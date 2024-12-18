import User from "../../models/user.js";
import RecordModification from "../../models/recordModification.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { BASE_URL_API, JWT_SECRET } from "../../constant/index.js";
import sendEmail from "../../utils/nodeMailer/sendEmail.js";
import randomCharacter from "../../utils/randomCharacter.js";

class AccountService {
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
        if (!user.isActived) {
            return new Error("Pengguna ditangguhkan")
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
        const newUser = await User.create(data)
        const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: "1d" })
        const url = `${BASE_URL_API}/api/account/confirm/${token}`
        console.log(url);
        const send = await sendEmail(email, "CREATE_ACCOUNT", url, name)
        if (send instanceof Error) {
            User.delete(newUser.id)
            return new Error(send.message)
        } else {
            RecordModification.register(user.name, name, email)
            return newUser
        }
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

    static async byDecoded(id) {
        const user = await User.byId(id)
        if (!user) {
            return new Error("404")
        }
        return user
    }

    static async edit(id, data) {
        const { name, email } = data
        if (!name || !email) {
            return new Error("Semua field harus diisi")
        }
        const user = await User.byId(id)
        const userByEmail = await User.byEmail(email)
        if (!user) {
            return new Error("404")
        }
        if (userByEmail && userByEmail.id !== id) {
            return new Error("Email sudah terdaftar")
        }
        const payload = {
            id: user.id,
            email: email,
            role: user.role,
        }

        const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" })
        const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
        User.refresh(user.id, refreshToken)
        const updated = await User.edit(id, data)
        const result = {
            ...updated,
            accessToken,
            refreshToken,
            type: "Bearer"
        }
        return result
    }

    static async editPicture(id, picture) {
        const user = await User.byId(id)
        if (!picture || !picture?.path) {
            return new Error("Semua field harus diisi")
        }
        if (!user) {
            return new Error("404")
        }
        return await User.editPicture(id, picture.path)
    }

    static async deletePicture(id) {
        const user = await User.byId(id)
        if (!user) {
            return new Error("404")
        }
        return await User.editPicture(id, null)
    }

    static async confirm(token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET)
            const user = await User.byId(decoded?.id)
            if (!user) {
                return new Error("Pengguna tidak ditemukan")
            }
            if (user.isConfirmed || user.password) {
                return new Error("Pengguna sudah terkonfirmasi")
            } else {
                const randomPassword = randomCharacter(10)
                const password = await bcrypt.hash(randomPassword, 10)
                await Promise.all([
                    User.updatePassword(user.id, password),
                    sendEmail(user.email, "CONFIRM_ACCOUNT", "", user.name, randomPassword),
                    User.confirm(user.id)
                ])
                RecordModification.accountConfirmed(user.name, user.email)
                return "Pengguna berhasil terkonfirmasi, cek email untuk login"
            }
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                if (error.message === "jwt expired") {
                    return new Error("Link kadaluarsa")
                }
                if (error.message === "jwt malformed") {
                    return new Error("Link kadaluarsa")
                }
                if (error.message === "invalid signature") {
                    return new Error("Link tidak valid")
                }
            } else {
                return new Error("Token tidak valid")
            }
        }
    }
}

export default AccountService