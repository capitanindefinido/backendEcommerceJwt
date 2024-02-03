console.log('real')
const socket = io()

// insertar en plantilla los productos con card de bootstrap
const insertProducts = products => {
    // console.log(products)
    if (products.length === 0) {
        return document.querySelector('#container-products').innerHTML = `
            <div class="alert alert-danger" role="alert">
                No hay productos cargados
            </div>
        `        
    }
    const containerProducts = document.querySelector('#container-products')
    containerProducts.innerHTML = ''
    products.forEach(product => {
        console.log(product)
        containerProducts.innerHTML += `
            <div class="w-100 mb-2">
                <div class="w-25 d-inline">
                    <img src="${product.thumbnail}" class="w-25" alt="image">                
                </div>
                <label class="card-title">Id: ${product._id}</label>
                <label class="card-title">Nombre: ${product.title}</label>
                <a href='/product-edit-form/${product._id}'>
                    <button class="btn btn-outline-primary">Modificar</button>
                </a>
                <button class="btn btn-danger" id="btn-eliminar" onclick="handleEliminar('${product._id}')">Eliminar</button>                
            </div>
            <hr>
        `
    })    
}

socket.on('products', dataProducts => {
    insertProducts(dataProducts)
})

const formProduct = document.querySelector('#form-product')

const handleOnSubmit = evt => {
    evt.preventDefault()

    socket.emit('addProduct', {
        title: formProduct.elements.title.value,
        description: formProduct.elements.description.value,
        stock: parseInt(formProduct.elements.stock.value),
        price: Number(formProduct.elements.price.value),
        thumbnail: formProduct.elements.thumbnail.value,
        code: formProduct.elements.code.value
    })
    // formProduct.reset()
}

formProduct.addEventListener('submit', handleOnSubmit)

// btn-eliminar
// swal
// const buttonEliminar = document.querySelector('#btn-eliminar')
const handleEliminar = (id) => {
    // evt.preventDefault()
    // console.log(id)
    // Swal ok y cancel
    Swal.fire({
        title: 'Estas seguro?',
        text: "No podras revertir esta accion!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33', 
        confirmButtonText: 'Si, eliminarlo!'
    })
    .then( result => {
        if (result.isConfirmed) {
            fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({isActive: false})
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    Swal.fire(
                        'Eliminado!',
                        'El producto ha sido eliminado.',
                        'success'
                    )                
                    window.location.reload()
                }
            })
        }
    })   
}

// buttonEliminar.addEventListener('click', handleEliminar)
