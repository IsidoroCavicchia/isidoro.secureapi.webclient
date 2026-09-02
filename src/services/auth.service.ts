import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { UserService } from './user.service';
import { GetUserResponse } from '../models/user.model';

const RETURN_PATH_KEY = 'oidc_return_path';

interface UserInfo {
    sub: string;
    name?: string;
    preferred_username?: string;
    email?: string;
    username?: string;
    image?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly router = inject(Router);
    private readonly http = inject(HttpClient);
    private readonly userService = inject(UserService);

    private readonly _authenticated = signal<boolean | null>(null);
    private readonly _username = signal<string | null>(null);
    private readonly _userId = signal<string | null>(null);

    readonly isAuthenticated = this._authenticated.asReadonly();
    readonly currentUser = this._username.asReadonly();

    get userId() {
        return this._userId();
    }

    get user() {
        return this.userService.currentUser();
    }

    async checkAuth(): Promise<boolean> {
        try {
            const userInfo = await firstValueFrom(
                this.http.get<UserInfo>(`${environment.apiUrl}/connect/userinfo`)
            );
            this._username.set(userInfo.preferred_username ?? userInfo.username ?? null);
            this._userId.set(userInfo.sub ?? null);
            this._authenticated.set(true);
            return true;
        } catch {
            this._username.set(null);
            this._authenticated.set(false);
            return false;
        }
    }

    async startLogin(returnPath: string): Promise<void> {
        sessionStorage.setItem(RETURN_PATH_KEY, returnPath);

        const callbackUrl = `${window.location.origin}/callback`;

        const codeVerifier = generateRandomString(64);

        const codeChallenge = await createCodeChallenge(codeVerifier);

        sessionStorage.setItem(
            'pkce_code_verifier',
            codeVerifier
        );

        const params = new URLSearchParams({
            client_id: 'isidoro-spa',
            redirect_uri: callbackUrl,
            response_type: 'code',
            scope: 'openid profile email api username image',
            code_challenge: codeChallenge,
            code_challenge_method: 'S256'
        });

        window.location.href =
            `${environment.apiUrl}/connect/authorize?${params.toString()}`;
    }

    async exchangeCode(code: string): Promise<void> {
        const codeVerifier =
            sessionStorage.getItem('pkce_code_verifier');

        if (!codeVerifier) {
            throw new Error(
                'PKCE code_verifier introuvable'
            );
        }

        const body = new URLSearchParams();

        body.set(
            'grant_type',
            'authorization_code'
        );

        body.set(
            'client_id',
            'isidoro-spa'
        );

        body.set(
            'code',
            code
        );

        body.set(
            'redirect_uri',
            `${window.location.origin}/callback`
        );

        body.set(
            'code_verifier',
            codeVerifier
        );

        const response = await fetch(
            `${environment.apiUrl}/connect/token`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: body.toString()
            }
        );

        console.log('TOKEN STATUS:', response.status);
        console.log(
            'TOKEN HEADERS:',
            [...response.headers.entries()]
        );

        const responseText = await response.text();

        console.log('TOKEN RESPONSE:', responseText);

        if (!response.ok) {
            throw new Error(
                `Token exchange failed: ${responseText}`
            );
        }

        const token = JSON.parse(responseText);

        console.log('TOKEN:', token);

        // À adapter à ton système actuel
        localStorage.setItem(
            'access_token',
            token.access_token
        );

        if (token.refresh_token) {
            localStorage.setItem(
                'refresh_token',
                token.refresh_token
            );
        }

        sessionStorage.removeItem(
            'pkce_code_verifier'
        );
    }

    getReturnPath(): string {
        const path = sessionStorage.getItem(RETURN_PATH_KEY) ?? '/';
        sessionStorage.removeItem(RETURN_PATH_KEY);
        return path;
    }

    getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    }

    async logout(): Promise<void> {
        try {
            await firstValueFrom(this.http.get(`${environment.apiUrl}/connect/logout`));
        } finally {
            this._authenticated.set(false);
            this._username.set(null);
            this.router.navigate(['/login']);
        }
    }
}

function base64UrlEncode(buffer: ArrayBuffer): string {
    return btoa(
        String.fromCharCode(...new Uint8Array(buffer))
    )
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function generateRandomString(length: number): string {
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';

    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);

    return Array.from(randomValues)
        .map(x => chars[x % chars.length])
        .join('');
}

async function createCodeChallenge(
    codeVerifier: string
): Promise<string> {

    const data = new TextEncoder().encode(codeVerifier);

    const digest = await crypto.subtle.digest(
        'SHA-256',
        data
    );

    return base64UrlEncode(digest);
}
