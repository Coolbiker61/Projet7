// au chargement de la page
document.onreadystatechange = function () {
    if (document.readyState == 'complete') { 
        // verifie si un token est present dans le sessionStorage
        if (sessionStorage.getItem('token')) {
            var requete = new XMLHttpRequest();
			requete.onreadystatechange = function () {
				if (this.readyState == XMLHttpRequest.DONE && this.status != 200) {
                    alert("Vous avez été déconnecté. Vous aller être rediriger vers la page de connexion.");
					window.setTimeout(() => { window.location.href = '/auth/login';}, 2000);
				} else if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                    // si la requête du profil n'a pas retourné d'erreur
                    document.getElementById("username").innerHTML = JSON.parse(this.responseText).username;
                    document.getElementById("loading").hidden = true;
                    document.getElementById("container").hidden = false;
                    importUsers();
                }
			};
			requete.open("GET", "http://localhost:3000/api/v1/auth/profil");
			requete.setRequestHeader("Content-Type", "application/json");
			requete.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem('token'));
			requete.send();
			
        } else {
            window.setTimeout(() => { window.location.href = '/auth/login';}, 200);
        }
    };
};

const addProfileUser = (id) => {
    var html = "";
    html += id;
    document.getElementById("bloc-users-profile").innerHTML = html;
}

const addUserListe = (usersListe) => {
    
    if (usersListe.length >= 1) {
        for (let i = 0; i < usersListe.length; i++) {
            var html = "<li class=\"li-users-liste\" id=\""+usersListe[i].id+"\">";
            html += usersListe[i].username;
            html += "</li>";
            document.querySelector(".bloc-users-liste").insertAdjacentHTML('beforeend', html);
            document.getElementById(usersListe[i].id).addEventListener('click', function (event) {
                addProfileUser(event.target.id);
            })
        }
    }
};


const importUsers = () => {
    var requete = new XMLHttpRequest();
    requete.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            // si la requête des messages n'a pas retourné d'erreur
            var arrayresponse = JSON.parse(this.responseText);
            addUserListe(arrayresponse);
        }
    };
    requete.open("GET", "http://localhost:3000/api/v1/auth/users"); 
    requete.setRequestHeader("Content-Type", "application/json");
    requete.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem('token'));
    requete.send();
}

