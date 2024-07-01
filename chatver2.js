import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';
        import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';
        import { getDatabase, ref, push, onChildAdded, query, equalTo,orderByChild, update  } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js';

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
       // const recipientSelect = document.getElementById('usuarioSeleccionado');
        const messagesContainer = document.getElementById('messages');

        // Espera a que la autenticación se complete antes de actualizar userDisplay
        onAuthStateChanged(auth, (user) => {
            if (user) {
                //userDisplay.textContent = `${user.email}`;
                loadMessages(user.email); // Cargar mensajes para el usuario actual
            }
        });
        
        
        // Obtén la lista de usuarios de Firebase y agrégala como elementos en la lista HTML
const usersList = document.querySelector('.contacts'); // Cambia esto según tu HTML

const usersRef = ref(db, 'usuarios');


onChildAdded(usersRef, (snapshot) => {
    const user = snapshot.val();
    const currentUser = auth.currentUser;

    // Filtrar el usuario actual y por estado
    if (currentUser && user.email !== currentUser.email) {
        // Crear un elemento de lista para cada usuario
        const listItem = document.createElement('li');
        listItem.classList.add('d-flex', 'bd-highlight');

        // Contenido de cada elemento de lista
        listItem.innerHTML = `
            <div class="img_cont">
                <img src="https://i.pinimg.com/564x/53/e2/de/53e2de66257f04782768afcd09a5fc9d.jpg" class="rounded-circle user_img">
                <span class="${user.estado ? 'online_icon' : 'offline_icon'}" ></span>
            </div>
            <div class="user_info">
                <span class= "usuarioSeleccionado" class= "usuarioSeleccionado" data-email="${user.email}">${user.usuario}</span>
                <p>${user.estado ? 'Online' : 'Offline'}</p>
            </div>
        `;

        // Agregar el elemento de lista a la lista de usuarios
        usersList.appendChild(listItem);
    }
});



// Función para actualizar el contenido de la tarjeta de chat con el usuario seleccionado
function updateChatCard(username) {
    const chatCard = document.getElementById('chatCard');
    if (chatCard) {
        const userDisplay = chatCard.querySelector('.usuarioSeleccionado');
        if (userDisplay) {
            userDisplay.textContent = username;
            document.querySelector('.contacts').addEventListener('click', (event) => {
                const listItem = event.target.closest('li');
                if (listItem) {
                    const username = listItem.querySelector('.usuarioSeleccionado').textContent;
                    updateChatCard(username);
                    
                    // Llama a loadMessages para cargar y mostrar los mensajes del usuario seleccionado
                    loadMessages(username);
                }
            });
        }
    }
}

        // Función para cargar mensajes
        function loadMessages(recipientEmail) {
            
            
            const chatRef = ref(db, 'chat');
            messagesContainer.innerHTML = '';
        
            // Crea una consulta ordenada por el campo 'timestamp'
            const messagesQuery = query(chatRef, orderByChild('timestamp'));
        
            onChildAdded(messagesQuery, (snapshot) => {
                const message = snapshot.val();
                
        
                const user = auth.currentUser;
        
                if (user && (message.destinatario === user.email || message.remitente === user.email)) {
                    if (message.destinatario === recipientEmail || message.remitente === recipientEmail) {
                        const messageDiv = document.createElement('div');
                        messageDiv.textContent = `${message.remitente}: ${message.mensaje}`;
                        messagesContainer.appendChild(messageDiv);
                    }
                }
            });
        }
        
        
        
        document.querySelector('.contacts').addEventListener('click', (event) => {
    const listItem = event.target.closest('li');
    if (listItem) {
        const userEmail = listItem.querySelector('.usuarioSeleccionado').dataset.email;
        
        // Llama a loadMessages para cargar y mostrar los mensajes del usuario seleccionado
        loadMessages(userEmail);
        console.log("correo: ", userEmail);
        // Actualiza el contenido de la tarjeta de chat con el usuario seleccionado
        updateChatCard(userEmail);
    }
});

        

        // Envía un mensaje a la base de datos
var txtMensaje = document.getElementById("mensaje");
var btnEnviar = document.getElementById("btnEnviar");

btnEnviar.addEventListener("click", function(){
    const user = auth.currentUser;
    const mensaje = txtMensaje.value;
    
    // Obtener el destinatario desde el elemento con la clase usuarioSeleccionado
    const recipientElement = document.querySelector('.usuarioSeleccionado');
    const recipient = recipientElement ? recipientElement.dataset.email : null;

    if (recipient) {
        console.log("remitente: ", user.email);
        console.log("destinatario: ", recipient);

        const chatRef = ref(db, 'chat');
        push(chatRef, {
            remitente: user.email,
            mensaje: mensaje,
            destinatario: recipient,
            read: false,
        });

        txtMensaje.value = '';
    } else {
        console.error("No se pudo obtener el destinatario.");
    }
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
        