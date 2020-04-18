
exports.getPageWall = (req, res, then) => {
    let html = "<!DOCTYPE html><html lang=\"fr\"><head><meta charset=\"UTF-8\">";
    html += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
    html += "<link rel=\"stylesheet\" href=\"/styles/style.css\" />";
    html += "<script src=\"https://kit.fontawesome.com/4fb3c3ed5b.js\" crossorigin=\"anonymous\"></script>";
    html += "<script src=\"/js/wall.js\" async></script>";
    html += "<script src=\"/js/menu.js\" async></script>";
    html += "<title>Groupomania</title></head><body><nav><ul class=\"menu\"><li><a href=\"/\">";
    html += "<img src=\"/images/icon-left-font-monochrome-black.svg\" alt=\"logo de l'entreprise\" class=\"logo-entreprise\">";
    html += "</a></li><li><a href=\"/socialNetwork\">Social Network</a></li>";
    html += "<li><div id=\"btn_new_post\">Nouveau Message</div></li>";
    html += "<li id=\"link_profil\"><span id=\"username\"></span><div style=\"visibility: hidden;\" id=\"menu_profil\">";
    html += "<div class=\"menu_profil_ligne\"><a href=\"/auth/profil\">Profil</a></div>";
    html += "<div id=\"logout\" class=\"menu_profil_ligne\"><a href=\"/auth/login\">Déconnexion</a></div>";
    html += "</div></li>";
    html += "</ul></nav><div class=\"offset-top\"></div>";
    // le logo animé qui reste affiché le temps du chargement
    html += "<div id=\"loading\"><img src=\"/images/loading1.gif\" alt=\"logo de chargement\"></div>";
    html += "<section hidden id=\"back\" class=\"back\">";

    html += "<header><h1>Bienvenue sur le réseau social interne de l'entreprise.</h1>";
    html += "</header>";
    
    // container a messages
    html += "<div id=\"container\" > </div>";

    html += "</section>";
    html += "</body></html>"
    res.writeHeader(200 ,{'Content-Type': 'text/html'});
    res.write(html);
    res.end();
};

exports.getPageMessage = (req, res, then) => {
    let html = "<!DOCTYPE html><html lang=\"fr\"><head><meta charset=\"UTF-8\">";
    html += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
    html += "<link rel=\"stylesheet\" href=\"/styles/style.css\" />";
    html += "<script src=\"https://kit.fontawesome.com/4fb3c3ed5b.js\" crossorigin=\"anonymous\"></script>";
    html += "<script src=\"/js/message.js\" async></script>";
    html += "<script src=\"/js/menu.js\" async></script>";
    html += "<title>Groupomania</title></head><body><nav><ul class=\"menu\"><li><a href=\"/\">";
    html += "<img src=\"/images/icon-left-font-monochrome-black.svg\" alt=\"logo de l'entreprise\" class=\"logo-entreprise\">";
    html += "</a></li><li><a href=\"/socialNetwork\">Social Network</a></li>";
    html += "<li><div id=\"btn_new_post\">Nouveau Message</div></li>";
    html += "<li id=\"link_profil\"><span id=\"username\"></span><div style=\"visibility: hidden;\" id=\"menu_profil\">";
    html += "<div class=\"menu_profil_ligne\"><a href=\"/auth/profil\">Profil</a></div>";
    html += "<div id=\"logout\" class=\"menu_profil_ligne\"><a href=\"/auth/login\">Déconnexion</a></div>";
    html += "</div></li>";
    html += "</ul></nav><div class=\"offset-top\"></div>";
    // le logo animé qui reste affiché le temps du chargement
    html += "<div id=\"loading\"><img src=\"/images/loading1.gif\" alt=\"logo de chargement\"></div>";
    html += "<section hidden id=\"back\" class=\"back\">";
    
    // container a messages
    html += "<div id=\"container\" ></div>";

    html += "</section>";
    html += "</body></html>"
    res.writeHeader(200 ,{'Content-Type': 'text/html'});
    res.write(html);
    res.end();
};

exports.createMessage = (req, res ,then) => {
    let html = "<!DOCTYPE html><html lang=\"fr\"><head><meta charset=\"UTF-8\">";
    html += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
    html += "<link rel=\"stylesheet\" href=\"/styles/style.css\" />";
    html += "<script src=\"https://kit.fontawesome.com/4fb3c3ed5b.js\" crossorigin=\"anonymous\"></script>";
    html += "<script src=\"https://cdn.tiny.cloud/1/vjax5i6wra9mztw82qywx797zkifcqfemwbzfxjdzjockixy/tinymce/5/tinymce.min.js\" referrerpolicy=\"origin\"></script>";
    html += "<script src=\"/js/posting.js\" async></script>";
    html += "<script src=\"/js/menu.js\" async></script>";
    html += "<title>Groupomania - poster un nouveau message</title></head><body><nav><ul class=\"menu\"><li><a href=\"/\">";
    html += "<img src=\"/images/icon-left-font-monochrome-black.svg\" alt=\"logo de l'entreprise\" class=\"logo-entreprise\">";
    html += "</a></li><li><a href=\"/socialNetwork\">Social Network</a></li>";
    html += "<li id=\"link_profil\"><span id=\"username\"></span><div style=\"visibility: hidden;\" id=\"menu_profil\">";
    html += "<div class=\"menu_profil_ligne\"><a href=\"/auth/profil\">Profil</a></div>";
    html += "<div id=\"logout\" class=\"menu_profil_ligne\"><a href=\"/auth/login\">Déconnexion</a></div>";
    html += "</div></li>";
    html += "</ul></nav><div class=\"offset-top\"></div>";
    // le logo animé qui reste affiché le temps du chargement
    html += "<div id=\"loading\"><img src=\"/images/loading1.gif\" alt=\"logo de chargement\"></div>";
    html += "<section hidden id=\"back\" class=\"back\"><form id=\"create_form\">";
    html += "<div class=\"title_line\"><label for=\"title\">Titre du message </label>";
    html += "<input type=\"text\" id=\"title\" maxlength=\"50\" ><div><span id=\"length-title\">0</span>/50</div></div>";
    html += "<div id=\"editor\" ><textarea id=\"message_editor\"></textarea>";
    html += "<button name=\"submitbtn\" id=\"submitbtn\">Publier</button></form>";
    //
    html += " </div>";

    html += "</section>";
    html += "</body></html>"
    res.writeHeader(200 ,{'Content-Type': 'text/html'});
    res.write(html);
    res.end();
}

exports.deleteMessage = (req, res ,then) => {
    let html = "<!DOCTYPE html><html lang=\"fr\"><head><meta charset=\"UTF-8\">";
    html += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
    html += "<link rel=\"stylesheet\" href=\"/styles/style.css\" />";
    html += "<script src=\"https://kit.fontawesome.com/4fb3c3ed5b.js\" crossorigin=\"anonymous\"></script>";
    html += "<script src=\"/js/deposting.js\"></script>";
    html += "<script src=\"/js/menu.js\" async></script>";
    html += "<title>Groupomania - suppression de message</title></head><body><nav><ul class=\"menu\"><li><a href=\"/\">";
    html += "<img src=\"/images/icon-left-font-monochrome-black.svg\" alt=\"logo de l'entreprise\" class=\"logo-entreprise\">";
    html += "</a></li><li><a href=\"/socialNetwork\">Social Network</a></li>";
    html += "<li id=\"link_profil\"><span id=\"username\"></span><div style=\"visibility: hidden;\" id=\"menu_profil\">";
    html += "<div class=\"menu_profil_ligne\"><a href=\"/auth/profil\">Profil</a></div>";
    html += "<div id=\"logout\" class=\"menu_profil_ligne\"><a href=\"/auth/login\">Déconnexion</a></div>";
    html += "</div></li>";
    html += "</ul></nav><div class=\"offset-top\"></div>";
    // le logo animé qui reste affiché le temps du chargement
    html += "<div id=\"loading\"><img src=\"/images/loading1.gif\" alt=\"logo de chargement\"></div>";
    html += "<section hidden id=\"back\" class=\"back\">";

    html += "";
    html += "Confirmer vous le suppression de votre message ?";
    // container a messages
    html += "<div id=\"container\" > </div>";

    html += "</section>";
    html += "</body></html>"
    res.writeHeader(200 ,{'Content-Type': 'text/html'});
    res.write(html);
    res.end();
}