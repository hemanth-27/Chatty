import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var config = {
    apiKey: "AIzaSyBzJoIMwmrdS2eR7jtvCy_4zs22wfVuYWo",
    authDomain: "mychatapp-86ee9.firebaseapp.com",
    databaseURL: "https://mychatapp-86ee9-default-rtdb.firebaseio.com/",
    projectId: "mychatapp-86ee9",
    storageBucket: "gs://mychatapp-86ee9.appspot.com",
}
firebase.initializeApp(config);
export const auth = firebase.auth;
export const db = firebase.database();

export default firebase;