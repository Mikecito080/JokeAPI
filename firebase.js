// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD7U1G9K_VPabazYsaxaUqb2DHFRoK82z8",
  authDomain: "jokeapi-14e1f.firebaseapp.com",
  projectId: "jokeapi-14e1f",
  storageBucket: "jokeapi-14e1f.firebasestorage.app",
  messagingSenderId: "596430117613",
  appId: "1:596430117613:web:b051c94593505743448ae4"
  };
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Guardar registro sin autenticación
  document.getElementById("form-registro").addEventListener("submit", async (e) => {
    e.preventDefault();
    const campos = e.target.elements;
  
    const nuevoUsuario = {
      nombre: campos[0].value,
      email: campos[1].value,
      edad: parseInt(campos[2].value),
      password: campos[3].value,
      pais: campos[4].value,
      genero: campos[5].value,
      chisteFavorito: campos[6].value,
      creado: new Date()
    };
  
    try {
      await db.collection("usuarios").add(nuevoUsuario);
      alert("¡Registro guardado exitosamente! 🎉");
      e.target.reset();
    } catch (error) {
      alert("Error al guardar: " + error.message);
    }
  });
  