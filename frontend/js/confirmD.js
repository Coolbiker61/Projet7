

// au chargement de la page
document.onreadystatechange = function () {
    if (document.readyState == 'complete') { 
        // verifie si un token est présent dans le sessionStorage
        if (sessionStorage.getItem('token')) {
            var requete = new XMLHttpRequest();
			requete.onreadystatechange = function () {
				if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
                    var html = "<p class=\"error\">Une erreur interne est survenue, veuillez nous excuser pour la géne occasionné.<br />";
                    html += "Notre équipe fait de son mieux pour corriger le problème.</p>";
                    document.querySelector('.back').insertAdjacentHTML('afterbegin', html);
                } else if (this.readyState == XMLHttpRequest.DONE && this.status != 200) {

                    alert("Vous avez été déconnecté. Vous aller être rediriger vers la page de connexion.");
					window.setTimeout(() => { window.location.href = '/auth/login';}, 2000);
				} else if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    document.getElementById("username").innerHTML = response.username;
                    if (response.isAdmin) {
                        var html = "<div class=\"menu_profil_ligne\"><a href=\"/admin/users\">Administration</a></div>";
                        document.getElementById('logout').insertAdjacentHTML("beforebegin", html);
                    }         
                    //définition de la taille du offset par rapport a celle du menu
                    document.querySelector('.offset-top').style.height = document.querySelector('nav').offsetHeight+"px";
           
                    ecoute();
                    document.getElementById("loading").hidden = true;
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

const ecoute = () => {
    document.getElementById("btn_oui").addEventListener("click", function (event) {
        
        document.getElementById("loading").hidden = false;
        document.getElementById("back").setAttribute('hidden', true);
        var requete = new XMLHttpRequest();
        requete.onreadystatechange = function () {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
                var html = "<p class=\"error\">Une erreur interne est survenue, veuillez nous excuser pour la géne occasionné.<br />";
                html += "Notre équipe fait de son mieux pour corriger le problème.</p>";
                document.querySelector('.loading').insertAdjacentHTML('afterbegin', html);
            } else if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                window.setTimeout(() => { window.location.href = '/auth/register';}, 2000);
            } else if (this.readyState == XMLHttpRequest.DONE && this.status != 200) {
                console.log(this.responseText);
            }
        };
        requete.open("DELETE", "http://localhost:3000/api/v1/auth/");
        requete.setRequestHeader("Content-Type", "application/json");
        requete.setRequestHeader("Authorization", "Bearer "+sessionStorage.getItem('token'));
        requete.send();
        
    });
    document.getElementById("btn_non").addEventListener("click", function (event){
            window.location.href = '/auth/profil/settings';
    })
}
