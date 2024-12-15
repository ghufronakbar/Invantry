import Response from "../../helper/response.js";
import TransactionService from "./transaction.service.js";

class TransactionController {
    static async all(req, res) {
        try {
            const service = await TransactionService.all(req.query.search || "", req.query.page || 1, req.query.type);
            if (service instanceof Error) {
                return res.status(400).json(Response.invalid(service.message));
            }
            return res.status(200).json(Response.oks(service.pagination, service.transactions));
        } catch (error) {
            console.log(error);
            return res.status(500).json(Response.error());
        }
    }

    static async byId(req, res) {
        try {
            const service = await TransactionService.byId(req.params.id);
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
            const service = await TransactionService.create(req?.decoded?.id, req.body);
            if (service instanceof Error) {
                return res.status(400).json(Response.invalid(service.message));
            }
            return res.status(200).json(Response.ok("Berhasil membuat transaksi", service));
        } catch (error) {
            console.log(error);
            return res.status(500).json(Response.error());
        }
    }
}

export default TransactionController