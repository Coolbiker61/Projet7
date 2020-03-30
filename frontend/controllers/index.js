


exports.getPageRoot = (req, res, then) => {
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
    html += "Bienvenue";
    html += "Sur le réseau social interne de l'entreprise.";
    html += "</section>";

    html += "</body></html>"
    res.writeHeader(200 ,{'Content-Type': 'text/html'});
    res.write(html);
    res.end();
};