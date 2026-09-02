import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = async (_route, state) => {
    const auth = inject(AuthService);

    const authenticated = auth.isAuthenticated();
    console.log('Authenticated:', authenticated);

    if (authenticated === true) {
        return true;
    }

    if (authenticated === null) {
        const result = await auth.checkAuth();

        if (result === true) {
            return true;
        }
    }

    auth.startLogin(state.url);

    return false;
};