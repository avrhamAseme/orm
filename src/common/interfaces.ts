


export interface CreateDto {}

export interface CreateEnvironmentDto extends CreateDto {
    id: number;
    name: string;
    url: string;
    username: string;
    password: string;
}

export interface UpdateEnvironmentDto extends CreateDto {
    name?: string;
    url?: string;
    username?: string;
    password?: string;
}


export interface DatabaseHandler {
    find(id : string): Promise<any>;
    remove(id : string): Promise<void>;
    update(id: string, updateDto : CreateDto ): Promise<void>;
    insert(createDto : CreateDto): Promise<void>;
}


export interface EnvironmentStatistics {
    activeThreadCount: number;
    flowFilesQueued: number;
    runningCount: number;
    stoppedCount: number;
}