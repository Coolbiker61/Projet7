
exports.getUserListe = (req, res ,then) => {
    let html = "<!DOCTYPE html><html lang=\"fr\"><head><meta charset=\"UTF-8\">";
    html += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
    html += "<link rel=\"icon\" type=\"image/png\" href=\"/images/favicon.png\" />";
    html += "<link rel=\"stylesheet\" href=\"/styles/style.min.css\" />";
    html += "<script src=\"https://kit.fontawesome.com/4fb3c3ed5b.js\" crossorigin=\"anonymous\"></script>";
    html += "<script src=\"https://cdn.tiny.cloud/1/vjax5i6wra9mztw82qywx797zkifcqfemwbzfxjdzjockixy/tinymce/5/tinymce.min.js\" referrerpolicy=\"origin\"></script>";
    html += "<script src=\"/js/admin.min.js\" async></script>";
    html += "<script src=\"/js/menu.min.js\" async></script>";
    html += "<title>Groupomania - Administration des utilisateurs</title></head><body><nav><ul class=\"menu\"><li><a href=\"/\">";
    html += "<img src=\"/images/icon-left-font-monochrome-black.svg\" alt=\"logo de l'entreprise\" class=\"logo-entreprise\">";
    html += "</a></li><li id=\"user_nav\"><a href=\"/socialNetwork\"><div class=\"btn\" tabindex=\"0\">Social Network</div></a></li>";
    html += "<li id=\"link_profil\"><div class=\"btn\" tabindex=\"0\"><span id=\"username\">&nbsp;</span></div><div style=\"visibility: hidden;\" id=\"menu_profil\">";
    html += "<div class=\"menu_profil_ligne\"><a href=\"/auth/profil\">Profil</a></div>";
    html += "<div id=\"logout\" class=\"menu_profil_ligne\"><a href=\"/auth/login\">Déconnexion</a></div>";
    html += "</div></li><li><a href=\"javascript:void(0);\" class=\"icon\" onclick=\"showMenu()\"><i class=\"fas fa-bars\"></i></a></li>";
    html += "</ul></nav><div class=\"offset-top\"></div>";
    // le logo animé qui reste affiché le temps du chargement
    html += "<div id=\"loading\"><img src=\"/images/loading1.gif\" alt=\"logo de chargement\"></div>";
    html += "<section hidden id=\"container\" >";
    html += "<h1>Gestion des utilisateurs</h1>"
    html += "<div class=\"users-main\" ><div class=\"bloc-users-liste\"><ul class=\"users-liste\">";
    html += "</ul></div><div id=\"bloc-users-profile\"></div>";
    
    html += "</div></section><div id=\"error\" class=\"error\"></div>";
    html += "<footer><a class=\"back_to_top\" ><i class=\"fas fa-chevron-up\"></i></a></footer>";
    html += "</body></html>"
    res.writeHeader(200 ,{'Content-Type': 'text/html'});
    res.write(html);
    res.end();
};

exports.adminDeleteAccountConfirm = (req, res, then) => {
    let html = "<!DOCTYPE html><html lang=\"fr\"><head><meta charset=\"UTF-8\">";
    html += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
    html += "<link rel=\"icon\" type=\"image/png\" href=\"/images/favicon.png\" />";
    html += "<link rel=\"stylesheet\" href=\"/styles/style.min.css\" />";
    html += "<script src=\"https://kit.fontawesome.com/4fb3c3ed5b.js\" crossorigin=\"anonymous\"></script>";
    html += "<script src=\"/js/adminConfirmD.min.js\" async></script>";
    html += "<script src=\"/js/menu.min.js\" async></script>";
    html += "<title>Confirmation de suppression - Groupomania</title></head><body><nav><ul class=\"menu\"><li><a href=\"/\">";
    html += "<img src=\"/images/icon-left-font-monochrome-black.svg\" alt=\"logo de l'entreprise\" class=\"logo-entreprise\">";
    html += "</a></li><li><a href=\"/socialNetwork\"><div class=\"btn\">Social Network</div></a></li>";
    html += "<li id=\"link_profil\"><div class=\"btn\"><span id=\"username\">&nbsp;</span></div><div style=\"visibility: hidden;\" id=\"menu_profil\">";
    html += "<div class=\"menu_profil_ligne\"><a href=\"/auth/profil\">Profil</a></div>";
    html += "<div id=\"logout\" class=\"menu_profil_ligne\"><a href=\"/auth/login\">Déconnexion</a></div>";
    html += "</div></li><li><a href=\"javascript:void(0);\" class=\"icon\" onclick=\"showMenu()\"><i class=\"fas fa-bars\"></i></a></li>";
    html += "</ul></nav><div class=\"offset-top\"></div>";

    html += "<div id=\"loading\"><img src=\"/images/loading1.gif\" alt=\"logo de chargement\"></div>";
    html += "<section  id=\"back\" class=\"back\"><h1>Confirmation de suppression du compte</h1><div class=\"confirm_delete\">";
    html += "<p>Cette action est irréversible, êtes vous sur de vouloir supprimer le compte de";
    html += "<span class=\"user_to_delete\"></span> ?</p>";
    html += "<p>Ceci supprimera également tous ses messages et ses commentaires.</p>";
    html += "<div class=\"choice\"><div id=\"btn_oui\">Oui</div><div id=\"btn_non\">Non</div></div>";
    
    
    html += "<div id=\"error\" class=\"error\"></div></div></section>";

    html += "<footer><a class=\"back_to_top\" ><i class=\"fas fa-chevron-up\"></i></a></footer>";
    html += "</body></html>"
    res.writeHeader(200 ,{'Content-Type': 'text/html'});
    res.write(html);
    res.end();
    
    
}