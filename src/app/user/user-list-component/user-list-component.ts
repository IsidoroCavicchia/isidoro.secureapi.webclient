import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { UserService } from '../../../services/user.service';
import { GetUserRequest, GetUserResponse, ResetPasswordRequest } from '../../../models/user.model';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const group = control as FormGroup;
  const newPassword = group.get('newPassword')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return newPassword === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-user-list-component',
  imports: [TableModule,
    CardModule,
    AvatarModule,
    DatePipe,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    ToastModule,
    ToolbarModule,
    FormsModule,
    DatePickerModule
  ],
  providers: [MessageService],
  templateUrl: './user-list-component.html',
  styleUrls: ['./user-list-component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  protected readonly users = this.userService.users;
  protected readonly dialogVisible = signal(false);
  protected readonly selectedUser = signal<GetUserResponse | null>(null);
  private request: GetUserRequest = {};

  protected readonly passwordForm = new FormGroup(
    {
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordsMatchValidator }
  );

  username: string = '';
  selectedCreatedDate: Date[] | null = null;

  ngOnInit(): void {
    this.userService.getUsers(this.request).subscribe((response) => {
      this.userService.users.set(response.body || []);
    });
  }

  protected onAdd(): void {
    this.router.navigate(['/user/create']);
  }

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
    var newPassword: ResetPasswordRequest = {
      id: user.id,
      newPassword: this.passwordForm.value.newPassword!,
    };
    this.userService.resetPassword(newPassword).subscribe(() => {
      this.dialogVisible.set(false);
    });
  }

  onSearch(): void {
    if (this.username.length >= 3){
      this.request.username = this.username;
      this.userService.getUsers(this.request).subscribe((response) => {
        this.userService.users.set(response.body || []);
      });
    } else {
      if (this.username.length === 0) {
        this.request.username = undefined;
        this.userService.getUsers(this.request).subscribe((response) => {
          this.userService.users.set(response.body || []);
        });
      }
    }
  }

  selectCreatedDate() {
    const range = this.selectedCreatedDate;
    const dateMin = range?.[0] ?? null;
    const dateMax = range?.[1] ?? new Date();

    this.request.lastConnectBeginAt = dateMin ?? undefined;
    this.request.lastConnectEndAt = dateMax ?? undefined;

    // Only refresh when the range is cleared or both dates are selected
    const isCleared = !range || range.every((d: Date | null) => d == null);
    if (isCleared || dateMax) {
      this.userService.getUsers(this.request).subscribe((response) => {
        this.userService.users.set(response.body || []);
      });
    }
  }
}
