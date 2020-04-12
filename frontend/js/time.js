const editTime = () => {
    // format de la base 2020-04-02T22:19:43.000Z
    const date = Date.parse("2020-04-02T22:19:43.000Z");
    const dateNow = Date.now();
    console.log(date+" - "+dateNow);
    var difference = dateNow - date;
    console.log(difference);
    difference /= 1000;
    difference = Math.trunc(difference);
    console.log(difference);
    let seconde = difference % 60;
    difference -= seconde; 
    difference /= 60;

    console.log(difference);
    let minute = difference % 60;
    difference -= minute;
    difference /= 60;
    console.log(difference);
    let heure = difference % 24;
    difference -= heure;
    difference /= 24;
    let day = difference;

    if (day) {
        console.log(day+"D ago");
    } else if (heure) {
        console.log(heure+"h ago");
    } else if (minute) {
        console.log(minute+"m ago");
    } else {
        console.log(seconde+"s ago");
    }
}

editTime();