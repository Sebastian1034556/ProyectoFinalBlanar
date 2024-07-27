// #region ELEMENTOS DEL DOM
// CONTENEDORES PARA LAS PRODUCT CARDS
const divContenedorNike = document.getElementById("productCardContainerNike");
const divContenedorAdidas = document.getElementById("productCardContainerAdidas");
const divContenedorPuma = document.getElementById("productCardContainerPuma");
const contenedores = [divContenedorNike, divContenedorAdidas, divContenedorPuma];

// Elementos para interactuar
const btnCarrito = document.getElementById("cart-button");
const contadorCarrito = document.getElementById("cart-counter");
const inputSearch = document.getElementById("input-search");
const botonBuscar = document.getElementById("searchButton");
const botonFiltrar = document.getElementById("filterButton");
const dropdown = document.querySelector(".dropdown-menu");
const selectElement = document.getElementById("select");
// #endregion

// Productos
const productos = [];
const URLproductos = "https://668c30b80b61b8d23b0cb6d3.mockapi.io/products";

const carrito = JSON.parse(localStorage.getItem("carrito")) || []

const manejarContador = (carrito,contadorCarrito) => {
    if (carrito.length > 0){
        contadorCarrito.classList.add("d-flex")
    }  else {
        contadorCarrito.classList.remove("d-flex")
        contadorCarrito.classList.add("d-none")
    }  
    contadorCarrito.textContent = carrito.length;
}

function eliminarElemento(array, id) {
    const index = array.findIndex((elemento) => elemento.id === id);
    if (index > -1) {
        array.splice(index, 1);
    }
}

function obtener_productos(URLproductos, productos) {
    fetch(URLproductos)
        .then(res => res.json())
        .then(data => {
            productos.push(...data);
        })
        .then(() => cargarProductos(productos, ...contenedores))
        .catch((error) => {
            console.error(error);
        });
}

obtener_productos(URLproductos, productos);

// #region PRODUCT CARDS
function retornarProductCard({ imagen, nombre, precio, id }) {
    return `
            <div class="product-card">
                <img src="${imagen}" alt="Nike Dunk Low">
                <div class="product-info">
                    <h3>${nombre}</h3>
                    <p class="price">$${precio}</p>
                    <button class="add-to-cart" id="${id}">Agregar al Carrito</button>
                </div>
            </div>
            `;
}

function modificarCardEnCarrito(producto) {
    let productoDuplicado = producto.id;
    const elementoHTMLDuplicado = document.getElementById(productoDuplicado);
    elementoHTMLDuplicado.textContent = "Quitar del Carrito";
}

const productoEnCarrito = (carrito,productoFiltrado) => carrito.some((producto) => producto.id === productoFiltrado.id)

function cargarProductos(productos, ...divContenedores) {
    if (productos.length > 0) {
        divContenedores.forEach((divContenedor) => {
            let productosFiltrados = productos.filter((producto) => divContenedor.id.includes(producto.marca));
            divContenedor.innerHTML = "";
            productosFiltrados.forEach((productoFiltrado) => {
                divContenedor.innerHTML += retornarProductCard(productoFiltrado);
                if (productoEnCarrito(carrito,productoFiltrado)) {
                    modificarCardEnCarrito(productoFiltrado);
                }
            });
        });
        manejarContador(carrito,contadorCarrito)
        const botonesCompra = document.querySelectorAll(".add-to-cart");
        activarEventosCompra(botonesCompra, carrito, contadorCarrito);
        ocultarBanners(divContenedores)
    }
}
// #endregion

// #region CARRITO

function activarEventosCompra(botones, carrito, contadorCarrito) {
    botones.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            let btnClickeado = event.target;
            let productoSeleccionado = productos.find((producto) => producto.id === parseInt(btnClickeado.id));
            if (! productoEnCarrito(carrito,productoSeleccionado)) {
                agregarAlCarrito(carrito,productoSeleccionado,contadorCarrito,btnClickeado)
            } else {
                eliminarDelCarrito(productoSeleccionado,carrito,btnClickeado)
            }
            manejarContador(carrito,contadorCarrito)
            localStorage.setItem("carrito", JSON.stringify(carrito));
        });
    });
}

function agregarAlCarrito(carrito,productoSeleccionado,contadorCarrito,btnClickeado){
    carrito.push(productoSeleccionado);
    contadorCarrito.classList.add("d-flex");
    mostrarMensajeToast(`${productoSeleccionado.nombre} ha sido agregado al carrito`);
    btnClickeado.textContent = "Quitar del Carrito";

}

function eliminarDelCarrito(productoSeleccionado,carrito,btnClickeado){
    mostrarMensajeToast(`${productoSeleccionado.nombre} ha sido eliminado del carrito`,"red");
    eliminarElemento(carrito, productoSeleccionado.id);
    btnClickeado.textContent = "Agregar al Carrito";
}


function ActivarClickBtnCarrito(btnCarrito) {
    btnCarrito.addEventListener("click", () => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
        carrito.length > 0 ? location.href = "/checkout.html" : mostrarMensajeCarrito("Primero debe cargar al menos un producto en su carrito", "error", "Error!");
    });
}
// #endregion

// #region Búsqueda
function manejarBusqueda(productos, botonesCompra, inputSearch, contenedores) {
    let resultado = productos.filter((producto) => producto.nombre.toLowerCase().includes(inputSearch.value.toLowerCase()));
    if (resultado.length > 0) {
        cargarProductos(resultado, ...contenedores);
        botonesCompra = document.querySelectorAll(".add-to-cart");
        localStorage.setItem("ultimaBusqueda", inputSearch.value);
    }
}

function buscarPorInput(productos, botonesCompra, inputSearch, contenedores) {
    inputSearch.addEventListener("keyup", (e) => {
        e.key === "Enter" && manejarBusqueda(productos, botonesCompra, inputSearch, contenedores);
    });
}

function buscarPorBoton(productos, botonesCompra, inputSearch, botonBuscar, contenedores) {
    botonBuscar.addEventListener("click", (e) => {
        e.preventDefault();
        manejarBusqueda(productos, botonesCompra, inputSearch, contenedores);
    });
}
// #endregion

// #region ORDENAMIENTO Y FILTRADO
function ordenar(lista, criterio, asc = true) {
    try {
        for (let i = 0; i < lista.length; i++) {
            for (let j = i + 1; j < lista.length; j++) {
                let criterio_i = lista[i][criterio];
                let criterio_j = lista[j][criterio];

                if (!isNaN(criterio_i) && !isNaN(criterio_j)) {
                    criterio_i = parseFloat(criterio_i);
                    criterio_j = parseFloat(criterio_j);
                }
                if (criterio_i > criterio_j) {
                    let auxiliar = lista[i];
                    lista[i] = lista[j];
                    lista[j] = auxiliar;
                }
            }
        }
        if (!asc) {
            lista.reverse();
        }
    } catch (error) {
        console.error("Ha ocurrido un error:", error);
    }
}

function filtrar(botonFiltrar, dropdown, selectElement, contenedores, productos) {
    botonFiltrar.addEventListener("click", () => {
        dropdown.classList.toggle("active");
    });
    selectElement.addEventListener("change", () => {
        let resultado = false;
        let productosFiltrados = productos;
        const selectedValue = selectElement.value;
        switch (selectedValue) {
            case "todas":
                cargarProductos(productos, ...contenedores);
                break;
            case "nike":
                resultado = "Nike";
                break;
            case "adidas":
                resultado = "Adidas";
                break;
            case "puma":
                resultado = "Puma";
                break;
            case "a-z":
                ordenar(productosFiltrados, "nombre", true);
                cargarProductos(productosFiltrados, ...contenedores);
                break;
            case "z-a":
                ordenar(productosFiltrados, "nombre", false);
                cargarProductos(productosFiltrados, ...contenedores);
                break;
            case "true":
                ordenar(productosFiltrados, "precio", true);
                cargarProductos(productosFiltrados, ...contenedores);
                break;
            case "false":
                ordenar(productosFiltrados, "precio", false);
                cargarProductos(productosFiltrados, ...contenedores);
                break;
        }
        if (resultado) {
            productosFiltrados = productos.filter((producto) => producto.marca === resultado);
            cargarProductos(productosFiltrados, ...contenedores);
        }
    });
}
// #endregion

// Boton carrito
ActivarClickBtnCarrito(btnCarrito);

// Búsqueda y filtrado
const botonesCompra = document.querySelectorAll(".add-to-cart");
buscarPorInput(productos, botonesCompra, inputSearch, contenedores);
buscarPorBoton(productos, botonesCompra, inputSearch, botonBuscar, contenedores);
filtrar(botonFiltrar, dropdown, selectElement, contenedores, productos);

// #region MENSAJES
// SweetAlert
function mostrarMensajeCarrito(mensaje, tipo, titulo) {
    Swal.fire({
        title: titulo,
        text: mensaje,
        icon: tipo,
        timer: 3500,
        showConfirmButton: false
    });
}

function mostrarMensajeToast(mensaje, color) {
    Toastify({
        text: mensaje,
        duration: 3500,
        style: {
            background: color
        }
    }).showToast();
}
// #endregion
const ocultarBanners = (divContenedores) => {
    divContenedores.forEach(divContenedor =>{
        const marca = divContenedor.dataset.brand;
        const secciones = document.querySelectorAll("." + marca)
        if (divContenedor.innerHTML == ''){
            secciones.forEach((section)=> section.classList.add("d-none"))        
        } else {
            secciones.forEach((section)=> section.classList.remove("d-none"))
        }
    })
}
