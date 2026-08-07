import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LabelModule } from 'primeng/label';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { UpdateUserRequest } from '../../../models/user.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-user-component',
  imports: [LabelModule, CardModule, InputTextModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './update-user-component.html',
  styleUrls: ['./update-user-component.css'],
})
export class UpdateUserComponent {
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private userId: string | null = null;

  updateUserRequest : UpdateUserRequest = {
    username: '',
    password: '',
    image: ''
  }

  user = this.userService.user;

  usernameFormControl = new FormControl('', { nonNullable: true });
  updateUserForm = new FormGroup({
    username : this.usernameFormControl,
  });

  protected readonly photoPreview = signal<string>('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2Ku7gWwNnLD6RdGGhEqzOjB-bK2jY2q4l15cVvpi4i-an0yPZQHoefBpD&s=10');

  protected onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.photoPreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });
    
    this.userService.getUser(this.userId || '').subscribe((response) => {
      this.userService.user.set(response);
      this.updateUserRequest.username = response.username;
      this.usernameFormControl.setValue(response.username);
    });
  }

  onSubmit(): void{
    this.updateUserRequest.username = this.usernameFormControl.value;
    this.updateUserRequest.image = this.photoPreview();
    this.userService.updateUser(this.userId || '', this.updateUserRequest).subscribe(() => this.router.navigate(['/users']));
  }
}
