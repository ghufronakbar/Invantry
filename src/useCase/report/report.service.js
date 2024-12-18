import Transaction from "../../models/transaction.js";
import * as XLSX from "xlsx";  // Import XLSX library
import formatDate from "../../utils/format/formatDate.js";
import Product from "../../models/product.js";

class ReportService {

    // Private function untuk membuat worksheet
    static #createSheet(transactions, sheetTitle) {
        // Filter dan map transaksi
        const flatTrans = transactions.map((transaction, index) => ({
            No: index + 1,
            Nama: transaction.product.name,
            Kategori: transaction.product.category.name,
            Kuantitas: transaction.amount,
            Jumlah: transaction.total,
            Tipe: transaction.type === "IN" ? "Pemasukan" : "Pengeluaran",
            Tanggal: formatDate(transaction.createdAt),
        }));

        // Menghitung total Kuantitas dan Jumlah
        const quan = flatTrans.reduce((acc, curr) => acc + curr.Kuantitas, 0);
        const total = flatTrans.reduce((acc, curr) => acc + curr.Jumlah, 0);

        // Membuat worksheet
        const sheet = XLSX.utils.json_to_sheet(flatTrans);

        // Menambahkan pengaturan kolom
        sheet["!cols"] = [
            { width: 10 }, { width: 20 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 20 }, { width: 30 }
        ];

        // Menambahkan judul dan kolom header
        XLSX.utils.sheet_add_aoa(sheet, [[sheetTitle]], { origin: { r: 0, c: 0 } });
        XLSX.utils.sheet_add_aoa(sheet, [["No", "Produk", "Kategori", "Kuantitas", "Jumlah", "Tipe", "Tanggal"]], { origin: { r: 0, c: 0 } });

        // Menambahkan total di bawah data
        XLSX.utils.sheet_add_aoa(sheet, [["Total", "", "", quan, total, "", ""]], { origin: { r: flatTrans.length + 1, c: 0 } });

        return sheet;
    }

    static #monthName(month) {
        const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        return months[month - 1];
    }

    static async annually() {
        const transactions = await Transaction.annually();

        const inTransactions = transactions.filter((transaction) => transaction.type === "IN");
        const outTransactions = transactions.filter((transaction) => transaction.type === "OUT");

        const inSheet = this.#createSheet(inTransactions, "Pemasukan");
        const outSheet = this.#createSheet(outTransactions, "Pengeluaran");

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, inSheet, "Pemasukan");
        XLSX.utils.book_append_sheet(wb, outSheet, "Pengeluaran");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

        const fileName = `Laporan_Tahun_${new Date().getFullYear().toString()}`

        return { excelBuffer, fileName };
    }

    static async thisMonth() {
        const transactions = await Transaction.thisMonth();

        const inTransactions = transactions.filter((transaction) => transaction.type === "IN");
        const outTransactions = transactions.filter((transaction) => transaction.type === "OUT");

        const inSheet = this.#createSheet(inTransactions, "Pemasukan");
        const outSheet = this.#createSheet(outTransactions, "Pengeluaran");

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, inSheet, "Pemasukan");
        XLSX.utils.book_append_sheet(wb, outSheet, "Pengeluaran");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

        const fileName = `Laporan_Bulan_${this.#monthName(new Date().getMonth() + 1)}_${new Date().getFullYear().toString()}`

        return { excelBuffer, fileName };
    }

    static async byProductId(id, dateStart, dateEnd) {
        let dateStarted = new Date("2000-01-01");
        let dateEnded = new Date();
        dateEnded.setMonth(dateEnded.getMonth() + 1);

        if (isNaN(Date.parse(dateStart))) {
            dateStarted = new Date("2000-01-01");
        } else {
            dateStarted = new Date(dateStart);
        }
        if (isNaN(Date.parse(dateEnd))) {
            dateEnded = new Date();
            dateEnded.setMonth(dateEnded.getMonth() + 1);
        } else {
            dateEnded = new Date(dateEnd);
        }

        const [product, transactions] = await Promise.all([
            Product.byId(id),
            Transaction.byProductId(id, dateStarted, dateEnded)
        ]);

        if (!product) {
            return new Error("Produk tidak ditemukan")
        }

        const inTransactions = transactions.filter((transaction) => transaction.type === "IN");
        const outTransactions = transactions.filter((transaction) => transaction.type === "OUT");

        const inSheet = this.#createSheet(inTransactions, "Pemasukan");
        const outSheet = this.#createSheet(outTransactions, "Pengeluaran");

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, inSheet, "Pemasukan");
        XLSX.utils.book_append_sheet(wb, outSheet, "Pengeluaran");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

        const fileName = `Laporan_Produk_${product.name}(${product.category.name})`

        return { excelBuffer, fileName };
    }
}

export default ReportService;
