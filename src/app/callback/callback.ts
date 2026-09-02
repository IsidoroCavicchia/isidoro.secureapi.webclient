import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-callback',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="flex min-h-screen items-center justify-center">
            <p class="text-muted-color">Authentification en cours...</p>
        </div>
    `
})
export class CallbackComponent implements OnInit {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    async ngOnInit(): Promise<void> {
        try {
            const params = new URLSearchParams(
                window.location.search
            );

            const code = params.get('code');
            const error = params.get('error');

            console.log('Callback URL:', window.location.href);
            console.log('Code:', code);
            console.log('OAuth error:', error);

            if (error) {
                console.error(
                    'OAuth error:',
                    error,
                    params.get('error_description')
                );

                return;
            }

            if (!code) {
                console.error('Aucun code OAuth reçu');
                return;
            }

            await this.authService.exchangeCode(code);

            const returnPath =
                this.authService.getReturnPath() || '/';

            await this.router.navigateByUrl(returnPath);

        } catch (error) {
            console.error(
                'Erreur pendant le callback:',
                error
            );
        }
    }
}