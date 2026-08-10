import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { UserService } from '../../../services/user.service';
import { CreateUserRequest } from '../../../models/user.model';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-user-component',
  imports: [CardModule, InputTextModule, ButtonModule, ReactiveFormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './create-user-component.html',
  styleUrl: './create-user-component.css',
})
export class CreateUserComponent {
  private readonly userService = inject(UserService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  protected readonly photoPreview = signal<string>('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2Ku7gWwNnLD6RdGGhEqzOjB-bK2jY2q4l15cVvpi4i-an0yPZQHoefBpD&s=10');

  image: string | null = null;

  usernameFormControl = new FormControl('', { nonNullable: true });
  passwordFormControl = new FormControl('', { nonNullable: true });
  createUserForm = new FormGroup({
    username: this.usernameFormControl,
    password: this.passwordFormControl,
  });

  onSubmit(): void {
    if (this.createUserForm.invalid) {
      return;
    }

    const username = this.usernameFormControl.value;
    const password = this.passwordFormControl.value;

    const request: CreateUserRequest = {
      username: username,
      password: password,
    };

    console.log(request);
    this.userService.registerUser(request).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Utilisateur (${username}) créé avec succès` });
        this.router.navigate(['/user']);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Erreur lors de la création de l'utilisateur (${username})` });
      },
    });
  }

  protected onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.photoPreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

}
