import DashboardService from "./dashboard.service.js";
import Response from "../../helper/response.js";

class DashboardController {
    static async index(req, res) {
        try {
            const service = await DashboardService.index();
            if (service instanceof Error) {
                return res.status(400).json(Response.invalid(service.message));
            }
            return res.status(200).json(Response.ok("Berhasil mengambil data dashboard", service));
        } catch (error) {
            console.log(error);
            return res.status(500).json(Response.error());
        }
    }
}

export default DashboardController