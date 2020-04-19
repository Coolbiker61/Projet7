const PLACEHOLDERVALUE = 'Tapez votre commentaire ici'; 

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
    var idMessage = window.location.href.split('/message/')[1];
    if (isNaN(idMessage) || idMessage < 0) {
        return;
    }
    var requete = new XMLHttpRequest();
    requete.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            // si la requête des messages n'a pas retourné d'erreur
            var arrayresponse = JSON.parse(this.responseText);
            addMessage(arrayresponse);
            listenerLike(arrayresponse[0]);
            importLike(arrayresponse[0]);
            importComment(arrayresponse[0]);
            initEditorComment();
            //listenerComment();
        }
    };
    requete.open("GET", "http://localhost:3000/api/v1/message/"+idMessage); 
    requete.setRequestHeader("Content-Type", "application/json");
    requete.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem('token'));
    requete.send();
}

const addMessage = (message) => {
    var html = "<div class=\"message\" id=\""+message[0].id+"\"><div class=\"col_likes\">";
    html += "<i class=\"fas fa-arrow-up like-up-not\"></i>";
    html += "<div class=\"nb-likes\">"+message[0].likes+"</div>";
    html += "<i class=\"fas fa-arrow-down like-down-not\"></i></div>";
    html += "<section class=\"corp\"><header class=\"author\">";
    html += "Posted by "+message[1].username+" il y a ";
    html += editTime(message[0].createdAt); 
    html += "</header><article><header><h3 class=\"title-article\">";
    html += message[0].title;
    html += "</h3></header><p class=\"content-article\">"+message[0].content;
    html += "</p></article></section>";

    html += "<form id=\"comment_noParent\"><div id=\"editor\" >";
    html += "<textarea id=\"no_parent\"></textarea>";
    html += "<button name=\"submitbtn\" id=\"submitbtn\">Publier</button></div></form>";

    html += "<div class=\"bloc-commentaire\"></div></div>";
    //ajoute le html à la page
    document.getElementById("container").insertAdjacentHTML('afterbegin', html); 
}
// ajoute un surveillance des boutons like et de chaque l'article
const listenerLike = (message) => {
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
}
// import les likes
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

// importe les commentaire
const importComment = (message) => {
    var requete = new XMLHttpRequest();
    requete.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            // si la requête des messages n'a pas retourné d'erreur
            var comments = JSON.parse(this.responseText);
            addComment(comments);            
        }
    };
    requete.open("GET", "http://localhost:3000/api/v1/comment/"+message.id);
    requete.setRequestHeader("Content-Type", "application/json");
    requete.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem('token'));
    requete.send();
}

// Ajoute les commentaires a la page
const addComment = (comments) => {
    if (comments.length == 0 ) {
        var html = "Aucun commentaire n'à encore été fait, soyez le premier à réagir à ce message.";
        document.querySelector('.bloc-commentaire').innerHTML = html;
        return;
    }
    
    var listeComment = comments;
    let position;

    while (listeComment.length >0) {
        position = [];
        for (let index = 0; index < listeComment.length; index++) {
            const comment = listeComment[index];
            if (comment.parent == 0) {
                var html = "<div class=\"commentaire\" id=\""+comment.id+"\"><div class=\"com-likes\">";
                html += "<div class=\"trait\"></div></div><div class=\"com-main-0\"><div>";
                html += "crée par "+comment.user.username+" il y a "+editTime(comment.createdAt);//author nblike - date
                html += "</div><div class=\"com-content\">";
                html += comment.content;
                html += "</div><span id=\"response"+comment.id+"\">Répondre</span></div></div>";
                document.querySelector('.bloc-commentaire').insertAdjacentHTML('beforeend', html);
                position.unshift(index);
            }
            if (comment.parent !=0) {
                var html = "<div class=\"commentaire\" id=\""+comment.id+"\"><div class=\"com-likes\">";
                html += "<div class=\"trait\"></div></div><div class=\"com-main-0\"><div>";
                html += "crée par "+comment.user.username+" il y a "+editTime(comment.createdAt);//author nblike - date
                html += "</div><div class=\"com-content\">";
                html += comment.content;
                html += "</div><span id=\"response"+comment.id+"\">Répondre</span></div></div>";
                if (document.getElementById(comment.parent)){
                    if (document.getElementById(comment.parent).querySelector('.com-content')) {
                        document.getElementById(comment.parent).querySelector('.com-content').insertAdjacentHTML('afterend', html); 
                        position.unshift(index);
                    }
                }
            }
        }
        for (const index of position) {
            listeComment.splice(index,1);
        }
        
    }
};

//editeur comment sans parent
const initEditorComment = () => {
    tinymce.init({
        selector: '#no_parent',
        plugins: ' autolink link emoticons autoresize wordcount',
        toolbar: 'alignleft aligncenter alignright | bold italic underline fontsizeselect | emoticons link spellchecker ',
        menubar: '',
        margin: 'auto',
        language: 'fr_FR',
        placeholder: PLACEHOLDERVALUE,
        autoresize: true,

        max_height: 500,
        max_width: 500,
        min_height: 100,
        min_width: 400,
        statusbar: false,

        save_enablewhendirty: true,
        automatic_uploads: false,
        elementpath: false,
        a11y_advanced_options: true,
        
    });

}

const listenerComment = () => {

}
  