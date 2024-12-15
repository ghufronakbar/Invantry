import prisma from "../db/prisma.js"

const TAKE = 10

class Transaction {
    static async all(search = "", page = 1, statusType = "ALL") {
        return await prisma.transaction.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                product: {
                    include: {
                        category: true
                    }
                }
            },
            where: {
                AND: [
                    {
                        product: {
                            name: {
                                contains: search
                            }
                        }
                    },
                    statusType !== "ALL" ? { type: statusType } : {}
                ]
            },
            take: TAKE,
            skip: (page - 1) * TAKE
        })
    }

    static async count(search = "", statusType = "ALL") {
        return await prisma.transaction.count({
            where: {
                AND: [
                    {
                        product: {
                            name: {
                                contains: search
                            }
                        }
                    },
                    statusType !== "ALL" ? { type: statusType } : {}
                ]
            },
        })
    }

    static async byId(id) {
        return await prisma.transaction.findUnique({
            where: {
                id
            },
            include: {
                product: {
                    include: {
                        category: true
                    }
                }
            }
        })
    }

    static async byProductIds(ids) {
        return await prisma.transaction.findMany({
            where: {
                productId: { in: ids }
            }
        })
    }

    static async create(data) {
        return await prisma.transaction.create({
            data: {
                productId: data.productId,
                type: data.type,
                amount: data.amount,
                total: data.total,
            },
            include: {
                product: {
                    include: {
                        transactions: true
                    }
                }
            }
        })
    }

    static async inTransactionLastTwelve() {
        const lastTwelveMonths = new Date();
        lastTwelveMonths.setMonth(lastTwelveMonths.getMonth() - 12);

        return await prisma.transaction.findMany({
            select: {
                amount: true,
                total: true,
                createdAt: true,
                product: {
                    select: {
                        id: true,
                        name: true,
                        category: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            },
            where: {
                AND: [
                    {
                        type: "IN"
                    },
                    {
                        createdAt: {
                            gte: lastTwelveMonths
                        }
                    }
                ]
            }
        });
    }

    static async outTransactionLastTwelve() {
        const lastTwelveMonths = new Date();
        lastTwelveMonths.setMonth(lastTwelveMonths.getMonth() - 12);

        return await prisma.transaction.findMany({
            select: {
                amount: true,
                total: true,
                createdAt: true,
                product: {
                    select: {
                        id: true,
                        name: true,
                        category: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            },
            where: {
                AND: [
                    {
                        type: "OUT"
                    },
                    {
                        createdAt: {
                            gte: lastTwelveMonths
                        }
                    }
                ]
            }
        });
    }
}

export default Transaction