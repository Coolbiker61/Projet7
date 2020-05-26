


exports.getPageRoot = (req, res, then) => {
    let html = "<!DOCTYPE html><html lang=\"fr\"><head><meta charset=\"UTF-8\">";
    html += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
    html += "<link rel=\"icon\" type=\"image/png\" href=\"/images/favicon.png\" />";
    html += "<link rel=\"stylesheet\" href=\"/styles/style.min.css\" />";
    html += "<script src=\"https://kit.fontawesome.com/4fb3c3ed5b.js\" crossorigin=\"anonymous\"></script>";
    html += "<script src=\"/js/index.min.js\" async></script>";
    html += "<script src=\"/js/menu.min.js\" async></script>";
    html += "<title>Groupomania</title></head><body><nav><ul class=\"menu\"><li>";
    html += "<img src=\"/images/icon-left-font-monochrome-black.svg\" role=\"banner\" alt=\"logo de l'entreprise\" class=\"logo-entreprise\">";
    html += "</li><li id=\"user_nav\"><a href=\"/socialNetwork\"><div class=\"btn\">Social Network</div></a></li>";
    html += "<li id=\"link_profil\"><div class=\"btn\"><span id=\"username\">&nbsp;</span></div><div style=\"visibility: hidden;\" id=\"menu_profil\">";
    html += "<a href=\"/auth/profil\"><div class=\"menu_profil_ligne\" >Profil</div></a>";
    html += "<div id=\"logout\" class=\"menu_profil_ligne\" ><a href=\"/auth/login\">Déconnexion</a></div>";
    html += "</div></li><li><a href=\"javascript:void(0);\" class=\"icon\" onclick=\"showMenu()\"><i class=\"fas fa-bars\"></i></a></li>";
    html += "</ul></nav>";
    html += "<div class=\"offset-top\"></div>";
    html += "<div role=\"banner\" id=\"loading\"><img src=\"/images/loading1.gif\" alt=\"logo de chargement\"></div>";
    
    html += "<section class=\"back-login\">";
    html += "<div class=\"accueil\"><h1>";
    html += "<img class=\"accueil_logo\" src=\"/images/icon-black.png\" alt=\"logo de l'entreprise\">";
    html += " Groupomania</h1>";
    html += "<h2>Bienvenue sur le réseau social interne de l'entreprise.</h2>";
    html += "</div></section>";

    html += "<footer><a class=\"back_to_top\" ><i class=\"fas fa-chevron-up\"></i></a></footer>";
    html += "</body></html>"
    res.writeHeader(200 ,{'Content-Type': 'text/html'});
    res.write(html);
    res.end();
};