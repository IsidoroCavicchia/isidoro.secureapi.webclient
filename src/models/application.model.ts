export interface GetApplicationResponse {
    id: string;
    name: string;
    domain: string;
    isActive: boolean;
    isOnline: boolean;
}

export interface CreateApplicationRequest {
    name: string;
    domain: string;
    isActive: boolean;
}