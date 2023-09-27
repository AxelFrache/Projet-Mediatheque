/*export*/ class Emprunts{
    constructor(idAdherent,idLivre){
        this.idAdherent=idAdherent;
        this.idLivre=idLivre;
    }

    get getIdAdherent(){
        return this.idAdherent;

    }

    get getIdLivre(){
        return this.idLivre;
    }
}

