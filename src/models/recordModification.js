import prisma from '../db/prisma.js'

const TAKE = 10

class RecordModification {
    static async register(admin, name, email) {
        return await prisma.recordModification.create({
            data: {
                desc: `${admin} dengan menambahkan ${name}(${email}) sebagai pengguna baru`,
                type: "REGISTER"
            }
        })
    }

    static async createProduct(admin, name, category, initialStock, buyingPrice, sellingPrice) {
        return await prisma.recordModification.create({
            data: {
                desc: `${admin} menambahakan produk ${name} (${category}) sejumlah ${initialStock} dengan harga beli ${this.#formatRupiah(buyingPrice)} dan harga jual ${this.#formatRupiah(sellingPrice)}`,
                type: "CREATE_PRODUCT"
            }
        })
    }

    static async editPictures(admin, name, category) {
        return await prisma.recordModification.create({
            data: {
                desc: `${admin} mengedit gambar ${name} (${category})`,
                type: "CREATE_PRODUCT"
            }
        })
    }

    static async editProduct(admin, oldName, oldCategory, newName, newCategory, buyingPrice, sellingPrice) {
        return await prisma.recordModification.create({
            data: {
                desc: `${admin} mengedit produk ${oldName} (${oldCategory}) menjadi ${newName} (${newCategory}) dengan harga beli ${this.#formatRupiah(buyingPrice)} dan harga jual ${this.#formatRupiah(sellingPrice)}`,
                type: "EDIT_PRODUCT"
            }
        })
    }

    static async deleteProduct(admin, name, category) {
        return await prisma.recordModification.create({
            data: {
                desc: `${admin} menghapus produk ${name} (${category})`,
                type: "DELETE_PRODUCT"
            }
        })
    }

    static async createTransactionIn(admin, productName, amount, total) {
        return await prisma.recordModification.create({
            data: {
                desc: `${admin} melakukan pencatatan transaksi pemasukan untuk produk ${productName} x${amount} sejumlah ${this.#formatRupiah(total)}`,
                type: "IN_TRANSACTION"
            }
        })
    }

    static async createTransactionOut(admin, productName, amount, total) {
        return await prisma.recordModification.create({
            data: {
                desc: `${admin} melakukan pencatatan transaksi pengeluaran untuk produk ${productName} x${amount} sejumlah ${this.#formatRupiah(total)}`,
                type: "OUT_TRANSACTION"
            }
        })
    }

    static #formatRupiah(amount) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
    }

    static async banUser(admin, name, email) {
        return await prisma.recordModification.create({
            data: {
                desc: `${admin} menonaktifkan akun ${name} (${email})`,
                type: "ACCOUNT_BANNED"
            }
        })
    }

    static async restoreUser(admin, name, email) {
        return await prisma.recordModification.create({
            data: {
                desc: `${admin} mengaktifkan akun ${name} (${email})`,
                type: "ACCOUNT_RESTORED"
            }
        })
    }

    static async all(search = "", page = 1, type = undefined) {
        return await prisma.recordModification.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: TAKE,
            skip: (page - 1) * TAKE,
            where: {
                AND: [
                    {
                        desc: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    },
                    type ? {
                        type: {
                            equals: type,
                            mode: 'insensitive'
                        }
                    } : {}
                ]
            }
        })
    }

    static async count(search = "", type = undefined) {
        return await prisma.recordModification.count({
            orderBy: {
                createdAt: 'desc'
            },
            where: {
                AND: [
                    {
                        desc: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    },
                    type ? {
                        type: {
                            equals: type,
                            mode: 'insensitive'
                        }
                    } : {}
                ]
            }
        })
    }

    static async byId(id) {
        return await prisma.recordModification.findUnique({ where: { id } })
    }
}

export default RecordModification