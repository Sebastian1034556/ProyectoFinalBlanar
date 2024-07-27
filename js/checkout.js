const carrito = JSON.parse(localStorage.getItem("carrito")) || []
const contenedor = document.getElementById("productCardContainer")
const importeTotalCarrito = document.querySelector("p#importeTotalCarrito")
const btnComprar = document.querySelector("button#btnComprar")
const btnVolver = document.querySelector("button.back")
const store = "/ProyectoFinalBlanar/"

// #region MENSAJES
//Se retorna una promesa
function mostrarMensajeCarrito(mensaje, tipo, titulo) {
    return Swal.fire({
        title: titulo,
        text: mensaje,
        icon: tipo,
        confirmButtonText: 'OK', 
    });
}

function confirmarCompra() {
    Swal.fire({
        title: '¿Está seguro de realizar esta compra?',
        text: "Confirme su compra",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, comprar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            mostrarMensajeCarrito("", "success", "¡Muchas gracias por su compra!").then(() => {
                localStorage.removeItem("carrito");
                location.href += store;
            });
        }
    });
}

function mostrarMensajeToast(mensaje,color){
    Toastify({
        text: mensaje,
        duration: 3500,
        style: {
            background: color
        }
        }).showToast();
}
// #endregion

function eliminarElemento(array, id) {
    const index = array.findIndex(elemento => elemento.id === id);
    if (index > -1) {
        array.splice(index, 1);
    }
}
// Renderizado
function retornarProductCard({imagen,nombre,precio,id,cantidad}){
    return ` 
            <div class="product-card">
                <img src="${imagen}" alt="Nike Dunk Low">
                <div class="product-info">
                    <h3 class="name" id="${id}">${nombre}</h3>
                    <p class="price">$${precio}</p>
                    <div class="actions">
                        <button class="add">+</button>
                        <button class="remove">-</button>
                    </div>
                    <p class="amount">${cantidad}</p>
                </div>
            </div> 
            `
}
// #region MODIFICAR PRODUCTOS 
function buscarIdProducto(carrito,productoClickeado){
    let card = productoClickeado.closest(".product-card")
    let h3 = card.querySelector("h3.name")
    let productoId = h3.id
    let producto = carrito.find((prod)=> prod.id === parseInt(productoId))
    return producto
}
function agregarProductoCarrito(carrito,botonesAgregar) {
    botonesAgregar.forEach((btnAgregar)=>{
        btnAgregar.addEventListener("click",(e)=>{
            let productoClickeado = e.target
            let prod = buscarIdProducto(carrito,productoClickeado)
            prod.cantidad += 1
            localStorage.setItem("carrito",JSON.stringify(carrito))
            cargarProductosDelCarrito()
        }) 
    })
}
function eliminarProductoCarrito(carrito,botonesEliminar){
    botonesEliminar.forEach((btnEliminar)=>{
        btnEliminar.addEventListener("click",(e)=>{
            let productoClickeado = e.target
            let prod = buscarIdProducto(carrito,productoClickeado)
            prod.cantidad != 1 ? prod.cantidad -= 1 : eliminarElemento(carrito,prod.id)
            localStorage.setItem("carrito",JSON.stringify(carrito))
            cargarProductosDelCarrito()
        }) 
    })
}
// #endregion

// #region CARRITO
function calcularTotalCarrito(carrito) {
    if (carrito.length > 0) {
        let montoTotalCarrito = carrito.reduce((acc, prod)=> acc + (prod.precio * prod.cantidad) , 0)
        importeTotalCarrito.textContent = `$ ${montoTotalCarrito.toLocaleString("es-AR")}`
    } else {
        importeTotalCarrito.textContent = `$0.00`
    }
}
function cargarProductosDelCarrito() {
    try {
        contenedor.innerHTML = ""
        if (carrito.length > 0) {
            carrito.forEach((producto)=>  contenedor.innerHTML += retornarProductCard(producto))
            const botonesAgregar = document.querySelectorAll(".add")
            const botonesEliminar = document.querySelectorAll(".remove")
            agregarProductoCarrito(carrito,botonesAgregar)
            eliminarProductoCarrito(carrito,botonesEliminar)
            calcularTotalCarrito(carrito)
        } else {
            calcularTotalCarrito(carrito)
            location.href += store
        }
    } catch(e){
        console.error(e)
    }
    
}

cargarProductosDelCarrito() 
// #endregion CARRITO

btnComprar.addEventListener("click", confirmarCompra);

btnVolver.addEventListener("click",()=>{
    Swal.fire({
        title: '¿Está seguro de que deseas volver?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, volver',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) location.href += store
    })
})

const header = document.querySelector("img.logo")
header.addEventListener("click" , ()=>{
    location.href += store
})