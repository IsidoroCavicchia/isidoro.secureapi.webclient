import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LabelModule } from 'primeng/label';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { UpdateUserRequest } from '../../../models/user.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-update-user-component',
  imports: [LabelModule, CardModule, InputTextModule, ButtonModule, ReactiveFormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './update-user-component.html',
  styleUrls: ['./update-user-component.css'],
})
export class UpdateUserComponent {
  private readonly userService = inject(UserService);
  private readonly messageService = inject(MessageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private userId: string | null = null;

  imageUrl = signal<string | null>(null);

  updateUserRequest : UpdateUserRequest = {
    username: '',
    password: '',
    image: '',
    email: ''
  }

  get user() {
    return this.userService.user();
  }

  usernameFormControl = new FormControl('', { nonNullable: true });
  emailFormControl = new FormControl('', { nonNullable: true, validators: [Validators.email] });
  updateUserForm = new FormGroup({
    username : this.usernameFormControl,
    email : this.emailFormControl
  });

  protected onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.imageUrl.set(reader.result as string);
    reader.readAsDataURL(file);
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });
    
    this.userService.getUser(this.userId || '').subscribe((response) => {
      this.userService.user.set(response);
      this.updateUserRequest.username = response.username;
      this.updateUserRequest.email = response.email;
      this.imageUrl.set(response.image || null);
      this.usernameFormControl.setValue(response.username);
      this.emailFormControl.setValue(response.email!);
    });
  }

  onSubmit(): void{
    if (this.updateUserForm.invalid) {
      this.updateUserForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez corriger les erreurs dans le formulaire.' });
      return;
    }
    
    this.updateUserRequest.username = this.usernameFormControl.value;
    this.updateUserRequest.email = this.emailFormControl.value;
    this.updateUserRequest.image = this.imageUrl() || undefined;
    this.userService.updateUser(this.userId || '', this.updateUserRequest).subscribe(() => this.router.navigate(['/users']));
  }
}
