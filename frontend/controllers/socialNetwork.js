const axios = require('axios').default;

exports.getPageWall = (req, res, then) => {
    let html = "<!DOCTYPE html><html lang=\"fr\"><head><meta charset=\"UTF-8\">";
    html += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
    html += "<link rel=\"stylesheet\" href=\"/styles/style.css\" />";
    html += "<script src=\"https://kit.fontawesome.com/4fb3c3ed5b.js\" crossorigin=\"anonymous\"></script>";
    html += "<title>Groupomania</title></head><body><nav><ul class=\"menu\"><li>";
    html += "<img src=\"/images/icon-left-font-monochrome-black.svg\" alt=\"logo de l'entreprise\" class=\"logo-entreprise\">";
    html += "</li><li>Social Network</li>";
    html += "<li><a href=\"/auth/login\">Connexion</a></li><li><a href=\"/auth/register\"> Inscription</a></li></ul></nav>";
    html += "<div class=\"offset-top\"></div>";
    html += "<section class=\"back-login\">";
//ajoute des messages https://www.npmjs.com/package/axios
    var listMessage = "error";

    axios.get("http://localhost:3000/api/v1/message/")
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.log(error);
    })

    //Dépot GitHub pour le Projet 6 de la formation Développeur web

    html += "<div class=\"message\"><div class=\"col_likes\"><i class=\"fas fa-arrow-up like-up-not\"></i>";
    html += "<div class=\"nb-likes\">00 k</div>";
    html += "<i class=\"fas fa-arrow-down like-down-not\"></i></div>";
    html += "<section class=\"corp\"><header class=\"author\">";
                    //posted by moi le 21/21/21 a 12h12
    html += "</header><article><header><h3 class=\"title-article\">";
                    //tittre article
    html += "</h3></header><p class=\"content-article\">";
            
    html += "</p></article></section></div>";


    html += "Bienvenue";
    html += "Sur le réseau social interne de l'entreprise.";


    html += "</section>";
    html += "</body></html>"
    res.writeHeader(200 ,{'Content-Type': 'text/html'});
    res.write(html);
    res.end();
};