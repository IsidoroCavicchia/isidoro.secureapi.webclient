import { GetUserResponse } from "./user.model";

export interface GetApplicationResponse {
    id: string;
    name: string;
    domain: string;
    isActive: boolean;
    isOnline: boolean;
    userIds?: string[];
    users?: GetUserResponse[];
}

export interface CreateApplicationRequest {
    name: string;
    domain: string;
    isActive: boolean;
}

export interface UpdateApplicationRequest {
    name: string;
    domain: string;
    isActive: boolean;
    userIds: string[];
}