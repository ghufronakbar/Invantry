import paginate from "../../helper/paginate.js";
import RecordModification from "../../models/recordModification.js";
import User from "../../models/user.js";

class UserService {
    static async all(search = "", page = 1, type = undefined) {
        if (isNaN(Number(page)) || Number(page) < 1) {
            return new Error("Page harus angka")
        }

        let filteredType = undefined;
        switch (type) {
            case "ADMIN":
                filteredType = "ADMIN"
                break;
            case "SUPER_ADMIN":
                filteredType = "SUPER_ADMIN"
                break;
            default:
                break;
        }
        const [users, counts] = await Promise.all([
            User.all(search, Number(page), filteredType),
            User.count(search, filteredType),
        ]);
        const pagination = paginate(page, users.length, counts)
        return { users, pagination }
    }

    static async byId(id) {
        const user = await User.byId(id)
        if (!user) return new Error("404")
        return user
    }

    static async setActive(userId, id) {
        const [user, curUser] = await Promise.all([
            User.byId(id),
            User.byId(userId)
        ]);
        if (!user) return new Error("404")
        if (!curUser) return new Error("404")
        if (user.role === "SUPER_ADMIN") {
            return new Error("Tidak dapat menonaktifkan akun super admin")
        }
        if (user.isActived === true) {
            RecordModification.banUser(curUser.name, user.name, user.email)
        } else {
            RecordModification.restoreUser(curUser.name, user.name, user.email)
        }
        const updated = await User.setActive(id, !user.isActived)
        return updated
    }
}

export default UserService