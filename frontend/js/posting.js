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
    selector: 'textarea#default',
    plugins: ' autolink lists media table link image emoticons autoresize wordcount save',
    toolbar: 'alignleft aligncenter alignright | bold italic underline fontsizeselect forecolor backcolor | emoticons image link spellchecker ',
    menubar: '',
    width: '50vw',
    margin: 'auto',
    language: 'fr_FR',
    placeholder: 'Tapez votre message ici',
    autoresize: true,

    save_enablewhendirty: true,
    save_onsavecallback: function () { console.log('Saved'); },
    //appeler quand une image est upload
    images_upload_handler: function (blobInfo, success, failure) {
        var xhr, formData;
        xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open('POST', 'http://localhost:3000/api/v1/message/upload');
    
        xhr.onload = function() {
          var json;
    
          if (xhr.status != 200) {
            failure('HTTP Error: ' + xhr.status);
            return;
          }
    
          json = JSON.parse(xhr.responseText);
    
          if (!json || typeof json.location != 'string') {
            failure('Invalid JSON: ' + xhr.responseText);
            return;
          }
    
          success(json.location);
        };
    
        formData = new FormData();
        console.log(blobInfo.blob()+ " - " + blobInfo.filename());
        formData.append('image', blobInfo.blob(), blobInfo.filename());
        xhr.send(formData);
      }
});
/*
tinymce.activeEditor.uploadImages(function(success) {
    document.forms[0].submit();
});
*/
  // { location : '/uploaded/image/path/image.png' } retourner par uploadImages

