import axios from "axios";

export default axios.create({
    baseURL: 'https://c19c-195-78-127-193.ngrok.io/botoapp/us-central1/app/api'
});