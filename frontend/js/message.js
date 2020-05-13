
const PLACEHOLDERVALUE = 'Tapez votre commentaire ici'; 
var USER = "";
let MESSAGE = [];
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
        // vérifie si un token est présent dans le sessionStorage
        if (sessionStorage.getItem('token')) {
            var requete = new XMLHttpRequest();
			requete.onreadystatechange = function () {
				if (this.readyState == XMLHttpRequest.DONE && this.status != 200) {
                    alert("Vous avez été déconnecté. Vous aller être rediriger vers la page de connexion.");
					window.setTimeout(() => { window.location.href = '/auth/login';}, 2000);
				} else if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                    // si la requête du profil n'a pas retourné d'erreur
                    var response = JSON.parse(this.responseText);
                    USER = response;
                    document.getElementById("username").innerHTML = response.username;
                    if (response.isAdmin) {
                        var html = "<div class=\"menu_profil_ligne\"><a href=\"/admin/users\">Administration</a></div>";
                        document.getElementById('logout').insertAdjacentHTML("beforebegin", html);
                    }
                    //definition de la taille du offset par rapport a celle du menu
                    document.querySelector('.offset-top').style.height = document.querySelector('nav').offsetHeight+"px";
                    importMessage(response);
                    document.getElementById("loading").hidden = true;
                    document.getElementById("back").style.setProperty('visibility', 'visible');
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

const importMessage = (user) => {
    let idMessage = window.location.href.split('/message/')[1];
    if (isNaN(idMessage) || idMessage < 0) {
        return;
    }
    var requete = new XMLHttpRequest();
    requete.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            // si la requête des messages n'a pas retourné d'erreur
            var arrayresponse = JSON.parse(this.responseText);
            MESSAGE = arrayresponse;
            addMessage(arrayresponse, user);
            if (user.id == arrayresponse[0].UserId || user.isAdmin) {
                listenerUpdate('all');
            }
            listenerLike(arrayresponse[0]);
            importLike(arrayresponse[0]);
            importComment(arrayresponse[0].id, user);
            initEditorComment('#no_parent');
            document.getElementById("comment_noParent").addEventListener("submit", function (event) {
                event.stopPropagation();
                event.preventDefault();
            
                var content = document.getElementById("no_parent").value;
                    sendcomment(idMessage, content, 0);
                
            })
        }
    };
    requete.open("GET", "http://localhost:3000/api/v1/message/"+idMessage); 
    requete.setRequestHeader("Content-Type", "application/json");
    requete.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem('token'));
    requete.send();
}

const addMessage = (message, user) => {
    var html = "<div class=\"message-solo\"><div class=\"message\" id=\""+message[0].id+"\"><div class=\"col_likes\">";
    html += "<i class=\"fas fa-arrow-up like-up-not\"></i>";
    html += "<div class=\"nb-likes\">"+message[0].likes+"</div>";
    html += "<i class=\"fas fa-arrow-down like-down-not\"></i></div>";
    html += "<section class=\"corp\"><header class=\"author\">";
    html += "Envoyé par "+message[1].username+" il y a ";
    html += editTime(message[0].createdAt); 
    html += "</header><article><header><h3 class=\"title-article\">";
    html += message[0].title;
    html += "</h3></header><p class=\"content-article\">"+message[0].content;
    html += "</p></article>";
    if (user.id == message[1].id || user.isAdmin) {
        html += "<div class=\"message_options\"><div class=\"message_editer\">Editer</div> ";
        html += "<div class=\"message_supprimer\">Supprimer</div></div>";
    }
    html += "</section></div>";

    html += "<form id=\"comment_noParent\"><div id=\"editor\" >";
    html += "<textarea id=\"no_parent\"></textarea>";
    html += "<button class=\"btn\" name=\"submitbtn\" id=\"submitNew\">Publier</button></div></form>";

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
        // si il a déjà été dislike
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
const importComment = (messageid, user) => {
    var requete = new XMLHttpRequest();
    requete.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            // si la requête des messages n'a pas retourné d'erreur
            var comments = JSON.parse(this.responseText);
            addComment(comments, user);            
        }
    };
    requete.open("GET", "http://localhost:3000/api/v1/comment/"+messageid);
    requete.setRequestHeader("Content-Type", "application/json");
    requete.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem('token'));
    requete.send();
}

// Ajoute les commentaires a la page
const addComment = (comments, user) => {
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
                html += "<div class=\"trait\"></div></div><div class=\"corpse\"><div class=\"author\" >";
                html += "crée par "+comment.user.username+" il y a "+editTime(comment.createdAt);//author nblike - date
                html += "</div><div class=\"com-content\">";
                html += comment.content;
                html += "</div>"; 
                html += "<div class=\"response_text\"id=\"res"+comment.id+"\"><p id=\"response"+comment.id+"\">Répondre</p>";
                if (user.id == comment.user.id || user.isAdmin) {
                    html += "<p id=\"comment_editer"+comment.id+"\">Editer</p> ";
                    html += "<p id=\"comment_supprimer"+comment.id+"\">Supprimer</p>";
                }
                html += "</div></div></div>";
                document.querySelector('.bloc-commentaire').insertAdjacentHTML('beforeend', html);
                position.unshift(index);
                listenerComment("response"+comment.id, comment.user.id);
                if (user.id == comment.user.id || user.isAdmin) {
                    listenerOptionsComment('all', comment.id);
                }
            }
            if (comment.parent !=0 && document.getElementById(comment.parent)) {
                var html = "<div class=\"commentaire\" id=\""+comment.id+"\"><div class=\"com-likes\">";
                html += "<div class=\"trait\"></div></div><div class=\"corpse\"><div class=\"author\">";
                html += "crée par "+comment.user.username+" il y a "+editTime(comment.createdAt);//author nblike - date
                html += "</div><div class=\"com-content\">";
                html += comment.content;
                html += "</div>";
                html += "<div class=\"response_text\"id=\"res"+comment.id+"\"><p id=\"response"+comment.id+"\">Répondre</p>";
                if (user.id == comment.user.id || user.isAdmin) {
                    html += "<p id=\"comment_editer"+comment.id+"\">Editer</p> ";
                    html += "<p id=\"comment_supprimer"+comment.id+"\">Supprimer</p>";
                }
                html += "</div></div></div>";
                if (document.getElementById(comment.parent).querySelector("#res"+comment.parent)) {
                    document.getElementById(comment.parent).querySelector("#res"+comment.parent).insertAdjacentHTML('afterend', html); 
                    position.unshift(index);
                    listenerComment("response"+comment.id, comment.user.id);
                    if (user.id == comment.user.id || user.isAdmin) {
                        listenerOptionsComment('all', comment.id);
                    }
                    
                }
            }
        }
        for (const index of position) {
            listeComment.splice(index,1);
        }
        
    }
};

// action changement contenu editeur
const contentChangeAction = (e) => { 
    if (e.element) {
        if(e.element.tagName === "IMG"){          
            e.element.setAttribute("alt", "Posted image");
        }
    }
    if (e.target.id && e.target.id.includes('parent')) {
        if (e.target.id == 'no_parent') {
            if (tinymce.get('no_parent').getBody().innerHTML != '<p><br data-mce-bogus="1"></p>' && tinymce.get('no_parent').getBody().innerHTML != '<p><br></p>') {
                document.getElementById('submitNew').removeAttribute('disabled');
            } else {
                document.getElementById('submitNew').setAttribute('disabled', true);
            }
        } else {
            var id = e.target.id.split('parent')[1];
            if (tinymce.get('parent'+id).getBody().innerHTML != '<p><br data-mce-bogus="1"></p>' && tinymce.get('parent'+id).getBody().innerHTML != '<p><br></p>') {
                document.getElementById('submitNew'+id).removeAttribute('disabled');
            } else {
                document.getElementById('submitNew'+id).setAttribute('disabled', true);
            }
        }
    } else if (e.target.id == 'message_editor') {
        if (tinymce.get('message_editor').getContent() != '<p><br data-mce-bogus="1"></p>' && tinymce.get('message_editor').getContent() != '<p><br></p>') {
            document.getElementById('submitUpdate').removeAttribute('disabled');
        } else {
            document.getElementById('submitUpdate').setAttribute('disabled', true);
        }
    } else if (e.target.id && e.target.id.includes('comment_editor')) {
        let targetId = e.target.id.split('comment_editor')[1];
        if (tinymce.get('comment_editor'+targetId).getContent() != '<p><br data-mce-bogus="1"></p>' && tinymce.get('comment_editor'+targetId).getContent() != '<p><br></p>') {
            document.getElementById('submitEdit'+targetId).removeAttribute('disabled');
        } else {
            document.getElementById('submitEdite'+targetId).setAttribute('disabled', true);
        }
    } else if (e.currentTarget.dataset.id) {
        if (e.currentTarget.dataset.id == 'no_parent') {
            if (tinymce.get('no_parent').getBody().innerHTML != '<p><br data-mce-bogus="1"></p>' && tinymce.get('no_parent').getBody().innerHTML != '<p><br></p>') {
                document.getElementById('submitNew').removeAttribute('disabled');
            } else {
                document.getElementById('submitNew').setAttribute('disabled', true);
            }
        } else if (e.currentTarget.dataset.id.includes('parent')) {
            var id = e.currentTarget.dataset.id.split('parent')[1];
            if (tinymce.get('parent'+id).getBody().innerHTML != '<p><br data-mce-bogus="1"></p>' && tinymce.get('parent'+id).getBody().innerHTML != '<p><br></p>') {
                document.getElementById('submitNew'+id).removeAttribute('disabled');
            } else {
                document.getElementById('submitNew'+id).setAttribute('disabled', true);
            }
        } else if (e.currentTarget.dataset.id == 'message_editor') {
            if (tinymce.get('message_editor').getContent() != '<p><br data-mce-bogus="1"></p>' && tinymce.get('message_editor').getContent() != '<p><br></p>') {
                document.getElementById('submitUpdate').removeAttribute('disabled');
            } else {
                document.getElementById('submitUpdate').setAttribute('disabled', true);
            }
        } else if (e.currentTarget.dataset.id.includes('comment_editor')) {
            let targetId = e.currentTarget.dataset.id.split('comment_editor')[1];
            if (tinymce.get('comment_editor'+targetId).getContent() != '<p><br data-mce-bogus="1"></p>' && tinymce.get('comment_editor'+targetId).getContent() != '<p><br></p>') {
                document.getElementById('submitEdit'+targetId).removeAttribute('disabled');
            } else {
                document.getElementById('submitEdite'+targetId).setAttribute('disabled', true);
            }
        }
    }
}

//editeur message
const initEditorMessage = () => {
    //const PLACEHOLDERVALUE = 'Tapez votre message ici';

    tinymce.init({
        selector: '#message_editor',
        plugins: ' autolink lists media table link image emoticons autoresize wordcount save',
        toolbar: 'alignleft aligncenter alignright | bold italic underline fontsizeselect forecolor backcolor | emoticons image link spellchecker ',
        menubar: '',
        margin: 'auto',
        language: 'fr_FR',
        placeholder: 'Tapez votre message ici',
        autoresize: true,
        min_height: 100,
        min_width: 310,
        statusbar: false,

        save_enablewhendirty: true,
        save_onsavecallback: function () { console.log('Saved'); },
        //appeler quand une image est upload
        images_upload_url: 'http://localhost:3000/api/v1/message/upload',
        images_reuse_filename: true,
        automatic_uploads: false,
        elementpath: false,
        image_description: false,
        content_style: 'img {max-width: 100%;}',
        //écoute les changement de contenu
        setup: function(editor) {
            editor.on('NodeChange', function(e){
                contentChangeAction(e);
            });
            editor.on('KeyUp', function(e){
                contentChangeAction(e);
            });
            editor.on('init', function(e){
                editor.setContent(MESSAGE[0].content);
                document.getElementById('update_title').value = MESSAGE[0].title;
                document.getElementById('length-title').innerHTML = document.getElementById('update_title').value.length;
                document.getElementById(e.target.id).scrollIntoView({behavior: "smooth", block: "end" });
            });
        }       
    });

}

const listenerUpdate = (param) => {
    if (param == 'all' || param == 'update') {
        document.querySelector(".message_editer").addEventListener("click", function (event) {
            //masque le bouton supprimer
            document.querySelector(".message_supprimer").setAttribute('hidden', true);

            var html = "<form id=\"update\"><div id=\"editor\" >";
            html += "<div class=\"title_line update\"><label for=\"title\">Titre du message </label>";
            html += "<input type=\"text\" id=\"update_title\" maxlength=\"50\" ><div><span id=\"length-title\">0</span>/50</div></div>";
            html += "<textarea id=\"message_editor\"></textarea>";
            html += "<button disabled=\"true\" class=\"btn\" name=\"submitupdatebtn\" id=\"submitUpdate\">Publier</button>";
            html += "<button class=\"btn\" name=\"cancelupdatebtn\" id=\"cancelUpdate\">Annuler</button></div></form>";
            event.target.innerHTML = html;
            initEditorMessage('#message_editor');
            document.getElementById("cancelUpdate").addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                tinymce.remove('#message_editor');
                document.querySelector('.message_editer').innerHTML = "Editer";
                listenerUpdate('update');
                document.querySelector(".message_supprimer").removeAttribute('hidden');
            }, {once: true});
            document.getElementById("submitUpdate").addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                var idMessage = window.location.href.split('/message/')[1];
                var content = tinymce.get('message_editor').getContent();
                //updateMessage(idMessage, content, id);
                var titleMessage = document.getElementById("update_title").value;
                if (content == MESSAGE[0].content && titleMessage == MESSAGE[0].title && content.length >= 11 && titleMessage.length >= 2) {
                    
                    console.log('tout identique');


                } else if (content != MESSAGE[0].content && titleMessage == MESSAGE[0].title && content.length >= 11 && titleMessage.length >= 2){
                    if (content.indexOf('<img') != -1) {
                        if (content.indexOf('<img src="data:') != -1) {
                            tinymce.activeEditor.uploadImages()
                            .then( url => {
                                console.log(url);
                                updateMessage(idMessage, tinymce.get('message_editor').getContent(), titleMessage);
                            })
                            .catch(error => { console.log(error) });
                        } else {
                            updateMessage(idMessage, tinymce.get('message_editor').getContent(), titleMessage);
                        }
                        
                    } else {
                        updateMessage(idMessage, tinymce.get('message_editor').getContent(), titleMessage);
                    }
                } else if (content == MESSAGE[0].content && titleMessage != MESSAGE[0].title && content.length >= 11 && titleMessage.length >= 2) {
                    updateMessage(idMessage, tinymce.get('message_editor').getContent(), titleMessage);
                } else {
                    if (content.indexOf('<img') != -1) {
                        if (content.indexOf('<img src="data:') != -1) {
                            tinymce.activeEditor.uploadImages()
                            .then( url => {
                                console.log(url);
                                updateMessage(idMessage, tinymce.get('message_editor').getContent(), titleMessage);
                            })
                            .catch(error => { console.log(error) });
                        } else {
                            updateMessage(idMessage, tinymce.get('message_editor').getContent(), titleMessage);
                        }
                        
                    } else {
                        updateMessage(idMessage, tinymce.get('message_editor').getContent(), titleMessage);
                    }
                }
                
                
            }, {once: true});
            document.getElementById('update_title').addEventListener('input', function () {
                document.getElementById('length-title').innerHTML = document.getElementById('update_title').value.length;
                if (tinymce.get('message_editor').getContent() != '<p><br data-mce-bogus="1"></p>' && tinymce.get('message_editor').getContent() != '<p><br></p>' && document.getElementById("update_title").value.length >= 2) {
                    document.getElementById('submitUpdate').removeAttribute('disabled');
                } else {
                    document.getElementById('submitUpdate').setAttribute('disabled', true);
                }
            });
        }, {once: true});
    }
    if ( param == 'all' || param == 'delete') {
        document.querySelector(".message_supprimer").addEventListener("click", function (event) {
            //
            document.querySelector(".message_editer").setAttribute('hidden', true);
            var idMessage = window.location.href.split('/message/')[1];
            var html = "<form id=\"delete\">";
            html += "<p class=\"text_delete\">Etes vous sur de vouloir le supprimer ?<br /> ";
            html += "Ceci supprimera également tous les commentaires associés.</p><div class=\"bloc_btn_delete\">";
            html += "<button class=\"btn\" name=\"submitdeletebtn\" id=\"submitdelete\">Supprimer</button>";
            html += "<button class=\"btn\" name=\"canceldeletebtn\" id=\"canceldelete\">Annuler</button></div></form>";
            document.querySelector('.message_supprimer').innerHTML = html;
            document.getElementById("canceldelete").addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                document.querySelector('.message_supprimer').innerHTML = "Supprimer";
                listenerUpdate('delete');
                document.querySelector(".message_editer").removeAttribute('hidden');
                
            }, {once: true});
            document.getElementById("submitdelete").addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                deleteMessage(idMessage);
            });


        }, {once: true});
    }
}

const updateMessage = (idMessage, content, title) => {
    var data = {
        title: title,
        content: content
    }
    data = JSON.stringify(data);
    //envoie la requête et modifie l'affichage en conséquence
    var requete = new XMLHttpRequest();
    var errorMessage = "";
    /* écoute des changement d'état de l'envoie */
    requete.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            switch (this.status) {
                case 201:
                    //document.querySelector('.bloc-commentaire').innerHTML = "";
                    console.log("update ok");
                    window.setTimeout(() => { window.location.reload(true);}, 20);
                    break;
                
                case 401:
                    //401 utilisateur non trouvé ou mail non conforme au regex
                    switch (JSON.parse(this.responseText).error) {
                        case "User not found !":
                            console.log("Aucun compte n'existe pour cet adresse mail.");
                            break;
                        case "Action not allow !":
                            alert("Vous avez été déconnecté. Vous aller être rediriger vers la page de connexion.");
					        window.setTimeout(() => { window.location.href = '/auth/login';}, 200);
                            break;
                        default:
                            errorMessage = "Action non autorisé !";
                            break;
                    }
                    document.getElementById("error").innerHTML = errorMessage;
                    break;
                case 500:
                    // 500 erreur serveur
                    errorMessage = "Une erreur interne est survenue, veuillez nous excuser pour la géne occasionné.";
                    console.log(errorMessage);
                    break;
                default:
                    break;
            }
            return;
        }
    };
    requete.open("PUT", "http://localhost:3000/api/v1/message/"+idMessage);
    requete.setRequestHeader("Content-Type", "application/json");
    requete.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem('token'));
    requete.responseType = 'text';
    requete.send(data);
}

const deleteMessage = (idMessage) => {
    //envoie la requête et modifie l'affichage en conséquence
    var requete = new XMLHttpRequest();
    var errorMessage = "";
    /* écoute des changement d'état de l'envoie */
    requete.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            switch (this.status) {
                case 200:
                    //document.querySelector('.bloc-commentaire').innerHTML = "";
                    console.log("delete ok");
                    window.setTimeout(() => { window.location.href = '/socialNetwork';}, 20);
                    break;
                
                case 401:
                    //401 utilisateur non trouvé ou mail non conforme au regex
                    switch (JSON.parse(this.responseText).error) {
                        case "User not found !":
                            console.log("Aucun compte n'existe pour cet adresse mail.");
                            break;
                        case "Action not allow !":
                            alert("Vous avez été déconnecté. Vous aller être rediriger vers la page de connexion.");
					        window.setTimeout(() => { window.location.href = '/auth/login';}, 200);
                            break;
                        default:
                            errorMessage = "Action non autorisé !";
                            break;
                    }
                    document.getElementById("error").innerHTML = errorMessage;
                    break;
                case 500:
                    // 500 erreur serveur
                    errorMessage = "Une erreur interne est survenue, veuillez nous excuser pour la géne occasionné.";
                    console.log(errorMessage);
                    break;
                default:
                    break;
            }
            return;
        }
    };
    requete.open("DELETE", "http://localhost:3000/api/v1/message/"+idMessage);
    requete.setRequestHeader("Content-Type", "application/json");
    requete.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem('token'));
    requete.responseType = 'text';
    requete.send();

}

//éditeur comment 
const initEditorComment = (place, content) => {
    var content = content || null;
    tinymce.init({
        selector: place,
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
        min_width: 300,
        statusbar: false,

        save_enablewhendirty: true,
        automatic_uploads: false,
        elementpath: false,
        a11y_advanced_options: true,
        //écoute les changement de contenu
        setup: function(editor) {
            editor.on('NodeChange', function(e){
                contentChangeAction(e);
            });
            editor.on('KeyUp', function(e){
                contentChangeAction(e);
            })
            /*editor.on('SelectionChange', function(e){
                contentChangeAction(e);
            });*/
            editor.on('init', function(e){
                if (e.target.id.includes('parent') && e.target.id != 'no_parent') {
                    let targetId = e.target.id.split('parent')[1];
                    document.getElementById(targetId).scrollIntoView({behavior: "smooth", block: "end" });
                } else if (e.target.id.includes('comment_editor')) {
                    editor.setContent(content);
                    let targetId = e.target.id.split('comment_editor')[1];
                    document.getElementById(targetId).scrollIntoView({behavior: "smooth", block: "end" });
                }
                
            });
        }
    });
    
}

const listenerComment = (responseId, userId) => {
    document.getElementById(responseId).addEventListener("click", function (event) {
        let id = event.target.id.split('response')[1];
        var html = "<form id=\"comment_parent"+id+"\"><div id=\"editor\" >";
        html += "<textarea id=\"parent"+id+"\"></textarea>";
        html += "<button class=\"btn\" name=\"submitbtn\" id=\"submitNew"+id+"\">Publier</button>";
        html += "<button class=\"btn\" name=\"cancelbtn\" id=\"cancelNew"+id+"\">Annuler</button></div></form>";
        event.target.innerHTML = html;
        if (USER.id == userId || USER.isAdmin) {
            console.log('proprio');
            document.getElementById('comment_editer'+id).setAttribute('hidden', true);
            document.getElementById('comment_supprimer'+id).setAttribute('hidden', true);
        }
        initEditorComment("#parent"+id);
        document.getElementById("cancelNew"+id).addEventListener('click', function (event) {
            tinymce.remove('#parent'+id);
            document.getElementById(responseId).innerHTML = "Répondre";
            event.preventDefault();
            event.stopPropagation();
            listenerComment(responseId, userId);
            if (USER.id == userId || USER.isAdmin) {
                document.getElementById('comment_editer'+id).removeAttribute('hidden');
                document.getElementById('comment_supprimer'+id).removeAttribute('hidden');
            }
        }, {once: true});
        document.getElementById("submitNew"+id).addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            var idMessage = window.location.href.split('/message/')[1];
            var content = tinymce.get('parent'+id).getBody().innerHTML;
            sendcomment(idMessage, content, id);
        }, {once: true})
    }, {once: true});
}

const listenerOptionsComment = (type, id) => {
    if (type == 'all' || type == 'edit') {
        document.getElementById('comment_editer'+id).addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            let idComment = event.target.id.split('comment_editer')[1];
            var html = "<form id=\"Edit_comm"+idComment+"\"><div id=\"editor_comm"+idComment+"\" >";
            html += "<textarea id=\"comment_editor"+idComment+"\"></textarea>";
            html += "<button disabled=\"true\" class=\"btn\" name=\"submitEditBtn\" id=\"submitEdit"+idComment+"\">Publier</button>";
            html += "<button class=\"btn\" name=\"cancelEditBtn\" id=\"cancelEdit"+idComment+"\">Annuler</button></div></form>";
            event.target.innerHTML = html;
            document.getElementById('response'+idComment).setAttribute('hidden', true)
            document.getElementById("comment_supprimer"+idComment).setAttribute('hidden', true);
            let value = document.getElementById(idComment).querySelector('.com-content').innerHTML;
            initEditorComment('#comment_editor'+idComment, value);
            document.getElementById("cancelEdit"+idComment).addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                tinymce.remove('#comment_editor'+idComment);
                document.getElementById('comment_editer'+idComment).innerHTML = "Editer";
                listenerOptionsComment('edit', id);
                document.getElementById('response'+idComment).removeAttribute('hidden')
                document.getElementById("comment_supprimer"+idComment).removeAttribute('hidden');
            }, {once: true});
            document.getElementById("submitEdit"+idComment).addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                console.log(value);
                var content = tinymce.get('comment_editor'+idComment).getContent();

                if (content == value && content.length >= 8 ) {
                    
                    console.log('tout identique');
                } else if (content != value && content.length >= 8){
                    updateComment(idComment, content);
                   
                }
                
            }, {once: true});
        }, {once: true});
    }
    if (type == 'all' || type == 'delete') {
        document.getElementById('comment_supprimer'+id).addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            let idComment = event.target.id.split('comment_supprimer')[1];
            console.log(idComment);
        });
    }
}

const sendcomment = (messageId, commentContent, parent) => {
    var data = {
        parent: parent,
        content: commentContent
    }
    data = JSON.stringify(data);
    //envoie la requête et modifie l'affichage en conséquence
    var requete = new XMLHttpRequest();
    var errorMessage = "";
    /* écoute des changement d'état de l'envoie */
    requete.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            switch (this.status) {
                case 201:
                    document.querySelector('.bloc-commentaire').innerHTML = "";
                    importComment(messageId, USER);
                    tinymce.activeEditor.setContent('');
                    break;
                
                case 401:
                    //401 utilisateur non trouvé ou mail non conforme au regex
                    switch (JSON.parse(this.responseText).error) {
                        case "User not found !":
                            errorMessage = "Aucun compte n'existe pour cet adresse mail.";
                            break;
                        case "Action not allow !":
                            alert("Vous avez été déconnecté. Vous aller être rediriger vers la page de connexion.");
					        window.setTimeout(() => { window.location.href = '/auth/login';}, 200);
                            break;
                        default:
                            errorMessage = "Action non autorisé !";
                            break;
                    }
                    document.getElementById("error").innerHTML = errorMessage;
                    break;
                case 500:
                    // 500 erreur serveur
                    errorMessage = "Une erreur interne est survenue, veuillez nous excuser pour la géne occasionné.";
                    document.getElementById("error").innerHTML = errorMessage;
                    break;
                default:
                    break;
            }
            return;
        }
    };
    requete.open("POST", "http://localhost:3000/api/v1/comment/"+messageId);
    requete.setRequestHeader("Content-Type", "application/json");
    requete.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem('token'));
    requete.responseType = 'text';
    requete.send(data);
}

const updateComment = (commentId, content) => {
    var data = {
        content: content
    }
    data = JSON.stringify(data);
    //envoie la requête et modifie l'affichage en conséquence
    var requete = new XMLHttpRequest();
    var errorMessage = "";
    /* écoute des changement d'état de l'envoie */
    requete.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            switch (this.status) {
                case 201:
                    document.querySelector('.bloc-commentaire').innerHTML = "";
                    var idMessage = window.location.href.split('/message/')[1];
                    importComment(idMessage, USER);
                    tinymce.activeEditor.setContent('');
                    break;
                
                case 401:
                    //401 utilisateur non trouvé ou mail non conforme au regex
                    switch (JSON.parse(this.responseText).error) {
                        case "User not found !":
                            errorMessage = "Aucun compte n'existe pour cet adresse mail.";
                            break;
                        case "Action not allow !":
                            alert("Vous avez été déconnecté. Vous aller être rediriger vers la page de connexion.");
					        window.setTimeout(() => { window.location.href = '/auth/login';}, 200);
                            break;
                        default:
                            errorMessage = "Action non autorisé !";
                            break;
                    }
                    document.getElementById("error").innerHTML = errorMessage;
                    break;
                case 500:
                    // 500 erreur serveur
                    errorMessage = "Une erreur interne est survenue, veuillez nous excuser pour la géne occasionné.";
                    document.getElementById("error").innerHTML = errorMessage;
                    break;
                default:
                    break;
            }
            console.log(this);
            return;
        }
    };
    requete.open("PUT", "http://localhost:3000/api/v1/comment/"+commentId);
    requete.setRequestHeader("Content-Type", "application/json");
    requete.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem('token'));
    requete.responseType = 'text';
    requete.send(data);
}

// écoute le bouton nouveau message
document.getElementById("btn_new_post").addEventListener("click", function (event) {
    window.location.href = "/socialNetwork/new";
})