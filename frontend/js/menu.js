document.getElementById("link_profil").addEventListener("mouseover", function( event ) {
    document.getElementById("menu_profil").style.visibility = "visible";
});
document.getElementById("link_profil").addEventListener("mouseleave", function( event ) {
    document.getElementById("menu_profil").style.visibility = "hidden";
});
document.getElementById("logout").addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    sessionStorage.removeItem("token");
    window.location.href = '/auth/login';
});
