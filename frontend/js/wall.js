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
        if (this.readyState == XMLHttpRequest.DONE && this.status != 200) {
            alert("Vous avez été déconnecté. Vous aller être rediriger vers la page de connexion.");
            window.setTimeout(() => { window.location.href = '/auth/login';}, 2000);
        } else if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            // si la requête des messages n'a pas retourné d'erreur
            var arrayMessage = JSON.parse(this.responseText);
            for (const message of arrayMessage) {
                addMessage(message);
                listener(message);
            }
            
        }
    };
    requete.open("GET", "http://localhost:3000/api/v1/message");
    requete.setRequestHeader("Content-Type", "application/json");
    requete.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem('token'));
    requete.send();
}

const addMessage = (message) => {

    var html = "<div class=\"message\" id=\""+message.id+"\"><div class=\"col_likes\"><i class=\"fas fa-arrow-up like-up-not\"></i>";
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

document.getElementById("btn_new_post").addEventListener("click", function (event) {
    window.location.href = "/socialNetwork/new";
})
// ajoute un surveillance des boutons like et de l'article
const listener = (message) => {
    var doc = document.getElementById(message.id);
    doc.querySelector('.like-up-not').addEventListener("click", function (event) {
        event.stopPropagation();
        console.log('like'+event.target.parentElement.parentElement.getAttribute('id'));
    });
    doc.querySelector('.like-down-not').addEventListener("click", function (event) {
        event.stopPropagation();
        console.log("dislike"+event.target.parentElement.parentElement.getAttribute('id'));
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
        console.log(idMessage);
        //window.location.href = "/socialNetwork/message:"+idMessage;
    });
}