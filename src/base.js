import Rebase from 're-base';
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDOMtGaKi0KByxihb9etAxTXv2mX743LoE",
    authDomain: "lockdownpoker-1b47c.firebaseapp.com",
    databaseURL: "https://lockdownpoker-1b47c.firebaseio.com",
    // projectId: "lockdownpoker-1b47c",
    // storageBucket: "lockdownpoker-1b47c.appspot.com",
    // messagingSenderId: "72343969088",
    // appId: "1:72343969088:web:7fa1752b676ee93c74eea5",
    // measurementId: "G-LHWYCSRMTQ"
  })

const base = Rebase.createClass(firebaseApp.database());

export { firebaseApp };

export default base;
