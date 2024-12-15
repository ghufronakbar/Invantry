import Product from "../../models/product.js";
import User from "../../models/user.js";
import paginate from "../../helper/paginate.js";
import Category from "../../models/category.js";
import RecordModification from "../../models/recordModification.js";
import Cloudinary from "../../utils/cloudinary.js";
import Picture from "../../models/picture.js";
import Transaction from "../../models/transaction.js";

class ProductService {
    static async all(search = "", page = 1, categoryId = undefined) {
        if (isNaN(Number(page)) || Number(page) < 1) {
            return new Error("Page harus angka")
        }
        const [products, counts] = await Promise.all([
            Product.all(search, Number(page), categoryId),
            Product.count(search, categoryId),
        ]);
        const productIds = products.map(product => product.id)
        const transactions = await Transaction.byProductIds(productIds)
        for (const product of products) {
            const filteredTransaction = transactions.filter(transaction => transaction.productId === product.id)
            product.currentStock = product.initialStock;
            product.income = 0
            product.outcome = 0
            product.totalProductIn = 0;
            product.totalProductOut = 0;
            for (const transaction of filteredTransaction) {
                if (transaction.type === "IN") {
                    product.currentStock -= transaction.amount;
                    product.income += transaction.total;
                    product.totalProductOut += 1;
                } else {
                    product.currentStock += transaction.amount;
                    product.outcome += transaction.total;
                    product.totalProductIn += 1;
                }

            }
        }
        const pagination = paginate(page, products.length, counts)
        return { products, pagination }
    }

    static async bySlug(id) {
        const product = await Product.bySlug(id)
        if (!product) return new Error("404")
        if (product.isDeleted) return new Error("404")
        product.currentStock = product.initialStock;
        product.income = 0
        product.outcome = 0
        product.totalProductIn = 0;
        product.totalProductOut = 0;
        for (const transaction of product.transactions) {
            if (transaction.type === "IN") {
                product.currentStock -= transaction.amount;
                product.income += transaction.total;
                product.totalProductOut += 1;
            } else {
                product.currentStock += transaction.amount;
                product.outcome += transaction.total;
                product.totalProductIn += 1;
            }

        }
        return product
    }

    static async create(userId, data) {
        const { name, desc, category, initialStock, buyingPrice, sellingPrice } = data
        if (!name || !category || !initialStock || !buyingPrice || !sellingPrice) return new Error("Semua field harus diisi")
        if (buyingPrice <= 0 || sellingPrice <= 0) return new Error("Harga tidak boleh negatif")
        if (typeof initialStock !== "number") return new Error("Initial Stock harus angka")
        if (typeof buyingPrice !== "number" || typeof sellingPrice !== "number") return new Error("Harga harus angka")
        const [user, isExist] = await Promise.all([
            User.byId(userId),
            Category.isCategoryExist(category)
        ])
        if (!user) return new Error("404")
        const filteredData = { name, desc, categoryId: isExist?.id, initialStock: Number(initialStock), buyingPrice: Number(buyingPrice), sellingPrice: Number(sellingPrice) }
        RecordModification.createProduct(user.name, name, category);
        if (isExist && isExist.isDeleted) {
            Category.restore(isExist.id)
            return await Product.create(filteredData)
        } else if (isExist && !isExist.isDeleted) {
            return await Product.create(filteredData)
        } else {
            const createdCategory = await Category.create(category)
            filteredData.categoryId = createdCategory.id
            return await Product.create(filteredData)
        }
    }

    static async edit(userId, slug, data) {
        const { name, desc, category, buyingPrice, sellingPrice } = data
        if (!name || !category || !buyingPrice || !sellingPrice) return new Error("Semua field harus diisi")
        if (typeof buyingPrice !== "number" || typeof sellingPrice !== "number") return new Error("Harga harus angka")
        if (buyingPrice <= 0 || sellingPrice <= 0) return new Error("Harga tidak boleh negatif")
        const [user, product, isExist] = await Promise.all([
            User.byId(userId),
            Product.bySlug(slug),
            Category.isCategoryExist(category),
        ])

        if (!product) return new Error("404")
        if (!user) return new Error("404")

        const filteredData = { name, desc, categoryId: isExist?.id, buyingPrice: Number(buyingPrice), sellingPrice: Number(sellingPrice) }
        RecordModification.editProduct(user.name, product.name, product.category.name, name, category,);
        if (isExist && isExist.isDeleted) {
            Category.restore(isExist.id)
            return await Product.edit(slug, filteredData)
        } else if (isExist && !isExist.isDeleted) {
            return await Product.edit(slug, filteredData)
        } else {
            const createdCategory = await Category.create(category)
            filteredData.categoryId = createdCategory.id
            return await Product.edit(slug, filteredData)
        }
    }

    static async postPictures(userId, slug, pictures) {
        const [product, user] = await Promise.all([
            Product.bySlug(slug),
            User.byId(userId),
        ])
        if (!user) return new Error("404")
        if (pictures.length <= 0) return new Error("Tidak ada gambar yang diupload")
        if (!product) {
            if (product && pictures.length > 0) {
                for (let i = 0; i < pictures.length; i++) {
                    Cloudinary.removeCloudinary(product[i].path, "product")
                }
            }
            return new Error("404")
        }
        RecordModification.editPictures(user.name, product.name, product.category.name);
        const urls = pictures.map(picture => ({ url: picture.path }))
        return await Product.pictures(slug, urls)
    }

    static async deletePictures(userId, ids) {
        if (!Array.isArray(ids) || ids.length <= 0 || ids.some(url => typeof url !== "string")) return new Error("Urls harus string[]")
        const [user, pictures] = await Promise.all([
            User.byId(userId),
            Picture.byIds(ids),
        ]);
        if (!user) return new Error("404")
        if (pictures.length <= 0) return new Error("404")
        RecordModification.editPictures(user.name, pictures[0].product.name, pictures[0].product.category.name);
        for (let i = 0; i < pictures.length; i++) {
            Cloudinary.removeCloudinary(pictures[i].url, "product")
        }
        return await Picture.deletes(ids)
    }

    static async delete(userId, slug) {
        const [user, product] = await Promise.all([
            User.byId(userId),
            Product.bySlug(slug)
        ])
        if (!user) return new Error("404")
        if (!product) return new Error("404")
        if (product.isDeleted) return new Error("404")
        this.#deleteCategory(product.categoryId)
        RecordModification.deleteProduct(user.name, product.name, product.category.name);
        return await Product.delete(slug)
    }

    static async #deleteCategory(categoryId) {
        const check = await Category.isAllProductExist(categoryId)
        if (check.length <= 1) {
            await Category.delete(categoryId)
        }
    }
}

export default ProductService