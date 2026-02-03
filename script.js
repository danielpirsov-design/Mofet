const searchForm = document.querySelector("#searchForm");
const resultsGrid = document.querySelector("#resultsGrid");
const sortBy = document.querySelector("#sortBy");
const loadingOverlay = document.querySelector("#loadingOverlay");
const statusPill = document.querySelector("#statusPill");
const resultsStatus = document.querySelector("#resultsStatus");
const resultsSummary = document.querySelector("#resultsSummary");
const emptyState = document.querySelector("#emptyState");

const baseResults = [
  {
    category: "Flights",
    provider: "Qatar Airways",
    price: 249,
    duration: "2h 35m",
    rating: 4.6,
    seats: 9,
    perk: "1 checked bag",
  },
  {
    category: "Trains",
    provider: "Eurostar",
    price: 189,
    duration: "3h 10m",
    rating: 4.4,
    seats: 4,
    perk: "High-speed rail",
  },
  {
    category: "Buses",
    provider: "FlixBus",
    price: 215,
    duration: "4h 00m",
    rating: 4.7,
    seats: 12,
    perk: "Wi-Fi onboard",
  },
  {
    category: "BNB stays",
    provider: "Booking.com",
    price: 142,
    duration: "5h 20m",
    rating: 4.2,
    seats: 7,
    perk: "Free cancellation",
  },
  {
    category: "Car rentals",
    provider: "Hertz",
    price: 89,
    duration: "Per day",
    rating: 4.3,
    seats: 5,
    perk: "Automatic SUV",
  },
  {
    category: "Ferries",
    provider: "Stena Line",
    price: 120,
    duration: "6h 15m",
    rating: 4.5,
    seats: 18,
    perk: "Cabin upgrade",
  },
  {
    category: "Bikes",
    provider: "Lime",
    price: 18,
    duration: "Per hour",
    rating: 4.1,
    seats: 1,
    perk: "E-bike option",
  },
];

const formatDuration = (duration) => `Estimated duration: ${duration}`;

const setStatus = (status, summary) => {
  statusPill.textContent = status;
  resultsStatus.textContent = status;
  resultsSummary.textContent = summary;
};

const renderResults = (category, destination, travelers) => {
  const matchingResults = baseResults.filter(
    (result) => result.category === category
  );
  const sortedResults = [...matchingResults].sort((a, b) => {
    if (sortBy.value === "price") return a.price - b.price;
    if (sortBy.value === "duration") {
      return a.duration.localeCompare(b.duration);
    }
    return b.rating - a.rating;
  });

  resultsGrid.innerHTML = "";
  if (sortedResults.length === 0) {
    emptyState.style.display = "block";
    return;
  }
  emptyState.style.display = "none";
  sortedResults.forEach((result) => {
    const card = document.createElement("div");
    card.className = "result-card";
    card.innerHTML = `
      <h3>${result.provider}</h3>
      <div class="price">$${result.price}</div>
      <div class="meta">${category} to ${destination}</div>
      <div class="meta">${formatDuration(result.duration)}</div>
      <div class="meta">${result.perk}</div>
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
  setStatus("Searching global providers…", "Updating live inventory");
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
    setStatus(
      "Live results ready",
      `${category} · ${destination} · ${travelers} traveler${
        travelers > 1 ? "s" : ""
      }`
    );
  }, 1600);
});

sortBy.addEventListener("change", () => {
  const category = document.querySelector("#category").value || "Flights";
  const travelers = Number(document.querySelector("#travelers").value) || 1;
  const destination =
    document.querySelector("#destination").value.trim() || "Paris";
  renderResults(category, destination, travelers);
  setStatus(
    "Sorted results",
    `${category} · ${destination} · ${travelers} traveler${
      travelers > 1 ? "s" : ""
    }`
  );
});

const runInitialSearch = () => {
  const category = "Flights";
  const destination = "Paris";
  const travelers = 2;
  setStatus("Preparing your global dashboard…", "Launching automatic preview");
  showLoading();
  setTimeout(() => {
    hideLoading();
    renderResults(category, destination, travelers);
    setStatus(
      "Live results ready",
      `${category} · ${destination} · ${travelers} travelers`
    );
  }, 1200);
};

runInitialSearch();
