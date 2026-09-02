import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { environment } from "../environments/environment";
import { GetLoginResponse, GetUserRequest, GetUserResponse, CreateUserRequest, ResetPasswordRequest } from "../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    public users = signal<GetUserResponse[]>([]);
    public user = signal<GetUserResponse | null>(null);
    public currentUser = signal<GetUserResponse | null>(null);

    constructor(private readonly http: HttpClient){}

    getUsers(request: GetUserRequest){
        return this.http.get<GetUserResponse[]>(environment.apiUrl + '/api/Account', {
            params: Object.fromEntries(
                Object.entries(request)
                    .filter(([, v]) => v !== undefined && v !== null)
                    .map(([k, v]) => {
                        if (v instanceof Date) {
                            const y = v.getFullYear();
                            const m = String(v.getMonth() + 1).padStart(2, '0');
                            const d = String(v.getDate()).padStart(2, '0');
                            return [k, `${y}-${m}-${d}`];
                        }
                        return [k, v];
                    })
            ),
            observe: 'response'
        });
    }

    getUser(id: string){
        return this.http.get<GetUserResponse>(environment.apiUrl + '/api/Account/' + id);
    }

    updateUser(id: string, request: any){
        return this.http.put(environment.apiUrl + '/api/Account/' + id, request);
    }

    resetPassword(request: ResetPasswordRequest){
        return this.http.patch(environment.apiUrl + '/api/Account/reset-password', request);
    }

    registerUser(request: CreateUserRequest){
        const params = Object.fromEntries(
            Object.entries(request).filter(([, v]) => v !== undefined && v !== null)
        )
        return this.http.post(environment.apiUrl + '/api/Account/register?Username=' + request.username + '&Password=' + request.password, {});
    }
}