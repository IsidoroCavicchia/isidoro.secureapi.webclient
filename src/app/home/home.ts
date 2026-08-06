import { Component } from '@angular/core';
import { LabelModule } from 'primeng/label';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-home',
  imports: [LabelModule, CardModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
