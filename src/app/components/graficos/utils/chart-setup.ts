// *****************************************************************************
// REGISTRO GLOBAL DE CHART.JS
//
// Chart.js usa un sistema de plugins modulares: si no registras un componente,
// no está disponible. Con ...registerables registramos de una vez todo lo que
// viene incluido en la librería (tipos bar, doughnut, line; escalas lineales,
// categóricas; plugin de tooltip, leyenda, título, etc.).
//
// Este módulo se importa (solo por su efecto secundario) desde cada componente
// de gráfico para garantizar que el registro se ejecuta una única vez, sin
// duplicar esta llamada en cada archivo.
// *****************************************************************************
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
