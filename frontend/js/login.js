//regex de l'email
const REGEX_MAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// au chargement de la page
const charge =  () => {
	// verifie si un token est present dans le sessionStorage
	if (sessionStorage.getItem('token')) {
		var requete = new XMLHttpRequest();
		requete.onreadystatechange = function () {
			if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
				console.log(this.responseText);
				window.location.href = '/';
				/*window.setTimeout(() => {
					window.location.reload(true);
				}, 200);*/
			}
		};
		requete.open("GET", "http://localhost:3000/api/v1/auth/profil");
		requete.setRequestHeader("Content-Type", "application/json");
		requete.setRequestHeader("Authorization", "Bearer "+this.sessionStorage.getItem('token'));
		requete.send();
		
	}
};
if (document.readyState == 'loading') { charge() }
// action effectué lors du click sur s'inscrire
const actionClick = (event) => {
	event.stopPropagation();
	if (document.getElementById("email").value !== "" && document.getElementById("email").validity.valid &&
	document.getElementById("password").value !== "" && document.getElementById("password").validity.valid ) {
		// si tout les champs sont valide
		if ( REGEX_MAIL.test(document.getElementById("email").value)) {
			var data = {
				email: document.getElementById("email").value,
				password: document.getElementById("password").value
			}
			data = JSON.stringify(data);
			//envoie la requête et modifie l'affichage en conséquence
			var requete = new XMLHttpRequest();
			var errorMessage = "";
            /* écoute des changement d'état de l'envoie */
            requete.onreadystatechange = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
					switch (this.status) {
						case 200:
                            //quand il a fini la requête avec le code http 200 on copie le token dans le sessionStorage
							sessionStorage.setItem('token', JSON.parse(this.responseText).token);
							
							break;
						case 400:
							//400 test des champs
							errorMessage = "Veuillez remplir correctement tous les champs.";
							document.getElementById("error").innerHTML = errorMessage;
							break;
						case 401:
							//401 dejà enregistré ou mail non conforme au regex
							errorMessage = "Cet adresse mail à déjà été utilisé.";
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
            requete.open("POST", "http://localhost:3000/api/v1/auth/login");
            requete.setRequestHeader("Content-Type", "application/json");
            requete.responseType = 'text';
            requete.send(data); 
		}
	} else {
		return;
	}

};


document.getElementById('connexion').addEventListener("click", function (event)  {
	actionClick(event);
});


/* vérifie si le champ du formulaire est valide et ajoute la class invalide le cas échéant sinon l'enlève */
const verifieValide = (elementForm) => {
	if (elementForm.validity.valid == false){
		if(elementForm.classList.contains("invalide") == false) {
			elementForm.classList.add("invalide");
		}
	} else {
		if(elementForm.classList.contains("invalide") == true) {
			elementForm.classList.remove("invalide");
		}
	}
}
/* surveille la modification des champs du formulaire et déclenche la fonction verifieValide() */
document.getElementById("password").addEventListener('input', function (event) {
	verifieValide(event.target);
});
document.getElementById("email").addEventListener('input', function (event) {
	verifieValide(event.target);
});
