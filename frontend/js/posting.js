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
    tinymce.activeEditor.uploadImages(function(success) {
        console.log('img upload');
    })
    .then( url => {
        console.log(url);
        console.log(document.getElementById("message_editor").value);
    })
    
})

document.getElementById('title').addEventListener('input', function () {
    document.getElementById('length-title').innerHTML = document.getElementById('title').value.length;
})