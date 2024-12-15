import prisma from '../db/prisma.js'

class Category {
    static isCategoryExist(name) {
        return prisma.category.findFirst({
            where: {
                AND: [
                    {
                        name: {
                            equals: name
                        }
                    },
                ]
            }
        })
    }

    static create = async (name) => {
        return await prisma.category.create({ data: { name } })
    }

    static restore = async (id) => {
        return await prisma.category.update({
            where: {
                id
            },
            data: {
                isDeleted: false
            }
        })
    }

    static all = async () => {
        return await prisma.category.findMany({
            where: {
                isDeleted: false
            },
            select: {
                id: true,
                name: true
            },
            orderBy: {
                name: 'asc'
            }
        })
    }

    static isAllProductExist = async (id) => {
        return await prisma.category.findMany({
            where: {
                id
            },
            include: {
                _count: {
                    select: {
                        products: {
                            where: {
                                isDeleted: false
                            }
                        }
                    }
                }
            }
        })
    }

    static delete = async (id) => {
        return await prisma.category.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        })
    }

    static countProduct = async () => {
        return await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                _count: {
                    select: {
                        products: {
                            where: {
                                isDeleted: false
                            }
                        }
                    }
                }
            }
        })
    }
}

export default Category