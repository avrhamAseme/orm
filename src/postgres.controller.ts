import * as express from "express";
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam, httpPut } from "inversify-express-utils";
import { injectable, inject } from "inversify";
import { PostgresService } from "./postgres.service";
import { METRICS_SERVICE, POSTGRES_SERVICE } from "./common/symbols";
import { Environment } from "./models/environments";
import { MetricsService } from "./metrics.service";


type ExpressHttpResponse = express.Response<any, Record<string, any>>;

@controller("/environments")
export class PostgresController implements interfaces.Controller {

    constructor( @inject(POSTGRES_SERVICE) private databaseHandler : PostgresService, 
                @inject(METRICS_SERVICE) private metricsService : MetricsService) {}

    @httpGet("/")
    private async index(@request() req: express.Request, @response() res: express.Response){

        if (!req.query.id) {
            return res.status(400).json({ error: "ID is required" });
        }

        return await this.databaseHandler.find(req.query.id as string)
            .then(
                (environment: Environment | null) => {
                    if (!environment) {
                        return res.status(404).json({ error: "Environment not found" });
                    }
                    return res.status(200).json(environment);
                }
            )
            .catch((err: Error) => {
                return res.status(500).json({ error: "Internal server error" });
            });
    }

    @httpPut("/:id")
    private async update(@requestParam("id") id: string, @request() req: express.Request, @response() res: express.Response) : Promise<ExpressHttpResponse> {

        return await this.databaseHandler.update(id, req.body)
            .then(() => {
                return res.sendStatus(204);
            }
            ).catch((err: Error) => {
                return res.status(400).json({ error: err.message });
            });
    }

    @httpPost("/")
    private async create(@request() req: express.Request, @response() res: express.Response) : Promise<ExpressHttpResponse> {
        return await this.databaseHandler.insert(req.body)
            .then(() => {
                return res.sendStatus(201);
            }
            ).catch((err: Error) => {
                return res.status(400).json({ error: err.message });
            });

    }

    @httpDelete("/:id")
    private async delete(@requestParam("id") id: string, @response() res: express.Response): Promise<ExpressHttpResponse> {
        
        return await this.databaseHandler.remove(id)
            .then(() => {
                return res.sendStatus(204);
            })
            .catch((err: Error) => {
                return res.status(400).json({ error: err.message });
            });
    }
    

    @httpGet("/:id/metrics")
    private async getMetrics(@requestParam("id") id: string, @response() res: express.Response): Promise<ExpressHttpResponse> {
        return await this.metricsService.getMetrics(id)
            .then((metrics) => {
                return res.status(200).json(metrics);
            })
            .catch((err: Error) => {
                return res.status(400).json({ error: err.message });
            });
    }
}