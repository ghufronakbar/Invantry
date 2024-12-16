import prisma from '../db/prisma.js'

const TAKE = 10

class User {

    static async all(search = "", page = 1, type = undefined) {
        return await prisma.user.findMany({
            orderBy: {
                name: 'asc'
            },
            select: {
                id: true,
                name: true,
                email: true,
                picture: true,
                role: true,
                isConfirmed: true,
                isActived: true,
                createdAt: true,
                updatedAt: true,
            },
            take: TAKE,
            skip: (page - 1) * TAKE,
            where: {
                AND: [
                    {
                        name: {
                            contains: search,
                            mode: 'insensitive'
                        },
                    },
                    type ? {
                        role: {
                            equals: type
                        }
                    } : {}
                ]
            }
        })
    }

    static async count(search = "", type = undefined) {
        return await prisma.user.count({
            orderBy: {
                createdAt: 'desc'
            },
            where: {
                AND: [
                    {
                        name: {
                            contains: search,
                            mode: 'insensitive'
                        },
                    },
                    type ? {
                        role: {
                            equals: type
                        }
                    } : {}
                ]
            }
        })
    }
    static async byId(id) {
        return await prisma.user.findUnique({ where: { id } })
    }
    static async byEmail(email) {
        return await prisma.user.findUnique({ where: { email } })
    }

    static async create(data) {
        return await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                role: "ADMIN",
                isConfirmed: false,
            }
        })
    }

    static async checkByEmail(email) {
        return await prisma.user.findUnique({ where: { email }, select: { isConfirmed: true } })
    }

    static async refresh(id, refreshToken) {
        return await prisma.user.update({ where: { id }, data: { refreshToken } })
    }

    static async setActive(id, isActived) {
        return await prisma.user.update({ where: { id }, data: { isActived } })
    }

    static async edit(id, data) {
        return await prisma.user.update({
            where: {
                id
            },
            data: {
                name: data.name,
                email: data.email,
            }
        })
    }

    static async editPicture(id, picture) {
        return await prisma.user.update({
            where: {
                id
            },
            data: {
                picture
            }
        })
    }
}

export default User;