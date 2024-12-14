import Response from "../../../helper/response.js";
import ProductService from "./product.service.js";

class ProductController {
    static async all(req, res) {
        try {
            const service = await ProductService.all(req.query.search || "", req.query.page || 1);
            if (service instanceof Error) {
                return res.status(400).json(Response.invalid(service.message));
            }
            return res.status(200).json(Response.oks(service.pagination, service.products));
        } catch (error) {
            console.log(error);
            return res.status(500).json(Response.error());
        }
    }

    static async bySlug(req, res) {
        try {
            const service = await ProductService.bySlug(req.params.slug);
            if (service instanceof Error) {
                if (service.message === "404") return res.status(404).json(Response.notFound());
                return res.status(400).json(Response.invalid(service.message));
            }
            return res.status(200).json(Response.ok(service));
        } catch (error) {
            console.log(error);
            return res.status(500).json(Response.error());
        }
    }

    static async create(req, res) {
        try {
            const service = await ProductService.create(req?.decoded?.id, req.body);
            if (service instanceof Error) {
                return res.status(400).json(Response.invalid(service.message));
            }
            return res.status(200).json(Response.ok("Berhasil membuat produk", service));
        } catch (error) {
            console.log(error);
            return res.status(500).json(Response.error());
        }
    }

    static async edit(req, res) {
        try {
            const service = await ProductService.edit(req?.decoded?.id, req.params.slug, req.body);
            if (service instanceof Error) {
                if (service.message === "404") return res.status(404).json(Response.notFound());
                return res.status(400).json(Response.invalid(service.message));
            }
            return res.status(200).json(Response.ok("Berhasil mengedit produk", service));
        } catch (error) {
            console.log(error);
            return res.status(500).json(Response.error());
        }
    }

    static async postPictures(req, res) {
        try {
            const service = await ProductService.postPictures(req?.decoded?.id, req.params.slug, req.files);
            if (service instanceof Error) {
                if (service.message === "404") return res.status(404).json(Response.notFound());
                return res.status(400).json(Response.invalid(service.message));
            }
            return res.status(200).json(Response.ok("Berhasil mengupload foto produk", service));
        } catch (error) {
            console.log(error);
            return res.status(500).json(Response.error());
        }
    }

    static async deletePictures(req, res) {
        try {
            const service = await ProductService.deletePictures(req?.decoded?.id, req?.body?.ids);
            if (service instanceof Error) {
                if (service.message === "404") return res.status(404).json(Response.notFound());
                return res.status(400).json(Response.invalid(service.message));
            }
            return res.status(200).json(Response.ok("Berhasil menghapus foto produk", service));
        } catch (error) {
            console.log(error);
            return res.status(500).json(Response.error());
        }
    }

    static async delete(req, res) {
        try {
            const service = await ProductService.delete(req?.decoded?.id, req.params.slug);
            if (service instanceof Error) {
                if (service.message === "404") return res.status(404).json(Response.notFound());
                return res.status(400).json(Response.invalid(service.message));
            }
            return res.status(200).json(Response.ok("Berhasil menghapus produk", service));
        } catch (error) {
            console.log(error);
            return res.status(500).json(Response.error());
        }
    }
}

export default ProductController