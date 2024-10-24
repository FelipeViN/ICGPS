import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from '../../component/toolbar/toolbar.component';
import { CardComponent } from '../../component/card/card.component';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterOutlet, ToolbarComponent, CardComponent, MatGridListModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export default class WelcomeComponent {
title = 'welcome';
}
