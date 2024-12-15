import Response from "../../helper/response.js";
import CategoryService from "./category.service.js";

class CategoryController {
    static async all(req, res) {
        try {
            const service = await CategoryService.all();
            return res.status(200).json(Response.ok("Berhasil mengambil data kategori", service));
        } catch (error) {
            console.log(error);
            return res.status(500).json(Response.error());
        }
    }
}

export default CategoryController