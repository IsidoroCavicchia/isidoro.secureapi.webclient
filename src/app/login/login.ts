import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, ButtonModule, InputTextModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-950">
            <div class="w-full max-w-sm rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 p-8 shadow-lg">
                <div class="mb-8 flex flex-col items-center gap-2">
                    <div class="flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 text-white font-bold text-xl">
                        API
                    </div>
                    <h1 class="text-xl font-semibold">SecureAPI</h1>
                    <p class="text-sm text-muted-color">Connectez-vous à votre compte</p>
                </div>
                <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4">
                    <div class="flex flex-col gap-1.5">
                        <label for="username" class="text-sm font-medium">Nom d'utilisateur</label>
                        <input
                            id="username"
                            pInputText
                            formControlName="username"
                            autocomplete="username"
                            class="w-full"
                        />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label for="password" class="text-sm font-medium">Mot de passe</label>
                        <input
                            id="password"
                            pInputText
                            type="password"
                            formControlName="password"
                            autocomplete="current-password"
                            class="w-full"
                        />
                    </div>
                    @if (error()) {
                        <p role="alert" class="text-sm text-red-500 text-center">{{ error() }}</p>
                    }
                    <p-button
                        type="submit"
                        label="Se connecter"
                        [loading]="loading()"
                        styleClass="w-full mt-2"
                    />
                </form>
            </div>
        </div>
    `
})
export class LoginComponent {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    protected readonly form = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    protected readonly error = signal<string | null>(null);
    protected readonly loading = signal(false);

    protected submit(): void {
        if (this.form.invalid) return;
        this.loading.set(true);
        this.error.set(null);
        const { username, password } = this.form.value;
        this.authService.login(username!, password!).subscribe({
            next: (res) => {
                this.loading.set(false);
                if (res.success) {
                    this.router.navigate(['/']);
                } else {
                    this.error.set(res.message || 'Identifiants incorrects.');
                }
            },
            error: () => {
                this.loading.set(false);
                this.error.set('Erreur de connexion. Veuillez réessayer.');
            }
        });
    }
}
