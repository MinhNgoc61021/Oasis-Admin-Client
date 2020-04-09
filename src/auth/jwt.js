export function getToken() {
    return JSON.parse(localStorage.getItem('jwt-from-api'));
}

export function authHeader() {
    let jwt = JSON.parse(getToken());
    // console.log(user.token);
    if (isTokenValid(jwt))
        return 'Bearer: ' + jwt.token; // send encoded jwt token
}

export function isTokenValid(jwt) {
    return jwt.split('.').length >= 3;
}
