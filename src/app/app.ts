import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { SideBarComponent } from '../theme/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonDirective, SideBarComponent],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('isidoro.secureapi.webclient');
}
