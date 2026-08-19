import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { CreateApplicationRequest, GetApplicationResponse } from "../models/application.model";
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

    addApplication(request: CreateApplicationRequest){
        return this.http.post<GetApplicationResponse>(environment.apiUrl + '/api/Application', request);
    }
}