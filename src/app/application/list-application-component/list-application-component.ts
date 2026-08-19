import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ApplicationService } from '../../../services/applciation.service';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

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
    ToggleSwitchModule 
  ],
  templateUrl: './list-application-component.html',
  styleUrl: './list-application-component.css',
})
export class ListApplicationComponent implements OnInit {
  private readonly applicationService = inject(ApplicationService);
  applicationName: string = '';
  applicationDomain: string = '';

  protected readonly dialogVisible = signal(false);

  get applications() { return this.applicationService.applications(); }

  ngOnInit(): void {
    this.applicationService.getApplications().subscribe((response) => {
      this.applicationService.applications.set(response);
      console.log(this.applications);
    })
  }

  protected addApplication(): void {
    this.dialogVisible.set(true);
  }
}
