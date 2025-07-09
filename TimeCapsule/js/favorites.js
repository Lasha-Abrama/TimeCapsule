(() => {
  const favoritesContainer = document.getElementById("favoritesList");

  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem("favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveFavorites = (favorites) => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  const renderFavorites = (favorites) => {
    if (!favorites.length) {
      favoritesContainer.innerHTML = "<p>You have no favorite events yet.</p>";
      return;
    }

    favoritesContainer.innerHTML = favorites
      .map(
        (event, idx) => `
        <article class="event-card">
          <h3>${event.year}</h3>
          <p>${event.description}</p>
          <button class="btn btn-remove" data-id="${idx}">Remove</button>
        </article>
      `
      )
      .join("");
  };

  const removeFavorite = (idx) => {
    const favorites = loadFavorites();
    favorites.splice(idx, 1);
    saveFavorites(favorites);
    renderFavorites(favorites);
  };

  favoritesContainer.addEventListener("click", (e) => {
    if (e.target.matches(".btn-remove")) {
      const idx = e.target.dataset.id;
      if (
        confirm("Are you sure you want to remove this from your favorites?")
      ) {
        removeFavorite(idx);
      }
    }
  });

  const init = () => {
    const favorites = loadFavorites();
    renderFavorites(favorites);
  };

  init();
})();
