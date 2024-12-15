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

const seedProduct1 = async () => {
    console.log("Seeding product...");
    const date = new Date();
    const product = await prisma.product.create({
        data: {
            name: "Iphone 14",
            buyingPrice: 1000000,
            sellingPrice: 1200000,
            initialStock: 10,
            slug: `iphone-14-${date.getHours() + date.getMinutes() + date.getSeconds()}`,
            category: {
                create: {
                    name: "Iphone",
                }
            }
        }
    });
    console.log(`Product 1 created with id: ${product.id}`);
    return product
}

const seedProduct2 = async () => {
    console.log("Seeding product...");
    const date = new Date();
    const product = await prisma.product.create({
        data: {
            name: "Razor",
            buyingPrice: 1000000,
            sellingPrice: 1200000,
            initialStock: 10,
            slug: `razor-${date.getHours() + date.getMinutes() + date.getSeconds()}`,
            category: {
                create: {
                    name: "Headphone",
                }
            }
        }
    });
    console.log(`Product 2 created with id: ${product.id}`);
    return product
}

const seedTransactions = async (productId) => {
    console.log(`Seeding transactions... for id ${productId}`);
    const transactions = [];
    for (let i = 0; i < 20; i++) {
        const randomDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28));
        transactions.push({
            type: i % 2 === 0 ? "IN" : "OUT",
            amount: Math.floor(Math.random() * 20) + 1,
            total: Math.floor(Math.random() * 100000) + 10000,
            productId: productId,
            createdAt: randomDate,
            updatedAt: randomDate,
        });
    }
    await prisma.transaction.createMany({
        data: transactions
    });
    console.log("Transactions seeded successfully");
}


const main = async () => {
    try {
        await prisma.$connect();
        await seedsUser();
        const [product1, product2] = await Promise.all([seedProduct1(), seedProduct2()]);
        await Promise.all([seedTransactions(product1.id), seedTransactions(product2.id)]);
    } catch (error) {
        console.error(error);
        process.exit(1);
    } finally {
        prisma.$disconnect();
    }
}

main()

