// Horario real fotografiado en la pizarra de la entrada del local
// ("HORARIO DE VERANO"). Fiable pero con un punto a confirmar con el
// cliente — ver `pendienteConfirmar` y PLACEHOLDERS.md.
export const horarios = {
  temporada: 'Horario de verano',
  dias: [
    { dia: 'Lunes', tramos: [], nota: 'Cerrado' },
    { dia: 'Martes a viernes', tramos: ['09:00–17:00', '20:00–00:00'] },
    { dia: 'Sábado', tramos: ['12:00–17:00', '20:00–00:00'] },
    { dia: 'Domingo', tramos: ['12:00–17:00'] },
  ],
  fuente: 'Fotografiado en la pizarra "Horario de verano" de la entrada del local',
  isPlaceholder: false,
  pendienteConfirmar: [
    'Este es el horario de VERANO — confirmar si existe un horario de invierno distinto.',
  ],
};
