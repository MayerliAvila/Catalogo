// gestionProductos.js

export function leerImagenComoBase64(archivo, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
      callback(e.target.result);
    };
    reader.readAsDataURL(archivo);
  }
  
  export function obtenerDatosFormulario(imagenBase64) {
    return {
      categoria: document.getElementById('categoria').value,
      nombre: document.getElementById('nombreProducto').value,
      descripcion: document.getElementById('descripcionProducto').value,
      tallas: document.getElementById('tallasProducto').value,
      imagen: imagenBase64
    };
  }
  
  export function guardarProductoEnCategoria(producto) {
    const categoria = producto.categoria;
    let productosPorCategoria = JSON.parse(localStorage.getItem('productosPorCategoria')) || {};
  
    if (!productosPorCategoria[categoria]) {
      productosPorCategoria[categoria] = [];
    }
  
    productosPorCategoria[categoria].push(producto);
  
    localStorage.setItem('productosPorCategoria', JSON.stringify(productosPorCategoria));
  }
  