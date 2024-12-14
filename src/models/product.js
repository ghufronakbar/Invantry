import prisma from '../db/prisma.js'

const TAKE = 10

class Product {
    static async all(search = "", page = 1) {
        return await prisma.product.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: TAKE,
            skip: (page - 1) * TAKE,
            where: {
                AND: [
                    {
                        name: {
                            contains: search
                        }
                    },
                    {
                        isDeleted: false
                    }
                ]
            }
        })
    }

    static async count(search) {
        return await prisma.product.count({
            where: {
                AND: [
                    {
                        name: {
                            contains: search
                        }
                    },
                    {
                        isDeleted: false
                    }
                ]
            }
        })
    }

    static async bySlug(slug) {
        return await prisma.product.findUnique({
            where: {
                slug
            },
            include: {
                category: true,
                pictures: true,
                transactions: true
            }
        })
    }

    static async create(data) {
        return await prisma.product.create({
            data: {
                slug: this.generateSlug(data.name),
                name: data.name,
                desc: data.desc,
                categoryId: data.categoryId,
                initialStock: data.initialStock,
                buyingPrice: data.buyingPrice,
                sellingPrice: data.sellingPrice
            },
            include: {
                category: true
            }
        })
    }

    static async edit(slug, data) {
        return await prisma.product.update({
            where: {
                slug
            },
            data: {
                name: data.name,
                desc: data.desc,
                categoryId: data.categoryId,
                buyingPrice: data.buyingPrice,
                sellingPrice: data.sellingPrice
            },
            include: {
                category: true
            }
        })
    }

    static generateSlug(name) {
        const date = new Date()
        const hhmmss = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}`
        return `${name.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}-${hhmmss}`
    }

    static async pictures(slug, pictures) {
        return await prisma.product.update({
            where: {
                slug
            },
            data: {
                pictures: {
                    createMany: {
                        data: pictures
                    }
                }
            },
            include: {
                pictures: true,
                category: true
            }
        })
    }

    static async delete(slug) {
        return await prisma.product.update({
            where: {
                slug
            },
            data: {
                isDeleted: true
            }
        })
    }

    static async byId(id) {
        return await prisma.product.findUnique({
            where: {
                id
            },
            include: {
                category: true,
                transactions: true
            }
        })
    }
}

export default Product