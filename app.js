window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => document.getElementById("splash").style.display = "none", 2000);
  
    document.querySelectorAll(".bottom-nav button").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
        document.getElementById(btn.dataset.tab).classList.add("active");
      });
    });
  
    obtenerChiste();
    cargarFavoritos();
  });
  
  function obtenerChiste() {
    fetch("https://v2.jokeapi.dev/joke/Any?lang=es")
      .then(res => res.json())
      .then(data => {
        document.getElementById("chiste-aleatorio").innerHTML = mostrarChiste(data, true);
      });
  }
  
  function buscarChistes() {
    const query = document.getElementById("buscarInput").value;
    const categoria = document.getElementById("filtroCategoria").value;
    let url = `https://v2.jokeapi.dev/joke/${categoria || 'Any'}?contains=${query}`;
  
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const contenedor = document.getElementById("resultado-busqueda");
        if (data.jokes) {
          contenedor.innerHTML = data.jokes.map(j => mostrarChiste(j)).join("");
        } else if (data.type) {
          contenedor.innerHTML = mostrarChiste(data);
        } else {
          contenedor.innerHTML = "No se encontraron chistes.";
        }
      });
  }
  
  function mostrarChiste(data, incluirBoton = false) {
    let chiste = data.type === "single" ? data.joke : `${data.setup}<br>${data.delivery}`;
    let boton = incluirBoton ? `<button onclick='guardarFavorito(${JSON.stringify(JSON.stringify(chiste))})'>Guardar</button>` : "";
    return `<div class="chiste">${chiste}${boton}</div>`;
  }
  
  function guardarFavorito(chiste) {
    chiste = JSON.parse(chiste);
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    if (!favoritos.includes(chiste)) {
      favoritos.push(chiste);
      localStorage.setItem("favoritos", JSON.stringify(favoritos));
      cargarFavoritos();
      alert("Chiste guardado 🤩");
    }
  }
  
  function cargarFavoritos() {
    const lista = document.getElementById("lista-favoritos");
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    lista.innerHTML = favoritos.map((c, i) =>
      `<div class="chiste">${c}<br><button onclick="eliminarFavorito(${i})">Eliminar</button></div>`
    ).join("");
  }
  
  function eliminarFavorito(index) {
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    favoritos.splice(index, 1);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    cargarFavoritos();
  }

  function buscarPorCategoria(cat) {
    const contenedor = document.getElementById("chistes-categoria");
    contenedor.innerHTML = "Cargando...";
    fetch(`https://v2.jokeapi.dev/joke/${cat}?amount=5&lang=es`)
      .then(res => res.json())
      .then(data => {
        if (data.jokes) {
          contenedor.innerHTML = data.jokes.map(j => mostrarChiste(j)).join("");
        } else if (data.type) {
          contenedor.innerHTML = mostrarChiste(data);
        } else {
          contenedor.innerHTML = "No se encontraron chistes.";
        }
      });
  }
  
  