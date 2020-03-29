
const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/* inscrit l'utilisateur si son email n'est pas déjà utilisé */
exports.register = (req, res, then) => {
    let html = "<!DOCTYPE html><html lang=\"fr\"><head><meta charset=\"UTF-8\">";
    html += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
    html += "<link rel=\"stylesheet\" href=\"/styles/style.css\" />";
    html += "<script src=\"https://kit.fontawesome.com/4fb3c3ed5b.js\" crossorigin=\"anonymous\"></script>";
    html += "<title>Groupomania</title></head><body><nav><ul class=\"menu\"><li>";
    html += "<img src=\"/images/icon-left-font-monochrome-black.svg\" alt=\"logo de l'entreprise\" class=\"logo-entreprise\">";
    html += "</li><li>Social Network</li>";
    html += "<li><a href=\"/auth/login\">Connexion</a></li><li><a href=\"/auth/register\"> Inscription</a></li></ul></nav>";
    html += "<div class=\"offset-top\"></div>";
    html += "<section class=\"back-inscription\"><form class=\"form-register\">";
    html += "<label for=\"email\">Adresse mail</label>";
    html += "<input type=\"email\" id=\"email\" name=\"email\" />";
    html += "<label for=\"username\">Pseudo</label>";
    html += "<input type=\"text\" name=\"username\" id=\"username\"/>";
    html += "<label for=\"password\">Mot de passe</label>";
    html += "<input type=\"password\" name=\"password\" id=\"password\"/>";
    html += "<input id=\"inscription\" type=\"submit\" value=\"S'inscrire\" />";
    html += "</form></section>";

    html += "<script src=\"/js/register.js\"></script>";
    html += "</body></html>"
    res.writeHeader(200 ,{'Content-Type': 'text/html'});
    res.write(html);
    res.end();
};

exports.login = (req, res, then) => {
    let html = "<!DOCTYPE html><html lang=\"fr\"><head><meta charset=\"UTF-8\">";
    html += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
    html += "<link rel=\"stylesheet\" href=\"/styles/style.css\" />";
    html += "<script src=\"https://kit.fontawesome.com/4fb3c3ed5b.js\" crossorigin=\"anonymous\"></script>";
    html += "<title>Groupomania</title></head><body><nav><ul class=\"menu\"><li>";
    html += "<img src=\"/images/icon-left-font-monochrome-black.svg\" alt=\"logo de l'entreprise\" class=\"logo-entreprise\">";
    html += "</li><li>Social Network</li>";
    html += "<li><a href=\"/auth/login\">Connexion</a></li><li><a href=\"/auth/register\"> Inscription</a></li></ul></nav>";
    html += "<div class=\"offset-top\"></div>";
    html += "<section class=\"back-login\"><form class=\"form-register\">";
    html += "<label for=\"email\">Adresse mail</label>";
    html += "<input type=\"email\" id=\"email\" name=\"email\" required />";
    html += "<label for=\"password\">Mot de passe</label>";
    html += "<input type=\"password\" name=\"password\" id=\"password\" required />";
    html += "<input id=\"connexion\" type=\"submit\" value=\"Connexion\" />";
    html += "</form></section>";

    html += "</body></html>"
    res.writeHeader(200 ,{'Content-Type': 'text/html'});
    res.write(html);
    res.end();
};





exports.getProfile = (req, res, then) => {
    var requete = new XMLHttpRequest();
		requete.onreadystatechange = function () {
			if (this.readyState == XMLHttpRequest.DONE && this.status == 200 ) {
				localStorage.setItem("cameras", this.responseText);
				affichage();
			} else if (this.readyState == XMLHttpRequest.DONE && this.status != 200) {
				console.error("erreur d'importation du produit cameras vintages");
			}
		}
		requete.open("GET", "http://localhost:3000/api/cameras");
		requete.send();
}


exports.deleteAccount = (req, res, then) => {
    
    
    var requete = new XMLHttpRequest();
        /* écoute des changement d'état de l'envoie */
        requete.onreadystatechange = function () {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 201 ) {
                localStorage.setItem("retourCommande", this.responseText);
                /* redirige l'utilisateur vers la page confirm.html */
                window.location.href = "confirm.html";
            } else if (this.readyState == XMLHttpRequest.DONE && this.status != 201) {
                console.error("erreur d’envois du panier");
                return;
            }
        };
        requete.open("POST", "http://localhost:3000/api/cameras/order");
        requete.setRequestHeader("Content-Type", "application/json");
        requete.responseType = 'text';
        requete.send(data);
}