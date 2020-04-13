const editTime = (param) => {
    // format de la base 2020-04-02T22:19:43.000Z
    const date = Date.parse(param);
    const dateNow = Date.now();
    var difference = dateNow - date;
    difference /= 1000;
    difference = Math.trunc(difference);
    let seconde = difference % 60;
    difference -= seconde; 
    difference /= 60;
    let minute = difference % 60;
    difference -= minute;
    difference /= 60;
    let heure = difference % 24;
    difference -= heure;
    difference /= 24;
    let day = difference;

    if (day) {
        return day+"jours";
    } else if (heure) {
        return heure+"heures";
    } else if (minute) {
        return minute+"minutes";
    } else {
        return seconde+"secondes";
    }
}
