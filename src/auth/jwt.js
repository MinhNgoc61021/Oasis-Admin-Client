export function getToken() {
    return JSON.parse(localStorage.getItem('jwt-from-api'));
}

export function authHeader() {
    let jwt = localStorage.getItem('jwt-from-api');
    if (isTokenValid(jwt)) {
        return 'Bearer: ' + JSON.parse(jwt).token; // send encoded jwt token
    }
}

export function isTokenValid(jwt) {
    return jwt.split('.').length >= 3;
}

export function removeToken() {
    localStorage.removeItem('jwt-from-api')
}
