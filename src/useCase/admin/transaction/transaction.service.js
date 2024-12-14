import paginate from "../../../helper/paginate.js";
import Transaction from "../../../models/transaction.js";
import Product from "../../../models/product.js";
import User from "../../../models/user.js";
import RecordModification from "../../../models/recordModification.js";

class TransactionService {
    static async all(search = "", page = 1, type = "ALL") {
        if (isNaN(Number(page)) || Number(page) < 1) {
            return new Error("Page harus angka")
        }
        let statusType = ""
        switch (type) {
            case "IN":
                statusType = "IN"
                break;
            case "OUT":
                statusType = "OUT"
                break;
            default:
                statusType = "ALL"
                break;
        }
        const [transactions, counts] = await Promise.all([
            Transaction.all(search, Number(page), statusType,),
            Transaction.count(search, statusType,)
        ]);
        const pagination = paginate(page, transactions.length, counts)
        return { transactions, pagination }
    }

    static async byId(id) {
        const transaction = await Transaction.byId(id)
        if (!transaction) {
            return new Error("404")
        }
        return transaction
    }

    static async create(userId, data) {
        const { productId, type, amount } = data
        if (!productId || !type || !amount) {
            return new Error("Data tidak lengkap")
        }
        if (typeof amount !== "number") return new Error("Jumlah harus angka")
        if (amount <= 0) return new Error("Jumlah  tidak boleh negatif")
        if (type !== "IN" && type !== "OUT") return new Error("Tipe transaksi harus IN atau OUT")
        const [product, user] = await Promise.all([
            Product.byId(productId),
            User.byId(userId)
        ])
        if (!product) return new Error("404")
        if (!user) return new Error("404")
        let currentStock = product.initialStock
        let income = 0
        let outcome = 0
        for (const transaction of product.transactions) {
            if (transaction.type === "IN") {
                currentStock -= transaction.amount;
                income += transaction.total;
            } else {
                currentStock += transaction.amount;
                outcome += transaction.total;
            }
        }

        if (type === "IN" && currentStock < amount ) {            
            return new Error("Stok tidak mencukupi")
        }

        let total = 0
        if (type === "IN") {
            total = product.sellingPrice * amount
            RecordModification.createTransactionIn(user.name, product.name, amount, total)
        } else {
            RecordModification.createTransactionOut(user.name, product.name, amount, total)
            total = product.buyingPrice * amount
        }

        const filteredData = { productId, type, amount, total }
        return await Transaction.create(filteredData)

    }
}

export default TransactionService