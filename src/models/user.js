import prisma from '../db/prisma.js'

const TAKE = 10

class User {

    static async all(search = "", page = 1) {
        return await prisma.user.findMany({
            orderBy: {
                name: 'asc'
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isConfirmed: true,
                isActived: true,
                createdAt: true,
            },
            take: TAKE,
            skip: (page - 1) * TAKE,
            where: {
                name: {
                    contains: search,
                    mode: 'insensitive'
                }
            }
        })
    }

    static async count(search = "") {
        return await prisma.user.count({
            orderBy: {
                createdAt: 'desc'
            },
            where: {
                name: {
                    contains: search,
                    mode: 'insensitive'
                }
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
}

export default User;