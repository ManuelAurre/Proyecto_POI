// Importa las funciones de Firebase que necesitas
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

// Configura tu objeto de configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAOnRHRND19HSaN19cUlez3AepxYOhszdM",
    authDomain: "porientadainternet.firebaseapp.com",
    projectId: "porientadainternet",
    storageBucket: "porientadainternet.appspot.com",
    messagingSenderId: "112181805077",
    appId: "1:112181805077:web:a8a3ec9a7d190c42448e1c"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getDatabase(app);
  
  var btnRegistrarse = document.getElementById("registrarseBtn");
  
  btnRegistrarse.addEventListener("click", function (e) {
      e.preventDefault();
  
      const nombre = document.getElementById("nombre").value;
      const apellidos = document.getElementById("apellidos").value;
      const usuario = document.getElementById("usuario").value;
      const fecha = document.getElementById("fecha").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
              const user = userCredential.user;
              console.log("Usuario registrado con UID:", user.uid);
  
              // Guardar los datos del usuario en la base de datos
              const userData = {
                  nombre: nombre,
                  apellidos: apellidos,
                  usuario: usuario,
                  fecha: fecha,
                  email: email,
                  estado: false,
              };
  
              const userRef = ref(db, 'usuarios/' + user.uid); // 'usuarios' debe ser la referencia a la colección de usuarios en tu base de datos
              set(userRef, userData)
                  .then(() => {
                      console.log("Datos del usuario guardados en la base de datos.");
                      window.location.href = "index.html";
                      alert("Registro exitoso. Serás redirigido a la nueva página.");
                  })
                  .catch((error) => {
                      console.error("Error al guardar los datos del usuario:", error);
                  });
          })
          .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.error("Error en el registro de usuario:", errorCode, errorMessage);
          });
  });