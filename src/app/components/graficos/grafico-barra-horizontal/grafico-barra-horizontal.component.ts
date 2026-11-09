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
  selector: 'app-grafico-barra-horizontal',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './grafico-barra-horizontal.component.html',
  styleUrls: ['./grafico-barra-horizontal.component.scss']
})
export class GraficoBarraHorizontalComponent implements OnDestroy {

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
  // GRÁFICO — Barras horizontales: restaurantes por tipo de establecimiento
  //
  // TIPO: 'bar' con indexAxis: 'y'
  //   Por defecto las barras son verticales (indexAxis: 'x').
  //   Cambiando a indexAxis: 'y' los ejes se intercambian:
  //     · Eje Y → categorías (tipos de establecimiento), sin escala numérica.
  //     · Eje X → valores numéricos (cantidad de restaurantes).
  //
  // PREPARACIÓN DE DATOS:
  //   Un Map<tipo, conteo> agrupa los restaurantes por tipo y el resultado
  //   se ordena de mayor a menor para que la barra más larga quede arriba.
  // *************************************************************************
  private render(data: Restaurante[], canvas: HTMLCanvasElement) {
    // TODO - antes de crear una nueva gráfica, libera la instancia anterior.
    // El efecto puede ejecutarse de nuevo cuando cambien los datos.
    this.chart?.destroy();

    // TODO - decide qué propiedad de Restaurante representa cada categoría.
    // 'counts' debe ser una estructura de pares clave-valor.
    const counts = new Map<string, number>();

    data.forEach(r => {
      // TODO - usa en cada restaurante el campo relacionado con el tipo de establecimiento (restorationType).
      // Si el campo no tiene contenido, lo llamaremos 'Desconocido'.
      const tipo = r.restorationType?.trim() || 'Desconocido';

      // TODO - busca la cantidad acumulada para esta categoría y actualiza
      // ese valor. Si aparece por primera vez, debe comenzar desde cero.
      const cantidadActual = counts.get(tipo) ?? 0;
      counts.set(tipo, cantidadActual + 1);
    });

    // TODO - transforma la estructura anterior en una lista de entradas,
    // donde cada entrada mantiene juntas la categoría y su cantidad.
    const sorted = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1]);

    // TOOD - crea la instancia de Chart.js sobre el canvas recibido y
    // completa sus dos partes principales: los datos y las opciones visuales.
    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        // TODO - Chart.js necesita una lista de etiquetas y otra de valores.
        labels: sorted.map(([tipo]) => tipo),
        datasets: [{
          label: 'Restaurantes',
          // TODO - sustituye este array por los valores numéricos calculados.
          data: sorted.map(([, cantidad]) => cantidad),
          backgroundColor: sorted.map((_, i) => CHART_PALETTE[i % CHART_PALETTE.length] + 'bb'),
          borderColor: sorted.map((_, i) => CHART_PALETTE[i % CHART_PALETTE.length]),
          borderWidth: 2,
          borderRadius: 6,
        }]
      },
      options: {
        // TODO: consulta qué opción cambia la orientación predeterminada
        // de las barras y comprueba qué valor debe recibir para ponerlas en horizontal.
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Restaurantes por tipo de establecimiento',
            font: { size: 15, weight: 'bold' },
            color: '#333',
            padding: { bottom: 14 }
          },
          tooltip: {
            callbacks: {
              // TODO: el tooltip recibe información del elemento señalado.
              // Identifica en 'ctx' el valor numérico del eje horizontal.
              label: ctx => ` ${ctx.parsed.x} restaurantes`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0,
              color: '#555'
            },
            grid: {
              color: 'rgba(0,0,0,0.06)'
            }
          },
          y: {
            ticks: { color: '#555' },
            grid: { display: false }
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