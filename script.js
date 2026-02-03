const searchForm = document.querySelector("#searchForm");
const resultsGrid = document.querySelector("#resultsGrid");
const sortBy = document.querySelector("#sortBy");
const loadingOverlay = document.querySelector("#loadingOverlay");

const baseResults = [
  {
    provider: "Skyline Travel",
    price: 249,
    duration: "2h 35m",
    rating: 4.6,
    seats: 9,
  },
  {
    provider: "BlueRail Express",
    price: 189,
    duration: "3h 10m",
    rating: 4.4,
    seats: 4,
  },
  {
    provider: "Coastal Lines",
    price: 215,
    duration: "4h 00m",
    rating: 4.7,
    seats: 12,
  },
  {
    provider: "MetroMove",
    price: 142,
    duration: "5h 20m",
    rating: 4.2,
    seats: 7,
  },
];

const formatDuration = (duration) => `Estimated duration: ${duration}`;

const renderResults = (category, destination, travelers) => {
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
      <div class="meta">${category} to ${destination}</div>
      <div class="meta">${formatDuration(result.duration)}</div>
      <div class="meta">Rating: ${result.rating} ★</div>
      <div class="meta">Seats left for ${travelers}: ${Math.max(
        result.seats - travelers,
        0
      )}</div>
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
  const destination = document.querySelector("#destination").value.trim();

  if (!category || !destination) return;

  showLoading();
  setTimeout(() => {
    hideLoading();
    renderResults(category, destination, travelers);
  }, 1600);
});

sortBy.addEventListener("change", () => {
  const category = document.querySelector("#category").value || "Flights";
  const travelers = Number(document.querySelector("#travelers").value) || 1;
  const destination =
    document.querySelector("#destination").value.trim() || "Paris";
  renderResults(category, destination, travelers);
});

renderResults("Flights", "Paris", 2);
