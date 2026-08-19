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
    lastConnectEndAt?: Date;
}

export interface GetUserResponse{
    id: string;
    username: string;
    lastConnect: Date;
    image?: string;
    email?: string;
}

export interface UpdateUserRequest{
    username: string;
    password: string;
    image?: string;
    email?: string;
}

export interface ResetPasswordRequest{
    id: string;
    newPassword: string;
}

export interface CreateUserRequest{
    username?: string;
    password: string;
    email?: string;
}