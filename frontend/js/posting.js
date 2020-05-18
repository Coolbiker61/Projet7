const PLACEHOLDERVALUE = 'Tapez votre message ici';
const REGEXiNVALIDE = /['\|\/\\\*\+&#"\{\(\[\]\}\)$£€%=\^`]/g;
const REGEXvALIDE = /([a-zA-Z]{1}\'{1}[a-z]{1})/g;

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
                    // si la requête n'a pas retourné d'erreur
                    var response = JSON.parse(this.responseText);
                    document.getElementById("username").innerHTML = response.username;
                    if (response.isAdmin) {
                        var html = "<div class=\"menu_profil_ligne\"><a href=\"/admin/users\">Administration</a></div>";
                        document.getElementById('logout').insertAdjacentHTML("beforebegin", html);
                    }
                    //definition de la taille du offset par rapport a celle du menu
                    document.querySelector('.offset-top').style.height = document.querySelector('nav').offsetHeight+"px";
                    listenerEvent();
                    document.getElementById("loading").hidden = true;
                    document.getElementById("create_form").hidden = false;
                    document.getElementById("back").style.setProperty('visibility', 'visible') ;
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

const sendMessage = (message, title) => {
    var data = {
        title: title,
        content: message
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
                    //quand il a fini la requête avec le code http 200 on copie le token dans le sessionStorage
                    
                    window.setTimeout(() => { window.location.href = '/socialNetwork/';}, 200);
                    break;
                case 400:
                    //400 test des champs
                    errorMessage = "Veuillez indiquer un titre d'au moins 2 caractères et/ou un message de 4 caractères minimum.";
                    document.getElementById("error").innerHTML = errorMessage;
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
    requete.open("POST", "http://localhost:3000/api/v1/message");
    requete.setRequestHeader("Content-Type", "application/json");
    requete.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem('token'));
    requete.responseType = 'text';
    requete.send(data);
}


// action changement contenu editeur
const contentChangeAction = (e) => {    
    if (e.element) {
        if(e.element.tagName === "IMG"){          
            e.element.setAttribute("alt", "Posted image");
        }
    }

    if (tinymce.get('message_editor').getBody().innerHTML != '<p><br data-mce-bogus="1"></p>' && tinymce.get('message_editor').getBody().innerHTML != '<p><br></p>' && document.getElementById("title").value.length >= 2) {
        document.getElementById('submitbtn').removeAttribute('disabled');
    } else {
        document.getElementById('submitbtn').setAttribute('disabled', true);
    }
}


// editor
tinymce.init({
    selector: '#message_editor',
    plugins: ' autolink lists media table link image emoticons autoresize wordcount save',
    toolbar: 'alignleft aligncenter alignright | bold italic underline fontsizeselect forecolor backcolor | emoticons image link spellchecker ',
    menubar: '',
    margin: 'auto',
    language: 'fr_FR',
    placeholder: PLACEHOLDERVALUE,
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
        })
    }
});




document.getElementById('create_form').addEventListener('submit', function (event) {
    event.stopPropagation();
    event.preventDefault();

    var titleMessage = document.getElementById("title").value;
    let imgStart = document.getElementById("message_editor").value.indexOf('<img');
    var messageValue = "";
    if (imgStart != -1) {
        tinymce.activeEditor.uploadImages()
        .then( url => {
            let imgStop = document.getElementById("message_editor").value.indexOf(' />') + 3;
            messageValue = document.getElementById("message_editor").value.slice(0, imgStart);
            messageValue += url[0].element.outerHTML;
            messageValue += document.getElementById("message_editor").value.slice(imgStop);
            if (messageValue.length >= 11 && titleMessage.length >= 2) {
                
                sendMessage(messageValue, titleMessage);
            }
        })
        .catch(error => { console.log(error) });
    } else {
        messageValue = document.getElementById("message_editor").value;
        if (messageValue.length >= 11 && titleMessage.length >= 2) {
            sendMessage(messageValue, titleMessage);
        }
    }    
    
})

const listenerEvent = () => {
    // met a jour la longueur du titre sur la page
    document.getElementById('title').addEventListener('input', function () {
        document.getElementById('length-title').innerHTML = document.getElementById('title').value.length;
        
        let title = document.getElementById('title').value.split(' ');
        let error = false;
        
        for (let part of title) {
            if (/(['\|\/\\\*\+&#"\{\(\[\]\}\)$£€%=\^`])/g.test(part) && !(/(^[a-z]{1}\'[a-z]{1,}$)/gi.test(part))) {
                error = true;
            }
        }
        /*if (error) {
            document.getElementById('submitbtn').setAttribute('disabled', true);
        } else {
            document.getElementById('submitbtn').removeAttribute('disabled');
        }*/
        if (tinymce.get('message_editor').getBody().innerHTML.length >= 11 && document.getElementById("title").value.length >= 2 && !error) {
            if (tinymce.get('message_editor').getBody().innerHTML != '<p><br data-mce-bogus="1"></p>') {
                document.getElementById('submitbtn').removeAttribute('disabled');
            }
        } else {
            document.getElementById('submitbtn').setAttribute('disabled', true);
        }
        
    });
}