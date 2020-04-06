
exports.getPageWall = (req, res, then) => {
    let html = "<!DOCTYPE html><html lang=\"fr\"><head><meta charset=\"UTF-8\">";
    html += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
    html += "<link rel=\"stylesheet\" href=\"/styles/style.css\" />";
    html += "<script src=\"https://kit.fontawesome.com/4fb3c3ed5b.js\" crossorigin=\"anonymous\"></script>";
    html += "<script src=\"/js/wall.js\"></script>";
    html += "<title>Groupomania</title></head><body><nav><ul class=\"menu\"><li><a href=\"/\">";
    html += "<img src=\"/images/icon-left-font-monochrome-black.svg\" alt=\"logo de l'entreprise\" class=\"logo-entreprise\">";
    html += "</a></li><li><a href=\"/socialNetwork\">Social Network</a></li>";
    html += "<li><a href=\"/auth/profil\">Profil</a></li></ul></nav>";
    html += "<div class=\"offset-top\"></div>";
    // le logo animé qui reste affiché le temps du chargement
    html += "<div id=\"loading\"><img src=\"/images/loading1.gif\" alt=\"logo de chargement\"></div>";
    html += "<section hidden id=\"back\" class=\"back\">";

    html += "Bienvenue";
    html += "Sur le réseau social interne de l'entreprise.";
    // container a messages
    html += "<div id=\"container\" > </div>";

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
    html += "<script src=\"/js/posting.js\"></script>";
    html += "<title>Groupomania - poster un nouveau message</title></head><body><nav><ul class=\"menu\"><li><a href=\"/\">";
    html += "<img src=\"/images/icon-left-font-monochrome-black.svg\" alt=\"logo de l'entreprise\" class=\"logo-entreprise\">";
    html += "</a></li><li><a href=\"/socialNetwork\">Social Network</a></li>";
    html += "<li><a href=\"/auth/profil\">Profil</a></li></ul></nav>";
    html += "<div class=\"offset-top\"></div>";
    // le logo animé qui reste affiché le temps du chargement
    html += "<div id=\"loading\"><img src=\"/images/loading1.gif\" alt=\"logo de chargement\"></div>";
    html += "<section hidden id=\"back\" class=\"back\">";

    html += "Bienvenue";
    html += "Sur le réseau social interne de l'entreprise.";
    // container a messages
    html += "<div id=\"container\" > </div>";

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
    html += "<title>Groupomania - suppression de message</title></head><body><nav><ul class=\"menu\"><li><a href=\"/\">";
    html += "<img src=\"/images/icon-left-font-monochrome-black.svg\" alt=\"logo de l'entreprise\" class=\"logo-entreprise\">";
    html += "</a></li><li><a href=\"/socialNetwork\">Social Network</a></li>";
    html += "<li><a href=\"/auth/profil\">Profil</a></li></ul></nav>";
    html += "<div class=\"offset-top\"></div>";
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