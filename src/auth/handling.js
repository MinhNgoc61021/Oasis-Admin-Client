import axios from 'axios';
import {authHeader} from "@/auth/jwt";

export async function signIn(username, password) {
    try {
        const response = await axios({
            url: `${process.env.VUE_APP_API_URL}/auth/sign-in`,
            method: 'post',
            data: {
                username: username,
                password: password,
            },
            changeOrigin: true,
        });
        localStorage.setItem('jwt-from-api', JSON.stringify(response.data));
        return response;
    } catch (e) {
        return e.response;
    }
}

export async function getData() {
    try {
        console.log('BEBE');
        return await axios({
            url: `${process.env.VUE_APP_API_URL}/auth/get-personal-data`,
            method: 'get',
            headers: { 'Authorization': authHeader() },
            changeOrigin: true,
        });
    } catch (e) {
        console.log(e);
        return e.response;
    }
}
