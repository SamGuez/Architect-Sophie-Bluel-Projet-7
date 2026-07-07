const form = document.getElementById("login-form");

form.addEventListener("submit", async (event) => {
    event.preventDefault(); // empêche le rechargement de la page

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error("Identifiants incorrects");
        }

        const data = await response.json();

        // Stocker le token
        localStorage.setItem("token", data.token);

        // Redirection vers l'accueil
        window.location.href = "index.html";

    } catch (error) {
        const errorMsg = document.createElement("p");
        errorMsg.textContent = "Erreur : email ou mot de passe incorrect";
        errorMsg.style.color = "red";
        errorMsg.style.marginTop = "10px";

        // éviter de dupliquer le message
        if (!form.querySelector("p")) {
            form.appendChild(errorMsg);
        }
    }
});
