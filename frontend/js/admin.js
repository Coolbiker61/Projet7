const editTime = (param) => {
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
// au chargement de la page
document.onreadystatechange = function () {
    if (document.readyState == 'complete') { 
        // vérifie si un token est présent dans le sessionStorage
        if (sessionStorage.getItem('token')) {
            var requete = new XMLHttpRequest();
			requete.onreadystatechange = function () {
				if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
                    var html = "<p class=\"error\">Une erreur interne est survenue, veuillez nous excuser pour la géne occasionné.<br />";
                    html += "Notre équipe fait de son mieux pour corriger le problème.</p>";
                    document.querySelector('#container').insertAdjacentHTML('afterbegin', html);
                } else if (this.readyState == XMLHttpRequest.DONE && this.status == 401 || this.status == 404) {
                    alert("Vous avez été déconnecté. Vous aller être rediriger vers la page de connexion.");
					window.setTimeout(() => { window.location.href = '/auth/login';}, 2000);
				} else if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                    // si la requête du profil n'a pas retourné d'erreur
                    var response = JSON.parse(this.responseText);
                    document.getElementById("username").innerHTML = response.username;
                    if (response.isAdmin) {
                        var html = "<div class=\"menu_profil_ligne\"><a href=\"/admin/users\">Administration</a></div>";
                        document.getElementById('logout').insertAdjacentHTML("beforebegin", html);
                    } else {
                        window.location.href = '/';
                    }   
                    //définition de la taille du offset par rapport a celle du menu
                    document.querySelector('.offset-top').style.height = document.querySelector('nav').offsetHeight+"px";
                
                    importUsers();
                    document.getElementById("loading").hidden = true;
                    document.getElementById("container").hidden = false;
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

const addProfileUser = (response) => {
    var html = "<div class=\"users-details\" ><h2>Détails du compte</h2> ";
    html += "<ul><li><span class=\"bold\">Pseudo : </span>"+response.username+"</li>";
    html += "<li><span class=\"bold\">Email : </span>"+response.email+"</li>";
    html += "<li><span class=\"bold\">Inscrit il y a : </span>"+editTime(response.createdAt)+"</li>";
    html += "<li><span class=\"bold\">Rôle : </span>";
    if (response.isAdmin) {
        html += "Administrateur";
    } else {
        html += "Utilisateur";
    }
    html += "</li><li><button id=\"admin_delete_account\" class=\"btn\">Supprimer ce compte</button></li>";
    html += "</ul></div>";
    html += "<div class=\"users-details\" ><h2>Les 5 derniers messages de cet utilisateur</h2>";
    if (response.Messages.length == 0) {
        html += "Cet utilisateur n'as poster aucun message.";
    } else {
        for (let i = 0; i < response.Messages.length; i++) {
            var message = response.Messages[i];
            html += "<div class=\"users-article\" ><div class=\"author\"><span class=\"bold\">Titre :</span> "+message.title;
            html += " | Il y a "+editTime(message.createdAt);
            html += "</div><div class=\"content-article\">"+message.content;
            html += "</div></div>";
        }
    }
    html += "</div>";
    html += "<div class=\"users-details\" ><h2>Les 5 derniers commentaires de cette utilisateur</h2>"
    if (response.Comments.length == 0) {
        html += "Cet utilisateur n'as poster aucun commentaire.";
    } else {
        for (let i = 0; i < response.Comments.length; i++) {
            var comment = response.Comments[i];
            html += "<div class=\"users-reply\" ><div class=\"author\">";
            html += "Il y a "+editTime(comment.createdAt);
            html += "</div><div class=\"content-article\">"+comment.content;
            html += "</div></div>";
        }
    }
    html += "</div>";
    document.getElementById("bloc-users-profile").innerHTML = html;
    window.scrollTo({behavior: "smooth",top: (document.getElementById("bloc-users-profile").offsetTop - (10 + document.querySelector('.offset-top').offsetHeight) ), right: 0 });
    document.getElementById('admin_delete_account').addEventListener('click', function (event){
        console.log(event+' '+response.id);
        window.location.href = '/admin/users/delete/'+response.id;
    })
}

const importUsersDetail = (id) => {
    var requete = new XMLHttpRequest();
    requete.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
            var html = "<p class=\"error\">Une erreur interne est survenue, veuillez nous excuser pour la géne occasionné.<br />";
            html += "Notre équipe fait de son mieux pour corriger le problème.</p>";
            document.querySelector('#container').insertAdjacentHTML('afterbegin', html);
        } else if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            // si la requête des messages n'a pas retourné d'erreur
            var response = JSON.parse(this.responseText);
            addProfileUser(response);
        } else if (this.readyState == XMLHttpRequest.DONE && this.status != 200) {
            console.log(this.responseText);
        }
    };
    requete.open("GET", "http://localhost:3000/api/v1/auth/users/"+id); 
    requete.setRequestHeader("Content-Type", "application/json");
    requete.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem('token'));
    requete.send();
}

const addUserListe = (usersListe) => {
    
    if (usersListe.length >= 1) {
        for (let i = 0; i < usersListe.length; i++) {
            var html = "<li class=\"li-users-liste\" id=\""+usersListe[i].id+"\">";
            html += usersListe[i].username;
            html += "</li>";
            document.querySelector(".users-liste").insertAdjacentHTML('beforeend', html);
            document.getElementById(usersListe[i].id).addEventListener('click', function (event) {
                importUsersDetail(event.target.id);
            })
        }
    }
};


const importUsers = () => {
    var requete = new XMLHttpRequest();
    requete.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
            var html = "<p class=\"error\">Une erreur interne est survenue, veuillez nous excuser pour la géne occasionné.<br />";
            html += "Notre équipe fait de son mieux pour corriger le problème.</p>";
            document.querySelector('#container').insertAdjacentHTML('afterbegin', html);
        } else if (this.readyState == XMLHttpRequest.DONE && this.status == 401 || this.status == 404) {
            if (this.responseText == 'User is not admin !') {
                window.location.href = '/';
            }
        } else if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
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

