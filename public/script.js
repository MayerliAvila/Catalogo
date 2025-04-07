document.addEventListener('DOMContentLoaded', () => {
  const contenedorProductos = document.getElementById('carrusel-productos');
  const btnIzq = document.querySelector('.btn-carrusel.izq');
  const btnDer = document.querySelector('.btn-carrusel.der');

  let scrollInterval;

  // Función para empezar el scroll automático
  const iniciarScroll = () => {
    scrollInterval = setInterval(() => {
      contenedorProductos.scrollBy({ left: 1, behavior: 'smooth' });
      if (contenedorProductos.scrollLeft + contenedorProductos.clientWidth >= contenedorProductos.scrollWidth) {
        contenedorProductos.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }, 20);
  };

  // Función para detener el scroll automático
  const detenerScroll = () => clearInterval(scrollInterval);

  // Cargar productos desde productos.json
  fetch('productos.json')
    .then(response => response.json())
    .then(productos => {
      productos.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}">
          <p>${producto.nombre}</p>
        `;
        contenedorProductos.appendChild(card);
      });
      iniciarScroll();
    })
    .catch(error => console.error('Error al cargar productos:', error));

  // Funcionalidad de los botones del carrusel manual
  btnDer.addEventListener('click', () => {
    contenedorProductos.scrollBy({ left: 200, behavior: 'smooth' });
  });

  btnIzq.addEventListener('click', () => {
    contenedorProductos.scrollBy({ left: -200, behavior: 'smooth' });
  });

  contenedorProductos.addEventListener('mouseenter', detenerScroll);
  contenedorProductos.addEventListener('mouseleave', iniciarScroll);

  // Cargar categorías dinámicamente en el menú y en el formulario
  fetch("categorias.json")
    .then(res => res.json())
    .then(data => {
      const contenedorCategorias = document.getElementById("categorias");
      const selectCategoria = document.getElementById('categoria');

      data.categorias.forEach(cat => {
        // Botones de menú
        const boton = document.createElement("button");
        boton.classList.add("btn-categoria");
        boton.textContent = cat;
        contenedorCategorias.appendChild(boton);

        // Opciones del select del formulario
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        selectCategoria.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Error al cargar las categorías:", error);
    });
});

  function toggleCategorias() {
    const categorias = document.getElementById('contenedorCategorias');
    categorias.classList.toggle('mostrar');
  }


// Movimiento de la imagen de los productos
function changeImage(thumbnail) {
  const mainImage = document.getElementById('main-image');
  mainImage.src = thumbnail.src;
}
// MODAL PARA ADMINISTRADOR
function abrirModal() {
  document.getElementById('modalAdmin').style.display = 'block';
  volverAlInicio();
}

function cerrarModal() {
  document.getElementById('modalAdmin').style.display = 'none';
}

window.onclick = function(event) {
  const modal = document.getElementById('modalAdmin');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
}

// Mostrar distintas secciones
function mostrarSeccion(seccion) {
  ocultarTodo();

  switch (seccion) {
    case 'formulario':
      document.getElementById('formProducto').style.display = 'block';
      break;
    case 'productosExistentes':
      cargarProductos();
      document.getElementById('productosExistentes').style.display = 'block';
      break;
    case 'eliminarProducto':
      cargarEliminarProductos();
      document.getElementById('eliminarProducto').style.display = 'block';
      break;
    case 'masVendidos':
      mostrarProductosMasVendidos();
      document.getElementById('masVedidos').style.display = 'block';
      break;
    case 'agregarMasVendidos':
      abrirFormularioMasVendidos();
      break;
    case 'eliminarMasVendidos':
      abrirEliminarMasVendidos();
      break;
  }
}

function ocultarTodo() {
  const secciones = ['vistaInicial', 'formProducto', 'productosExistentes', 'eliminarProducto', 'productosMasVendidos'];
  secciones.forEach(id => document.getElementById(id).style.display = 'none');
}

function volverAlInicio() {
  ocultarTodo();
  document.getElementById('vistaInicial').style.display = 'block';
}

// Leer imagen como base64
function leerImagenComoBase64(archivo, callback) {
  const reader = new FileReader();
  reader.onload = function(event) {
    callback(event.target.result);
  };
  reader.readAsDataURL(archivo);
}

// Guardar producto normal
document.getElementById('formProducto').addEventListener('submit', function(e) {
  e.preventDefault();

  const archivoImagen = document.getElementById('imagenProducto').files[0];
  if (!archivoImagen) {
    alert('Por favor selecciona una imagen.');
    return;
  }

  leerImagenComoBase64(archivoImagen, (imagenBase64) => {
    const producto = obtenerDatosFormulario(imagenBase64);

    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    productos.push(producto);
    localStorage.setItem('productos', JSON.stringify(productos));

    document.getElementById('formProducto').reset();
    alert('Producto agregado correctamente');
    volverAlInicio();
  });
});

function obtenerDatosFormulario(imagenBase64) {
  return {
    categoria: document.getElementById('categoria').value,
    nombre: document.getElementById('nombreProducto').value,
    descripcion: document.getElementById('descripcionProducto').value,
    tallas: document.getElementById('tallasProducto').value,
    imagen: imagenBase64
  };
}

// Cargar productos existentes
function cargarProductos() {
  const contenedor = document.getElementById('listaProductos');
  contenedor.innerHTML = '';

  const productos = JSON.parse(localStorage.getItem('productos')) || [];

  if (productos.length === 0) {
    contenedor.innerHTML = '<p>No hay productos registrados.</p>';
    return;
  }

  productos.forEach(producto => {
    const div = document.createElement('div');
    div.classList.add('producto-item');
    div.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <strong>${producto.nombre}</strong>
      <p><strong>Categoria:</strong> ${producto.categoria}</p>
      <p><strong>Descripcion:</strong> ${producto.descripcion}</p>
      <p><strong>Tallas:</strong> ${producto.tallas}</p>
    `;
    contenedor.appendChild(div);
  });
}

// Cargar lista de productos para eliminar
function cargarEliminarProductos() {
  const contenedor = document.getElementById('listaEliminar');
  contenedor.innerHTML = '';

  const productos = JSON.parse(localStorage.getItem('productos')) || [];

  if (productos.length === 0) {
    contenedor.innerHTML = '<p>No hay productos para eliminar.</p>';
    return;
  }

  productos.forEach((producto, index) => {
    const div = document.createElement('div');
    div.classList.add('producto-item');
    div.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <strong>${producto.nombre}</strong>
      <p><strong>Categoria:</strong> ${producto.categoria}</p>
      <p><strong>Descripcion:</strong> ${producto.descripcion}</p>
      <p><strong>Tallas:</strong> ${producto.tallas}</p>
      <button onclick="eliminarProducto(${index})">Eliminar</button>
    `;
    contenedor.appendChild(div);
  });
}

function eliminarProducto(index) {
  let productos = JSON.parse(localStorage.getItem('productos')) || [];
  productos.splice(index, 1);
  localStorage.setItem('productos', JSON.stringify(productos));
  cargarEliminarProductos();
}

// Mostrar productos más vendidos
function mostrarProductosMasVendidos() {
  ocultarTodo();
  document.getElementById('productosMasVendidos').style.display = 'block';
  cargarProductosMasVendidos();
}

function cargarProductosMasVendidos() {
  const contenedor = document.getElementById('listaMasVendidos');
  contenedor.innerHTML = '';

  const productos = JSON.parse(localStorage.getItem('productosMasVendidos')) || [];

  if (productos.length === 0) {
    contenedor.innerHTML = '<p>No hay productos más vendidos.</p>';
    return;
  }

  productos.forEach(producto => {
    const div = document.createElement('div');
    div.classList.add('producto-item');
    div.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p><strong>Categoria:</strong> ${producto.categoria}</p>
      <p><strong>Descripcion:</strong> ${producto.descripcion}</p>
      <p><strong>Tallas:</strong> ${producto.tallas}</p>
    `;
    contenedor.appendChild(div);
  });
}

// Agregar productos a más vendidos
function abrirFormularioMasVendidos() {
  ocultarTodo();
  document.getElementById('formProducto').style.display = 'block';

  const form = document.getElementById('formProducto');
  const nuevoForm = form.cloneNode(true);
  form.parentNode.replaceChild(nuevoForm, form);

  nuevoForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const archivoImagen = document.getElementById('imagenProducto').files[0];
    if (!archivoImagen) {
      alert('Por favor selecciona una imagen.');
      return;
    }

    leerImagenComoBase64(archivoImagen, (imagenBase64) => {
      const producto = obtenerDatosFormulario(imagenBase64);

      let productos = JSON.parse(localStorage.getItem('productosMasVendidos')) || [];
      productos.push(producto);
      localStorage.setItem('productosMasVendidos', JSON.stringify(productos));

      nuevoForm.reset();
      alert('Producto agregado a más vendidos correctamente');
      volverAlInicio();
    });
  });
}

// Eliminar todos los productos más vendidos
function abrirEliminarMasVendidos() {
  const confirmacion = confirm('¿Quieres eliminar todos los productos más vendidos?');
  if (confirmacion) {
    localStorage.removeItem('productosMasVendidos');
    alert('Se han eliminado todos los productos más vendidos.');
    cargarProductosMasVendidos();
  }
}

// Previsualizar imagen
document.getElementById('imagenProducto').addEventListener('change', function(event) {
  const archivo = event.target.files[0];
  if (archivo) {
    const lector = new FileReader();
    lector.onload = function(e) {
      const preview = document.getElementById('previewImagen');
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    lector.readAsDataURL(archivo);
  }
});
