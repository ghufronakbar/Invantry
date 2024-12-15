import Category from "../../models/category.js";
import Transaction from "../../models/transaction.js";

class DashboardService {
    static async index() {
        const inOut = await this.#inOutData();
        const countProductByCategory = await Category.countProduct();

        const groupByCategoryIn = []
        const groupByCategoryOut = []
        const groupByCategory = {
            inTransaction: groupByCategoryIn,
            outTransaction: groupByCategoryOut
        }

        const annually = {
            income: 0,
            outcome: 0
        }

        const monthly = {
            income: 0,
            outcome: 0
        }


        const count = { annually, monthly }

        for (const inData of inOut.inTransaction) {
            const category = groupByCategoryIn.find(category => category?.id === inData.product.category.id)
            if (category) {
                category.countTransaction += 1
                category.amountTransaction += inData.amount
                category.totalTransaction += inData.total
            } else {
                groupByCategoryIn.push({
                    id: inData.product.category.id,
                    name: inData.product.category.name,
                    countTransaction: 1,
                    amountTransaction: inData.amount,
                    totalTransaction: inData.total
                })
            }
        }

        for (const outData of inOut.outTransaction) {
            const category = groupByCategoryOut.find(category => category?.id === outData.product.category.id)
            if (category) {
                category.countTransaction += 1
                category.amountTransaction += outData.amount
                category.totalTransaction += outData.total
            } else {
                groupByCategoryOut.push({
                    id: outData.product.category.id,
                    name: outData.product.category.name,
                    countTransaction: 1,
                    amountTransaction: outData.amount,
                    totalTransaction: outData.total
                })
            }
        }

        const inTransaction = this.#formatChart(inOut.inTransaction);
        const outTransaction = this.#formatChart(inOut.outTransaction);


        for (const transaction of inTransaction) {
            count.annually.income += transaction.total;
        }

        count.monthly.income = inTransaction[inTransaction.length - 1].total;
        count.monthly.outcome = outTransaction[outTransaction.length - 1].total;

        for (const transaction of outTransaction) {
            count.annually.outcome += transaction.total;
        }

        const chart = { inTransaction, outTransaction };
        return { count, groupByCategory, countProductByCategory, chart, };
    }

    static async #inOutData() {
        const [inTransaction, outTransaction] = await Promise.all([
            Transaction.inTransactionLastTwelve(),
            Transaction.outTransactionLastTwelve(),
        ]);

        return { inTransaction, outTransaction };
    }

    static #formatMonthName(date) {
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const monthIndex = new Date(date).getMonth();
        return months[monthIndex];
    }

    static #isSameMonthYear(transactionDate, month, year) {
        const transactionMonth = new Date(transactionDate).getMonth();
        const transactionYear = new Date(transactionDate).getFullYear();
        return transactionMonth === month && transactionYear === year;
    }

    static #formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    static #formatChart(data) {
        const currentDate = new Date();
        let response = [];

        for (let i = 0; i < 12; i++) {
            const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthName = this.#formatMonthName(monthStart);
            const month = monthStart.getMonth();
            const year = monthStart.getFullYear();

            const inMonthData = data.find(item => this.#isSameMonthYear(item.createdAt, month, year)) || { amount: 0, total: 0 };


            response.unshift({
                date: this.#formatDate(monthStart),
                monthName,
                amount: inMonthData.amount,
                total: inMonthData.total,
            });
        }


        return response;
    }
}

export default DashboardService;
