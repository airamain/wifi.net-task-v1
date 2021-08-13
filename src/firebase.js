import app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyA_iKpL9hPPOEqL_wBITciPfu12gdYMWAo",
    authDomain: "crud-react-firestore-d9b2c.firebaseapp.com",
    projectId: "crud-react-firestore-d9b2c",
    storageBucket: "crud-react-firestore-d9b2c.appspot.com",
    messagingSenderId: "462561666705",
    appId: "1:462561666705:web:0caf1643a38834c0e64130"
};
// Initialize Firebase
app.initializeApp(firebaseConfig);

const db = app.firestore()
const auth = app.auth()

export { db, auth }