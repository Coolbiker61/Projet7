// au chargement de la page
document.onreadystatechange = function () {
	if (document.readyState == 'loading') { 
		// verifie si un token est present dans le sessionStorage
		if (sessionStorage.getItem('token')) {
		var requete = new XMLHttpRequest();
		requete.onreadystatechange = function () {
	// verifie si un token est present dans le sessionStorage
			if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
				console.log(this.responseText);
				window.location.href = '/';
			}
		};
		requete.open("GET", "http://localhost:3000/api/v1/auth/profil");
		requete.setRequestHeader("Content-Type", "application/json");
		requete.setRequestHeader("Authorization", "Bearer "+this.sessionStorage.getItem('token'));
		requete.send();
		
	} }
    if (document.readyState == 'complete') { 
		document.getElementById("loading").hidden = true;
		document.getElementById("back-inscription").style.setProperty('visibility', 'visible') ;
	}
}

//regex de l'email
const REGEX_MAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// regex du pseudo de l'utilisateur
const REGEX_USERNAME = /[a-zA-Z\sáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{3,}/;

// action effectué lors du click sur s'inscrire
const actionClick = (event) => {
	event.stopPropagation();
	if (document.getElementById("email").value !== "" && document.getElementById("email").validity.valid &&
	document.getElementById("username").value !== "" && document.getElementById("username").validity.valid &&
	document.getElementById("password").value !== "" && document.getElementById("password").validity.valid ) {
		// si tout les champs sont valide
		if ( REGEX_MAIL.test(document.getElementById("email").value) && 
		REGEX_USERNAME.test(document.getElementById("username").value) ) {
			var data = {
				email: document.getElementById("email").value,
				username: document.getElementById("username").value,
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
						case 201:
							//quand il a fini la requête avec le code http 201
							let codeHtml = "<div class=\"confirm-inscription\"> Votre inscription a bien été éfféctué. <br>";
							codeHtml += "Vous pouvez maintenant vous connecter.</div>";
							document.getElementById("back-inscription").innerHTML = codeHtml;
							break;
						case 400:
							//400 test des champs
							switch (JSON.parse(this.responseText).error) {
								case "Missing parameters":
									errorMessage = "Veuillez remplir toutes les cases du formulaire.";
									break;
							
								case "Wrong username length":
									errorMessage = "Le pseudo doit avoir une longueur comprise entre 4 et 25 caractères.";
									break;
							
								case "Wrong password content":
									errorMessage = "Le mot de passe doit avoir une longueur comprise entre 4 et 25 caractères et ne doit contenir que des lettres (majuscule et/ou minuscule) et des chiffres.";
									break;
							
								case "Wrong email format":
									errorMessage = "Veuillez indiquer une adresse mail correct.";
								break;
								default:
									errorMessage = "Une erreur est survenue, nous sommes désolé pour la géne occasionné.";
									break;
							}
							document.getElementById("erreur").innerHTML = errorMessage;
							break;
						case 401:
							//401 dejà enregistré ou mail non conforme au regex
							errorMessage = "Cet adresse mail à déjà été utilisé.";
							document.getElementById("erreur").innerHTML = errorMessage;
							break;
						case 500:
							// 500 erreur serveur
							errorMessage = "Une erreur interne est survenue, veuillez nous excuser pour la géne occasionné.";
							document.getElementById("erreur").innerHTML = errorMessage;
							break;
						default:
							break;
					}
					return;
				}
            };
            requete.open("POST", "http://localhost:3000/api/v1/auth/register");
            requete.setRequestHeader("Content-Type", "application/json");
            requete.responseType = 'text';
			requete.send(data); 
		}
	} else {
		return;
	}

};


document.getElementById('inscription').addEventListener("click", function (event)  {
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
document.getElementById("username").addEventListener('input', function (event) {
	verifieValide(event.target);
});
document.getElementById("password").addEventListener('input', function (event) {
	verifieValide(event.target);
});
document.getElementById("email").addEventListener('input', function (event) {
	verifieValide(event.target);
});

