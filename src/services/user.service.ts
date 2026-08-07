import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { environment } from "../environments/environment";
import { GetLoginResponse, GetUserRequest, GetUserResponse, ResetPasswordRequest } from "../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    public users = signal<GetUserResponse[]>([]);
    public user = signal<GetUserResponse | null>(null);

    constructor(private readonly http: HttpClient){}

    getUsers(request: GetUserRequest){
        const params = Object.fromEntries(
            Object.entries(request).filter(([, v]) => v !== undefined && v !== null)
        )
        return this.http.get<GetUserResponse[]>(environment.apiUrl + '/api/Account', { params, observe: 'response' });
    }

    getUser(id: string){
        return this.http.get<GetUserResponse>(environment.apiUrl + '/api/Account/' + id);
    }

    login(username: string, password: string){
        return this.http.post<GetLoginResponse>(environment.apiUrl + '/api/Account/Login?Username=' + username + '&Password=' + password, {});
    }

    updateUser(id: string, request: any){
        return this.http.put(environment.apiUrl + '/api/Account/' + id, request);
    }

    resetPassword(request: ResetPasswordRequest){
        return this.http.patch(environment.apiUrl + '/api/Account/reset-password', request);
    }
}