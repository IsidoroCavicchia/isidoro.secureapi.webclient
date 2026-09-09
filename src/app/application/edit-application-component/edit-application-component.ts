import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { forkJoin } from 'rxjs';
import { ApplicationService } from '../../../services/applciation.service';
import { UserService } from '../../../services/user.service';
import { UpdateApplicationRequest } from '../../../models/application.model';
import { GetUserResponse } from '../../../models/user.model';

@Component({
  selector: 'app-edit-application-component',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    SelectModule,
    ToggleSwitchModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './edit-application-component.html',
  styleUrl: './edit-application-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditApplicationComponent implements OnInit {
  private readonly applicationService = inject(ApplicationService);
  private readonly userService = inject(UserService);
  private readonly messageService = inject(MessageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly loading = signal(true);
  protected readonly selectedUserIds = signal<string[]>([]);
  protected readonly userOptions = signal<GetUserResponse[]>([]);
  protected readonly selectedUserCount = computed(() => this.selectedUserIds().length);
  protected applicationId = '';

  protected readonly nameFormControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  protected readonly domainFormControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  protected readonly isActiveFormControl = new FormControl(true, { nonNullable: true });
  protected readonly userIdsFormControl = new FormControl<string[]>([], { nonNullable: true });

  protected readonly applicationForm = new FormGroup({
    name: this.nameFormControl,
    domain: this.domainFormControl,
    isActive: this.isActiveFormControl,
    userIds: this.userIdsFormControl,
  });

  ngOnInit(): void {
    this.applicationId = this.route.snapshot.paramMap.get('id') ?? '';
    this.userIdsFormControl.valueChanges.subscribe((userIds) => this.selectedUserIds.set(userIds));

    forkJoin({
      application: this.applicationService.getApplication(this.applicationId),
      users: this.userService.getUsers({})
    }).subscribe({
      next: ({ application, users }) => {
        this.applicationService.application.set(application);
        const applicationUsers = this.getApplicationUsers(application);
        const availableUsers = this.mergeUsers(users.body ?? [], applicationUsers);
        this.userService.users.set(availableUsers);
        this.userOptions.set(availableUsers);
        const selectedUserIds = this.getApplicationUserIds(application);
        this.applicationForm.setValue({
          name: application.name,
          domain: application.domain,
          isActive: application.isActive,
          userIds: selectedUserIds,
        });
        this.selectedUserIds.set(selectedUserIds);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Impossible de charger l'application." });
      }
    });
  }

  private getApplicationUserIds(application: unknown): string[] {
    const applicationUsers = this.getApplicationUsers(application);
    const source = application as { userIds?: string[]; userId?: string; user?: { id: string } };

    if (Array.isArray(source.userIds)) {
      return source.userIds;
    }

    if (applicationUsers.length > 0) {
      return applicationUsers.map((user) => user.id);
    }

    if (source.userId) {
      return [source.userId];
    }

    if (source.user?.id) {
      return [source.user.id];
    }

    return [];
  }

  private getApplicationUsers(application: unknown): GetUserResponse[] {
    const source = application as { users?: GetUserResponse[]; accounts?: GetUserResponse[] };

    if (Array.isArray(source.users)) {
      return source.users;
    }

    if (Array.isArray(source.accounts)) {
      return source.accounts;
    }

    return [];
  }

  private mergeUsers(users: GetUserResponse[], applicationUsers: GetUserResponse[]): GetUserResponse[] {
    const mergedUsers = new Map<string, GetUserResponse>();

    for (const user of [...users, ...applicationUsers]) {
      mergedUsers.set(user.id, user);
    }

    return Array.from(mergedUsers.values());
  }

  protected onCancel(): void {
    this.router.navigate(['/application']);
  }

  protected onSubmit(): void {
    if (this.applicationForm.invalid) {
      this.applicationForm.markAllAsTouched();
      return;
    }

    const request: UpdateApplicationRequest = {
      name: this.nameFormControl.value,
      domain: this.domainFormControl.value,
      isActive: this.isActiveFormControl.value,
      userIds: this.userIdsFormControl.value,
    };

    this.applicationService.updateApplication(this.applicationId, request).subscribe({
      next: () => this.router.navigate(['/application']),
      error: () => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "La modification n'a pas pu être enregistrée." })
    });
  }
}