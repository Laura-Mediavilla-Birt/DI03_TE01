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

    // TODO: 'mapa' debe guardar una entrada por territorio y dos valores
    // acumulados. Una propiedad representa estrellas y la otra soles.
    // El tipo de la estructura sirve para recordar qué información conserva.
    // Tendremos un map de un string y un objeto que contenga los datos de michelin y repsol
    const mapa = [];
    data.forEach(r => {
      // TODO: extrae la categoría común de cada restaurante y obtén los
      // acumuladores existentes; si es la primera aparición, parte de cero.
      // territorio hace uso del campo territory
      const territorio = null;
      // estrellas coge el valor actual o las ponemos a 0
      const estrellas = null;
      // TODO: suma en cada acumulador la distinción correspondiente del
      // restaurante actual. Convierte los datos si el JSON no los entrega
      // directamente como números y evita que un valor vacío rompa la suma.
      
      // TODO: después de modificar el objeto acumulador, vuelve a dejarlo
      // asociado a su territorio para conservar el resultado del recorrido.
      // seteamos los valores nuevos de territorio y estrellas al mapa

    });

    // TODO: descarta categorías sin datos útiles (filter) y elige un orden estable (sort).
    // El filtro debe conservar un territorio si tiene al menos una de las
    // dos distinciones; el orden elegido mantiene las etiquetas predecibles.
    // En resumen, convierte un Map en un array, filtra sus elementos y los ordena alfabéticamente.
    // habrá que hacer uso de entries() de mapa, para convertir el map en array y obtener [clave, valor]
    // Para el filtro, ignoraremos la clave y guardaremos solo el valor si es mayor que 0 de michelin y repsol
    // Para ordenar podemos hacer uso de localeCompare para comparar mejor tildes, ñ,...; a[0].localeCompare(b[0]) 
    const entries = [];

    // TODO: prepara una lista de etiquetas y una lista de valores para
    // cada serie. Todas deben conservar exactamente el mismo orden para que
    // las dos líneas comparen los mismos territorios.
    const labels: string[] = []; //cogeremos la clave del array
    const michelin: number[] = []; //cogeremos el valor del array, pero que sea michelin
    const repsol: number[] = []; //cogeremos el valor del array, pero que sea repsol

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
          },
          {
            label: '☀️ Soles Repsol',
            data: repsol,
            borderColor: '#ffc409',
            backgroundColor: '#ffc40922',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top', labels: { color: '#333', usePointStyle: true } },
          title: {
            display: true,
            text: '',
            font: { size: 15, weight: 'bold' },
            color: '#333',
            padding: { bottom: 14 }
          },
          tooltip: {
            callbacks: {
              //TODO: mostrar el texto
              label: ctx => ` `
            }
          }
        },
        scales: {
          //TODO: Configurar los ticks, beginAtZero,grid...
          y: {

          },
          x: {

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
