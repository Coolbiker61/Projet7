
// au chargement de la page
document.onreadystatechange = function () {
	if (document.readyState == 'loading') { 
		// vérifie si un token est présent dans le sessionStorage
		if (sessionStorage.getItem('token')) {
		var requete = new XMLHttpRequest();
		requete.onreadystatechange = function () {
			if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
				window.location.href = '/';
			}
		};
		requete.open("GET", "http://localhost:3000/api/v1/auth/profil");
		requete.setRequestHeader("Content-Type", "application/json");
		requete.setRequestHeader("Authorization", "Bearer "+this.sessionStorage.getItem('token'));
		requete.send();
		
	} }
    if (document.readyState == 'complete') { 
		//définition de la taille du offset par rapport a celle du menu
		document.querySelector('.offset-top').style.height = document.querySelector('nav').offsetHeight+"px";

		document.getElementById("loading").hidden = true;
		document.getElementById("back-inscription").style.setProperty('visibility', 'visible') ;
	}
}

//regex de l'email
const REGEX_MAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// regex du pseudo de l'utilisateur
const REGEX_USERNAME = /^[a-zA-Z]{1}[\w\sáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{2,25}$/;
// regex password
const REGEX_PASSWORD = /^[a-zA-Z]{1}\w{3,24}$/;

// action effectué lors du click sur s'inscrire
const actionClick = (event) => {
	event.stopPropagation();
	if (document.getElementById("email").value !== "" && REGEX_MAIL.test(document.getElementById("email").value) &&
	document.getElementById("username").value !== "" && REGEX_USERNAME.test(document.getElementById("username").value) &&
	document.getElementById("password").value !== "" && REGEX_PASSWORD.test(document.getElementById("password").value) ) {
		// si tout les champs sont valide
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
								errorMessage = "Veuillez indiquer une adresse mail au format ****@***.*** .";
							break;
							default:
								errorMessage = "Une erreur est survenue, nous sommes désolé pour la géne occasionné.";
								break;
						}
						document.getElementById("erreur").innerHTML = errorMessage;
						break;
					case 401:
						//401 déjà enregistré ou mail non conforme au regex
						errorMessage = "Email ou mot de passe invalide.";
						document.getElementById("erreur").innerHTML = errorMessage;
						break;
					case 500:
						// 500 erreur serveur
						errorMessage = "Une erreur interne est survenue, veuillez nous excuser pour la géne occasionné.<br>";
						//errorMessage += JSON.parse(this.responseText).error;
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
		
	} else {
		return;
	}

};


document.getElementById('inscription').addEventListener("click", function (event)  {
	actionClick(event);
});


/* vérifie si le champ du formulaire est valide et ajoute la class invalide le cas échéant sinon l'enlève */
const verifieValide = (elementForm) => {
	if (elementForm.id == 'email') {
		if (REGEX_MAIL.test(document.getElementById("email").value) == false){
			if(elementForm.classList.contains("invalide") == false) {
				elementForm.classList.add("invalide");
			}
		} else {
			if(elementForm.classList.contains("invalide") == true) {
				elementForm.classList.remove("invalide");
			}
		}
	}
	if (elementForm.id == 'username') {
		if (REGEX_USERNAME.test(document.getElementById("username").value) == false){
			if(elementForm.classList.contains("invalide") == false) {
				elementForm.classList.add("invalide");
			}
		} else {
			if(elementForm.classList.contains("invalide") == true) {
				elementForm.classList.remove("invalide");
			}
		}
	}
	if (elementForm.id == 'password') {
		if (REGEX_PASSWORD.test(document.getElementById("password").value) == false){
			if(elementForm.classList.contains("invalide") == false) {
				elementForm.classList.add("invalide");
			}
		} else {
			if(elementForm.classList.contains("invalide") == true) {
				elementForm.classList.remove("invalide");
			}
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

