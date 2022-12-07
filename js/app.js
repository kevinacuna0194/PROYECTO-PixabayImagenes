const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const paginacionDiv = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario)
}

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if (terminoBusqueda === '') {
        mostrarAlerta('Agrega un término de búsqueda');

        return;
    }

    /** Cuando pasemos la validación Buscaremos la imágenes en Pixabay */
    buscarImagenes();
}

function mostrarAlerta(mensaje) {

    const existeAlerta = document.querySelector('.bg-red-100')

    if (!existeAlerta) {
        const alerta = document.createElement('P');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'uppercase');

        alerta.innerHTML = `
            <strong class="font-bold block">¡Error!</strong>
            
            <span class="block sm:inline">${mensaje}</span>
        `;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function buscarImagenes() {

    const termino = document.querySelector('#termino').value;
    
    /** Requiere que le pasemos una API Key */
    const key = '24423264-389224fa4f79c639625c30ad4';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    // console.log(url);

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            /** console.log(resultado);  {total: 3808, totalHits: 500, hits: Array(100)} */
            totalPaginas = calcularPaginas(resultado.totalHits);
            mostrarImagenes(resultado.hits);
        })
}

/** Recuerda el generador, va a permitirte iterar sobre todos los registros y te va a decir cuando ha llegado al final. Por eso estamos utilizando un generador. */
function* crearPaginador(total) {

    // console.log(`Páginas: ${total}`);

    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

function calcularPaginas(total) {
    return parseInt(Math.ceil(total / registrosPorPagina));
}

function mostrarImagenes(imagenes) {
    /** console.log(imagenes);  (20) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}] */

    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    /** Iterar sobre el arreglo de imagenes y construir el HTML */

    imagenes.forEach(imagen => {

        const { previewURL, likes, views, largeImageURL } = imagen;

        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 mb-4 p-3">
                <div class="bg-white ">
                    <img class="w-full" src=${previewURL} alt={tags} />
                    <div class="p-4">
                        <p class="card-text">${likes} Me Gusta</p>
                        <p class="card-text">${views} Vistas </p>
        
                        <a href=${largeImageURL} 
                        rel="noopener noreferrer" 
                        target="_blank" class="bg-blue-800 w-full p-1 block mt-5 rounded text-center font-bold uppercase hover:bg-blue-500 text-white">Ver Imagen</a>
                    </div>
                </div>
            </div>
            `;
    });

    /** Limpiar Paginador previo */
    while (paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }

    /** Generamos nuevo HTML */
    imprimirPaginador()
}

/** imprimirPaginador() va a ir generando el HTML mientras no hayamos llegado al final del generador. */
function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);
    // console.log(iterador.next());

    while (true) {
        const { value, done } = iterador.next();

        if (done) return;

        /** Caso contrario, genera un botón por cada elemento en el paginador */
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded');

        boton.onclick = () => {

            paginaActual = value;

            // console.log(paginaActual)

            /** Consultar nuevamnete la API con un número de página diferente */
            buscarImagenes();
        }

        paginacionDiv.appendChild(boton);
    }
}