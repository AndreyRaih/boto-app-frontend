import axios from "axios";

export default axios.create({
    baseURL: 'https://dd94-195-78-127-150.ngrok.io/botoapp/us-central1/app/api'
    // baseURL: 'https://us-central1-botoapp.cloudfunctions.net/app/api'
});