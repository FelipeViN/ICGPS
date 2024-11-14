import { Component } from '@angular/core';
import { ToolbarComponent } from '../../component/toolbar/toolbar.component';
import { CardComponent } from '../../component/card/card.component';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [ToolbarComponent, CardComponent, MatGridListModule],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export default class MapaComponent {

}
