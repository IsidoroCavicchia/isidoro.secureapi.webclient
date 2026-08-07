import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { UserService } from './user.service';

const TOKEN_KEY = 'auth_token';
const USERNAME_KEY = 'auth_username';
const EXPIRY_KEY = 'auth_expiry';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly router = inject(Router);
    private readonly userService = inject(UserService);

    private readonly _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
    private readonly _username = signal<string | null>(localStorage.getItem(USERNAME_KEY));
    private readonly _expiry = signal<Date | null>(this.parseStoredDate(localStorage.getItem(EXPIRY_KEY)));

    readonly currentUser = this._username.asReadonly();
    readonly isAuthenticated = computed(() => {
        const token = this._token();
        if (!token) return false;
        const expiry = this._expiry();
        return !expiry || new Date() <= expiry;
    });

    login(username: string, password: string) {
        return this.userService.login(username, password).pipe(
            tap(response => {
                if (response.success) {
                    const expiry = this.decodeJwtExpiry(response.token);
                    this.storeSession(response.token, response.username, expiry);
                }
            })
        );
    }

    logout(): void {
        this.clearSession();
        this.router.navigate(['/login']);
    }

    private storeSession(token: string, username: string, expiry: Date | null): void {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USERNAME_KEY, username);
        if (expiry) localStorage.setItem(EXPIRY_KEY, expiry.toISOString());
        this._token.set(token);
        this._username.set(username);
        this._expiry.set(expiry);
    }

    private clearSession(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USERNAME_KEY);
        localStorage.removeItem(EXPIRY_KEY);
        this._token.set(null);
        this._username.set(null);
        this._expiry.set(null);
    }

    // Decode exp claim from JWT payload without an external library
    private decodeJwtExpiry(token: string): Date | null {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return typeof payload.exp === 'number' ? new Date(payload.exp * 1000) : null;
        } catch {
            return null;
        }
    }

    private parseStoredDate(value: string | null): Date | null {
        return value ? new Date(value) : null;
    }
}
