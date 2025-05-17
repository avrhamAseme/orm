import { inject, injectable } from 'inversify';
import { POSTGRES_SERVICE } from './common/symbols';
import { PostgresService } from './postgres.service';
import { EnvironmentStatistics } from './common/interfaces';
import { Environment } from './models/environments';
import axios from 'axios';

const https = require('https');

const agent = new https.Agent({  
  rejectUnauthorized: false
});

@injectable()
export class MetricsService {
    
    private readonly axiosInstance: any;

    constructor( @inject(POSTGRES_SERVICE) private databaseHandler : PostgresService) {
        this.axiosInstance = axios.create({
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });
    }

    

    async getMetrics(id : string): Promise<EnvironmentStatistics> {

        try {
            
            const environment : Environment | null = await this.databaseHandler.find(id);
            
            if (!environment) {
            
                throw new Error("Environment not found");
            
            }
            
            const token = await this.claimToken(environment);

            return await this.getMetricsFromEnvironment(environment, token);;
        
        } catch (error) {
        
            throw error;
        
        }

    }

    async getMetricsFromEnvironment(environment: Environment, token : string): Promise<EnvironmentStatistics> {
        try {

            const res = await this.axiosInstance.get(`${environment.url}"/nifi-api/flow/status`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });
            

            if(res.status !== 200) {
                throw new Error("Failed to fetch metrics");
            }

            const { queued: flowFilesQueued, stoppedCount, activeThreadCount, runningCount } = res.data.controllerStatus;

            return {
                flowFilesQueued,
                stoppedCount,
                activeThreadCount,
                runningCount,
            };
        
        } catch (error) {
        
            throw error;
        
        }
    }

    async claimToken(environment: Environment): Promise<string> {

        const params = new URLSearchParams({ username: environment.username, password: environment.password });
        try {

            const res = await this.axiosInstance.post(`${environment.url}/nifi-api/access/token`, params, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            });
            
            if(res.status !== 200) {
                throw new Error("Failed to claim token");
            }

            return res.data;

        } catch (error) {
            throw error;
        }
    }

}