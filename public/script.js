// Lista de productos de ejemplo para el carrusel.
  // Cada objeto debe tener al menos 'id', 'nombre' e 'imagen'.
  const productos = [
    { id: 1, nombre: 'Suly', imagen: 'uploads/1732899608051-SULY.png' },
    { id: 2, nombre: 'Suly', imagen: 'uploads/1732899608051-SULY.png' },
    { id: 3, nombre: 'Suly', imagen: 'uploads/1732899608051-SULY.png' },
    { id: 4, nombre: 'Suly', imagen: 'uploads/1732899608051-SULY.png' },
    // Puedes agregar más productos aquí si lo deseas.
  ];


  // Función para generar los elementos HTML del carrusel y agregarlos al DOM.
  // Recibe la lista de productos y el número máximo de ítems a mostrar.
  function cargarCarrusel(productos, maxItems) {
    // Obtiene el elemento contenedor (el 'track') del carrusel usando su clase CSS.
    const track = document.querySelector('.carousel-track');
    // Crea una copia del array de productos para no modificar el original.
    let elementos = [...productos]; 

    // Si la cantidad de productos es menor que el máximo deseado, duplica la lista
    // hasta alcanzar o superar ese máximo, para asegurar un llenado visual.
    while (elementos.length < maxItems) {
      // Concatena la lista original de productos a la lista actual.
      elementos = elementos.concat(productos); 
    }

    // Recorta la lista de elementos para que no exceda el máximo especificado.
    elementos = elementos.slice(0, maxItems); 

    // Itera sobre cada producto en la lista final de 'elementos'.
    elementos.forEach((producto) => {
      // Crea un nuevo elemento 'div' para representar un ítem del carrusel.
      const item = document.createElement('div'); 
      // Agrega la clase CSS 'carousel-item' al nuevo 'div'.
      item.classList.add('carousel-item'); 
      // Establece el contenido HTML del ítem, incluyendo la imagen y el nombre del producto.
      item.innerHTML = ` 
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <p>${producto.nombre}</p>
      `; 
      // Añade el ítem recién creado como hijo del contenedor 'track'.
      track.appendChild(item); 
    });
  }


  // Función para inicializar la funcionalidad del carrusel (navegación, auto-scroll, táctil).
  function iniciarCarrusel() {
    // Obtiene el elemento contenedor (el 'track') del carrusel.
    const track = document.querySelector('.carousel-track'); 
    // Obtiene el botón de navegación "anterior".
    const prevBtn = document.getElementById('prev'); 
    // Obtiene el botón de navegación "siguiente".
    const nextBtn = document.getElementById('next'); 
    // Obtiene todos los elementos (ítems) dentro del carrusel.
    const items = document.querySelectorAll('.carousel-item'); 
    // Si no hay items, no se puede inicializar, sale de la función.
    if (items.length === 0) {
        console.error("No se encontraron items para el carrusel.");
        return; 
    }
    // Calcula el ancho de un ítem, incluyendo su margen/espacio (asume 20px de espacio).
    // offsetWidth da el ancho visible del elemento.
    const itemWidth = items[0].offsetWidth + 20; 
    // Variable para almacenar el ID de la animación de auto-scroll (para poder pausarla).
    let autoScrollTimeout; 
    // Define la velocidad del desplazamiento automático en píxeles por frame.
    let autoScrollSpeed = 2; 

    // Función recursiva para realizar el desplazamiento automático suave.
    function autoScroll() {
      // Solicita al navegador que ejecute el código antes del próximo repintado.
      autoScrollTimeout = requestAnimationFrame(() => {
        // Incrementa la posición de scroll horizontal del 'track'.
        track.scrollLeft += autoScrollSpeed; 

        // Comprueba si el scroll ha llegado al final del contenido.
        // scrollWidth es el ancho total del contenido, offsetWidth es el ancho visible.
        if (track.scrollLeft >= track.scrollWidth - track.offsetWidth) {
          // Si llegó al final, reinicia la posición de scroll al principio (0).
          track.scrollLeft = 0; 
        }
        // Llama a autoScroll de nuevo para continuar la animación en el siguiente frame.
        autoScroll(); 
      });
    }

    // Función para detener la animación de auto-scroll.
    function pauseAutoScroll() {
      // Cancela la próxima ejecución de 'autoScroll' programada con requestAnimationFrame.
      cancelAnimationFrame(autoScrollTimeout); 
    }

    // Función para reanudar el auto-scroll después de una pausa (ej. interacción del usuario).
    function resumeAutoScroll() {
      // Espera 20000 milisegundos (20 segundos) antes de volver a llamar a autoScroll.
      setTimeout(autoScroll, 20000); 
    }

    // Detecta si el dispositivo actual soporta eventos táctiles.
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Si es un dispositivo táctil, configura los eventos para el arrastre.
    if (isTouchDevice) {
      // Bandera para saber si el usuario está actualmente arrastrando.
      let isDragging = false; 
      // Variables para guardar la posición X inicial del toque y la posición de scroll inicial.
      let startX, scrollLeft; 

      // Event listener para cuando el usuario toca la pantalla sobre el 'track'.
      track.addEventListener('touchstart', (e) => {
        // Establece la bandera de arrastre a true.
        isDragging = true; 
        // Pausa el desplazamiento automático mientras el usuario interactúa.
        pauseAutoScroll(); 
        // Guarda la coordenada X del primer punto de contacto.
        startX = e.touches[0].pageX; 
        // Guarda la posición de scroll horizontal actual del 'track'.
        scrollLeft = track.scrollLeft; 
      });

      // Event listener para cuando el usuario mueve el dedo sobre la pantalla mientras toca el 'track'.
      track.addEventListener('touchmove', (e) => {
        // Si no se está arrastrando, no hace nada.
        if (!isDragging) return; 
        // Obtiene la coordenada X actual del primer punto de contacto.
        const x = e.touches[0].pageX; 
        // Calcula cuánto se ha movido el dedo horizontalmente desde el inicio. El '* 1' es redundante.
        const walk = (startX - x) * 1; 
        // Actualiza la posición de scroll del 'track' basándose en el movimiento del dedo.
        track.scrollLeft = scrollLeft + walk; 
        // Previene el comportamiento por defecto del navegador (como el scroll vertical de la página)
        // para asegurar que solo se controle el scroll horizontal del carrusel.
        e.preventDefault(); 
      });

      // Event listener para cuando el usuario levanta el dedo del 'track'.
      track.addEventListener('touchend', () => {
        // Establece la bandera de arrastre a false.
        isDragging = false; 
        // Reanuda el desplazamiento automático después de la interacción.
        resumeAutoScroll(); 
      });
    }

    // Event listener para el clic en el botón "siguiente".
    nextBtn.addEventListener('click', () => {
      // Pausa el desplazamiento automático.
      pauseAutoScroll(); 
      // Desplaza el 'track' hacia la derecha por el ancho de un ítem.
      track.scrollLeft += itemWidth; 
      // Reanuda el desplazamiento automático.
      resumeAutoScroll(); 
    });

    // Event listener para el clic en el botón "anterior".
    prevBtn.addEventListener('click', () => {
      // Pausa el desplazamiento automático.
      pauseAutoScroll(); 
      // Desplaza el 'track' hacia la izquierda por el ancho de un ítem.
      track.scrollLeft -= itemWidth; 
      // Reanuda el desplazamiento automático.
      resumeAutoScroll(); 
    });

    // Inicia el desplazamiento automático del carrusel por primera vez.
    autoScroll(); 
  }

  // Event listener que se ejecuta cuando el contenido HTML de la página ha sido completamente cargado y parseado.
  document.addEventListener('DOMContentLoaded', () => {
    // Define el número máximo de imágenes que se mostrarán en el carrusel.
    const maxItems = 10; 
    // Llama a la función para crear los elementos HTML del carrusel usando los productos de ejemplo.
    cargarCarrusel(productos, maxItems); 
    // Llama a la función para activar toda la interactividad y animación del carrusel.
    iniciarCarrusel(); 
  });

  /* Notas Adicionales:
  - Este código asume que tienes elementos HTML con las clases e IDs correspondientes:
    - Un contenedor principal con la clase `.carousel-container` (o similar).
    - Dentro de él, un elemento con la clase `.carousel-track` donde irán los ítems.
    - Elementos `button` (o similares) con los IDs `prev` y `next` para la navegación.
    - Cada ítem generado tendrá la clase `.carousel-item`.
  - Necesitarás CSS para estilizar el carrusel, controlar el overflow, el display de los ítems (flex o grid), y la apariencia de los botones.
  - La constante `productos` aquí es solo un ejemplo. En una aplicación real, estos datos vendrían probablemente de una API o estarían definidos en otra parte de tu código.
  - El `+ 20` en `itemWidth` asume un espaciado (gap o margin) de 20px entre ítems. Ajusta este valor según tu CSS.
  - La velocidad `autoScrollSpeed` y el tiempo de `resumeAutoScroll` (20 segundos) pueden ser ajustados a tu preferencia.
  */

  // --- Carga Dinámica de Categorías desde un Archivo JSON ---

fetch("categorias.json") 
.then(res => {
  // Verifica si la respuesta de red fue exitosa
  if (!res.ok) {
    throw new Error(`Error de red - ${res.statusText} (status: ${res.status})`);
  }
  return res.json(); // Procede a parsear como JSON
})
.then(data => { 
  // 1. VERIFICAR DATOS RECIBIDOS: Muestra los datos completos recibidos del JSON
  console.log("Datos recibidos:", data); 

  // Verifica si data.categorias es realmente un array
  if (!Array.isArray(data.categorias)) {
      console.error("Error: data.categorias no es un array.", data.categorias);
      return; // Detiene la ejecución si no es un array
  }

  // 2. VERIFICAR ELEMENTOS DOM: Asegúrate de que los contenedores existen
  const contenedorCategorias = document.getElementById("categorias"); 
  const selectCategoria = document.getElementById('categoria'); 
  console.log("Contenedor de botones encontrado:", contenedorCategorias);
  console.log("Select de categoría encontrado:", selectCategoria);

  // Verifica que ambos elementos existan antes de continuar
  if (!contenedorCategorias) {
      console.error("Error: No se encontró el elemento con ID 'categorias'.");
      return; // Detiene si no se encuentra el contenedor de botones
  }
   if (!selectCategoria) {
      console.error("Error: No se encontró el elemento con ID 'categoria' (el select).");
      // Podrías decidir continuar solo con los botones si el select es opcional
      // return; 
  }


  // 3. SEGUIMIENTO DEL BUCLE: Itera sobre las categorías
  data.categorias.forEach((cat, index) => { 
    // Muestra qué categoría se está procesando y su índice
    console.log(`Procesando categoría [${index}]:`, cat); 

    try { // Añadimos try...catch para aislar errores por iteración
      // --- Crear y agregar Botones al Menú de Categorías ---
      const boton = document.createElement("button"); 
      boton.classList.add("btn-categoria"); 
      boton.textContent = cat; 
      // Asegúrate de que contenedorCategorias no sea null aquí
      if (contenedorCategorias) {
          contenedorCategorias.appendChild(boton); 
      } else {
          console.warn(`Intento de agregar botón '${cat}' a un contenedor nulo.`);
      }


      // --- Crear y agregar Opciones al Select del Formulario ---
      // Solo si selectCategoria existe
      if (selectCategoria) {
          const option = document.createElement('option'); 
          option.value = cat; 
          option.textContent = cat; 
          selectCategoria.appendChild(option); 
      } else {
           // Opcional: podrías loggear si el select no existe pero se intentó añadir
           // console.warn(`Select 'categoria' no encontrado, no se añadió la opción '${cat}'.`);
      }

      // Si llega aquí, esta iteración fue exitosa
      console.log(`Categoría [${index}] '${cat}' procesada con éxito.`);

    } catch (errorEnIteracion) {
        // 4. CAPTURAR ERRORES DENTRO DEL BUCLE:
        console.error(`Error al procesar la categoría [${index}] '${cat}':`, errorEnIteracion);
        // Decide si quieres detener el bucle o continuar con la siguiente iteración
        // Por defecto, forEach continuará, pero este log te dirá dónde falló.
    }
  });
})
.catch(error => { 
  // 5. CAPTURAR ERRORES GENERALES (Fetch, JSON parse, etc.)
  console.error("Error general al cargar o procesar las categorías:", error); 
});


// --- Función para Alternar la Visibilidad del Menú de Categorías (para móvil) ---
// Asegúrate de que el ID aquí es el correcto para el CONTENEDOR de los botones
function toggleCategorias() { 
// Usa el mismo ID que usaste arriba para el contenedor de botones ('categorias')
// o si es un contenedor diferente (ej. 'contenedorCategorias'), asegúrate que exista.
const elContenedor = document.getElementById('categorias'); // Usa el ID correcto aquí

if (elContenedor) {
  console.log("Alternando clase 'mostrar' en:", elContenedor);
  elContenedor.classList.toggle('mostrar'); 
} else {
    console.error("Error en toggleCategorias: No se encontró el contenedor con el ID especificado.");
}
}
//FUNCION PARA LA IMAGEN DEL CATALOGO//
function cambiarImagen(src) {
  const imagen = document.getElementById('imagenGrande');
  const contenedor = document.querySelector('.imagen-principal');

  imagen.src = src;

  // Aplica la clase para el efecto de zoom por unos segundos
  contenedor.classList.add('zoom');

  // Quita la clase luego de 1.5 segundos para que no quede permanente
  setTimeout(() => contenedor.classList.remove('zoom'), 1500);
}


//PANEL DE ADMINITRADOS//
// ===================== MODAL ADMIN ===================== //

// Abre el modal de administrador y vuelve a la vista inicial
function abrirModal() {
    document.getElementById('modalAdmin').style.display = 'block';
    volverAlInicio();
  }
  
  // Cierra el modal de administrador
  function cerrarModal() {
    document.getElementById('modalAdmin').style.display = 'none';
  }
  
  // Cierra el modal si se hace clic fuera de él
  window.onclick = function(event) {
    const modal = document.getElementById('modalAdmin');
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  }
  
  