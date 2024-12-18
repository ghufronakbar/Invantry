import ReportService from "./report.service.js";
import Response from "../../helper/response.js";

class ReportController {
    static async annually(req, res) {
        try {
            const service = await ReportService.annually();
            res.setHeader("Content-Disposition", `attachment; filename=${service.fileName}.xlsx`);
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

            return res.status(200).send(service.excelBuffer);
        } catch (error) {

        }
    }

    static async thisMonth(req, res) {
        try {
            const service = await ReportService.thisMonth();
            res.setHeader("Content-Disposition", `attachment; filename=${service.fileName}.xlsx`);
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

            return res.status(200).send(service.excelBuffer);
        } catch (error) {

        }
    }

    static async byProductId(req, res) {
        try {
            const service = await ReportService.byProductId(req.params.id, req.query.dateStart, req.query.dateEnd);
            if (service instanceof Error) {
                console.log("hitted error")
                return res.status(400).send(service.message)
            } else {
                res.setHeader("Content-Disposition", `attachment; filename=${service.fileName}.xlsx`);
                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                return res.status(200).send(service.excelBuffer);
            }
        } catch (error) {
            console.log(error)
            return res.status(500).send(Response.error())
        }
    }
}

export default ReportController