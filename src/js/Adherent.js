/*
import {Adherents} from "../objects/Adherents.js";
import {Emprunts} from "../objects/Emprunts.js";
import {Livres} from "../objects/Livres.js";
 */
let listeAdherents = [];
let listeAdherentsEmprunt = [];
let listeLivres = [];
let listeLivreDisponibles = [];
/**
 * Event listener pour le chargement de la page
 */
document.addEventListener("DOMContentLoaded", async function () {

    await getAdherents() //Charge la liste des adhérents
    await getLivresEmpruntes() //Charge la liste des livres empruntés
    await getLivres() //Charge la liste des livres
    getListeLivreDisponible() //Charge la liste des livres disponibles

    //console.log(listeAdherents);
    //console.log(listeAdherentsEmprunt);
    //console.log(listeLivres);
    //console.log(listeLivreDisponibles);

    afficheAdherant();
    afficherListeLivresDisponibles();
    afficherListeLivresEmpruntes();

    const boutonAjoutAdherent = document.getElementById("ajouterAdherent");
    boutonAjoutAdherent.addEventListener("click", clickBoutonAjout);
});

function getListeAdherents() {
    return listeAdherents;
}

function getListeAdherentsEmprunt() {
    return listeAdherentsEmprunt;
}

function getListeLivres() {
    return listeLivres;
}

// Fonction qui récupère la liste des livres disponibles
function getListeLivreDisponible() {
    //console.log("getListeLivreDisponible called")
    listeLivreDisponibles = [];
    // On compare la liste des livres avec la liste des emprunts
    listeLivres.forEach((livre) => {
        // On vérifie si le livre est emprunté
        let livreEmprunte = false;
        listeAdherentsEmprunt.forEach((emprunt) => {
            // Si l'id du livre est égal à l'id du livre de l'emprunt
            if (livre.idLivre === emprunt.idLivre) {
                // Le livre est emprunté
                livreEmprunte = true;
            }
        });

        // Si le livre n'est pas emprunté, on l'ajoute à la liste des livres disponibles
        if (!livreEmprunte) {
            listeLivreDisponibles.push(livre);
        }
    });

    return listeLivreDisponibles;
}

async function updateRequete() {
    // On vide les listes
    listeAdherents = [];
    listeAdherentsEmprunt = [];
    listeLivres = [];
    listeLivreDisponibles = [];

    await getAdherents() //Charge la liste des adhérents
    await getLivresEmpruntes() //Charge la liste des livres empruntés
    await getLivres() //Charge la liste des livres
    getListeLivreDisponible() //Charge la liste des livres disponibles
    await afficheAdherant();
    await afficherListeLivresDisponibles();
    await afficherListeLivresEmpruntes();

}


/**
 * Fonction qui permet de récupérer la liste des adhérents
 */
async function getAdherents() {
    const xhr = new XMLHttpRequest();
    let url = "./php/Controller/ControllerAdherent.php?action=readAll";
    xhr.open("GET", url, true);
    xhr.send();

    // Attendre la fin de la requête XHR et le remplissage de la liste
    await new Promise(resolve => {
        xhr.onload = function () {
            const adherant = JSON.parse(xhr.responseText);
            for (let i = 0; i < adherant.length; i++) {
                listeAdherents.push(new Adherents(adherant[i].idAdherent, adherant[i].nomAdherent))
            }
            resolve();
        }
    });
}

/**
 * Fonction qui permet de récupérer la liste des livres empruntés par un adhérent
 */
async function getLivresEmpruntes() {
    const xhr = new XMLHttpRequest();
    let url = "./php/Controller/ControllerEmprunt.php?action=readAll";
    xhr.open("GET", url, true);
    xhr.send();

    // Attendre la fin de la requête XHR et le remplissage de la liste
    await new Promise(resolve => {
        xhr.onload = function () {
            const emprunt = JSON.parse(xhr.responseText);
            for (let i = 0; i < emprunt.length; i++) {
                listeAdherentsEmprunt.push(new Emprunts(emprunt[i].idAdherent, emprunt[i].idLivre));
            }
            resolve();
        }
    });
}

/**
 * Fonction qui permet de récupérer la liste des livres
 */
async function getLivres() {
    const xhr = new XMLHttpRequest();
    let url = "./php/Controller/ControllerLivre.php?action=readAll";
    xhr.open("GET", url, true);
    xhr.send();

    // Attendre la fin de la requête XHR et le remplissage de la liste
    await new Promise(resolve => {
        xhr.onload = function () {
            const livre = JSON.parse(xhr.responseText);
            for (let i = 0; i < livre.length; i++) {
                listeLivres.push(new Livres(livre[i].idLivre, livre[i].titreLivre));
            }
            resolve();
        }
    });
}


/**
 * Cette fonction permet d'afficher la liste des adhérents
 * Permet aussi de voir les livres empruntés par un adhérent
 */

function afficheAdherant() {
    //Supprime les enfants de la div
    let divAdherant = document.getElementById("listeAdherents");
    while (divAdherant.firstChild) {
        divAdherant.removeChild(divAdherant.firstChild);
    }

    // Créez un élément <ul> et ajoutez-le à divAdherant
    let ul = document.createElement("ul");
    divAdherant.appendChild(ul);

    for (let i = 0; i < listeAdherents.length; i++) {
        // Créez un élément <li> et ajoutez-le à ul
        let li = document.createElement("li");
        let imgSupprimer = document.createElement("img");
        let imgLivre = document.createElement("img");

        let compteurEmprunt = compterEmprunts(listeAdherents[i].idAdherent);
        //Si l'adhérent a emprunté un livre ou des livres
        if (compteurEmprunt > 0) {
            li.innerText = listeAdherents[i].idAdherent + "-" + listeAdherents[i].nomAdherent + " (" + compteurEmprunt + " emprunts";
            li.id = i;
            imgLivre.src = "./img/book.ico";
            imgLivre.className = "iconeLivre";
            li.innerHTML += imgLivre.outerHTML + ")";
            popUpAdherent(li, listeAdherents[i]);
            li.addEventListener("click", function () { // Ajout de cet event listener
                popUpAdherent(li, listeAdherents[i]);
            });
        } else {
            li.innerText = listeAdherents[i].idAdherent +"-"+ listeAdherents[i].nomAdherent;
            li.id = i;
        }

        imgSupprimer.src = "./img/x.svg";
        imgSupprimer.id = listeAdherents[i].idAdherent;
        imgSupprimer.className = "imgSupAdherent";

        li.innerHTML += imgSupprimer.outerHTML;

        ul.appendChild(li);
    }
    ajouterEventListenersSupprimerAdherent();
}

/**
 * Fonction qui permet de compter le nombre d'emprunts par adhérent
 * @param {number} idAdherent l'id de l'adhérent
 * @returns {number} le nombre d'emprunts
 */

function compterEmprunts(idAdherent) {
    let compteur = 0;
    for (let i = 0; i < listeAdherentsEmprunt.length; i++) {
        if (listeAdherentsEmprunt[i].idAdherent === idAdherent) {
            compteur++;
        }
    }
    return compteur;
}

/**
 * Cette fonction permet d'avoir une liste des livres empruntés par un adhérent
 * @param idAdherent
 * @return {*[]}
 */

function getLivreAdherentEmprunt(idAdherent) {
    let listeLivre = [];
    for (let i = 0; i < listeAdherentsEmprunt.length; i++) {
        if (listeAdherentsEmprunt[i].idAdherent === idAdherent) {
            listeLivre.push({
                idLivre: listeAdherentsEmprunt[i].idLivre,
                titreLivre: getTitreLivreById(listeAdherentsEmprunt[i].idLivre)
            });
        }
    }
    return listeLivre;
}


function getTitreLivreById(idLivre) {
    for (let i = 0; i < listeLivres.length; i++) {
        if (listeLivres[i].idLivre === idLivre) {
            return listeLivres[i].titreLivre;
        }
    }
}

/**
 * Cette fonction permet d'ajouter un adhérent avec une requête AJAX (POST)
 */
async function clickBoutonAjout() {
    const xhr = new XMLHttpRequest();
    let inputField = document.getElementById("nomAdherent");
    if (inputField.value !== "") {
        console.log(inputField.value);
        let nom = encodeURIComponent(inputField.value);
        let url = "./php/Controller/ControllerAdherent.php?action=create";
        xhr.open("POST", url, true);
        // Ajoutez l'en-tête pour indiquer que vous envoyez des données de formulaire
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        // Envoyez les données en tant que paramètres POST
        xhr.send(`nom=${nom}`);
        //On vide le champ
        inputField.value = "";

        if (nom === "Heisenberg") {
            const audio = new Audio('./audio/02breakingbad.mp3');
            audio.load();
            audio.play();
        }

        xhr.onload = async function () {
            //Recharge la liste des adhérents
            await updateRequete();
        }
    }
}


function ajouterEventListenersSupprimerAdherent() {
    // Ajoutez un event listener pour chaque bouton "supprimer adhérent"
    const imgSupAdherents = document.querySelectorAll(".imgSupAdherent");
    imgSupAdherents.forEach(function (imgSupAdherent) {
        imgSupAdherent.addEventListener("click", async function (event) {
            const idCible = event.target.id;
            //console.log(idCible);
            await supprimeAdherent(idCible);
            event.stopPropagation(); //Obligatoire pour éviter que le pop-up s'affiche
        });
    });
}

/**
 * La fonction popUpAdherent affiche un pop-up lorsque l'utilisateur clique sur un élément li (adhérent)
 * et ferme le pop-up lorsque l'utilisateur clique en dehors du contenu du pop-up ou sur le bouton closePopup.
 * @param {HTMLElement} li - L'élément li sur lequel l'utilisateur clique pour afficher le pop-up.
 * @param {Object} adherantI - L'objet adherant qui contient les informations sur l'adhérent (telles que l'ID de l'adhérent).
 */

function popUpAdherent(li, adherantI) {

    const popup = document.getElementById("popup");


    // Affiche le pop-up lorsque l'utilisateur clique sur un adhérent
    li.addEventListener("click", function () {
        popup.style.display = "block";
        // Affichage des livres empruntés par un adhérent
        const contentPopup = document.getElementsByClassName("popup-content")[0];
        ajouteLivresEmpuntesAdherentDansPopUp(contentPopup, adherantI);

        const closePopup = document.getElementById("close-popup");
        // Fermez le pop-up lorsque l'utilisateur clique en dehors du contenu du pop-up
        closePopup.addEventListener("click", function () {
            popup.style.display = "none";
        });

        // Fermez le pop-up lorsque l'utilisateur clique en dehors du contenu du pop-up
        window.addEventListener("click", function (event) {
            if (event.target === popup) {
                popup.style.display = "none";
            }
        });
    });
}

/**
 * @param {HTMLElement} contentPopup
 * @param {Object} adherant adherantI
 */
function ajouteLivresEmpuntesAdherentDansPopUp(contentPopup, adherantI) {
    //Vider contentPopup mais ne pas supprimer le span qui ferme le pop-up
    while (contentPopup.firstChild) {
        contentPopup.removeChild(contentPopup.firstChild);
    }
    //On remet le span qui ferme le pop-up
    let span = document.createElement("span");
    span.id = "close-popup";
    span.className = "close";
    span.innerHTML = "&times;";
    contentPopup.appendChild(span);

    let tabIdAdherentIdLivreEmprunte = getLivreAdherentEmprunt(adherantI.idAdherent);
    //(tabIdAdherentIdLivreEmprunte);
    let ul = document.createElement("ul");
    let pEmprunt = document.createElement("p");
    pEmprunt.innerHTML = adherantI.nomAdherent + " a emprunté :";
    contentPopup.appendChild(pEmprunt);
    contentPopup.appendChild(ul);

    for (let i = 0; i < tabIdAdherentIdLivreEmprunte.length; i++) {
        let li = document.createElement("li");
        li.id = tabIdAdherentIdLivreEmprunte[i].idLivre;
        li.innerHTML = tabIdAdherentIdLivreEmprunte[i].idLivre + "-" + tabIdAdherentIdLivreEmprunte[i].titreLivre;
        ul.appendChild(li);
    }

    //Ajout d'un event listener sur chaque li pour rendre un livre
    const liLivresEmpruntes = document.querySelectorAll("#popup li");
    liLivresEmpruntes.forEach(function (liLivreEmprunte) {
        liLivreEmprunte.addEventListener("click", async function (event) {
            const idCible = event.target.id;
            //console.log(idCible);
            rendreLivre(idCible);
        });
    });
}

/**
 * Fonction qui permet de rendre un livre emprunté par un adhérent.
 */

function rendreLivre(idLivre) {
    //Demande de confirmation avant de rendre le livre
    let titreLivre;
    for (let i = 0; i < listeLivres.length; i++) {
        if (idLivre == listeLivres[i].idLivre){
           titreLivre = listeLivres[i].titreLivre;
        }
    }
    if (confirm("Voulez-vous vraiment rendre ce livre : "+ titreLivre +"?")) {
        for (let i = 0; i < listeAdherentsEmprunt.length; i++) {
            if (idLivre == listeAdherentsEmprunt[i].idLivre) { //Il faut bien mettre que deux égales sinon ça ne fonctionne pas (ça compare les types)
                let xhr = new XMLHttpRequest();
                let url = "./php/Controller/ControllerEmprunt.php?action=delete&idLivre=" + idLivre;
                xhr.open("GET", url, true);
                xhr.send();
                xhr.onload = async function () {
                    //Recharge la liste des adhérents
                    await updateRequete();
                    //Supprime le li du livre rendu
                    const liLivreRendu = document.getElementById(idLivre);
                    liLivreRendu.remove();

                }
            }
        }
    } else {
        console.log("Le livre n'a pas été rendu");
        return;
    }
}


/**
 * Fontion qui permet de supprimer un adhérent de la liste.
 */
async function supprimeAdherent(idAdherent) {
    //let listeEmprunts = await getLivresEmpruntes();
    for (let i = 0; i < listeAdherents.length; i++) {
        if (idAdherent == listeAdherents[i].idAdherent) { //Il faut bien mettre que deux égales sinon ça ne fonctionne pas (ça compare les types)
            let nomAdherent = listeAdherents[i].nomAdherent;
            if (confirm("Êtes-vous sûr de vouloir supprimer l'adhérent " + nomAdherent + " ?")) {
                let xhr = new XMLHttpRequest();
                let url = "./php/Controller/ControllerAdherent.php?action=delete&id=" + idAdherent;
                xhr.open("GET", url, true);
                xhr.send();
                xhr.onload = async function () {
                    await updateRequete();
                }
            } else {
                return false;
            }

        }
    }
}
