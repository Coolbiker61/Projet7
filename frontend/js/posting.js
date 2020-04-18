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
                    document.getElementById("loading").hidden = true;
                    document.getElementById("back").hidden = false;
                    document.getElementById("username").innerHTML = JSON.parse(this.responseText).username;
                    listenerEvent();
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





// editor
tinymce.init({
    selector: '#message_editor',
    plugins: ' autolink lists media table link image emoticons autoresize wordcount save',
    toolbar: 'alignleft aligncenter alignright | bold italic underline fontsizeselect forecolor backcolor | emoticons image link spellchecker ',
    menubar: '',
    margin: 'auto',
    language: 'fr_FR',
    placeholder: 'Tapez votre message ici',
    autoresize: true,

    save_enablewhendirty: true,
    save_onsavecallback: function () { console.log('Saved'); },
    //appeler quand une image est upload
    images_upload_url: 'http://localhost:3000/api/v1/message/upload',
    images_reuse_filename: true,
    automatic_uploads: false,
    elementpath: false,
    a11y_advanced_options: true,
});




document.getElementById('create_form').addEventListener('submit', function (event) {
    event.stopPropagation();
    event.preventDefault();
    
    let imgStart = document.getElementById("message_editor").value.indexOf('<img');
    var messageValue = "";
    if (imgStart != -1) {
        tinymce.activeEditor.uploadImages()
        .then( url => {
            
            let imgStop = document.getElementById("message_editor").value.indexOf(' />') + 3;
            messageValue = document.getElementById("message_editor").value.slice(0, imgStart);
            messageValue += url[0].element.outerHTML;
            messageValue += document.getElementById("message_editor").value.slice(imgStop);
        })
    } else {
        messageValue = document.getElementById("message_editor").value;
    }
    var titleMessage = document.getElementById("title").value;
    if (messageValue.length >= 11 && titleMessage.length >= 2) {
        sendMessage(messageValue, titleMessage);
    }
    
})
const listenerEvent = () => {
    // met a jour la longueur du titre sur la page
    document.getElementById('title').addEventListener('input', function () {
        document.getElementById('length-title').innerHTML = document.getElementById('title').value.length;
        if (document.getElementById("title").value.length < 2) {
            //class invalide
        } else if (tinymce.get('message_editor').getBody().innerHTML.length >= 11 && document.getElementById("title").value.length >= 2) {
            console.log("conforme "+tinymce.get('message_editor').getBody().innerHTML.length);
        }
    });

    tinymce.get('message_editor').getBody().addEventListener('change', function () {
        if (tinymce.get('message_editor').getBody().innerHTML.length >= 11 && document.getElementById("title").value.length >= 2) {
            console.log("conforme");
        }
    })
}