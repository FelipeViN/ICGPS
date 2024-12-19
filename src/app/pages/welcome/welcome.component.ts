import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from '../../component/toolbar/toolbar.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterOutlet, ToolbarComponent],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export default class WelcomeComponent {
  title = 'bienvenida';
}
