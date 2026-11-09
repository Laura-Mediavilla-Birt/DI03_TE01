// *****************************************************************************
// IMPORTS
// *****************************************************************************
import { Component, input, effect, viewChild, ElementRef, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Chart } from 'chart.js';
import { Restaurante } from '../../../interface/restaurante';
import '../utils/chart-setup';

@Component({
  selector: 'app-grafico-linea',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './grafico-linea.component.html',
  styleUrls: ['./grafico-linea.component.scss']
})
export class GraficoLineaComponent implements OnDestroy {

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
  // GRÁFICO — Línea: distinciones gastronómicas por territorio
  //
  // TIPO: 'line' (líneas que unen los puntos de datos de cada serie)
  //
  // PREPARACIÓN DE DATOS:
  //   Recorremos el array y acumulamos en un Map<territorio, {michelin, repsol}>
  //   el total de estrellas Michelin y soles Repsol de cada territorio.
  //   Después filtramos los territorios sin ninguna distinción para no
  //   mostrar entradas vacías, y ordenamos alfabéticamente para que las
  //   etiquetas del eje X sean consistentes entre filtrados.
  //
  // DOS DATASETS (dos líneas):
  //   · dataset[0] → estrellas Michelin  (rojo #eb445a)
  //   · dataset[1] → soles Repsol        (amarillo #ffc409)
  //
  // fill: true → rellena el área bajo la línea con el mismo color al 13%
  //   de opacidad (sufijo '22' en hex), dando profundidad visual sin tapar
  //   la segunda línea.
  //
  // tension: 0.4 → suaviza la línea con curvas Bézier cúbicas.
  //   0 = línea recta entre puntos; 1 = curva muy pronunciada.
  //
  // pointRadius / pointHoverRadius: tamaño del círculo en cada punto de dato.
  //   Al pasar el ratón el radio aumenta para mejorar la interactividad.
  //
  // LEYENDA (display: true):
  //   Con dos series es imprescindible mostrar la leyenda para distinguirlas.
  //   usePointStyle: true dibuja el marcador con la misma forma que los puntos
  //   de la línea en lugar de un rectángulo.
  // *************************************************************************
  private render(data: Restaurante[], canvas: HTMLCanvasElement) {
    // TODO: limpia la instancia anterior porque este método puede volver
    // a ejecutarse al cambiar los filtros o los datos de entrada.
    this.chart?.destroy();

    // TODO: 'mapa' debe guardar una entrada por territorio y dos valores
    // acumulados. Una propiedad representa estrellas y la otra soles.
    // El tipo de la estructura sirve para recordar qué información conserva.
    // Tendremos un map de un string y un objeto que contenga los datos de michelin y repsol
    const mapa = new Map<string, { michelin: number; repsol: number }>();

    data.forEach(r => {
      // TODO: extrae la categoría común de cada restaurante y obtén los
      // acumuladores existentes; si es la primera aparición, parte de cero.
      // territorio hace uso del campo territory
      const territorio = r.territory?.trim() || 'Desconocido';

      // estrellas coge el valor actual o las ponemos a 0
      const estrellas = mapa.get(territorio) ?? {
        michelin: 0,
        repsol: 0
      };

      // TODO: suma en cada acumulador la distinción correspondiente del
      // restaurante actual. Convierte los datos si el JSON no los entrega
      // directamente como números y evita que un valor vacío rompa la suma.
      estrellas.michelin += Number(r.michelinStar) || 0;
      estrellas.repsol += Number(r.repsolSun) || 0;

      // TODO: después de modificar el objeto acumulador, vuelve a dejarlo
      // asociado a su territorio para conservar el resultado del recorrido.
      // seteamos los valores nuevos de territorio y estrellas al mapa
      mapa.set(territorio, estrellas);
    });

    // TODO: descarta categorías sin datos útiles (filter) y elige un orden estable (sort).
    // El filtro debe conservar un territorio si tiene al menos una de las
    // dos distinciones; el orden elegido mantiene las etiquetas predecibles.
    // En resumen, convierte un Map en un array, filtra sus elementos y los ordena alfabéticamente.
    // habrá que hacer uso de entries() de mapa, para convertir el map en array y obtener [clave, valor]
    // Para el filtro, ignoraremos la clave y guardaremos solo el valor si es mayor que 0 de michelin y repsol
    // Para ordenar podemos hacer uso de localeCompare para comparar mejor tildes, ñ,...; a[0].localeCompare(b[0])
    const entries = Array.from(mapa.entries())
      .filter(([, valores]) => valores.michelin > 0 || valores.repsol > 0)
      .sort((a, b) => a[0].localeCompare(b[0]));

    // TODO: prepara una lista de etiquetas y una lista de valores para
    // cada serie. Todas deben conservar exactamente el mismo orden para que
    // las dos líneas comparen los mismos territorios.
    const labels: string[] = entries.map(([territorio]) => territorio);
    const michelin: number[] = entries.map(([, valores]) => valores.michelin);
    const repsol: number[] = entries.map(([, valores]) => valores.repsol);

    // TODO: configura una gráfica con dos series, una por cada magnitud.
    // Cada serie necesita una etiqueta identificativa y sus valores asociados.
    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        //TODO: configurar los puntos, color,...
        datasets: [
          {
            label: '⭐ Estrellas Michelin',
            data: michelin,
            borderColor: '#eb445a',
            backgroundColor: '#eb445a22',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: '#eb445a',
            borderWidth: 2
          },
          {
            label: '☀️ Soles Repsol',
            data: repsol,
            borderColor: '#ffc409',
            backgroundColor: '#ffc40922',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: '#ffc409',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#333',
              usePointStyle: true
            }
          },
          title: {
            display: true,
            text: 'Distinciones gastronómicas por territorio',
            font: { size: 15, weight: 'bold' },
            color: '#333',
            padding: { bottom: 14 }
          },
          tooltip: {
            callbacks: {
              //TODO: mostrar el texto
              label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}`
            }
          }
        },
        scales: {
          //TODO: Configurar los ticks, beginAtZero,grid...
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              stepSize: 1,
              color: '#555'
            },
            grid: {
              color: 'rgba(0,0,0,0.06)'
            }
          },
          x: {
            ticks: {
              color: '#555'
            },
            grid: {
              display: false
            }
          }
        }
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