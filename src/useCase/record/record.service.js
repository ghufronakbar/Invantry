import paginate from "../../helper/paginate.js";
import RecordModification from "../../models/recordModification.js";

const VALID_RECORD_TYPE_ADMIN = ["IN_TRANSACTION", "OUT_TRANSACTION", "CREATE_PRODUCT", "EDIT_PRODUCT", "DELETE_PRODUCT"];
const VALID_RECORD_TYPE_SUPER_ADMIN = [...VALID_RECORD_TYPE_ADMIN, "REGISTER", "ACCOUNT_CONFIRMED", "ACCOUNT_RESTORED", "ACCOUNT_BANNED"];

class RecordService {
    static async all(role, page = 1, type = undefined) {
        if (isNaN(Number(page)) || Number(page) < 1) {
            return new Error("Page harus angka")
        }
        let filteredType = undefined;
        switch (role) {
            case "ADMIN":
                filteredType = VALID_RECORD_TYPE_ADMIN.includes(type) ? type : undefined
                break;
            case "SUPER_ADMIN":
                filteredType = VALID_RECORD_TYPE_SUPER_ADMIN.includes(type) ? type : undefined
                break;
        }
        console.log({ type, filteredType });
        const [records, counts] = await Promise.all([
            RecordModification.all(Number(page), filteredType),
            RecordModification.count(filteredType),
        ]);
        const pagination = paginate(page, records.length, counts)
        return { records, pagination }
    }

    static async byId(role, id) {
        const record = await RecordModification.byId(id)
        if (!record) return new Error("404")
        if (record.isDeleted) return new Error("404")
        if (role === "ADMIN" && !VALID_RECORD_TYPE_ADMIN.includes(record.type)) return new Error("404")
        return record
    }
}

export default RecordService