//Token
const token = localStorage.getItem("token");

if (token) {
    document.getElementById("edition-banner").classList.remove("hidden");
}

const loginLink = document.getElementById("login-link");

if (token) {
    loginLink.textContent = "logout";
    loginLink.href = "#";
}

loginLink.addEventListener("click", () => {
    if (token) {
        localStorage.removeItem("token");
        window.location.reload();
    }
});

if (token) {
    document.getElementById("filters").style.display = "none";
}

if (token) {
    document.getElementById("edit-button").classList.remove("hidden");
}

//Récupération des projets depuis l’API
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    return works;
}

function displayWorks(works) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    works.forEach(work => {
        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;
        img.dataset.id = work.id; // 🔥 obligatoire

        const figcaption = document.createElement("figcaption");
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}


async function init() {
    const works = await getWorks();
    displayWorks(works);
    setupFilters(works);
    displayModalGallery(works);

    const categories = await getCategories();
    populateCategorySelect(categories);
}

// Gestion des filtres
function setupFilters(works) {
    const buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach(button => {
        button.addEventListener("click", () => {

            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const categoryId = parseInt(button.dataset.id);

            if (categoryId === 0) {
                displayWorks(works);
            } else {
                const filteredWorks = works.filter(work => work.categoryId === categoryId);
                displayWorks(filteredWorks);
            }
        });
    });
}

// ouverture modale

const editButton = document.querySelector(".edit-btn");
console.log("editButton =", editButton);

editButton.addEventListener("click", () => {
    console.log("clic sur modifier");
    document.getElementById("modal").classList.remove("hidden");
});


// Fermeture modale
const modal = document.getElementById("modal");
const closeModal = document.querySelector(".close-modal");

//  Le clic sur la croix déclenche la fermeture
closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});

// Le clic en dehors de la modale déclenche la fermeture
modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.classList.add("hidden");
    }
});

// Affichage gallerie dans la modale
function displayModalGallery(works) {
    const modalWorks = document.getElementById("modal-works");
    modalWorks.innerHTML = "";

    works.forEach(work => {
        const div = document.createElement("div");
        div.classList.add("modal-work");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const deleteIcon = document.createElement("span");
        deleteIcon.classList.add("delete-icon");
        deleteIcon.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

        // 🔥 Le clic sur la poubelle déclenche la suppression
        deleteIcon.addEventListener("click", () => {
            deleteWork(work.id, div);
        });

        div.appendChild(img);
        div.appendChild(deleteIcon);
        modalWorks.appendChild(div);
    });
}


//passer à l'ecran ajoutez une photo
document.getElementById("open-add-photo").addEventListener("click", () => {
    document.getElementById("modal-gallery").classList.add("hidden");
    document.getElementById("modal-add").classList.remove("hidden");
});

// revenir à l'ecran gallerie
document.getElementById("back-to-gallery").addEventListener("click", () => {
    document.getElementById("modal-add").classList.add("hidden");
    document.getElementById("modal-gallery").classList.remove("hidden");
});

// categories
async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    return categories;
}

function populateCategorySelect(categories) {
    const select = document.getElementById("category-input");
    select.innerHTML = "";

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}
// Gestion de l'upload de photo pour ouvrir le sélecteur de fichiers lorsque l'utilisateur clique sur le bouton "Ajouter photo"
const photoInput = document.getElementById("photo-input");
const uploadBtn = document.getElementById("photo-upload-btn");

uploadBtn.addEventListener("click", () => {
    photoInput.click();
});

// afficher l'aperçu de la photo sélectionnée
photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (!file) return;

    const reader = new FileReader();
// affichage image dans la zone d'upload
    reader.onload = function(e) {
        const uploadArea = document.getElementById("photo-upload-area");
        uploadArea.innerHTML = `<img src="${e.target.result}" alt="preview">`;
    };

    reader.readAsDataURL(file);
});

// Supprimer un projet
async function deleteWork(id, figureElement) {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*"
        }
    });

    console.log("DELETE status =", response.status); 

    if (response.ok) {
        // Supprimer dans la modale
        figureElement.remove();

        // Supprimer dans la galerie principale
        const mainGallery = document.querySelector(".gallery");
        const imgToRemove = mainGallery.querySelector(`img[data-id="${id}"]`);
        if (imgToRemove) {
            imgToRemove.parentElement.remove();
        }
    } else {
        alert("Impossible de supprimer le projet");
    }
}

document.getElementById("add-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = photoInput.files[0];
    const title = document.getElementById("title-input").value;
    const category = document.getElementById("category-input").value;

    if (!file || !title || !category) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    // Si tout est bon → on envoie
    await sendNewWork(file, title, category);
    addWorkToModal(newWork);

});

// Envoyer le nouveau projet à l’API (POST)
async function sendNewWork(file, title, category) {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", category);

    const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    });

    if (response.ok) {
        alert("Projet ajouté avec succès !");
        const newWork = await response.json();

        // Ajouter dans la galerie principale
    addWorkToGallery(newWork);   // portfolio
    addWorkToModal(newWork);     // modale
    
        // Retour à la galerie
        document.getElementById("modal-add").classList.add("hidden");
        document.getElementById("modal-gallery").classList.remove("hidden");
    } else {
        alert("Erreur lors de l'ajout du projet.");
    }
}

//Ajouter le nouveau projet dans la galerie principale (sans recharger)
function addWorkToGallery(work) {
    const gallery = document.querySelector(".gallery");

    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    img.dataset.id = work.id;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
}

function addWorkToModal(work) {
    const modalWorks = document.getElementById("modal-works");

    const div = document.createElement("div");
    div.classList.add("modal-work");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const deleteIcon = document.createElement("span");
    deleteIcon.classList.add("delete-icon");
    deleteIcon.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    deleteIcon.addEventListener("click", () => {
        deleteWork(work.id, div);
    });

    div.appendChild(img);
    div.appendChild(deleteIcon);
    modalWorks.appendChild(div);
}

init();
