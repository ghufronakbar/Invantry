import Category from "../../models/category.js";

class CategoryService {
    static async all() {
        return await Category.all()
    }
}

export default CategoryService