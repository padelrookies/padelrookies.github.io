// Carta — mezcla de datos REALES (leídos en los carteles fotografiados
// de la fachada) y placeholders explícitos donde aún falta información.
// Cada ítem lleva `isPlaceholder`. Ver PLACEHOLDERS.md antes de publicar.

export const menuDelDia = {
  nombre: 'Menú del día',
  precioLaborable: 15.0,
  precioFinDeSemana: 25.9,
  incluye: 'Pan, bebida, postre y café',
  horarioServicio: null, // parcialmente ilegible en la foto del cartel
  fuente: 'Cartel de precios de la fachada',
  isPlaceholder: false,
};

export const categorias = [
  {
    id: 'tapas',
    nombre: 'Tapas',
    fuente: "Cartel 'Nuestras tapas' de la fachada — nombres reales, precios pendientes",
    isPlaceholder: false,
    items: [
      { nombre: 'Patatas bravas', precio: null, destacado: true, isPlaceholder: true },
      { nombre: 'Boquerones a la andaluza', precio: null, destacado: true, isPlaceholder: true },
      { nombre: 'Calamares a la andaluza', precio: null, isPlaceholder: true },
      { nombre: 'Croquetas de la casa', precio: null, destacado: true, isPlaceholder: true },
      { nombre: 'Bomba brava', precio: null, isPlaceholder: true },
      { nombre: 'Jamón ibérico', precio: null, isPlaceholder: true },
      { nombre: 'Queso manchego', precio: null, isPlaceholder: true },
      { nombre: 'Morros fritos', precio: null, isPlaceholder: true },
      { nombre: 'Chipirones', precio: null, isPlaceholder: true },
      { nombre: 'Morcilla', precio: null, isPlaceholder: true },
      { nombre: 'Pinchos morunos', precio: null, isPlaceholder: true },
      { nombre: 'Chorizo a la sidra', precio: null, isPlaceholder: true },
      { nombre: 'Olivas', precio: null, isPlaceholder: true },
    ],
  },
  {
    id: 'desayunos',
    nombre: 'Desayunos y cafetería',
    fuente: "Categoría real ('Cafetería' en la fachada), ítems y precios placeholder",
    isPlaceholder: true,
    items: [
      { nombre: 'Café con tostada', precio: null, isPlaceholder: true },
      { nombre: 'Entrepà de pernil i formatge', precio: null, isPlaceholder: true },
      { nombre: 'Cafè amb llet', precio: null, isPlaceholder: true },
    ],
  },
  {
    id: 'bocadillos',
    nombre: 'Bocadillos',
    fuente: "Categoría real ('Entrepans' en la fachada), ítems y precios placeholder",
    isPlaceholder: true,
    items: [
      { nombre: 'Bikini', precio: null, isPlaceholder: true },
      { nombre: 'Bocadillo de calamares', precio: null, isPlaceholder: true },
    ],
  },
  {
    id: 'platos-combinados',
    nombre: 'Platos combinados',
    fuente: "Categoría real ('Plats combinats' en la fachada), ítems y precios placeholder",
    isPlaceholder: true,
    items: [{ nombre: 'Por confirmar con el cliente', precio: null, isPlaceholder: true }],
  },
  {
    id: 'torradas-hamburguesas-pizzas',
    nombre: 'Torradas, hamburguesas y pizzas',
    fuente: "Categorías reales del cartel ('Torrades · Frankfurts · Hamburgueses · Pizzes')",
    isPlaceholder: true,
    items: [{ nombre: 'Por confirmar con el cliente', precio: null, isPlaceholder: true }],
  },
];
