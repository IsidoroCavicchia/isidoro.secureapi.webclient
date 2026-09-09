import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { CreateApplicationRequest, GetApplicationResponse, UpdateApplicationRequest } from "../models/application.model";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ApplicationService {
    private readonly http = inject(HttpClient);

    public applications = signal<GetApplicationResponse[]>([]);
    public application = signal<GetApplicationResponse | null>(null);

    getApplications(){
        return this.http.get<GetApplicationResponse[]>(environment.apiUrl + '/api/Application');
    }

    getApplication(id: string){
        return this.http.get<GetApplicationResponse>(environment.apiUrl + '/api/Application/' + id);
    }

    addApplication(request: CreateApplicationRequest){
        return this.http.post<GetApplicationResponse>(environment.apiUrl + '/api/Application', request);
    }

    updateApplication(id: string, request: UpdateApplicationRequest){
        return this.http.put<GetApplicationResponse>(environment.apiUrl + '/api/Application/' + id, request);
    }
}