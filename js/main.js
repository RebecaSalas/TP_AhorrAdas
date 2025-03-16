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









