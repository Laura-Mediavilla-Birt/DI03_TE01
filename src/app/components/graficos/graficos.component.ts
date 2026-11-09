// *****************************************************************************
// IMPORTS
// *****************************************************************************
import { Component, input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Restaurante } from '../../interface/restaurante';
import { GraficoBarraVerticalComponent } from './grafico-barra-vertical/grafico-barra-vertical.component';
import { GraficoLineaComponent } from './grafico-linea/grafico-linea.component';
import { GraficoBarraHorizontalComponent } from './grafico-barra-horizontal/grafico-barra-horizontal.component';
import { GraficoDonutComponent } from './grafico-donut/grafico-donut.component';

// *****************************************************************************
// GraficosComponent — CONTENEDOR
//
// Este componente ya no dibuja ninguna gráfica: solo recibe los datos
// filtrados del padre (home.page.html) y los reparte entre los cuatro
// componentes hijos, cada uno responsable de una única gráfica de Chart.js
// (su propio <canvas>, su propio effect() y su propia limpieza en
// ngOnDestroy). Ver components/graficos/grafico-*/ para el detalle de cada
// gráfica.
// *****************************************************************************
@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [
    IonicModule,
    GraficoBarraVerticalComponent,
    GraficoLineaComponent,
    GraficoBarraHorizontalComponent,
    GraficoDonutComponent
  ],
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.scss']
})
export class GraficosComponent {

  // *************************************************************************
  // INPUT CON SEÑAL
  //
  // input<T>() es la forma moderna de recibir datos del componente padre.
  // Recibe la lista de restaurantes que se mostrará en las gráficas.
  // *************************************************************************
  restaurantes = input<Restaurante[]>([]);
}
