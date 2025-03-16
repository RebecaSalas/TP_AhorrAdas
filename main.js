// Selección de elementos del DOM
const elementos = {
  //// Sección de Categorías ////
  agregarCategoriaBtn: document.getElementById('agregar-categoria-btn'), // Botón para agregar categorías
  nombreCategoriaInput: document.getElementById('nombre-categoria'), // Campo para el nombre de la categoría
  listaCategorias: document.getElementById('lista-categorias'), // Contenedor de la lista de categorías
  modalEditarCategoria: document.getElementById('modal-editar-categoria'), // Modal para editar categoría
  formularioEditarCategoria: document.getElementById('formulario-editar-categoria'), // Formulario del modal de edición
  cancelarEditarCategoria: document.getElementById('cancelar-editar-categoria'), // Botón para cancelar edición
  guardarEditarCategoria: document.getElementById('guardar-editar-categoria'), // Botón para guardar edición
  editarCategoriaId: document.getElementById('editar-categoria-id'), // Campo oculto para ID
  editarCategoriaNombre: document.getElementById('editar-categoria-nombre'), // Campo para el nuevo nombre
  filtroCategoria: document.querySelector('#filter-categoria') // Filtro de categorías
};

//// Sección de Categorías ////


// Constantes para claves
const LOCALSTORAGE_CATEGORIAS_KEY = 'categorias'; // Clave de almacenamiento
let categorias = []; // Array para las categorías

// Función para guardar categorías en localStorage
const guardarCategorias = () => {
  localStorage.setItem(LOCALSTORAGE_CATEGORIAS_KEY, JSON.stringify(categorias)); // Guardar las categorías
};

// Función para cargar categorías desde localStorage
const cargarCategorias = () => {
  const categoriasGuardadas = localStorage.getItem(LOCALSTORAGE_CATEGORIAS_KEY);
  if (categoriasGuardadas) {
      categorias = JSON.parse(categoriasGuardadas);
  }
};

// Función para renderizar una categoría en la lista
const renderizarCategoria = (categoria) => {
  const nuevaCategoriaDiv = document.createElement('div');
  nuevaCategoriaDiv.classList.add('flex', 'justify-between', 'items-center', 'py-2', 'border-b', 'border-gray-200');
  nuevaCategoriaDiv.innerHTML = `
      <span>${categoria.nombre}</span>
      <div class="flex space-x-2">
          <button class="editar-categoria-btn text-red-500 hover:text-black font-bold py-1 px-2 rounded bg-white cursor-pointer" data-id="${categoria.id}">Editar</button>
          <button class="eliminar-categoria-btn text-red-500 hover:text-black font-bold py-1 px-2 rounded bg-white cursor-pointer" data-id="${categoria.id}">Eliminar</button>
      </div>
  `;
  elementos.listaCategorias.appendChild(nuevaCategoriaDiv);

  // Asignar eventos a los botones de la categoría creada
  nuevaCategoriaDiv.querySelector('.editar-categoria-btn').addEventListener('click', () => editarCategoria(categoria.id));
  nuevaCategoriaDiv.querySelector('.eliminar-categoria-btn').addEventListener('click', () => eliminarCategoria(categoria.id));
};

// Función para actualizar el filtro de categorías y el modal
const actualizarFiltroCategorias = () => {
  if (elementos.filtroCategoria) {
      elementos.filtroCategoria.innerHTML = '<option value="todas">Todas</option>';
      categorias.forEach(categoria => {
          const opcion = document.createElement('option');
          opcion.value = categoria.nombre;
          opcion.textContent = categoria.nombre;
          elementos.filtroCategoria.appendChild(opcion);
      });
  }

  const selectCategoriaModal = document.querySelector('#categoria');
  if (selectCategoriaModal) {
      selectCategoriaModal.innerHTML = '';
      categorias.forEach(categoria => {
          const opcion = document.createElement('option');
          opcion.value = categoria.nombre;
          opcion.textContent = categoria.nombre;
          selectCategoriaModal.appendChild(opcion);
      });
  }
};

// Función para agregar una nueva categoría
const agregarCategoria = (evento) => {
  evento.preventDefault();
  const nombreCategoria = elementos.nombreCategoriaInput.value.trim();

  if (nombreCategoria === '') {
      alert('El nombre de la categoría no puede estar vacío.');
      return;
  }

  const nuevaCategoria = { id: Date.now(), nombre: nombreCategoria };
  categorias.push(nuevaCategoria);
  guardarCategorias();
  renderizarCategoria(nuevaCategoria);
  actualizarFiltroCategorias();
  elementos.nombreCategoriaInput.value = ''; // Limpia el input
};

// Función para editar una categoría
const editarCategoria = (id) => {
  const categoria = categorias.find(cat => cat.id == id);
  if (!categoria) return;

  elementos.editarCategoriaId.value = categoria.id;
  elementos.editarCategoriaNombre.value = categoria.nombre;
  elementos.modalEditarCategoria.classList.remove('hidden');
};

// Función para guardar cambios al editar una categoría
const guardarEditarCategoria = (evento) => {
  evento.preventDefault();
  const id = parseInt(elementos.editarCategoriaId.value, 10);
  const categoria = categorias.find(cat => cat.id === id);

  if (!categoria) return;

  const nuevoNombre = elementos.editarCategoriaNombre.value.trim();
  if (nuevoNombre === '') {
      alert('El nombre de la categoría no puede estar vacío.');
      return;
  }

  categoria.nombre = nuevoNombre;
  guardarCategorias();

  elementos.listaCategorias.innerHTML = ''; // Vaciar lista
  categorias.forEach(renderizarCategoria); // Renderizar todas las categorías
  actualizarFiltroCategorias(); // Actualizar filtros
  elementos.modalEditarCategoria.classList.add('hidden'); // Ocultar modal
};

// Función para eliminar una categoría
const eliminarCategoria = (id) => {
  categorias = categorias.filter(cat => cat.id != id);
  guardarCategorias();

  elementos.listaCategorias.innerHTML = ''; // Vaciar lista
  categorias.forEach(renderizarCategoria); // Renderizar categorías restantes
  actualizarFiltroCategorias(); // Actualizar filtros
};

// Hacer que el botón agregar funcione con "Enter"
elementos.nombreCategoriaInput.addEventListener('keydown', (evento) => {
  if (evento.key === 'Enter') {
      agregarCategoria(evento);
  }
});

// Asignar eventos principales
elementos.agregarCategoriaBtn.addEventListener('click', agregarCategoria);
elementos.cancelarEditarCategoria.addEventListener('click', () => {
  elementos.modalEditarCategoria.classList.add('hidden'); // Ocultar modal
});
elementos.formularioEditarCategoria.addEventListener('submit', guardarEditarCategoria);

// Inicializar categorías al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  cargarCategorias(); // Cargar categorías desde localStorage
  categorias.forEach(renderizarCategoria); // Renderizar categorías almacenadas
  actualizarFiltroCategorias(); // Actualizar filtros
});


//// Sección de Reportes //// 

// Función para calcular el resumen
const generarResumen = () => {
  if (!operaciones || operaciones.length === 0) return; // Evitar cálculos si no hay datos

  const categorias = [...new Set(operaciones.map(op => op.categoria))];
  const resumen = {
      mayorGanancia: { categoria: 'Sin datos', monto: 0 },
      mayorGasto: { categoria: 'Sin datos', monto: 0 },
      mayorBalance: { categoria: 'Sin datos', monto: 0 },
      mesMayorGanancia: { mes: 'Sin datos', monto: 0 },
      mesMayorGasto: { mes: 'Sin datos', monto: 0 }
  };

  // Calcular por categoría
  categorias.forEach(categoria => {
      const ganancias = operaciones
          .filter(op => op.categoria === categoria && op.tipo === 'ganancia')
          .reduce((total, op) => total + parseFloat(op.monto || 0), 0); // Asegurar que monto es numérico
      const gastos = operaciones
          .filter(op => op.categoria === categoria && op.tipo === 'gasto')
          .reduce((total, op) => total + parseFloat(op.monto || 0), 0);
      const balance = ganancias - gastos;

      if (ganancias > resumen.mayorGanancia.monto) {
          resumen.mayorGanancia = { categoria, monto: ganancias };
      }
      if (gastos > resumen.mayorGasto.monto) {
          resumen.mayorGasto = { categoria, monto: gastos };
      }
      if (balance > resumen.mayorBalance.monto) {
          resumen.mayorBalance = { categoria, monto: balance };
      }
  });

  // Calcular por mes
  const operacionesPorMes = operaciones.reduce((acum, op) => {
      if (!op.fecha) return acum; // Ignorar operaciones sin fecha
      const mes = new Date(op.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit' });
      if (!acum[mes]) acum[mes] = [];
      acum[mes].push(op);
      return acum;
  }, {});

  Object.entries(operacionesPorMes).forEach(([mes, ops]) => {
      const ganancias = ops
          .filter(op => op.tipo === 'ganancia')
          .reduce((total, op) => total + parseFloat(op.monto || 0), 0);
      const gastos = ops
          .filter(op => op.tipo === 'gasto')
          .reduce((total, op) => total + parseFloat(op.monto || 0), 0);

      if (ganancias > resumen.mesMayorGanancia.monto) {
          resumen.mesMayorGanancia = { mes, monto: ganancias };
      }
      if (gastos > resumen.mesMayorGasto.monto) {
          resumen.mesMayorGasto = { mes, monto: gastos };
      }
  });

  // Renderizar resumen en el DOM
  document.getElementById('categoria-mayor-ganancia').textContent =
      `${resumen.mayorGanancia.categoria}: +$${resumen.mayorGanancia.monto.toFixed(2)}`;
  document.getElementById('categoria-mayor-gasto').textContent =
      `${resumen.mayorGasto.categoria}: -$${resumen.mayorGasto.monto.toFixed(2)}`;
  document.getElementById('categoria-mayor-balance').textContent =
      `${resumen.mayorBalance.categoria}: $${resumen.mayorBalance.monto.toFixed(2)}`;
  document.getElementById('mes-mayor-ganancia').textContent =
      `${resumen.mesMayorGanancia.mes}: +$${resumen.mesMayorGanancia.monto.toFixed(2)}`;
  document.getElementById('mes-mayor-gasto').textContent =
      `${resumen.mesMayorGasto.mes}: -$${resumen.mesMayorGasto.monto.toFixed(2)}`;
};

// Función para calcular totales por categorías
const calcularTotalesPorCategorias = () => {
  const categoriasTotales = [...new Set(operaciones.map(op => op.categoria))].map(categoria => {
      const ganancias = operaciones
          .filter(op => op.categoria === categoria && op.tipo === 'ganancia')
          .reduce((total, op) => total + parseFloat(op.monto || 0), 0);
      const gastos = operaciones
          .filter(op => op.categoria === categoria && op.tipo === 'gasto')
          .reduce((total, op) => total + parseFloat(op.monto || 0), 0);
      const balance = ganancias - gastos;

      return { categoria, ganancias, gastos, balance };
  });

  const lista = document.getElementById('lista-categorias-totales');
  lista.innerHTML = ''; // Limpiar tabla antes de agregar datos

  categoriasTotales.forEach(cat => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td class="px-4 py-2 border border-gray-300">${cat.categoria}</td>
          <td class="px-4 py-2 border border-gray-300 text-green-500 font-bold">+$${cat.ganancias.toFixed(2)}</td>
          <td class="px-4 py-2 border border-gray-300 text-red-500 font-bold">-$${cat.gastos.toFixed(2)}</td>
          <td class="px-4 py-2 border border-gray-300 font-bold ${cat.balance >= 0 ? 'text-green-500' : 'text-red-500'}">$${cat.balance.toFixed(2)}</td>
      `;
      lista.appendChild(row);
  });
};

// Función para calcular totales por mes
const calcularTotalesPorMeses = () => {
  const operacionesPorMes = operaciones.reduce((acum, op) => {
      if (!op.fecha) return acum; // Ignorar operaciones sin fecha
      const mes = new Date(op.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit' });
      if (!acum[mes]) acum[mes] = [];
      acum[mes].push(op);
      return acum;
  }, {});

  const mesesTotales = Object.entries(operacionesPorMes).map(([mes, ops]) => {
      const ganancias = ops
          .filter(op => op.tipo === 'ganancia')
          .reduce((total, op) => total + parseFloat(op.monto || 0), 0);
      const gastos = ops
          .filter(op => op.tipo === 'gasto')
          .reduce((total, op) => total + parseFloat(op.monto || 0), 0);
      const balance = ganancias - gastos;

      return { mes, ganancias, gastos, balance };
  });

  const lista = document.getElementById('lista-meses-totales');
  lista.innerHTML = ''; // Limpiar tabla antes de agregar datos

  mesesTotales.forEach(mes => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td class="px-4 py-2 border border-gray-300">${mes.mes}</td>
          <td class="px-4 py-2 border border-gray-300 text-green-500 font-bold">+$${mes.ganancias.toFixed(2)}</td>
          <td class="px-4 py-2 border border-gray-300 text-red-500 font-bold">-$${mes.gastos.toFixed(2)}</td>
          <td class="px-4 py-2 border border-gray-300 font-bold ${mes.balance >= 0 ? 'text-green-500' : 'text-red-500'}">$${mes.balance.toFixed(2)}</td>
      `;
      lista.appendChild(row);
  });
};

// Función principal para generar los reportes
const generarReportes = () => {
  generarResumen(); // Generar y renderizar el resumen
  calcularTotalesPorCategorias(); // Calcular y renderizar totales por categorías
  calcularTotalesPorMeses(); // Calcular y renderizar totales por mes
};

// Inicializar reportes al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  cargarOperaciones(); // Carga las operaciones desde localStorage
  generarReportes(); // Generar reportes iniciales
});
