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

//Fin token
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
}

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

closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});

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

        div.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <span class="delete-icon"><i class="fa-solid fa-trash-can"></i></span>
        `;

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

init();
