// *****************************************************************************
// IMPORTS
// *****************************************************************************
import { Component, input, effect, viewChild, ElementRef, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Chart } from 'chart.js';
import { Restaurante } from '../../../interface/restaurante';
import { CHART_PALETTE } from '../utils/chart-colors';
import '../utils/chart-setup';

@Component({
  selector: 'app-grafico-donut',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './grafico-donut.component.html',
  styleUrls: ['./grafico-donut.component.scss']
})
export class GraficoDonutComponent implements OnDestroy {

  restaurantes = input<Restaurante[]>([]);

  private canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  private chart?: Chart;

  constructor() {
    effect(() => {
      const data = this.restaurantes();
      const c = this.canvas();
      if (!c) return;

      this.render(data, c.nativeElement);
    });
  }

  // *************************************************************************
  // GRÁFICO — Donut: top 10 localidades con más restaurantes
  //
  // TIPO: 'doughnut' (donut = variante del gráfico de sectores/pie con hueco)
  //   · 'pie' rellena todo el círculo.
  //   · 'doughnut' deja un hueco en el centro (visualmente más limpio).
  //   · NO usa escalas (scales), porque no hay ejes X/Y.
  //   · La leyenda es especialmente importante aquí porque los colores son
  //     la única forma de identificar cada sector.
  //
  // PREPARACIÓN DE DATOS:
  //   1. Contamos restaurantes por localidad con un Map.
  //   2. Convertimos a array, ordenamos de mayor a menor y tomamos los 10 primeros.
  //   3. Asignamos un color distinto a cada localidad recorriendo la paleta
  //      cuando hay más localidades que colores disponibles CHART_PALETTE[i % 10].
  //
  // TOOLTIP CON PORCENTAJE:
  //   Calculamos el total sumando todos los valores del dataset y dividimos
  //   el valor del sector entre el total para obtener el porcentaje.
  //
  // LEYENDA A LA DERECHA (position: 'right'):
  //   Con 10 etiquetas, colocarla abajo ocuparía demasiado espacio vertical.
  //   A la derecha aprovecha el ancho de pantalla y el donut queda centrado.
  //
  // hoverOffset: cuando el usuario pone el cursor sobre un sector, éste se
  //   desplaza hacia afuera N píxeles, dando retroalimentación visual clara.
  // *************************************************************************
  private render(data: Restaurante[], canvas: HTMLCanvasElement) {
    // TODO: destruye la instancia anterior antes de representar los datos
    // de nuevo para no acumular gráficas sobre el mismo canvas.


    // TODO: 'counts' debe guardar una entrada por localidad. La clave
    // identificará el sector y el valor determinará su tamaño proporcional.
    const counts = null;
    data.forEach(r => {
      // TODO: usa en cada restaurante el campo que identifica la localidad
      // y decide qué texto mostrar cuando no exista ese dato -> locality
      const loc = null;
      // TODO: localiza el recuento actual de la localidad, incrementa el
      // valor y conserva el nuevo total para el siguiente restaurante.
   
    });

    // TODO: convierte los recuentos en una lista de parejas localidad- cantidad, 
    // ordénala de mayor a menor y limita los sectores mostrados para que el gráfico siga siendo legible. 
    // Para recortar la lista podemos hacer uso de slice(0, 10)
    const top10 = null;

    // TODO: en un donut no hay ejes. Relaciona cada localidad con su
    // cantidad y configura una única serie, ya que cada sector pertenece a
    // una categoría diferente dentro del mismo conjunto de datos.
    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        // TODO: extrae por separado las claves y los valores de las
        // entradas, manteniendo el mismo orden en ambas listas.
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [], //CHART_PALETTE[i % CHART_PALETTE.length] + 'bb'
          borderColor: [], //CHART_PALETTE[i % CHART_PALETTE.length]
          borderWidth: 2,
          // hoverOffset: desplaza el sector N px hacia afuera al pasar el ratón
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            //TODO: Añadir la leyenda y su configuración, position y label

          },
          title: {
            display: true,
            text: '',
            font: { size: 15, weight: 'bold' },
            color: '#333',
            padding: { bottom: 14 }
          },
          tooltip: {
            callbacks: {
              label: ctx => {
                // TODO - Calculamos el total sumando todos los valores del dataset
                // total: se calculará cogiendo los datos de ctx.dataset.data y podemos hacer uso de reduce para el resultado acumulado
                const total = 0;
                // porcentaje: Si total es mayor que 0, habrá que calcular el porcentaje del trozo de donuts que hemos seleccionado (ctx.parsed)
                const porcentaje = 0;
                //Devolver el texto a mostrar
                return ` restaurantes `;
              }
            }
          }
        }
        // Los gráficos doughnut/pie no usan la propiedad 'scales'
      }
    });
  }

  // *************************************************************************
  // ngOnDestroy — imprescindible destruir la instancia de Chart para liberar
  // el canvas, eliminar los event listeners internos y evitar memory leaks.
  // *************************************************************************
  ngOnDestroy() {
    this.chart?.destroy();
  }
}
