const formatDatePart = (num) => (num < 10 ? `0${num}` : num);

// Random Highlights from the Past
(() => {
  const highlightContainer = document.getElementById("highlightContainer");
  if (!highlightContainer) return;

  const fetchHighlights = async () => {
    const today = new Date();
    const month = formatDatePart(today.getMonth() + 1);
    const day = formatDatePart(today.getDate());

    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`
      );
      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();
      const events = data.events || [];

      if (!events.length) {
        highlightContainer.innerHTML = "<p>No highlights found for today.</p>";
        return;
      }

      const randomFour = events.sort(() => 0.5 - Math.random()).slice(0, 4);

      randomFour.forEach((event) => {
        const year = event.year || "Unknown Year";
        const description = event.text || "No description available";
        const box = document.createElement("div");
        box.className = "timeline-box";
        box.innerHTML = `
          <h3>${year}</h3>
          <p>${description}</p>
        `;
        highlightContainer.appendChild(box);
      });
    } catch (error) {
      highlightContainer.innerHTML = `<p>Failed to load highlights: ${error.message}</p>`;
    }
  };

  fetchHighlights();
})();

/* Today's Page*/
(() => {
  const todayEventsContainer = document.getElementById("todayEvents");
  const loadMoreBtn = document.getElementById("load-more-btn");

  if (!todayEventsContainer || !loadMoreBtn) return;

  let allEvents = [];
  let currentIndex = 0;
  const batchSize = 8;

  const fetchTodayEvents = async () => {
    const today = new Date();
    const month = formatDatePart(today.getMonth() + 1);
    const day = formatDatePart(today.getDate());

    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`
      );
      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();
      allEvents = data.events || [];

      if (!allEvents.length) {
        todayEventsContainer.innerHTML =
          "<p>No historical events found for today.</p>";
        loadMoreBtn.style.display = "none";
        return;
      }

      renderNextBatch();
    } catch (error) {
      todayEventsContainer.innerHTML = `<p>Failed to load events: ${error.message}</p>`;
      loadMoreBtn.style.display = "none";
    }
  };

  const renderNextBatch = () => {
    const nextEvents = allEvents.slice(currentIndex, currentIndex + batchSize);

    nextEvents.forEach((event) => {
      const year = event.year || "Unknown Year";
      const description = event.text || "No description available";
      const wikiUrl = event.pages[0].content_urls.desktop.page || null;

      const article = document.createElement("article");
      article.className = "event-card";

      article.innerHTML = `
        <h3>${year}</h3>
        <p>${description}</p>
        <div class="btn-group">
          ${
            wikiUrl
              ? `<a href="${wikiUrl}" class="btn secondary" target="_blank">See More</a>`
              : ""
          }
          <button class="btn btn-favorite">Add to Favorites</button>
        </div>
      `;

      todayEventsContainer.appendChild(article);
    });

    currentIndex += batchSize;
    if (currentIndex >= allEvents.length) {
      loadMoreBtn.style.display = "none";
    }
  };

  loadMoreBtn.addEventListener("click", renderNextBatch);

  todayEventsContainer.addEventListener("click", (e) => {
    if (e.target.matches(".btn-favorite")) {
      const card = e.target.closest(".event-card");
      const year = card.querySelector("h3").textContent;
      const description = card.querySelector("p").textContent;

      const newFav = { year, description };
      let favs = JSON.parse(localStorage.getItem("favorites")) || [];

      if (!favs.some((f) => f.year === year && f.description === description)) {
        favs.push(newFav);
        localStorage.setItem("favorites", JSON.stringify(favs));
        alert("Event added to favorites!");
      } else {
        alert("This event is already in your favorites.");
      }
    }
  });

  fetchTodayEvents();
})();
