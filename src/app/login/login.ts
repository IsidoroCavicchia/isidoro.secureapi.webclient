import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { environment } from '../../environments/environment';

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
                    <p-button
                        type="submit"
                        label="Se connecter"
                        styleClass="w-full mt-2"
                    />
                </form>
            </div>
        </div>
    `
})
export class LoginComponent {
    private readonly fb = inject(FormBuilder);
    private readonly route = inject(ActivatedRoute);

    // ReturnUrl is set by OpenIddict when it redirects to this login page
    private readonly backendReturnUrl = this.route.snapshot.queryParamMap.get('ReturnUrl') ?? '/';

    protected readonly form = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    protected submit(): void {
        if (this.form.invalid) return;
        const { username, password } = this.form.value;

        // Native form POST avoids CORS on the backend redirect
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `${environment.apiUrl}/login`;

        for (const [name, value] of [['Username', username!], ['Password', password!], ['ReturnUrl', this.backendReturnUrl]] as [string, string][]) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
    }
}
