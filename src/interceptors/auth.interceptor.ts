import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment';

const LOGIN_URL = `${environment.apiUrl}/api/Account/Login`;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.url.startsWith(LOGIN_URL)) {
        return next(req);
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
        return next(req);
    }

    return next(req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
    }));
};
