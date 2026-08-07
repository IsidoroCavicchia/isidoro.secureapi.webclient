export interface GetLoginResponse{
    success: boolean;
    message: string;
    username: string;
    token: string;
}

export interface GetUserRequest{
    id?: string;
    username?: string;
    lastConnectBeginAt?: Date;
    LastConnectEndAt?: Date;
}

export interface GetUserResponse{
    id: string;
    username: string;
    lastConnect: Date;
    image?: string;
}

export interface UpdateUserRequest{
    username: string;
    password: string;
    image: string;
}

export interface ResetPasswordRequest{
    id: string;
    newPassword: string;
}