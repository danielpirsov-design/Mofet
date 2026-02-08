const searchForm = document.querySelector("#searchForm");
const resultsGrid = document.querySelector("#resultsGrid");
const sortBy = document.querySelector("#sortBy");
const loadingOverlay = document.querySelector("#loadingOverlay");

const baseResults = [
  {
    provider: "Emirates Skyward",
    price: 289,
    duration: "2h 35m",
    rating: 4.8,
    seats: 9,
    link: "https://www.emirates.com",
    perks: "1 checked bag · Flexible change",
  },
  {
    provider: "EuroRail Connect",
    price: 169,
    duration: "3h 10m",
    rating: 4.6,
    seats: 4,
    link: "https://www.eurostar.com",
    perks: "Wi-Fi · Quiet car",
  },
  {
    provider: "FlixBus Plus",
    price: 88,
    duration: "4h 00m",
    rating: 4.4,
    seats: 12,
    link: "https://www.flixbus.com",
    perks: "Reserved seat · Luggage included",
  },
  {
    provider: "Seaside Ferries",
    price: 129,
    duration: "5h 20m",
    rating: 4.3,
    seats: 7,
    link: "https://www.stenaline.com",
    perks: "Cabins available · Vehicle boarding",
  },
];

const formatDuration = (duration) => `Estimated duration: ${duration}`;

const renderResults = (category, destination, travelers, origin) => {
  const sortedResults = [...baseResults].sort((a, b) => {
    if (sortBy.value === "price") return a.price - b.price;
    if (sortBy.value === "duration") {
      return a.duration.localeCompare(b.duration);
    }
    return b.rating - a.rating;
  });

  resultsGrid.innerHTML = "";
  sortedResults.forEach((result) => {
    const card = document.createElement("div");
    card.className = "result-card";
    card.innerHTML = `
      <h3>${result.provider}</h3>
      <div class="price">$${result.price}</div>
      <div class="meta">${category} · ${origin} → ${destination}</div>
      <div class="meta">${formatDuration(result.duration)}</div>
      <div class="meta">${result.perks}</div>
      <div class="meta">Rating: ${result.rating} ★</div>
      <div class="meta">Seats left for ${travelers}: ${Math.max(
        result.seats - travelers,
        0
      )}</div>
      <div class="actions">
        <a class="link-button" href="${result.link}" target="_blank" rel="noreferrer">
          Open provider
        </a>
        <a class="link-button secondary" href="${result.link}" target="_blank" rel="noreferrer">
          View full details
        </a>
      </div>
    `;
    resultsGrid.appendChild(card);
  });
};

const showLoading = () => {
  loadingOverlay.classList.add("active");
  loadingOverlay.setAttribute("aria-hidden", "false");
};

const hideLoading = () => {
  loadingOverlay.classList.remove("active");
  loadingOverlay.setAttribute("aria-hidden", "true");
};

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const category = document.querySelector("#category").value;
  const travelers = Number(document.querySelector("#travelers").value);
  const origin = document.querySelector("#origin").value.trim();
  const destination = document.querySelector("#destination").value.trim();

  if (!category || !origin || !destination) return;

  showLoading();
  setTimeout(() => {
    hideLoading();
    renderResults(category, destination, travelers, origin);
  }, 1600);
});

sortBy.addEventListener("change", () => {
  const category = document.querySelector("#category").value || "Flights";
  const travelers = Number(document.querySelector("#travelers").value) || 1;
  const origin =
    document.querySelector("#origin").value.trim() || "Amsterdam";
  const destination =
    document.querySelector("#destination").value.trim() || "Paris";
  renderResults(category, destination, travelers, origin);
});

renderResults("Flights", "Paris", 2, "Amsterdam");
