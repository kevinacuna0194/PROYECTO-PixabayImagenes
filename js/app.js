const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario)
}

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if (terminoBusqueda === '') {
        impirmirAlerta('Agrega un término de búsqueda');

        return;
    }
}

function impirmirAlerta(mensaje) {

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