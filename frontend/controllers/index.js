


exports.getPageRoot = (req, res, then) => {
    let html = "<!DOCTYPE html><html lang=\"fr\"><head><meta charset=\"UTF-8\">";
    html += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
    html += "<link rel=\"stylesheet\" href=\"/styles/style.css\" />";
    html += "<script src=\"https://kit.fontawesome.com/4fb3c3ed5b.js\" crossorigin=\"anonymous\"></script>";
    html += "<script src=\"/js/index.js\" async></script>";
    html += "<script src=\"/js/menu.js\" async></script>";
    html += "<title>Groupomania</title></head><body><nav><ul class=\"menu\"><li>";
    html += "<img src=\"/images/icon-left-font-monochrome-black.svg\" role=\"banner\" alt=\"logo de l'entreprise\" class=\"logo-entreprise\">";
    html += "</li><li id=\"user_nav\"><a href=\"/socialNetwork\"><div class=\"btn\" tabindex=\"0\">Social Network</div></a></li>";
    html += "<li id=\"link_profil\"><div class=\"btn\" tabindex=\"0\"><span id=\"username\"></span></div><div style=\"visibility: hidden;\" id=\"menu_profil\">";
    html += "<div class=\"menu_profil_ligne\" tabindex=\"0\"><a href=\"/auth/profil\">Profil</a></div>";
    html += "<div id=\"logout\" class=\"menu_profil_ligne\" tabindex=\"0\"><a href=\"/auth/login\">Déconnexion</a></div>";
    html += "</div></li>";
    html += "</ul></nav>";
    html += "<div class=\"offset-top\"></div>";
    html += "<div role=\"banner\" id=\"loading\"><img src=\"/images/loading1.gif\" alt=\"logo de chargement\"></div>";
    
    html += "<section class=\"back-login\">";
    html += "<div class=\"accueil\"> <img class=\"accueil_logo\" src=\"/images/icon-left-font-monochrome-black.svg\" alt=\"logo de l'entreprise\">";
    html += "<h1>Bienvenue sur le réseau social interne de l'entreprise.</h1>";
    html += "</div></section>";

    html += "</body></html>"
    res.writeHeader(200 ,{'Content-Type': 'text/html'});
    res.write(html);
    res.end();
};