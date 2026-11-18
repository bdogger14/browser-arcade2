const games = [
    {
        name: "2048",
        category: "Puzzle",
        icon: "🔢",
        path: "games/2048/"
    },
    {
        name: "Snake",
        category: "Puzzle",
        icon: "🐍",
        path: "games/snake/"
    },
    {
        name: "Geometry Dash",
        category: "Action",
        icon: "🟪",
        path: "games/geometry-dash/"
    },
    {
        name: "Racing",
        category: "Racing",
        icon: "🏎️",
        path: "games/racing/"
    },
    {
        name: "Basketball",
        category: "Sports",
        icon: "🏀",
        path: "games/basketball/"
    },
    {
        name: "Adventure",
        category: "Adventure",
        icon: "🌎",
        path: "games/adventure/"
    }
];

let favorites = JSON.parse(
    localStorage.getItem("ba-favorites") || "[]"
);

let recent = JSON.parse(
    localStorage.getItem("ba-recent") || "[]"
);

function saveData() {
    localStorage.setItem(
        "ba-favorites",
        JSON.stringify(favorites)
    );

    localStorage.setItem(
        "ba-recent",
        JSON.stringify(recent)
    );
}

function createCard(game) {
    const card = document.createElement("article");
    card.className = "game-card";

    const thumbnail = document.createElement("div");
    thumbnail.className = "game-thumbnail";
    thumbnail.textContent = game.icon;

    const details = document.createElement("div");
    details.className = "game-details";

    const title = document.createElement("h3");
    title.textContent = game.name;

    const category = document.createElement("p");
    category.textContent = game.category;

    const favorite = document.createElement("button");
    favorite.className = "favorite-button";

    favorite.textContent =
        favorites.includes(game.name) ? "★" : "☆";

    favorite.classList.toggle(
        "active",
        favorites.includes(game.name)
    );

    favorite.setAttribute(
        "aria-label",
        "Toggle favorite for " + game.name
    );

    favorite.addEventListener("click", event => {
        event.stopPropagation();

        if (favorites.includes(game.name)) {
            favorites = favorites.filter(
                name => name !== game.name
            );
        } else {
            favorites.push(game.name);
        }

        saveData();
        renderGames();
    });

    details.append(favorite, title, category);
    card.append(thumbnail, details);

    card.addEventListener("click", () => openGame(game));

    return card;
}

function renderRow(elementId, list) {
    const container = document.getElementById(elementId);

    container.replaceChildren();

    if (list.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-message";
        message.textContent = "Nothing here yet.";
        container.appendChild(message);
        return;
    }

    list.forEach(game => {
        container.appendChild(createCard(game));
    });
}

function renderGames() {
    renderRow("popular-games", games);

    renderRow(
        "action-games",
        games.filter(game => game.category === "Action")
    );

    renderRow(
        "puzzle-games",
        games.filter(game => game.category === "Puzzle")
    );

    renderRow(
        "favorite-games",
        games.filter(game => favorites.includes(game.name))
    );

    renderRow(
        "recent-games",
        recent.map(name => games.find(game => game.name === name))
            .filter(Boolean)
    );
}

function openGame(game) {
    document.getElementById("player-title").textContent =
        game.name;

    const modal = document.getElementById("player-modal");

    modal.style.display = "flex";

    recent = [
        game.name,
        ...recent.filter(name => name !== game.name)
    ].slice(0, 10);

    saveData();
    renderGames();
}

document.getElementById("close-player").addEventListener(
    "click",
    () => {
        document.getElementById("player-modal").style.display =
            "none";
    }
);

document.getElementById("fullscreen-button").addEventListener(
    "click",
    () => {
        const screen = document.getElementById("player-screen");

        if (!document.fullscreenElement) {
            screen.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    }
);

document.getElementById("search").addEventListener(
    "input",
    event => {
        const query = event.target.value.toLowerCase();

        const results = games.filter(game =>
            game.name.toLowerCase().includes(query) ||
            game.category.toLowerCase().includes(query)
        );

        renderRow("popular-games", results);
    }
);

renderGames();
