import AccountService from "./account.service.js";
import Response from "../../helper/response.js";

class AccountController {
    static async login(req, res) {
        try {
            const service = await AccountService.login(req.body);
            if (service instanceof Error) {
                return res.status(400).json(Response.invalid(service.message));
            }
            return res.status(200).json(Response.ok("Berhasil melakukan login", service));
        } catch (error) {
            console.log(error);
            return res.status(500).json(Response.error());
        }
    }

    static async register(req, res) {
        try {
            const service = await AccountService.register(req?.decoded?.id, req.body);
            if (service instanceof Error) {
                return res.status(400).json(Response.invalid(service.message));
            }
            return res.status(200).json(Response.ok("Berhasil melakukan registrasi", service));
        } catch (error) {
            console.log(error);
            return res.status(500).json(Response.error());
        }
    }

    static async refresh(req, res) {
        try {
            const authorization = req.body?.authorization || req.query?.authorization
            const service = await AccountService.refresh(authorization);
            if (service instanceof Error) {
                return res.status(401).json(Response.unauthorized());
            }
            return res.status(200).json(Response.ok("Berhasil melakukan refresh", service));
        } catch (error) {
            console.log(error);
            if (error.message === "401") return res.status(401).json(Response.unauthorized());
            return res.status(500).json(Response.error());
        }
    }

    static async byDecoded(req, res) {
        try {
            const service = await AccountService.byDecoded(req?.decoded?.id);
            if (service instanceof Error) {
                if (service.message === "404") return res.status(404).json(Response.notFound());
                return res.status(400).json(Response.invalid(service.message));
            }
            return res.status(200).json(Response.ok("Berhasil mengambil data akun", service));
        } catch (error) {
            console.log(error);
            return res.status(500).json(Response.error());
        }
    }

    static async edit(req, res) {
        try {
            const service = await AccountService.edit(req?.decoded?.id, req.body);
            if (service instanceof Error) {
                if (service.message === "404") return res.status(404).json(Response.notFound());
                return res.status(400).json(Response.invalid(service.message));
            }
            return res.status(200).json(Response.ok("Berhasil mengedit akun", service));
        } catch (error) {
            console.log(error);
            return res.status(500).json(Response.error());
        }
    }

    static async editPicture(req, res) {
        try {
            const service = await AccountService.editPicture(req?.decoded?.id, req.file);
            if (service instanceof Error) {
                if (service.message === "404") return res.status(404).json(Response.notFound());
                return res.status(400).json(Response.invalid(service.message));
            }
            return res.status(200).json(Response.ok("Berhasil mengedit foto profile", service));
        } catch (error) {
            console.log(error);
            return res.status(500).json(Response.error());
        }
    }

    static async deletePicture(req, res) {
        try {
            const service = await AccountService.deletePicture(req?.decoded?.id);
            if (service instanceof Error) {
                if (service.message === "404") return res.status(404).json(Response.notFound());
                return res.status(400).json(Response.invalid(service.message));
            }
            return res.status(200).json(Response.ok("Berhasil menghapus foto profile", service));
        } catch (error) {
            console.log(error);
            return res.status(500).json(Response.error());
        }
    }

    static async confirm(req, res) {
        const { token } = req.params;
        try {
            const result = await AccountService.confirm(token);

            if (result instanceof Error) {
                return res.render('confirm', { message: result.message, success: false });
            }

            return res.render('confirm', { message: result, success: true });
        } catch (error) {
            return res.render('confirm', { message: "Terjadi kesalahan, coba lagi.", success: false });
        }
    }
}

export default AccountController