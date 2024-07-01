import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';
        import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';
        import { getDatabase, ref, push, onChildAdded, query, equalTo } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js';

        const firebaseConfig = {
    apiKey: "AIzaSyAOnRHRND19HSaN19cUlez3AepxYOhszdM",
    authDomain: "porientadainternet.firebaseapp.com",
    projectId: "porientadainternet",
    storageBucket: "porientadainternet.appspot.com",
    messagingSenderId: "112181805077",
    appId: "1:112181805077:web:a8a3ec9a7d190c42448e1c"
};

// Obtén una referencia a la base de datos de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Variable para controlar la lista de usuarios seleccionados
const control = [];

// Obtén la lista de usuarios de Firebase y agrégala al primer combobox
const usersRef = ref(db, 'usuarios');
onChildAdded(usersRef, (snapshot) => {
    const user = snapshot.val();
    const currentUser = auth.currentUser;

    // Filtrar el usuario actual
    if (currentUser && user.email !== currentUser.email) {
        const option = document.createElement('option');
        option.value = user.email;
        option.textContent = user.email;
        combobox1.appendChild(option);
    }
});

// Agregar usuario seleccionado al hacer clic en el botón "Agregar"
const agregarBtn = document.getElementById('agregarBtn');
agregarBtn.addEventListener('click', () => {
    const selectedUser = combobox1.value;
    if (selectedUser) {
        // Verificar si el usuario ya está en la lista "control"
        if (!control.includes(selectedUser)) {
            control.push(selectedUser);
            // Actualiza el segundo combobox con los usuarios en la variable "control"
            actualizarCombobox2();
        } else {
            alert("Este usuario ya ha sido agregado.");
        }
    }
});

// Eliminar usuario seleccionado del segundo combobox
const eliminarBtn = document.getElementById('eliminarBtn');
eliminarBtn.addEventListener('click', () => {
    const selectedUser = combobox2.value;
    if (selectedUser) {
        const index = control.indexOf(selectedUser);
        if (index !== -1) {
            control.splice(index, 1);
            // Actualiza el segundo combobox después de eliminar el usuario
            actualizarCombobox2();
        }
    }
});

// Función para actualizar el contenido del segundo combobox
function actualizarCombobox2() {
    // Borra todos los elementos existentes en el segundo combobox
    while (combobox2.firstChild) {
        combobox2.removeChild(combobox2.firstChild);
    }

    // Agrega los usuarios en la variable "control" al segundo combobox
    control.forEach((user) => {
        const option = document.createElement('option');
        option.value = user;
        option.textContent = user;
        combobox2.appendChild(option);
    });


// Obtén referencias a los botones "Crear" y "Cancelar"
const crearBtn = document.getElementById('crearBtn');
const cancelarBtn = document.getElementById('cancelarBtn');

// Agregar un evento al botón "Cancelar" para redirigir a "mensaje.html"
cancelarBtn.addEventListener('click', () => {
    window.location.href = 'mensaje.html';
});

// Agregar un evento al botón "Crear" para guardar los datos en Firebase
crearBtn.addEventListener('click', () => {
    const nombreGrupo = document.getElementById('nombre').value;

    if (nombreGrupo && control.length > 0) {
        const currentUser = auth.currentUser;
        const grupoData = {
            nombre: nombreGrupo,
            usuarios: [currentUser.email, ...control],
        };

        // Guardar los datos del grupo en Firebase
        const gruposRef = ref(db, 'grupos');
        push(gruposRef, grupoData)
            .then(() => {
                alert('Grupo creado');
                window.location.href = 'mensaje.html';
            })
            .catch((error) => {
                console.error('Error al crear el grupo:', error);
            });
    } else {
        alert('Por favor, ingresa un nombre de grupo y selecciona usuarios.');
    }
});

}