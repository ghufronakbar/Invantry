import Response from "../../helper/response.js";
import UserService from "./user.service.js";

class UserController {
    static async all(req, res) {
        try {
            const service = await UserService.all(req.query.search || "", req.query.page);
            if (service instanceof Error) {
                return res.status(400).json(Response.invalid(service.message));
            }
            return res.status(200).json(Response.oks(service.pagination, service.users));
        } catch (error) {
            console.log(error);
            return res.status(500).json(Response.error());
        }
    }

    static async byId(req, res) {
        try {
            const service = await UserService.byId(req.params.id);
            if (service instanceof Error) {
                if (service.message === "404") return res.status(404).json(Response.notFound());
                return res.status(400).json(Response.invalid(service.message));
            }
            return res.status(200).json(Response.ok("Berhasil mengambil data pengguna", service));
        } catch (error) {
            console.log(error);
            return res.status(500).json(Response.error());
        }
    }

    static async setActive(req, res) {
        try {
            const service = await UserService.setActive(req?.decoded?.id, req.params.id);
            if (service instanceof Error) {
                if (service.message === "404") return res.status(404).json(Response.notFound());
                return res.status(400).json(Response.invalid(service.message));
            }
            return res.status(200).json(Response.ok(`Berhasil ${service.isActived ? "mengaktifkan" : "menonaktifkan"} pengguna ${service.name}`, service));
        } catch (error) {
            console.log(error);
            return res.status(500).json(Response.error());
        }
    }
}

export default UserController