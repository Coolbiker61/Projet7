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
        if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
            var html = "<p class=\"error\">Une erreur interne est survenue, veuillez nous excuser pour la géne occasionné.<br />";
            html += "Notre équipe fait de son mieux pour corriger le problème.</p>";
            document.querySelector('.back').insertAdjacentHTML('afterbegin', html);
        } else if (this.readyState == XMLHttpRequest.DONE && this.status == 404) {
            var html = "Vous n'avez posté aucun message."
            document.getElementById("liste_message").insertAdjacentHTML('beforeend', html);
            document.getElementById("loading").hidden = true;
            document.querySelector(".back").style.visibility = "visible";
        } else if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            // si la requête des messages n'a pas retourné d'erreur
            var arrayMessage = JSON.parse(this.responseText);
            for (const message of arrayMessage) {
                addMessage(message);
                listener(message);
                importLike(message);
            }
            document.getElementById("loading").hidden = true;
            document.querySelector(".back").style.visibility = "visible";
        }
    };
    requete.open("GET", "http://"+HOST_ADDRESS+"/api/v1/message/user/"+id+"?limit=5");
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
        // verifie si un token est présent dans le sessionStorage
        if (sessionStorage.getItem('token')) {
            var requete = new XMLHttpRequest();
			requete.onreadystatechange = function () {
                if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
                    var html = "<p class=\"error\">Une erreur interne est survenue, veuillez nous excuser pour la géne occasionné.<br />";
                    html += "Notre équipe fait de son mieux pour corriger le problème.</p>";
                    document.getElementById("container").insertAdjacentHTML('beforeend', html);
                } else if (this.readyState == XMLHttpRequest.DONE && this.status != 200) {

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
                    //définition de la taille du offset par rapport a celle du menu
                    document.querySelector('.offset-top').style.height = document.querySelector('nav').offsetHeight+"px";
                    importeMessage(response.id);
                }
			};
			requete.open("GET", "http://"+HOST_ADDRESS+"/api/v1/auth/profil");
			requete.setRequestHeader("Content-Type", "application/json");
			requete.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem('token'));
			requete.send();
			
        } else {
            window.setTimeout(() => { window.location.href = '/auth/login';}, 200);
        }
    };
};

// ajoute un surveillance des boutons like et de chaque l'article
const listener = (message) => {
    var doc = document.getElementById(message.id);
    //event like 
    doc.querySelector('.like-up-not').addEventListener("click", function (event) {
        event.stopPropagation();      
        if (doc.querySelector('.like-up-not').classList.contains("like-up-select")) {
            //envoie la requête et modifie l'affichage en conséquence
            var requete = new XMLHttpRequest();
            // écoute des changement d'état de l'envoie 
            requete.onreadystatechange = function () {
                if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
                    var html = "<p class=\"error\">Une erreur interne est survenue, veuillez nous excuser pour la géne occasionné.<br />";
                    html += "Notre équipe fait de son mieux pour corriger le problème.</p>";
                    document.querySelector('.back').insertAdjacentHTML('afterbegin', html);
                } else if (this.readyState == XMLHttpRequest.DONE && this.status == 201) {
                    doc.querySelector('.like-up-not').classList.remove("like-up-select");
                    doc.querySelector('.nb-likes').innerHTML--;
                }
            };
            requete.open("POST", "http://"+HOST_ADDRESS+"/api/v1/message/"+message.id+"/like/0");
            requete.setRequestHeader("Content-Type", "application/json");
            requete.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem('token'));
            requete.responseType = 'text';
            requete.send();
            return;
        }
        
        //envoie la requête et modifie l'affichage en conséquence
        var requete = new XMLHttpRequest();
        // écoute des changement d'état de l'envoie 
        requete.onreadystatechange = function () {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
                var html = "<p class=\"error\">Une erreur interne est survenue, veuillez nous excuser pour la géne occasionné.<br />";
                html += "Notre équipe fait de son mieux pour corriger le problème.</p>";
                document.querySelector('.back').insertAdjacentHTML('afterbegin', html);
            } else if (this.readyState == XMLHttpRequest.DONE && this.status == 201) {
                doc.querySelector('.like-up-not').classList.add("like-up-select");
                if (doc.querySelector('.like-down-not').classList.contains("like-down-select")) {
                    doc.querySelector('.like-down-not').classList.remove("like-down-select");
                }
                doc.querySelector('.nb-likes').innerHTML = JSON.parse(this.responseText).likes;
            }
        };
        requete.open("POST", "http://"+HOST_ADDRESS+"/api/v1/message/"+message.id+"/like/1");
        requete.setRequestHeader("Content-Type", "application/json");
        requete.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem('token'));
        requete.responseType = 'text';
        requete.send();
    });
    // event dislike
    doc.querySelector('.like-down-not').addEventListener("click", function (event) {
        event.stopPropagation();
        // si il a déjà été dislike
        if (doc.querySelector('.like-down-not').classList.contains("like-down-select")) {
            var requete = new XMLHttpRequest();
            // écoute des changement d'état de l'envoie *
            requete.onreadystatechange = function () {
                if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
                    var html = "<p class=\"error\">Une erreur interne est survenue, veuillez nous excuser pour la géne occasionné.<br />";
                    html += "Notre équipe fait de son mieux pour corriger le problème.</p>";
                    document.querySelector('.back').insertAdjacentHTML('afterbegin', html);
                } else if (this.readyState == XMLHttpRequest.DONE && this.status == 201) {
                    //quand il a fini la requête avec le code http 201
                    doc.querySelector('.like-down-not').classList.remove("like-down-select");
                    doc.querySelector('.nb-likes').innerHTML++;
                }
            };
            requete.open("POST", "http://"+HOST_ADDRESS+"/api/v1/message/"+message.id+"/like/0");
            requete.setRequestHeader("Content-Type", "application/json");
            requete.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem('token'));
            requete.responseType = 'text';
            requete.send();
            return;
        }
        //envoie la requête et modifie l'affichage en conséquence
        var requete = new XMLHttpRequest();
        // écoute des changement d'état de l'envoie *
        requete.onreadystatechange = function () {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
                var html = "<p class=\"error\">Une erreur interne est survenue, veuillez nous excuser pour la géne occasionné.<br />";
                html += "Notre équipe fait de son mieux pour corriger le problème.</p>";
                document.querySelector('.back').insertAdjacentHTML('afterbegin', html);
            } else if (this.readyState == XMLHttpRequest.DONE && this.status == 201) {
                //quand il a fini la requête avec le code http 201
                doc.querySelector('.like-down-not').classList.add("like-down-select");
                if (doc.querySelector('.like-up-not').classList.contains("like-up-select")) {
                    doc.querySelector('.like-up-not').classList.remove("like-up-select");
                }
                doc.querySelector('.nb-likes').innerHTML = JSON.parse(this.responseText).likes;
            }
        };
        requete.open("POST", "http://"+HOST_ADDRESS+"/api/v1/message/"+message.id+"/like/-1");
        requete.setRequestHeader("Content-Type", "application/json");
        requete.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem('token'));
        requete.responseType = 'text';
        requete.send();
    });
    document.getElementById(message.id).addEventListener("click", function (event) {
        event.stopPropagation();
        let idMessage = 0;
        if (event.target.getAttribute('id')) {
            idMessage = event.target.getAttribute('id');
        } else if (event.target.parentElement.getAttribute('id')) {
            idMessage = event.target.parentElement.getAttribute('id');
        } else if (event.target.parentElement.parentElement.getAttribute('id')) {
            idMessage = event.target.parentElement.parentElement.getAttribute('id');
        } else if (event.target.parentElement.parentElement.parentElement.getAttribute('id')) {
            idMessage = event.target.parentElement.parentElement.parentElement.getAttribute('id');
        } else if (event.target.parentElement.parentElement.parentElement.parentElement.getAttribute('id')) {
            idMessage = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute('id');
        } else if (event.target.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('id')) {
            idMessage = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('id');
        } else if (event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('id')) {
            idMessage = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('id');
        }
        window.location.href = "/socialNetwork/message/"+idMessage;
    });
}

const importLike = (message) => {
    var requete = new XMLHttpRequest();
    requete.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
            var html = "<p class=\"error\">Une erreur interne est survenue, veuillez nous excuser pour la géne occasionné.<br />";
            html += "Notre équipe fait de son mieux pour corriger le problème.</p>";
            document.querySelector('.back').insertAdjacentHTML('afterbegin', html);
        } else if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            // si la requête des messages n'a pas retourné d'erreur
            var like = JSON.parse(this.responseText);
            var doc = document.getElementById(message.id);
            if (like.likeType == -1) {
                doc.querySelector('.like-down-not').classList.add("like-down-select");
            } else if (like.likeType == 1) {
                doc.querySelector('.like-up-not').classList.add("like-up-select");
            }
            
        }
    };
    requete.open("GET", "http://"+HOST_ADDRESS+"/api/v1/message/"+message.id+"/like/");
    requete.setRequestHeader("Content-Type", "application/json");
    requete.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem('token'));
    requete.send();
}

