
const REGEX_EMAIL = "/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/";
const REGEX_USERNAME = "[a-zA-Z\sáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{3,}";
const REGEX_PASSWORD = "^[a-zA-Z]\w{4,25}$";

/* inscrit l'utilisateur si son email n'est pas déjà utilisé */
exports.register = (req, res, then) => {
    let html = "<!DOCTYPE html><html lang=\"fr\"><head><meta charset=\"UTF-8\">";
    html += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
    html += "<link rel=\"stylesheet\" href=\"/styles/style.css\" />";
    html += "<script src=\"https://kit.fontawesome.com/4fb3c3ed5b.js\" crossorigin=\"anonymous\"></script>";
    html += "<script src=\"/js/register.js\" async></script>";
    html += "<title>Groupomania</title></head><body><nav><ul class=\"menu\"><li>";
    html += "<img src=\"/images/icon-left-font-monochrome-black.svg\" alt=\"logo de l'entreprise\" class=\"logo-entreprise\">";
    html += "</li><li>Social Network</li>";
    html += "<li><a href=\"/auth/login\">Connexion</a></li><li><a href=\"/auth/register\"> Inscription</a></li></ul></nav>";
    html += "<div class=\"offset-top\"></div>";
    html += "<section id=\"back-inscription\" class=\"back-inscription\"><div class=\"form-register\">";
    html += "<label for=\"email\">Adresse mail</label>";
    html += "<input type=\"email\" id=\"email\" name=\"email\" required patern=\""+REGEX_EMAIL+"\"/>";
    html += "<label for=\"username\">Pseudo</label>";
    html += "<input type=\"text\" name=\"username\" id=\"username\" required patern=\""+REGEX_USERNAME+"\" />";
    html += "<label for=\"password\">Mot de passe</label>";
    html += "<input type=\"password\" name=\"password\" id=\"password\" required patern=\""+REGEX_PASSWORD+"\"/>";
    html += "<div id=\"inscription\">S'inscrire </div>";
    html += "</div><div id=\"erreur\"></div></section>";

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
    html += "<script src=\"/js/login.js\" defer></script>";
    html += "<title>Groupomania</title></head><body><nav><ul class=\"menu\"><li>";
    html += "<img src=\"/images/icon-left-font-monochrome-black.svg\" alt=\"logo de l'entreprise\" class=\"logo-entreprise\">";
    html += "</li><li><a href=\"/socialNetwork\">Social Network</a></li>";
    html += "<li><a href=\"/auth/login\">Connexion</a></li><li><a href=\"/auth/register\"> Inscription</a></li></ul></nav>";
    html += "<div class=\"offset-top\"></div>";
    // le logo animé qui reste affiché le temps du chargement
    html += "<div id=\"loading\"><img src=\"/images/loading1.gif\" alt=\"logo de chargement\"></div>";
    html += "<section hidden id=\"back-login\" class=\"back-login\"><div class=\"form-login\">";
    html += "<label for=\"email\">Adresse mail</label>";
    html += "<input type=\"email\" id=\"email\" name=\"email\" required partern=\""+REGEX_EMAIL+"\" />";
    html += "<label for=\"password\">Mot de passe</label>";
    html += "<input type=\"password\" name=\"password\" id=\"password\" required partern=\""+REGEX_PASSWORD+"\"/>";
    html += "<input id=\"connexion\" type=\"submit\" value=\"Connexion\" />";
    html += "<div id=\"error\" class=\"error\"></div></div></section>";

    html += "</body></html>"
    res.writeHeader(200 ,{'Content-Type': 'text/html'});
    res.write(html);
    res.end();
};


exports.getProfile = (req, res, then) => {
    let html = "<!DOCTYPE html><html lang=\"fr\"><head><meta charset=\"UTF-8\">";
    html += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
    html += "<link rel=\"stylesheet\" href=\"/styles/style.css\" />";
    html += "<script src=\"https://kit.fontawesome.com/4fb3c3ed5b.js\" crossorigin=\"anonymous\"></script>";
    html += "<script src=\"/js/profil.js\"></script>";
    html += "<script src=\"/js/menu.js\" async></script>";
    html += "<title>Groupomania</title></head><body><nav><ul class=\"menu\"><li><a href=\"/\">";
    html += "<img src=\"/images/icon-left-font-monochrome-black.svg\" alt=\"logo de l'entreprise\" class=\"logo-entreprise\">";
    html += "</a></li><li><a href=\"/socialNetwork\">Social Network</a></li>";
    html += "<li id=\"link_profil\"><span id=\"username\"></span><div style=\"visibility: hidden;\" id=\"menu_profil\">";
    html += "<div class=\"menu_profil_ligne\"><a href=\"/auth/profil\">Profil</a></div>";
    html += "<div id=\"logout\" class=\"menu_profil_ligne\"><a href=\"/auth/login\">Déconnexion</a></div>";
    html += "</div></li>";
    html += "</ul></nav><div class=\"offset-top\"></div>";

    html += "<div id=\"loading\"><img src=\"/images/loading1.gif\" alt=\"logo de chargement\"></div>";
    html += "<div hidden  id=\"profile\"><section  id=\"liste_message\" class=\"liste_message\">";
    html += "Vos cinq dernier messages :";
    html += "<div id=\"error\" class=\"error\"></div></section>";
    html += "<section id=\"quick_profile\">";
    html += "<div id=\"mini_username\">username</div>";
    html +="<a href=\"/auth/profil/settings\" ><i id=\"profil_settings\" class=\"fas fa-cog icon_settings\"></i></a>";
    html += "</section>";
    html += "</div></body></html>"
    res.writeHeader(200 ,{'Content-Type': 'text/html'});
    res.write(html);
    res.end();
}
exports.getProfileSettings = (req, res, then) => {
    let html = "<!DOCTYPE html><html lang=\"fr\"><head><meta charset=\"UTF-8\">";
    html += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
    html += "<link rel=\"stylesheet\" href=\"/styles/style.css\" />";
    html += "<script src=\"https://kit.fontawesome.com/4fb3c3ed5b.js\" crossorigin=\"anonymous\"></script>";
    html += "<script src=\"/js/profilSettings.js\"></script>";
    html += "<script src=\"/js/menu.js\" async></script>";
    html += "<title>Groupomania</title></head><body><nav><ul class=\"menu\"><li><a href=\"/\">";
    html += "<img src=\"/images/icon-left-font-monochrome-black.svg\" alt=\"logo de l'entreprise\" class=\"logo-entreprise\">";
    html += "</a></li><li><a href=\"/socialNetwork\">Social Network</a></li>";
    html += "<li id=\"link_profil\"><span id=\"username\"></span><div style=\"visibility: hidden;\" id=\"menu_profil\">";
    html += "<div class=\"menu_profil_ligne\"><a href=\"/auth/profil\">Profil</a></div>";
    html += "<div id=\"logout\" class=\"menu_profil_ligne\"><a href=\"/auth/login\">Déconnexion</a></div>";
    html += "</div></li>";
    html += "</ul></nav><div class=\"offset-top\"></div>";

    html += "<section  id=\"back\" class=\"back\"><div class=\"profile_details\">";
    html += "<div>Email : <span id=\"email\"></span></div>";
    html += "<div>Pseudo : <span id=\"username_detail\"></span></div>";
    html += "<div class=\"delete_box\"><div class=\"verif_del\">";
    html += "<label for=\"supprimer\">Voulez vous supprimer votre compte ? ";
    html += "<input type=\"checkbox\" id=\"supprimer\" name=\"supprimer\">";
    html += "</div><div id=\"delete\" class=\"btn_delete\" >Supprimer le compte</div></div>";
    
    html += "</div></section>";

    html += "</body></html>"
    res.writeHeader(200 ,{'Content-Type': 'text/html'});
    res.write(html);
    res.end();
}

exports.deleteAccountConfirm = (req, res, then) => {
    let html = "<!DOCTYPE html><html lang=\"fr\"><head><meta charset=\"UTF-8\">";
    html += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
    html += "<link rel=\"stylesheet\" href=\"/styles/style.css\" />";
    html += "<script src=\"https://kit.fontawesome.com/4fb3c3ed5b.js\" crossorigin=\"anonymous\"></script>";
    html += "<script src=\"/js/confirmD.js\"></script>";
    html += "<script src=\"/js/menu.js\" async></script>";
    html += "<title>Groupomania</title></head><body><nav><ul class=\"menu\"><li><a href=\"/\">";
    html += "<img src=\"/images/icon-left-font-monochrome-black.svg\" alt=\"logo de l'entreprise\" class=\"logo-entreprise\">";
    html += "</a></li><li><a href=\"/socialNetwork\">Social Network</a></li>";
    html += "<li id=\"link_profil\"><span id=\"username\"></span><div style=\"visibility: hidden;\" id=\"menu_profil\">";
    html += "<div class=\"menu_profil_ligne\"><a href=\"/auth/profil\">Profil</a></div>";
    html += "<div id=\"logout\" class=\"menu_profil_ligne\"><a href=\"/auth/login\">Déconnexion</a></div>";
    html += "</div></li>";
    html += "</ul></nav><div class=\"offset-top\"></div>";

    html += "<div hidden id=\"loading\"><img src=\"/images/loading1.gif\" alt=\"logo de chargement\"></div>";
    html += "<section  id=\"back\" class=\"back\"><div class=\"confirm_delete\">";
    html += "<p>Dernière chance.</p>";
    html += "<p>Cette action est irréversible, êtes vous sur de vouloir supprimer votre compte ?</p>";
    html += "<p>Ceci supprimera également tous les messages et commentaires.</p>";
    html += "<div class=\"choice\"><div id=\"btn_oui\">Oui</div><div id=\"btn_non\">Non</div></div>";
    
    
    html += "<div id=\"error\" class=\"error\"></div></div></section>";

    html += "</body></html>"
    res.writeHeader(200 ,{'Content-Type': 'text/html'});
    res.write(html);
    res.end();
    
    
}