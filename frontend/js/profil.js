const editTime = (param) => {
    // format de la base 2020-04-02T22:19:43.000Z
    const date = Date.parse(param);
    const dateNow = Date.now();
    var difference = dateNow - date;
    difference /= 1000;
    difference = Math.trunc(difference);
    let seconde = difference % 60;
    difference -= seconde; 
    difference /= 60;
    let minute = difference % 60;
    difference -= minute;
    difference /= 60;
    let heure = difference % 24;
    difference -= heure;
    difference /= 24;
    let day = difference;

    if (day) {
        return day+" jours";
    } else if (heure) {
        return heure+" heures";
    } else if (minute) {
        return minute+" minutes";
    } else {
        return seconde+" secondes";
    }
}

const importeMessage = (id) => {
    var requete = new XMLHttpRequest();
    requete.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status != 200) {
            alert("Vous avez été déconnecté. Vous aller être rediriger vers la page de connexion.");
            window.setTimeout(() => { window.location.href = '/auth/login';}, 2000);
        } else if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            // si la requête des messages n'a pas retourné d'erreur
            var arrayMessage = JSON.parse(this.responseText);
            for (const message of arrayMessage) {
                addMessage(message);
            }
            document.getElementById("loading").hidden = true;
            document.getElementById("profile").style.visibility = "visible";
        }
    };
    requete.open("GET", "http://localhost:3000/api/v1/message/user/"+id+"?limit=5");
    requete.setRequestHeader("Content-Type", "application/json");
    requete.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem('token'));
    requete.send();
}

const addMessage = (message) => {

    var html = "<div class=\"message\" id=\""+message.id+"\"><div class=\"col_likes\"><i class=\"fas fa-arrow-up like-up-not\"></i>";
    html += "<div class=\"nb-likes\">"+message.likes+"</div>";
    html += "<i class=\"fas fa-arrow-down like-down-not\"></i></div>";
    html += "<section class=\"corp\"><header class=\"author\">";
    html += "Il y a ";
    html += editTime(message.createdAt); 
    html += "</header><article><header><h3 class=\"title-article\">";
    html += message.title;
    html += "</h3></header><p class=\"content-article\">"+message.content;
    html += "</p></article></section></div>";

    document.getElementById("liste_message").insertAdjacentHTML('beforeend', html);
}

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
                    var response = JSON.parse(this.responseText);
                    document.getElementById("username").innerHTML = response.username;
                    if (response.isAdmin) {
                        var html = "<div class=\"menu_profil_ligne\"><a href=\"/admin/users\">Administration</a></div>";
                        document.getElementById('logout').insertAdjacentHTML("beforebegin", html);
                    }
                    document.getElementById("mini_username").innerHTML = response.username;
                    importeMessage(response.id);
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

