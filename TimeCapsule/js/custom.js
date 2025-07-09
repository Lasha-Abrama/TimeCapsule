(() => {
  const form = document.getElementById("customForm");
  const eventsContainer = document.getElementById("customEvents");
  const loadMoreBtn = document.getElementById("load-more-btn");

  let allEvents = [];
  let currentIndex = 0;
  const batchSize = 8;

  const formatDatePart = (num) => (num < 10 ? `0${num}` : num);

  const renderNextBatch = () => {
    const nextBatch = allEvents.slice(currentIndex, currentIndex + batchSize);
    nextBatch.forEach((event) => {
      const year = event.year || "Unknown Year";
      const description = event.text || "No description available";
      const wikiTitle =
        event.pages && event.pages.length > 0
          ? event.pages[0].normalizedtitle
          : null;
      const wikiUrl = wikiTitle
        ? `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiTitle)}`/* to safely format URLs */
        : null;

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
          <button class="btn btn-favorite" >Add to Favorites</button>
        </div>
      `;
      eventsContainer.appendChild(article);
    });

    currentIndex += batchSize;
    loadMoreBtn.style.display =
      currentIndex < allEvents.length ? "block" : "none";
  };

  /* This fetches the events from Wikipedia for a given month and day.*/
  const fetchCustomEvents = async (month, day) => {
    eventsContainer.innerHTML = "<p>Loading events...</p>";
    loadMoreBtn.style.display = "none";
    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`
      );
      if (!res.ok) throw new Error("Network response not ok");

      const data = await res.json();
      allEvents = data.events || [];
      currentIndex = 0;
      eventsContainer.innerHTML = "";

      if (!allEvents.length) {
        eventsContainer.innerHTML =
          "<p>No historical events found for this date.</p>";
        return;
      }
      renderNextBatch();
    } catch (err) {
      eventsContainer.innerHTML = `<p>Failed to load events: ${err.message}</p>`;
    }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const m = parseInt(form.month.value, 10);/*Decimal*/
    const d = parseInt(form.day.value, 10);
    if (
      isNaN(m) ||
      isNaN(d) ||
      m < 1 ||
      m > 12 ||
      d < 1 ||
      d > 31 ||
      (m === 2 && d > 29) ||
      ([4, 6, 9, 11].includes(m) && d > 30)
    ) {
      alert("Please enter a valid date.");
      return;
    }
    fetchCustomEvents(formatDatePart(m), formatDatePart(d));
  });

  /*Load More button*/
  loadMoreBtn.addEventListener("click", renderNextBatch);

  /*Add To Favorites*/
  eventsContainer.addEventListener("click", (e) => {
    if (e.target.matches(".btn-favorite")) {
      const card = e.target.closest(".event-card");
      const year = card.querySelector("h3").textContent;
      const description = card.querySelector("p").textContent;
      const newFav = { year, description };
      const favs = JSON.parse(localStorage.getItem("favorites")) || [];
      if (!favs.some((f) => f.year === year && f.description === description)) {
        favs.push(newFav);
        localStorage.setItem("favorites", JSON.stringify(favs));
        alert("Event added to favorites!");
      } else {
        alert("This event is already in your favorites.");
      }
    }
  });
})();
