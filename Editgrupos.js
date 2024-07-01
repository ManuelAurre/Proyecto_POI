import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';
import { getDatabase, ref, push, onChildAdded, query, equalTo, update,get, set  } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyAOnRHRND19HSaN19cUlez3AepxYOhszdM",
    authDomain: "porientadainternet.firebaseapp.com",
    projectId: "porientadainternet",
    storageBucket: "porientadainternet.appspot.com",
    messagingSenderId: "112181805077",
    appId: "1:112181805077:web:a8a3ec9a7d190c42448e1c"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);


// Obtén una referencia a la lista de grupos en la base de datos
const gruposRef = ref(db, 'grupos');

// Obtén el elemento select del combobox de grupos
const gruposSelect = document.getElementById('grupos');

onAuthStateChanged(auth, (user) => {
if (user) {
    // Borra cualquier opción previa del combobox de grupos
    gruposSelect.innerHTML = '';

    // Espera a que la autenticación se complete antes de cargar los grupos
    onAuthStateChanged(auth, (user) => {

        if (user) {

         // Borra cualquier opción previa del combobox de grupos

            gruposSelect.innerHTML = '';


            // Obtén la lista completa de grupos desde la base de datos

            onChildAdded(gruposRef, (snapshot) => {
    
                const grupo = snapshot.val();

                // Verifica si el usuario actual está presente en la lista de usuarios del grupo
    
                if (grupo.usuarios && grupo.usuarios.includes(user.email)) {
        
                    // Si el usuario está presente, crea una opción para el grupo y agrégala al combobox
                    const option = document.createElement('option');
                    option.value = snapshot.key; // Usa la clave única del grupo como valor
                    option.textContent = grupo.nombre; // Usa el nombre del grupo como texto visible
                    gruposSelect.appendChild(option);
    
                    }   
            });
        }
});
}
});


document.getElementById('seleccionarGrupo').addEventListener('click', () => {
    // Obtén el ID del grupo seleccionado
    const selectedGroupId = gruposSelect.value;

    if (selectedGroupId) {
        // Limpia el contenido actual de la sección de usuarios del grupo
        const usuariosGrupoSection = document.getElementById('usuariosGrupoSection');
        usuariosGrupoSection.innerHTML = '';

        // Crea una referencia a la lista de usuarios en el grupo seleccionado
        const usuariosGrupoRef = ref(db, `grupos/${selectedGroupId}/usuarios`);

        // Obtén la lista de usuarios en el grupo
        onChildAdded(usuariosGrupoRef, (snapshot) => {
            const usuarioEmail = snapshot.val();
            console.log("que es esto?", snapshot.val());
            // Crea un elemento div para cada usuario y un botón de eliminar
            const usuarioDiv = document.createElement('div');
            usuarioDiv.textContent = usuarioEmail;

            const eliminarBtn = document.createElement('button');
            eliminarBtn.textContent = 'Eliminar';
            eliminarBtn.addEventListener('click', () => eliminarUsuario(selectedGroupId, usuarioEmail));

            // Agrega el botón eliminar al div del usuario
            usuarioDiv.appendChild(eliminarBtn);

            // Agrega el div del usuario a la sección de usuarios del grupo
            usuariosGrupoSection.appendChild(usuarioDiv);
        });
    }
});

function eliminarUsuario(groupId, userEmail) {
    // Obtén la referencia del grupo
    const grupoRef = ref(db, `grupos/${groupId}`);
    
    // Busca directamente el usuario en el grupo y obtén su clave
    onChildAdded(grupoRef, (snapshot) => {
        const usuario = snapshot.val();
        console.log( userEmail);
        if (usuario === userEmail) {
            const usuarioKey = snapshot.key;
            
            // Elimina al usuario del grupo
            update(ref(db, `grupos/${groupId}/usuarios/${usuarioKey}`), null)
                .then(() => {
                    console.log("Usuario eliminado exitosamente");
                })
                .catch((error) => {
                    console.error("Error al intentar eliminar el usuario:", error);
                });
        }else{
            
            console.log("que es esto?", snapshot.val());
        }
    });
}