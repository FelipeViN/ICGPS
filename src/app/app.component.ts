import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from "./component/toolbar/toolbar.component";
import {MatGridListModule} from '@angular/material/grid-list';
import { CardComponent } from "./component/card/card.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToolbarComponent, MatGridListModule, CardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cecyteProyecto';
}
