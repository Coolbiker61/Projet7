// ecoute du clic sur le bouton
// verification formulaire
// affichage message d'erreur
// redirection login si reussi
// 

//regex de l'email
const REGEX_MAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
			let codeHtml = "<div class=\"confirm-inscription\"> Votre inscription a bien été éfféctué. <br>";
			codeHtml += "Vous pouvez maintenant vous conneter.</div>";
		document.getElementById("back-inscription").innerHTML = codeHtml;
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

