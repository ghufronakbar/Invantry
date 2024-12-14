import { configDotenv } from "dotenv"
configDotenv()

export const PORT = Number(process.env.PORT) || 3000
export const JWT_SECRET = process.env.JWT_SECRET
export const BASE_URL_API = process.env.BASE_URL_API