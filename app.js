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

    generarDuelo();

  });
  
  function obtenerChiste() {
    fetch("https://v2.jokeapi.dev/joke/Any?lang=es")
      .then(res => res.json())
      .then(data => {
        document.getElementById("chiste-aleatorio").innerHTML = mostrarChiste(data, true);
      });
  }
  function generarDuelo() {
    const contenedor = document.getElementById("duelo-chistes");
    contenedor.innerHTML = "Cargando duelo...";
  
    Promise.all([
      fetch("https://v2.jokeapi.dev/joke/Any?lang=es").then(res => res.json()),
      fetch("https://v2.jokeapi.dev/joke/Any?lang=es").then(res => res.json())
    ]).then(([c1, c2]) => {
      contenedor.innerHTML = `
        <div class="duelo">
          <div class="chiste-box">
            ${mostrarChiste(c1)}
            <button onclick="votarChiste('votos1')">Votar por este</button>
          </div>
          <div class="chiste-box">
            ${mostrarChiste(c2)}
            <button onclick="votarChiste('votos2')">Votar por este</button>
          </div>
        </div>
        <div class="resultados">
          🏆 Chiste 1: <span id="votos1">${localStorage.getItem("votos1") || 0}</span> votos |
          🏆 Chiste 2: <span id="votos2">${localStorage.getItem("votos2") || 0}</span> votos
        </div>
        <button onclick="generarDuelo()">Nuevo duelo</button>
      `;
    });
  }
  function votarChiste(clave) {
    let votos = parseInt(localStorage.getItem(clave) || 0);
    votos++;
    localStorage.setItem(clave, votos);
    document.getElementById(clave).textContent = votos;
    alert("¡Tu voto fue contado! 🙌");
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
  
  