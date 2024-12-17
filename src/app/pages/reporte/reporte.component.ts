import { Component } from '@angular/core';
import { ToolbarComponent } from '../../component/toolbar/toolbar.component';
import { GraficaComponent } from '../../component/grafica/grafica.component';
import { ReportePDFComponent } from '../../component/reporte/reportePDF.component';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [
    ToolbarComponent,
    GraficaComponent,
  ],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css'
})
export default class ReporteComponent {

}
