import { Component } from '@angular/core';
import { LabelModule } from 'primeng/label';
import { CardModule } from 'primeng/card';
import { UserWidgetComponent } from "./widgets/user.widget";

@Component({
  selector: 'app-home',
  imports: [LabelModule, CardModule, UserWidgetComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
