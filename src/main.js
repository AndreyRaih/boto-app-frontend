import { createApp } from 'vue'
import { createMetaManager } from 'vue-meta'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import firebase from "firebase";
import './styles/main.stylus';

const firebaseConfig = {
    apiKey: "AIzaSyC34zmQa3R0mWoIslxnxTeyp0l5ppATx2w",
    authDomain: "botoapp.firebaseapp.com",
    projectId: "botoapp",
    storageBucket: "botoapp.appspot.com",
    messagingSenderId: "351920932323",
    appId: "1:351920932323:web:0c4d0ca5ed43073b1accd6"
}

firebase.initializeApp(firebaseConfig)

const app = createApp(App);
app.use(store).use(router).use(createMetaManager()).mount('#app')
