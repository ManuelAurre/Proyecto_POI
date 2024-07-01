import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';
        import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';
        import { getDatabase, ref, push, onChildAdded, query, equalTo,update  } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js';

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

        // Muestra el usuario que inició sesión
        const userDisplay = document.getElementById('userDisplay');
        const recipientSelect = document.getElementById('recipient');
        const messagesContainer = document.getElementById('messages');
// Obtén una referencia al elemento "mensajeGrupo"
const mensajeGrupo = document.getElementById('mensajeGrupo');
const btnEnviar2 = document.getElementById('btnEnviar2');

const seleccionarBtn = document.getElementById('seleccionarGrupo'); 
const mensajesContainer = document.getElementById('tmgrupo');

// Agrega un evento click al botón "btnEnviar2" para enviar el mensaje
btnEnviar2.addEventListener('click', () => {
    const mensaje = document.getElementById('mensajeGrupo').value;
    const grupoSeleccionado = gruposSelect.options[gruposSelect.selectedIndex].textContent; // Obtiene el texto del grupo seleccionado

    // Verifica que se haya seleccionado un grupo antes de enviar el mensaje
    if (grupoSeleccionado) {
        const user = auth.currentUser;
        if (user) {
            const remitente = user.email; // Obtén el email del remitente
            // Crea una referencia a la base de datos para el grupo seleccionado
            const chatGrupalRef = ref(db, 'chatgrupal');

            // Guarda el mensaje en la base de datos
            push(chatGrupalRef, {
                id: grupoSeleccionado,
                remitente: remitente, // Utiliza el email del remitente
                mensaje: mensaje,
                destinatario: grupoSeleccionado, // Supongo que quieres que el destinatario sea el mismo grupo
            });

            // Limpia el cuadro de texto después de enviar el mensaje
            document.getElementById('mensajeGrupo').value = '';

            // Limpia el contenido actual del elemento "mensajeGrupo"
            mensajeGrupo.innerHTML = '';

            // Carga y muestra los mensajes del grupo seleccionado
            loadGrupoMessages(grupoSeleccionado);
        } else {
            alert('Usuario no autenticado. Inicia sesión primero.');
        }
    } else {
        alert('Selecciona un grupo antes de enviar el mensaje.');
    }
});


// Agrega un evento click al botón "Seleccionar" para mostrar los mensajes del grupo seleccionado
seleccionarBtn.addEventListener('click', () => {
    const grupoSeleccionadoText = gruposSelect.options[gruposSelect.selectedIndex].textContent; // Obtén el texto del grupo seleccionado

    // Limpia los mensajes anteriores
    mensajesContainer.innerHTML = '';

    // Referencia a la base de datos de Firebase para cargar todos los mensajes de chatgrupal
    const mensajesRef = ref(db, 'chatgrupal');

    // Cargar y mostrar mensajes del grupo seleccionado
    onChildAdded(mensajesRef, (snapshot) => {
        const mensaje = snapshot.val();
        const destinatario = mensaje.destinatario;
        const remitente = mensaje.remitente;
        const textoMensaje = mensaje.mensaje;

        // Compara el destinatario del mensaje con el grupo seleccionado
        if (destinatario === grupoSeleccionadoText) {
            // Muestra el mensaje en el contenedor de mensajes
            const mensajeDiv = document.createElement('div');
            mensajeDiv.textContent = `${remitente}: ${textoMensaje}`;
            mensajesContainer.appendChild(mensajeDiv);

            console.log('Nuevo mensaje agregado:', snapshot.val());
            console.log(`Grupo seleccionado: ${grupoSeleccionadoText} Mensaje cargado: ${remitente}: ${textoMensaje}`);
        }
    });
});

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
        

        // Espera a que la autenticación se complete antes de actualizar userDisplay
        onAuthStateChanged(auth, (user) => {
            if (user) {
                userDisplay.textContent = `${user.email}`;
                loadMessages(user.email); // Cargar mensajes para el usuario actual
            }
        });
        
        // Obtén la lista de usuarios de Firebase y agrégala al combobox
        const usersRef = ref(db, 'usuarios');
        onChildAdded(usersRef, (snapshot) => {
            const user = snapshot.val();
            const currentUser = auth.currentUser;
            
            // Filtrar el usuario actual
            if (currentUser && user.email !== currentUser.email) {
                const option = document.createElement('option');
                option.value = user.email;
                option.textContent = user.email;
                recipientSelect.appendChild(option);
            }
        });

        // Función para cargar mensajes
        function loadMessages(recipient) {
            const chatRef = ref(db, 'chat'); // Usamos la referencia general
            onChildAdded(chatRef, (snapshot) => {
                const message = snapshot.val();
                const user = auth.currentUser;
                
                // Filtrar mensajes para mostrar solo los mensajes del destinatario actual
                if (user && message.destinatario === user.email) {
                    const messageDiv = document.createElement('div');
                    messageDiv.textContent = `${message.remitente}: ${message.mensaje}`;
                    messagesContainer.appendChild(messageDiv);
                }
            });
        }

        // Envía un mensaje a la base de datos
        var txtMensaje = document.getElementById("mensaje");
        var btnEnviar = document.getElementById("btnEnviar");

        btnEnviar.addEventListener("click", function(){
            const user = auth.currentUser;
            const username = user.email;
            const mensaje = txtMensaje.value;
            const recipient = recipientSelect.value;

            const chatRef = ref(db, 'chat');
            push(chatRef, {
                remitente: username,
                mensaje: mensaje,
                destinatario: recipient,
                read: false,
            });

            txtMensaje.value = '';
        });


        
btnCrearGrupo.addEventListener("click", function(){
    // Aquí puedes agregar la lógica para crear un grupo de chat
    // Por ejemplo, podrías abrir un cuadro de diálogo para que el usuario ingrese el nombre del grupo
    // Y luego agregar ese grupo a la base de datos con una referencia única

    // Después de crear el grupo y guardar los datos en la base de datos, redirige al usuario a la página de grupos
    window.location.href = "grupos.html";
});

btonEditarGrupo.addEventListener("click", function(){
    
    window.location.href = "Editargrupos.html";
});

        // Desconectar al usuario
        const signOutBtn = document.getElementById('signOutBtn');

        signOutBtn.addEventListener('click', () => {
            const user = auth.currentUser;
        
            if (user) {
                // Obtén el token del usuario
                user.getIdToken().then((token) => {
                    // Referencia a la ubicación del campo 'estado' en la base de datos
                    const estadoRef = ref(db, `usuarios/${user.uid}/estado`);
        
                    // Actualizar el campo 'estado' a false
                    const updates = {};
                    updates[`usuarios/${user.uid}/estado`] = false;
        
                    // Llamada a la función update con el objeto de actualización
                    update(ref(db), updates).then(() => {
                        // Desconectar al usuario después de actualizar el estado en la base de datos
                        return signOut(auth);
                    }).then(() => {
                        // Redirige al usuario a la página de inicio de sesión después de desconectar
                        window.location.href = "index.html"; // Cambia esto por la URL de tu página de inicio de sesión
                    }).catch((error) => {
                        console.error("Error al actualizar el estado:", error);
                    });
                });
            }
        });
        