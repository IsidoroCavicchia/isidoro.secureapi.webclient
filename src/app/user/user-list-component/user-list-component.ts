import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { UserService } from '../../../services/user.service';
import { GetUserRequest, GetUserResponse, ResetPasswordRequest } from '../../../models/user.model';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const group = control as FormGroup;
  const newPassword = group.get('newPassword')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return newPassword === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-user-list-component',
  imports: [TableModule, CardModule, AvatarModule, DatePipe, ButtonModule, DialogModule, InputTextModule, ReactiveFormsModule],
  providers: [],
  templateUrl: './user-list-component.html',
  styleUrl: './user-list-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  protected readonly users = this.userService.users;
  protected readonly dialogVisible = signal(false);
  protected readonly selectedUser = signal<GetUserResponse | null>(null);

  protected readonly passwordForm = new FormGroup(
    {
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordsMatchValidator }
  );

  ngOnInit(): void {
    const request: GetUserRequest = {};
    this.userService.getUsers(request).subscribe((response) => {
      this.userService.users.set(response.body || []);
    });
  }

  protected onAdd(): void {}

  protected onEdit(user: GetUserResponse): void {
    this.router.navigate(['/user', user.id]);
  }

  protected resetPassword(user: GetUserResponse): void {
    this.selectedUser.set(user);
    this.passwordForm.reset();
    this.dialogVisible.set(true);
  }

  protected onSubmitPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    const user = this.selectedUser();
    if (!user) return;
    var newPassword : ResetPasswordRequest = {
      id: user.id,
      newPassword: this.passwordForm.value.newPassword!,
    };
    this.userService.resetPassword(newPassword).subscribe(() => {
      this.dialogVisible.set(false);
    });
  }
}
