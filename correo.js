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
