

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
                    var response = JSON.parse(this.responseText);
                    document.getElementById("username").innerHTML = response.username;
                    if (response.isAdmin) {
                        var html = "<div class=\"menu_profil_ligne\"><a href=\"/admin/users\">Administration</a></div>";
                        document.getElementById('logout').insertAdjacentHTML("beforebegin", html);
                    }
                    document.getElementById("email").innerHTML = response.email;
                    document.getElementById("username_detail").innerHTML = response.username;
                    document.getElementById("back").style.setProperty('visibility', 'visible') ;
                    ecoute();
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

const ecoute = () => {
    document.getElementById("supprimer").addEventListener("click", function (event) {
        if (document.getElementById("supprimer").checked) {
            document.getElementById("delete").classList.add("btn_delete_active");
        } else if (!document.getElementById("supprimer").checked) {
            document.getElementById("delete").classList.remove("btn_delete_active");
        }
        
    });
    document.getElementById("delete").addEventListener("click", function (event){
        if (document.getElementById("supprimer").checked) {
            window.location.href = '/auth/delete/confirm';
        }
    })
}

// delete http://localhost:3000/api/v1/auth/