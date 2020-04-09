import axios from 'axios';

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
