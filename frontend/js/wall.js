let LAST_MESSAGE_ID = 0;
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
                    document.getElementById("loading").hidden = true;
                    document.getElementById("back").hidden = false;
                    document.getElementById("username").innerHTML = JSON.parse(this.responseText).username;
                    importMessage();
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

const importMessage = () => {
    var requete = new XMLHttpRequest();
    requete.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            // si la requête des messages n'a pas retourné d'erreur
            var arrayMessage = JSON.parse(this.responseText);
            for (const message of arrayMessage) {
                addMessage(message);
                listener(message);
                importLike(message);
            }
            
        }
    };
    requete.open("GET", "http://localhost:3000/api/v1/message");
    requete.setRequestHeader("Content-Type", "application/json");
    requete.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem('token'));
    requete.send();
}
// ajoute un message à la fin de ceux present
const addMessage = (message) => {
    var html = "<div class=\"message\" id=\""+message.id+"\"><div class=\"col_likes\">";
    html += "<i class=\"fas fa-arrow-up like-up-not\"></i>";
    html += "<div class=\"nb-likes\">"+message.likes+"</div>";
    html += "<i class=\"fas fa-arrow-down like-down-not\"></i></div>";
    html += "<section class=\"corp\"><header class=\"author\">";
    html += "Posted by "+message.User.username+" le : ";
    var date = message.createdAt.split('T');
    html += date[0]+" à "+date[1]; 
    html += "</header><article><header><h3 class=\"title-article\">";
    html += message.title;
    html += "</h3></header><p class=\"content-article\">"+message.content;
    html += "</p></article></section></div>";
    //ajoute le html à la page
    document.getElementById("container").insertAdjacentHTML('beforeend', html); 
}

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
                if (this.readyState == XMLHttpRequest.DONE && this.status == 201) {
                    doc.querySelector('.like-up-not').classList.remove("like-up-select");
                    doc.querySelector('.nb-likes').innerHTML--;
                }
            };
            requete.open("POST", "http://localhost:3000/api/v1/message/"+message.id+"/like/0");
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
            if (this.readyState == XMLHttpRequest.DONE && this.status == 201) {
                doc.querySelector('.like-up-not').classList.add("like-up-select");
                if (doc.querySelector('.like-down-not').classList.contains("like-down-select")) {
                    doc.querySelector('.like-down-not').classList.remove("like-down-select");
                }
                doc.querySelector('.nb-likes').innerHTML = JSON.parse(this.responseText).likes;
            }
        };
        requete.open("POST", "http://localhost:3000/api/v1/message/"+message.id+"/like/1");
        requete.setRequestHeader("Content-Type", "application/json");
        requete.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem('token'));
        requete.responseType = 'text';
        requete.send();
    });
    // event dislike
    doc.querySelector('.like-down-not').addEventListener("click", function (event) {
        event.stopPropagation();
        // si il a deja été dislike
        if (doc.querySelector('.like-down-not').classList.contains("like-down-select")) {
            var requete = new XMLHttpRequest();
            // écoute des changement d'état de l'envoie *
            requete.onreadystatechange = function () {
                if (this.readyState == XMLHttpRequest.DONE && this.status == 201) {
                    //quand il a fini la requête avec le code http 201
                    doc.querySelector('.like-down-not').classList.remove("like-down-select");
                    doc.querySelector('.nb-likes').innerHTML++;
                }
            };
            requete.open("POST", "http://localhost:3000/api/v1/message/"+message.id+"/like/0");
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
            if (this.readyState == XMLHttpRequest.DONE && this.status == 201) {
                //quand il a fini la requête avec le code http 201
                doc.querySelector('.like-down-not').classList.add("like-down-select");
                if (doc.querySelector('.like-up-not').classList.contains("like-up-select")) {
                    doc.querySelector('.like-up-not').classList.remove("like-up-select");
                }
                doc.querySelector('.nb-likes').innerHTML = JSON.parse(this.responseText).likes;
            }
        };
        requete.open("POST", "http://localhost:3000/api/v1/message/"+message.id+"/like/-1");
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
        }
        window.location.href = "/socialNetwork/message/"+idMessage;
    });
}

const importLike = (message) => {
    var requete = new XMLHttpRequest();
    requete.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
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
    requete.open("GET", "http://localhost:3000/api/v1/message/"+message.id+"/like/");
    requete.setRequestHeader("Content-Type", "application/json");
    requete.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem('token'));
    requete.send();
}



// ecoute le bouton nouveau message
document.getElementById("btn_new_post").addEventListener("click", function (event) {
    window.location.href = "/socialNetwork/new";
})