import axios from "axios";

export default axios.create({
    baseURL: 'https://1ef4-195-78-127-197.ngrok.io/botoapp/us-central1/app/api'
    // baseURL: 'https://us-central1-botoapp.cloudfunctions.net/app/api'
});