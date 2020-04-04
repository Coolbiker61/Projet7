// au chargement de la page
document.onreadystatechange = function () {
    if (document.readyState == 'complete') { 
        // verifie si un token est present dans le sessionStorage
        if (sessionStorage.getItem('token')) {
        } else {
            window.setTimeout(() => { window.location.href = '/auth/login';}, 200);
        }
    };
};