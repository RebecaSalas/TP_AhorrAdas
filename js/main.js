// Selección de elementos del DOM
const elementos = {
    // Elementos de navegación (Menú)
    enlacesMenu: document.querySelectorAll('header nav a'), // Todos los enlaces del menú
    secciones: document.querySelectorAll('main section'), // Todas las secciones de la página
    //// Sección de Balance ////
    iconoHamburguesa: document.getElementById('hamburger-icon'), // Ícono del menú hamburguesa
    iconoCerrar: document.getElementById('close-icon'), // Ícono para cerrar el menú
    menuModal: document.getElementById('menu-modal'), // Modal del menú en modo responsive
    abrirModalBtn: document.getElementById('abrir-modal-btn'), // Botón para abrir el modal de nueva operación
    modalNuevaOperacion: document.getElementById('modal-nueva-operacion'), // Modal de nueva operación
    cancelarBtn: document.getElementById('cancelar-btn'), // Botón de cancelar en el modal de nueva operación
    formularioNuevaOperacion: document.getElementById('formulario-nueva-operacion'), // Formulario para nueva operación
    listaOperaciones: document.getElementById('lista-operaciones'), // Contenedor de la lista de operaciones
    itemsOperaciones: document.getElementById('operaciones-lista'), // Elemento donde se muestran las operaciones
    mensajeSinResultados: document.getElementById('mensaje-sin-resultados'), // Mensaje de "Sin resultados"
    mensajeCambiarFiltros: document.getElementById('mensaje-cambiar-filtros'), // Mensaje de "Cambiar filtros"
    operationsPlaceholder: document.getElementById('operations-placeholder'), // Placeholder cuando no hay operaciones
    balanceGanancias: document.getElementById('balance-ganancias'), // Elemento que muestra las ganancias
    balanceGastos: document.getElementById('balance-gastos'), // Elemento que muestra los gastos
    balanceTotal: document.getElementById('balance-total'), // Elemento que muestra el balance total
    contenedorFiltros: document.querySelector('#contenedor-filtros'), // Contenedor de filtros
    mostrarOcultarFiltrosBtn: document.querySelector('#contenedor-filtros a'), // Botón para mostrar/ocultar filtros
    contenidoFiltros: document.querySelector('#contenido-filtros'), // Contenido de los filtros
    filtroTipo: document.querySelector('#filter-tipo'), // Filtro por tipo de operación
    filtroCategoria: document.querySelector('#filter-categoria'), // Filtro por categoría de operación
    filtroFecha: document.querySelector('#filter-fecha'), // Filtro por fecha de operación
    filtroOrden: document.querySelector('#filter-ordenar'), // Filtro para ordenar las operaciones
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

//// Sección de Balance ////
// Almacenar operaciones
let operaciones = []; // Array para almacenar las operaciones

// Función para guardar operaciones en localStorage
const guardarOperaciones = () => localStorage.setItem('operaciones', JSON.stringify(operaciones));

// Función para cargar operaciones desde localStorage
const cargarOperaciones = () => {
    const operacionesGuardadas = localStorage.getItem('operaciones');
    if (operacionesGuardadas) {
        operaciones = JSON.parse(operacionesGuardadas);
        aplicarFiltros(); // Aplica los filtros después de cargar las operaciones
        actualizarBalance(); // Actualiza el balance después de cargar las operaciones
    }
};

// Función para alternar el menú hamburguesa
const alternarMenu = () => {
    elementos.menuModal.classList.toggle('hidden');
    elementos.iconoHamburguesa.classList.toggle('hidden');
    elementos.iconoCerrar.classList.toggle('hidden');
};

elementos.iconoHamburguesa.addEventListener('click', alternarMenu);
elementos.iconoCerrar.addEventListener('click', alternarMenu);

// Funciones para abrir y cerrar el modal de nueva operación
const abrirModal = () => {
    elementos.modalNuevaOperacion.classList.remove('hidden');
    document.getElementById('contenido-principal').classList.add('hidden');
};

const cerrarModal = () => {
    elementos.modalNuevaOperacion.classList.add('hidden');
    document.getElementById('contenido-principal').classList.remove('hidden');
};

elementos.abrirModalBtn.addEventListener('click', abrirModal);
elementos.cancelarBtn.addEventListener('click', cerrarModal);

// Función para agregar una nueva operación
const agregarOperacion = (evento) => {
    evento.preventDefault();
    const nuevaOperacion = {
        id: Date.now(),
        descripcion: document.getElementById('descripcion').value,
        monto: parseFloat(document.getElementById('monto').value),
        tipo: document.getElementById('tipo').value,
        categoria: document.getElementById('categoria').value,
        fecha: document.getElementById('fecha').value,
    };

    operaciones.push(nuevaOperacion);
    guardarOperaciones();
    aplicarFiltros();
    cerrarModal();
    elementos.formularioNuevaOperacion.reset();
};

elementos.formularioNuevaOperacion.addEventListener('submit', agregarOperacion);

// Función para editar una operación
const editarOperacion = (id) => {
    const operacion = operaciones.find(op => op.id === id);
    document.getElementById('descripcion').value = operacion.descripcion;
    document.getElementById('monto').value = operacion.monto;
    document.getElementById('tipo').value = operacion.tipo;
    document.getElementById('categoria').value = operacion.categoria;
    document.getElementById('fecha').value = operacion.fecha;

    abrirModal();

    const guardarEdicion = (evento) => {
        evento.preventDefault();
        operacion.descripcion = document.getElementById('descripcion').value;
        operacion.monto = parseFloat(document.getElementById('monto').value);
        operacion.tipo = document.getElementById('tipo').value;
        operacion.categoria = document.getElementById('categoria').value;
        operacion.fecha = document.getElementById('fecha').value;

        guardarOperaciones();
        aplicarFiltros();
        cerrarModal();
        elementos.formularioNuevaOperacion.removeEventListener('submit', guardarEdicion);
        elementos.formularioNuevaOperacion.addEventListener('submit', agregarOperacion);
    };

    elementos.formularioNuevaOperacion.removeEventListener('submit', agregarOperacion);
    elementos.formularioNuevaOperacion.addEventListener('submit', guardarEdicion);
};

// Función para eliminar una operación
const eliminarOperacion = (id) => {
    operaciones = operaciones.filter(op => op.id !== id);
    guardarOperaciones();
    aplicarFiltros();
};

// Función para renderizar operaciones en la interfaz
const renderizarOperaciones = (ops) => {
    elementos.itemsOperaciones.innerHTML = ''; // Limpia la lista de operaciones
    ops.forEach(operacion => {
        const nuevaOperacionDiv = document.createElement('div');
        nuevaOperacionDiv.classList.add('operacion', 'grid', 'grid-cols-5', 'gap-4', 'py-2', 'border-b', 'border-gray-200');
        nuevaOperacionDiv.innerHTML = `
            <div>${operacion.descripcion}</div>
            <div>${operacion.categoria}</div>
            <div>${operacion.fecha}</div>
            <div class="${operacion.tipo === 'gasto' ? 'text-red-500' : 'text-green-500'}">
                ${operacion.tipo === 'gasto' ? '-' : '+'}$${operacion.monto.toFixed(2)}
            </div>
            <div class="flex space-x-2">
                <button class="editar-btn text-red-500 hover:text-black font-bold py-1 px-2 rounded bg-white cursor-pointer">Editar</button>
                <button class="eliminar-btn text-red-500 hover:text-black font-bold py-1 px-2 rounded bg-white cursor-pointer">Eliminar</button>
            </div>
        `;

        // Asignar eventos a los botones de edición y eliminación
        nuevaOperacionDiv.querySelector('.editar-btn').addEventListener('click', () => editarOperacion(operacion.id));
        nuevaOperacionDiv.querySelector('.eliminar-btn').addEventListener('click', () => eliminarOperacion(operacion.id));
        elementos.itemsOperaciones.appendChild(nuevaOperacionDiv);
    });

    const noOperaciones = ops.length === 0;
    elementos.mensajeSinResultados.classList.toggle('hidden', !noOperaciones);
    elementos.mensajeCambiarFiltros.classList.toggle('hidden', !noOperaciones);
    elementos.operationsPlaceholder.classList.toggle('hidden', !noOperaciones);
    elementos.listaOperaciones.classList.toggle('hidden', noOperaciones);
};

// Función para aplicar filtros y actualizar balance
const aplicarFiltros = () => {
    let operacionesFiltradas = operaciones;

    // Filtrar por tipo
    const tipo = elementos.filtroTipo.value;
    if (tipo !== 'todos') {
        operacionesFiltradas = operacionesFiltradas.filter(op => op.tipo === tipo);
    }

    // Filtrar por categoría
    const categoria = elementos.filtroCategoria.value;
    if (categoria !== 'todas') {
        operacionesFiltradas = operacionesFiltradas.filter(op => op.categoria === categoria);
    }

    // Filtrar por fecha
    const fecha = elementos.filtroFecha.value;
    if (fecha) {
        operacionesFiltradas = operacionesFiltradas.filter(op => new Date(op.fecha) >= new Date(fecha));
    }

    // Ordenar operaciones
    const ordenar = elementos.filtroOrden.value;
    operacionesFiltradas.sort((a, b) => {
        if (ordenar === 'fecha-reciente') return new Date(b.fecha) - new Date(a.fecha);
        if (ordenar === 'fecha-antigua') return new Date(a.fecha) - new Date(b.fecha);
        if (ordenar === 'monto-mayor') return b.monto - a.monto;
        if (ordenar === 'monto-menor') return a.monto - b.monto;
        if (ordenar === 'descripcion-asc') return a.descripcion.localeCompare(b.descripcion);
        if (ordenar === 'descripcion-desc') return b.descripcion.localeCompare(a.descripcion);
        return 0;
    });

    // Renderizar las operaciones filtradas
    renderizarOperaciones(operacionesFiltradas);

    // Actualizar el balance según las operaciones filtradas
    actualizarBalanceFiltrado(operacionesFiltradas);
};

// Función para actualizar el balance basado en las operaciones filtradas
const actualizarBalanceFiltrado = (operacionesFiltradas) => {
    const ganancias = operacionesFiltradas
        .filter(op => op.tipo === 'ganancia')
        .reduce((total, op) => total + op.monto, 0);

    const gastos = operacionesFiltradas
        .filter(op => op.tipo === 'gasto')
        .reduce((total, op) => total + op.monto, 0);

    const total = ganancias - gastos;

    // Actualizar visualmente los elementos de balance
    elementos.balanceGanancias.textContent = `+$${ganancias.toFixed(2)}`;
    elementos.balanceGastos.textContent = `-$${gastos.toFixed(2)}`;
    elementos.balanceTotal.textContent = total >= 0 
        ? `+$${total.toFixed(2)}` 
        : `-$${Math.abs(total).toFixed(2)}`;

    // Actualizar los colores del balance total
    if (total >= 0) {
        elementos.balanceTotal.classList.remove('text-red-500');
        elementos.balanceTotal.classList.add('text-green-500');
    } else {
        elementos.balanceTotal.classList.remove('text-green-500');
        elementos.balanceTotal.classList.add('text-red-500');
    }
};

// Eventos para actualizar el balance y operaciones al cambiar los filtros
elementos.filtroTipo.addEventListener('change', aplicarFiltros);
elementos.filtroCategoria.addEventListener('change', aplicarFiltros);
elementos.filtroFecha.addEventListener('change', aplicarFiltros);
elementos.filtroOrden.addEventListener('change', aplicarFiltros);

// Función para alternar la visibilidad de los filtros
const alternarFiltros = () => {
    const isHidden = elementos.contenidoFiltros.classList.contains('hidden');
    elementos.contenidoFiltros.classList.toggle('hidden');
    elementos.mostrarOcultarFiltrosBtn.textContent = isHidden ? 'Ocultar filtros' : 'Mostrar filtros';
};

elementos.mostrarOcultarFiltrosBtn.addEventListener('click', alternarFiltros);

// Función para actualizar el balance total (inicial o sin filtros)
const actualizarBalance = () => {
    const ingresos = operaciones
        .filter(op => op.tipo === 'ganancia')
        .reduce((total, op) => total + op.monto, 0);

    const gastos = operaciones
        .filter(op => op.tipo === 'gasto')
        .reduce((total, op) => total + op.monto, 0);

    const total = ingresos - gastos;

    // Actualizar visualmente los elementos de balance
    elementos.balanceGanancias.textContent = `+$${ingresos.toFixed(2)}`;
    elementos.balanceGastos.textContent = `-$${gastos.toFixed(2)}`;
    elementos.balanceTotal.textContent = total >= 0 
        ? `+$${total.toFixed(2)}` 
        : `-$${Math.abs(total).toFixed(2)}`;

    // Cambiar colores del balance total
    if (total >= 0) {
        elementos.balanceTotal.classList.remove('text-red-500');
        elementos.balanceTotal.classList.add('text-green-500');
    } else {
        elementos.balanceTotal.classList.remove('text-green-500');
        elementos.balanceTotal.classList.add('text-red-500');
    }
};

// Inicializar aplicación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarOperaciones();
    aplicarFiltros(); // Aplicar filtros al cargar
    actualizarBalance(); // Actualizar balance inicial
});

// Navegación del menú 
// Mostrar la sección seleccionada
const mostrarSeccion = (evento) => {
    evento.preventDefault(); // Evitar el comportamiento por defecto del enlace

    const idSeccion = evento.target.getAttribute('href').replace('#', ''); // Obtener el ID sin el símbolo #
    const seccionSeleccionada = document.getElementById(idSeccion); // Seleccionar la sección correspondiente

    // Ocultar todas las secciones
    elementos.secciones.forEach(seccion => seccion.classList.add('hidden'));

    // Mostrar solo la sección seleccionada
    if (seccionSeleccionada) {
        seccionSeleccionada.classList.remove('hidden');
    }
};

// Asignar el evento de clic a cada enlace del menú
elementos.enlacesMenu.forEach(enlace => enlace.addEventListener('click', mostrarSeccion));


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
