import * as bodyParser from 'body-parser';
import { Environment } from "./models/environments";
import { Container } from "inversify";
import { PostgresService } from "./postgres.service";
import { InversifyExpressServer } from "inversify-express-utils";

import { ENVIRONMENT_REPOSITORY, METRICS_SERVICE, POSTGRES_SERVICE } from "./common/symbols";
import { EnvironmentRepository } from "./common/types";

import postgresConnector from "./databases/postgresConnector";

import "./postgres.controller";
import { MetricsService } from './metrics.service';

const container = new Container();

container.bind<PostgresService>(POSTGRES_SERVICE).to(PostgresService);
container.bind<EnvironmentRepository>(ENVIRONMENT_REPOSITORY).toConstantValue(Environment);
container.bind<MetricsService>(METRICS_SERVICE).to(MetricsService);

async function initDatabase() {
    try {
        await postgresConnector.sync();
        console.log("Postgres database connected and synced");
    } catch (error) {
        console.error("Error connecting to Postgres database:", error);
    }
}

async function startServer() { 

    const server : InversifyExpressServer = new InversifyExpressServer(container);

    server.setConfig((app) => {
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.use(bodyParser.json());
    });

    let app = server.build();

    app.listen(3000);

}

initDatabase();

startServer()
    .then(() => {
        console.log("Server started successfully");
    })
    .catch((error) => {
        console.error("Error starting server:", error);
    });