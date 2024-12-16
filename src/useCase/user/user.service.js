import paginate from "../../helper/paginate.js";
import RecordModification from "../../models/recordModification.js";
import User from "../../models/user.js";

const VALID_RECORD_TYPE_ADMIN = ["IN_TRANSACTION", "OUT_TRANSACTION", "CREATE_PRODUCT", "EDIT_PRODUCT", "DELETE_PRODUCT"];
const VALID_RECORD_TYPE_SUPER_ADMIN = [...VALID_RECORD_TYPE_ADMIN, "REGISTER", "ACCOUNT_CONFIRMED"];

class UserService {
    static async all(search = "", page = 1) {
        if (isNaN(Number(page)) || Number(page) < 1) {
            return new Error("Page harus angka")
        }
        const [users, counts] = await Promise.all([
            User.all(search, Number(page)),
            User.count(search),
        ]);
        const pagination = paginate(page, users.length, counts)
        return { users, pagination }
    }

    static async byId(id) {
        const user = await User.byId(id)
        if (!user) return new Error("404")
        return user
    }

    static async setActive(id) {
        const user = await User.byId(id)
        if (!user) return new Error("404")
        if (user.role === "SUPER_ADMIN") {
            return new Error("Tidak dapat menonaktifkan akun super admin")
        }
        const updated = await User.setActive(id, !user.isActived)
        return updated
    }
}

export default UserService