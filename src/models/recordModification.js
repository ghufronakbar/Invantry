import prisma from '../db/prisma.js'

class RecordModification {
    static async register(email) {
        return await prisma.recordModification.create({
            data: {
                desc: `${email} melakukan registrasi akun`,
                type: "REGISTER"
            }
        })
    }

    static async createProduct(admin, name, category) {
        return await prisma.recordModification.create({
            data: {
                desc: `${admin} menambahakan produk ${name} (${category})`,
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

    static async editProduct(admin, oldName, oldCategory, newName, newCategory) {
        return await prisma.recordModification.create({
            data: {
                desc: `${admin} mengedit produk ${oldName} (${oldCategory}) menjadi ${newName} (${newCategory})`,
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
}

export default RecordModification