import { inject, injectable } from 'inversify';
import { CreateEnvironmentDto, DatabaseHandler, UpdateEnvironmentDto } from './common/interfaces';
import { EnvironmentRepository } from './common/types';

import { ENVIRONMENT_REPOSITORY } from './common/symbols';
import { Environment } from './models/environments';


@injectable()
export class PostgresService implements DatabaseHandler {
    
    constructor(@inject(ENVIRONMENT_REPOSITORY) private readonly environmentRepository: EnvironmentRepository) {}

    async find(id : string): Promise<Environment | null> {
        try {
            const environment : Environment | null = await this.environmentRepository.findOne({ where: { id } });
            if (!environment) {
                throw new Error("Environment not found");
            }
            return environment;

        } catch (error) {
            throw error;
        }
    }

    async remove(id : string): Promise<void>{
        try{
            const environment : Environment | null = await this.environmentRepository.findOne({ where: { id } });
            if (environment) {
                await this.environmentRepository.destroy({ where: { id } });
            }
            else {
                throw new Error("Environment not found");
            }
        }
        catch (error) {
            throw error;
        }
    }

    async update(id : string, updateEnvironmentDto : UpdateEnvironmentDto): Promise<void> {
        try{ 
             await this.environmentRepository.update(updateEnvironmentDto, { where: { id: id } });
        }
        catch (error) {
            throw error;
        }
    }

    async insert(createEnvironmentDto : CreateEnvironmentDto): Promise<void> {
        try {
            await this.environmentRepository.create(createEnvironmentDto as Environment);
        } catch (error) {
            throw error
        }
    }
}