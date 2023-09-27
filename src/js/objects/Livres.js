/*export*/ class Livres {
    constructor(idLivre,titreLivre){
        this.idLivre=idLivre;
        this.titreLivre=titreLivre;
    }

    get getIdLivre(){
        return this.idLivre;

    }

    get getTitreLivre(){
        return this.titreLivre;
    }


}