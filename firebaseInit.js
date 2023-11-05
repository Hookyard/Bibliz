// Importation des bibliothèques nécessaires
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Configuration de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAgFbMUel0ySk_brhuBq8GMXK2FbOIkRbk",
    authDomain: "bibliz-f9be0.firebaseapp.com",
    projectId: "bibliz-f9be0",
    storageBucket: "bibliz-f9be0.appspot.com",
    messagingSenderId: "1048096721817",
    appId: "1:1048096721817:web:cd3eef47bf9cafb51fa108",
    measurementId: "G-FDNN3XWQ6S"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Accès à Firestore
const db = getFirestore(app);

class FirebaseInit {
    constructor() {
        this.db = db;
    }

    async getStarPositions() {
        // Récupération des données de la collection 'stars'
        const snapshot = await getDocs(collection(this.db, 'stars'));
        const starPositions = snapshot.docs.map(doc => {
            const data = doc.data();
            return { x: data.x, y: data.y, z: data.z };
        });
        return starPositions;
    }
}

export default FirebaseInit;
