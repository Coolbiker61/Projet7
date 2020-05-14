/* découpe la chaîne selon les espaces et remplace dans chaque morceau les caractères spéciaux par des underscore */
exports.replaceCharacter = ( chain ) => {
    partChain = chain.split(' ');
    let recompose = "";
    for (let part in partChain) {
        if (/['\|\/\\\*\+&#"\{\(\[\]\}\)$£€%=\^`]/g.test(partChain[part]) && !(/([a-zA-Z]{1}\'[a-z]{1})/gi.test(partChain[part]))) {
            partChain[part] = partChain[part].replace(/['\|\/\\\*\+&#"\{\(\[\]\}\)$£€%=\^`]/g, '_');
        }
        if (part == (partChain.length - 1 )) {
            recompose += partChain[part]; 
        } else {
            recompose += partChain[part] + ' ';
        }
    }
    return recompose;
}
