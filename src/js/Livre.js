window.addEventListener('load', (event) => {
    let boutonAjoutLivre = document.getElementById("ajouterLivre");
    boutonAjoutLivre.addEventListener("click", ajouterLivre);
});

/**
 * Récupère et affiche la liste des livres empruntés.
 */
function afficherListeLivresEmpruntes() {
    let livres;
    let emprunts;

    fetch("php/Controller/ControllerLivre.php?action=readAll")
        .then((response) => response.json())
        .then((livresData) => {
            livres = livresData;
            return fetch("php/Controller/ControllerEmprunt.php?action=readAll");
        })
        .then((response) => response.json())
        .then((empruntsData) => {
            emprunts = empruntsData;
            const listeLivresEmpruntes = document.getElementById("listeLivresEmpruntes");
            listeLivresEmpruntes.innerHTML = "";
            const ul = document.createElement("ul");
            listeLivresEmpruntes.appendChild(ul);
            livres.forEach((livre) => {
                emprunts.forEach((emprunt) => {
                    if (emprunt.idLivre === livre.idLivre) {
                        const liLivre = document.createElement("li");
                        liLivre.textContent = livre.titreLivre;


                        //Ajout de l'image personn.svg
                        const imgImage = document.createElement("img");
                        imgImage.src = "./img/person.svg";
                        imgImage.id = livre.idLivre;
                        imgImage.className = "imgImageLivre";
                        imgImage.addEventListener("click", (event) => {
                            event.stopImmediatePropagation();
                            let livreClique = event.target.id;
                            for (let j = 0; j < listeAdherentsEmprunt.length; j++) {
                                if (listeAdherentsEmprunt[j].idAdherent == emprunt.idAdherent
                                    && listeAdherentsEmprunt[j].idLivre == livreClique) {
                                    for (let i = 0; i < listeAdherents.length; i++) {
                                        if (listeAdherents[i].idAdherent == listeAdherentsEmprunt[j].idAdherent) {
                                            alert("Le livre \"" + livre.titreLivre + "\" est emprunté par " + listeAdherents[i].nomAdherent);
                                        }
                                    }
                                }
                            }

                        });
                        liLivre.appendChild(imgImage);

                        const imgImageLivre = document.createElement("img");
                        imgImageLivre.src = "./img/image.svg";
                        imgImageLivre.id = livre.titreLivre;
                        imgImageLivre.className = "imgImageLivre";
                        imgImageLivre.addEventListener("click", () => {
                            popUpLivre(livre);
                        });
                        liLivre.appendChild(imgImageLivre);

                        const imgSupprimer = document.createElement("img");
                        imgSupprimer.src = "./img/x.svg";
                        imgSupprimer.id = livre.idLivre;
                        imgSupprimer.className = "imgSupEmpruntLivre";
                        imgSupprimer.addEventListener("click", () => {
                            //Confirmer la suppression
                            if (!confirm("Voulez-vous vraiment rendre ce livre?")) {
                                return;
                            } else {
                                // Supprimer l'emprunt et rafraîchir les listes
                                fetch(`php/Controller/ControllerEmprunt.php?action=delete&idLivre=${livre.idLivre}`)
                                    .then(() => {
                                        updateRequete();
                                    })
                                    .catch((error) => {
                                        console.error("Error deleting emprunt:", error);
                                    });
                            }
                        });
                        liLivre.appendChild(imgSupprimer);

                        ul.appendChild(liLivre);
                    }
                });
            });
        })
        .catch((error) => {
            console.error('Error fetching livres or emprunts:', error);
        });
}


/**
 * Récupère et affiche la liste des livres disponibles (qui ne sont pas actuellement empruntés).
 */
function afficherListeLivresDisponibles() {
    fetch("php/Controller/ControllerLivre.php?action=readAll")
        .then((response) => response.json())
        .then((livres) => {
            fetch("php/Controller/ControllerEmprunt.php?action=readAll")
                .then((response) => response.json())
                .then((emprunts) => {

                    const listeLivresDisponibles = document.getElementById("listeLivresDisponibles");
                    listeLivresDisponibles.innerHTML = "";
                    const ul = document.createElement("ul");
                    listeLivresDisponibles.appendChild(ul);
                    livres.forEach((livre) => {

                        const livreEmprunte = emprunts.find((emprunt) => emprunt.idLivre === livre.idLivre);
                        if (!livreEmprunte) {
                            const liLivre = document.createElement("li");

                               const contenuLivre = document.createElement("span");
                            contenuLivre.textContent = livre.titreLivre;
                            contenuLivre.addEventListener("click", () => emprunterLivre(livre));
                            liLivre.appendChild(contenuLivre);

                            const imgImage = document.createElement("img");
                            imgImage.src = "./img/image.svg";
                            imgImage.id = livre.titreLivre;
                            imgImage.className = "imgImageLivre";
                            liLivre.appendChild(imgImage);

                            const imgSupprimer = document.createElement("img");
                            imgSupprimer.src = "./img/x.svg";
                            imgSupprimer.id = livre.idLivre;
                            imgSupprimer.className = "imgSupLivre";
                            liLivre.appendChild(imgSupprimer);
                            ul.appendChild(liLivre);
                        }
                    });

                    ajouterEventListenersSupprimerLivre();
                    ajouterEventListenersImageLivre();
                })
                .catch((error) => {
                    console.error('Error fetching emprunts:', error);
                });
        })
        .catch((error) => {
            console.error('Error fetching livres:', error);
        });
}

/**
 * Ajoute un livre à la liste des livres disponibles.
 */
function ajouterLivre() {
    let xhr = new XMLHttpRequest();
    let inputField = document.getElementById("titreLivre");
    if (inputField.value !== "") {
        console.log(inputField.value);
        let titre = encodeURIComponent(inputField.value);
        let url = "./php/Controller/ControllerLivre.php?action=create";
        xhr.open("POST", url, true);

        // Ajoutez l'en-tête pour indiquer que vous envoyez des données de formulaire
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        // Envoyez les données en tant que paramètres POST
        xhr.send(`titre=${titre}`);
        inputField.value = "";

        // Ajoutez un écouteur d'événement pour détecter lorsque la requête est terminée
        xhr.addEventListener("load", function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                afficherListeLivresDisponibles();
            }
        });
    }
}

/**
 * Supprime un livre de la liste des livres disponibles et l'affiche dans la liste des livres empruntés.
 * @param livre
 */
function emprunterLivre(livre) {
    const idAdherent = prompt(`Veuillez entrer l'identifiant de l'adhérent qui empruntera le livre "${livre.titreLivre}"`);

    if (idAdherent) {
        let xhr = new XMLHttpRequest();
        let url = "./php/Controller/ControllerEmprunt.php?action=create";
        xhr.open("POST", url, true);

        // Ajoutez l'en-tête pour indiquer que vous envoyez des données de formulaire
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        // Envoyez les données en tant que paramètres POST
        xhr.send(`idAdherent=${idAdherent}&idLivre=${livre.idLivre}`);

        // Ajoutez un écouteur d'événement pour détecter lorsque la requête est terminée
        xhr.addEventListener("load", async function () {
            await updateRequete();

            if (xhr.readyState === XMLHttpRequest.DONE) {
                afficherListeLivresDisponibles();
            }
        });
    }
}

function ajouterEventListenersImageLivre() {
    const imgLivres = document.querySelectorAll(".imgImageLivre");
    imgLivres.forEach(function (imgLivres) {
        imgLivres.addEventListener("click", async function (event) {
            const titreCible = event.target.id;
            const livre = {titreLivre: titreCible};
            await popUpLivre(livre);

            //easter egg
            if (titreCible.includes("Star Wars") && !titreCible.includes("Lego")) {
            }
            if (titreCible.includes("Lego")) {
                const audio = new Audio("./audio/03lego.mp3");
                audio.load();
                audio.play();
            }
        });
    });
}

/**
 * Affiche une popup avec les informations du livre.
 * @param titreLivre
 * @param popupContent
 * @returns {Promise<any>}
 */
function getImageLivre(titreLivre, popupContent) {
    const apiKey = ""
    const googleBooksAPI = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(titreLivre)}&maxResults=1&key=${apiKey}`;
    return fetch(googleBooksAPI)
        .then((response) => response.json())
        .then((data) => {
            if (data.items && data.items.length > 0 && data.items[0].volumeInfo.imageLinks) {
                const imgCover = document.createElement("img");
                imgCover.src = data.items[0].volumeInfo.imageLinks.thumbnail;
                imgCover.alt = "Cover image";
                imgCover.className = "imgCover";
                popupContent.appendChild(imgCover);
            }
        })
        .catch((error) => {
            console.error("Error fetching cover image:", error);
        });
}

function ajouterEventListenersSupprimerLivre() {
    const imgSupLivres = document.querySelectorAll(".imgSupLivre");
    imgSupLivres.forEach(function (imgSupLivre) {
        imgSupLivre.addEventListener("click", async function (event) {
            const idCible = event.target.id;

            const confirmation = confirm("Voulez-vous vraiment supprimer ce livre ?");
            if (confirmation) {
                await supprimerLivre(idCible);
            }
        });
    });
}



/**
 * Supprime un livre de la liste des livres disponibles.
 * @param idLivre
 * @returns {Promise<void>}
 */
async function supprimerLivre(idLivre) {
    try {
        const response = await fetch(`php/Controller/ControllerLivre.php?action=delete&id=${idLivre}`, {
            method: "GET"
        });

        if (response.ok) {
            afficherListeLivresDisponibles();
        } else {
            console.error("Erreur lors de la suppression du livre:", response.statusText);
        }
    } catch (error) {
        console.error("Erreur lors de la suppression du livre:", error);
    }
}

/**
 * Affiche un popup avec les informations du livre.
 * @param livre
 * @returns {Promise<void>}
 */
async function popUpLivre(livre) {
    const popup = document.createElement("div");
    popup.id = "popup";
    popup.className = "popup";
    document.body.appendChild(popup);

    const popupContent = document.createElement("div");
    popupContent.className = "popup-content";
    popup.appendChild(popupContent);

    const gidR2D2 = "./img/stressed-stress.gif";
    //Affiche le gif et le supp après 3s
    const imgR2D2 = document.createElement("img");
    imgR2D2.src = gidR2D2;
    imgR2D2.id = "imgR2D2";


    const close = document.createElement("span");
    close.id = "close-popup";
    close.className = "close";
    close.innerHTML = "&times;";
    popupContent.appendChild(close);

    const title = document.createElement("h4");
    title.textContent = livre.titreLivre;
    popupContent.appendChild(title);

    await getImageLivre(livre.titreLivre, popupContent);

    // Affiche le pop-up
    popup.style.display = "block";


    if (livre.titreLivre.includes("Star Wars") && !livre.titreLivre.includes("Lego")) {
        const audio = new Audio("./audio/01r2d2.mp3");
        audio.load();
        await audio.play();

        popupContent.appendChild(imgR2D2);
        setTimeout(function () {
            popupContent.removeChild(imgR2D2);
        }, 3000);


    }

    // Ajoutez l'événement click à l'élément close
    close.addEventListener("click", function () {
        popup.style.display = "none";
        document.body.removeChild(popup);
    });

    // Fermez le pop-up lorsque l'utilisateur clique en dehors du contenu du pop-up
    window.addEventListener("click", function (event) {
        if (event.target === popup) {
            popup.style.display = "none";
            document.body.removeChild(popup);
        }
    });
}

/**
 * Affiche les suggestions de livres grâce à l'API de google.
 * @param val
 * @returns {Promise<void>}
 */
async function autocompletion(val) {
    const suggestionsLivres = document.getElementById("suggestionsLivres");
    const apiKey = "";
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${val}&maxResults=10&key=${apiKey}`;
    if (val.length === 0) {
        suggestionsLivres.innerHTML = "";
        suggestionsLivres.style.display = "none";
        return;
    }
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.items) {
            suggestionsLivres.innerHTML = "";
            suggestionsLivres.style.display = "block";

            data.items.forEach((item) => {
                const suggestion = document.createElement("div");
                suggestion.textContent = item.volumeInfo.title;
                suggestion.onclick = () => {
                    document.getElementById("titreLivre").value = suggestion.textContent;
                    suggestionsLivres.innerHTML = "";
                    suggestionsLivres.style.display = "none";
                };
                suggestionsLivres.appendChild(suggestion);
            });
        } else {
            suggestionsLivres.innerHTML = "";
            suggestionsLivres.style.display = "none";
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données de l'API :", error);
    }
}
//Fonction pour fermer la liste de suggestion lorsqu'on clique en dehors de la liste
function isOutsideSuggestions(element, suggestions) {
    while (element) {
        if (element === suggestions) {
            return false;
        }
        element = element.parentElement;
    }
    return true;
}

//Event listener pour fermer la liste de suggestion lorsqu'on clique en dehors de la liste
window.addEventListener("click", (event) => {
    const suggestionsLivres = document.getElementById("suggestionsLivres");
    if (isOutsideSuggestions(event.target, suggestionsLivres)) {
        suggestionsLivres.innerHTML = "";
        suggestionsLivres.style.display = "none";
    }
});