import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

const seedsUser = async () => {
    const user = await prisma.user.findFirst();
    if (!user) {
        console.log("Seeding admin...");
        await prisma.user.createMany({
            data: [
                {
                    name: "Super Admin",
                    email: "alan.040219.gam@gmail.com",
                    role: "SUPER_ADMIN",
                    isConfirmed: true,
                    password: await bcrypt.hash("12345678", 10),
                }
            ]
        });
    } else {
        console.log("Admin already exists");
    }
}


const main = async () => {
    try {
        await prisma.$connect();
        await seedsUser();
    } catch (error) {
        console.error(error);
        process.exit(1);
    } finally {
        prisma.$disconnect();
    }
}

main()

