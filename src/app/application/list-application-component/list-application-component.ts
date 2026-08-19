import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ApplicationService } from '../../../services/applciation.service';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CreateApplicationRequest } from '../../../models/application.model';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-list-application-component',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    InputTextModule,
    CardModule,
    DialogModule,
    CheckboxModule,
    ToggleSwitchModule,
    TagModule
  ],
  templateUrl: './list-application-component.html',
  styleUrl: './list-application-component.css',
})
export class ListApplicationComponent implements OnInit {
  private readonly applicationService = inject(ApplicationService);
  searchName: string = '';
  searchDomain: string = '';

  applicationName = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  applicationDomain = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  applicationIsActive = new FormControl(true, { nonNullable: true, validators: [Validators.required] });
  applicationFormGroup = new FormGroup({
    applicationName: this.applicationName,
    applicationDomain: this.applicationDomain,
    applicationIsActive: this.applicationIsActive
  });

  protected readonly dialogVisible = signal(false);

  get applications() { return this.applicationService.applications(); }

  ngOnInit(): void {
    this.getApplications();
  }

  private getApplications(){
        this.applicationService.getApplications().subscribe((response) => {
      this.applicationService.applications.set(response);
    });
  }

  protected addApplication(): void {
    this.dialogVisible.set(true);
  }

  protected onSubmitApplication(): void {
    if (this.applicationFormGroup.valid) {
      const application: CreateApplicationRequest = {
        name: this.applicationName.value,
        domain: this.applicationDomain.value,
        isActive: this.applicationIsActive.value
      };

      this.applicationService.addApplication(application).subscribe((response) => {
        this.applicationService.getApplications().subscribe((response) => {
          this.applicationService.applications.set(response);
          this.dialogVisible.set(false);
          this.applicationFormGroup.reset();
          this.getApplications();
        });
      });
    }
  }
}