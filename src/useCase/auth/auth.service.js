import User from "../../models/user.js";
import RecordModification from "../../models/recordModification.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../../constant/index.js";

class AuthService {
    static async login(data) {
        const { email, password } = data
        if (!email || !password) {
            return new Error("Semua field harus diisi")
        }
        const user = await User.byEmail(email)
        if (!user) {
            return new Error("Email belum terdaftar")
        }
        if (!user.isConfirmed) {
            return new Error("Pengguna belum terkonfirmasi")
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return new Error("Password salah")
        }
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        }
        const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" })
        const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
        User.refresh(user.id, refreshToken)
        const result = {
            id: user.id,
            role: user.role,
            accessToken,
            refreshToken,
            type: "Bearer"
        }
        return result
    }

    static async register(userId, data) {
        const { name, email } = data
        if (!name || !email) {
            return new Error("Semua field harus diisi")
        }
        const [check, user] = await Promise.all([
            User.checkByEmail(email),
            User.byId(userId),
        ]);
        if (check) {
            return new Error("Email sudah terdaftar")
        }
        if (check && !check.isConfirmed) {
            return new Error("Pengguna belum terkonfirmasi")
        }
        RecordModification.register(user.name, name, email)
        return await User.create(data)
    }

    static async refresh(refreshToken) {
        try {
            if (!refreshToken) {
                return new Error("Refresh token harus diisi")
            }
            const payload = jwt.verify(refreshToken, JWT_SECRET)
            const user = await User.byId(payload.id)
            if (!user) {
                throw new Error("401")
            }
            if (user.refreshToken !== refreshToken) {
                throw new Error("401")
            }
            const newPayload = {
                id: user.id,
                email: user.email,
                role: user.role
            }
            const accessToken = jwt.sign(newPayload, JWT_SECRET, { expiresIn: "1d" })
            const refreshTokenNew = jwt.sign(newPayload, JWT_SECRET, { expiresIn: "7d" })
            User.refresh(user.id, refreshTokenNew)
            const result = { id: user.id, role: user.role, accessToken, refreshToken: refreshTokenNew, type: "Bearer" }
            return result
        } catch (error) {
            throw new Error("401")
        }
    }
}

export default AuthService