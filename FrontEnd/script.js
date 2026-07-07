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



init();
