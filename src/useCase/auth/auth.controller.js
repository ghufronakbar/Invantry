import AuthService from "./auth.service.js";
import Response from "../../helper/response.js";

class AuthController {
    static async login(req, res) {
        try {
            const service = await AuthService.login(req.body);
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
            const service = await AuthService.register(req.body);
            if (service instanceof Error) {
                return res.status(400).json(Response.invalid(service.message));
            }
            return res.status(200).json(Response.ok("Berhasil melakukan registrasi, tunggu konfirmasi admin", service));
        } catch (error) {
            console.log(error);
            return res.status(500).json(Response.error());
        }
    }

    static async refresh(req, res) {
        try {
            const authorization = req.body?.authorization || req.query?.authorization
            const service = await AuthService.refresh(authorization);
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
}

export default AuthController