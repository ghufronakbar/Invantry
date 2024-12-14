import prisma from "../db/prisma.js"

class Picture {
    static async byIds(ids) {
        return await prisma.picture.findMany({
            where: {
                id: {
                    in: ids
                }
            },
            select: {
                id: true,
                url: true,
                product: {
                    select: {
                        name: true,
                        category: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }

        })
    }

    static async deletes(ids) {
        return await prisma.picture.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        })
    }
}


export default Picture