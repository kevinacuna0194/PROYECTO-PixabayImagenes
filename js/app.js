const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const registrosPorPagina = 40;
let totalPaginas;
let iterador;

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
    buscarImagenes(terminoBusqueda);
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

function buscarImagenes(termino) {
    /** Puedes ver que tenemos este aquí está a pie en específico. Requiere que le pasemos una piqui. De esa forma identifican cuántas consultas estás haciendo  */
    const key = '24423264-389224fa4f79c639625c30ad4';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=100`;

    // console.log(url);

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            /** console.log(resultado);  {total: 3808, totalHits: 500, hits: Array(100)} */
            totalPaginas = calcularPaginas(resultado.totalHits);
            mostrarImagenes(resultado.hits);
        })
}

/** Generador que va a registrar la cantidad de elementos de acuerod a las páginas */
function* crearPaginador(total) {
    console.log(total);
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

    imprimirPaginador()
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);
    console.log(iterador.next());
}