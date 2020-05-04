document.getElementById("link_profil").addEventListener("mouseover", function(event) {
    document.getElementById("menu_profil").style.visibility = "visible";
});
document.getElementById("link_profil").addEventListener("mouseleave", function(event) {
    document.getElementById("menu_profil").style.visibility = "hidden";
});
document.getElementById("link_profil").addEventListener("focusin", function(event) {
    document.getElementById("menu_profil").style.visibility = "visible";
});
document.getElementById("link_profil").addEventListener("focusout", function(event) {
    document.getElementById("menu_profil").style.visibility = "hidden";
});

document.getElementById("logout").addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    sessionStorage.removeItem("token");
    window.location.href = '/auth/login';
});


document.querySelector(".back_to_top").addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
});
window.addEventListener("scroll",(event) => {
    if (window.pageYOffset > screen.height) {
        if (!document.querySelector(".back_to_top").classList.contains("show")) {
            document.querySelector(".back_to_top").classList.add("show");
        }        
    } else {
        if (document.querySelector(".back_to_top").classList.contains("show")) {
            document.querySelector(".back_to_top").classList.remove("show");
        }
    }
})
    /*
    function scrollToTopView() {
        $(window).scrollTop() > $(window).height() / 3 ? $(".scrollToTop").hasClass("showScrollTop") || $(".scrollToTop").addClass("showScrollTop") : $(".scrollToTop").removeClass("showScrollTop")
    }*/