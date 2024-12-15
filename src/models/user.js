import prisma from '../db/prisma.js'

class User {

    static async all() {
        return await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isConfirmed: true,
                createdAt: true,
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
}

export default User;