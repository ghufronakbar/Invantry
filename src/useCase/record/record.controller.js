import Response from "../../helper/response.js";
import RecordService from "./record.service.js";

class RecordController {
    static async all(req, res) {
        try {
            const service = await RecordService.all(req?.decoded?.role, req.query.page || 1, req.query.type);
            if (service instanceof Error) {
                return res.status(400).json(Response.invalid(service.message));
            }
            return res.status(200).json(Response.oks(service.pagination, service.records));
        } catch (error) {
            console.log(error);
            return res.status(500).json(Response.error());
        }
    }

    static async byId(req, res) {
        try {
            const service = await RecordService.byId(req?.decoded?.role, req.params.id);
            if (service instanceof Error) {
                if (service.message === "404") return res.status(404).json(Response.notFound());
                return res.status(400).json(Response.invalid(service.message));
            }
            return res.status(200).json(Response.ok("Berhasil mengambil data record", service));
        } catch (error) {
            console.log(error);
            return res.status(500).json(Response.error());
        }
    }
}

export default RecordController