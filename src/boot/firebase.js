// firebase app SDK is always required
import * as firebase from 'firebase/app'

// add firebase products
import 'firebase/auth'
import 'firebase/database'

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyC5ykzMOizgs43ytrOxxufzIT6Y1H9_xl4',
  authDomain: 'chatci2.firebaseapp.com',
  databaseURL: 'https://chatci2.firebaseio.com',
  projectId: 'chatci2',
  storageBucket: 'chatci2.appspot.com',
  messagingSenderId: '397342118839',
  appId: '1:397342118839:web:dc2436e7331b8eb5884e32'
}
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig)
const firebaseAuth = firebase.auth()
const firebaseDb = firebase.database()

export {
  firebaseApp,
  firebaseDb,
  firebaseAuth
}
