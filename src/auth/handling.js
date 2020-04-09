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
        return response;

    } catch (e) {
        console.log(e);
        return e.response;
    }
}
