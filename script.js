const searchForm = document.querySelector("#searchForm");
const resultsGrid = document.querySelector("#resultsGrid");
const resultsTable = document.querySelector("#resultsTable");
const sortBy = document.querySelector("#sortBy");
const loadingOverlay = document.querySelector("#loadingOverlay");
const originInput = document.querySelector("#origin");
const destinationInput = document.querySelector("#destination");
const originSuggestions = document.querySelector("#originSuggestions");
const destinationSuggestions = document.querySelector("#destinationSuggestions");
const detectLocationButton = document.querySelector("#detectLocation");
const locationStatus = document.querySelector("#locationStatus");
const travelDate = document.querySelector("#travelDate");

const locationOptions = [
  { name: "Paris, France", type: "City", code: "PAR" },
  { name: "Palermo, Italy", type: "City", code: "PMO" },
  { name: "Panama City, Panama", type: "City", code: "PTY" },
  { name: "Palo Alto, USA", type: "City", code: "PAO" },
  { name: "Paris Charles de Gaulle Airport", type: "Airport", code: "CDG" },
  { name: "London St Pancras International", type: "Train Station", code: "STP" },
  { name: "Roma Termini", type: "Train Station", code: "ROM" },
  { name: "New York Port Authority Bus Terminal", type: "Bus Terminal", code: "PABT" },
  { name: "Port of Barcelona", type: "Port", code: "BCN" },
  { name: "Changi Airport", type: "Airport", code: "SIN" },
  { name: "Tokyo Station", type: "Train Station", code: "TYO" },
  { name: "Dubai Marina", type: "Landmark", code: "DXB" },
  { name: "San Francisco Ferry Building", type: "Port", code: "SFFB" },
  { name: "Gare du Nord", type: "Train Station", code: "GDN" },
  { name: "Berlin Brandenburg Airport", type: "Airport", code: "BER" },
];

const baseResults = [
  {
    provider: "Emirates",
    price: 412,
    durationMinutes: 385,
    rating: 4.8,
    policy: "Flex fare, 1 checked bag, low CO₂",
    link: "https://www.emirates.com",
  },
  {
    provider: "SNCF/TGV",
    price: 129,
    durationMinutes: 215,
    rating: 4.6,
    policy: "Seat selection, free Wi-Fi, flexible change",
    link: "https://www.sncf-connect.com",
  },
  {
    provider: "FlixBus",
    price: 48,
    durationMinutes: 410,
    rating: 4.2,
    policy: "Extra legroom, onboard toilet, baggage included",
    link: "https://www.flixbus.com",
  },
  {
    provider: "Hertz",
    price: 62,
    durationMinutes: 95,
    rating: 4.4,
    policy: "Automatic transmission, free cancellation",
    link: "https://www.hertz.com",
  },
];

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const renderResults = (category, origin, destination, travelers) => {
  const sortedResults = [...baseResults].sort((a, b) => {
    if (sortBy.value === "price") return a.price - b.price;
    if (sortBy.value === "duration") return a.durationMinutes - b.durationMinutes;
    return b.rating - a.rating;
  });

  resultsTable.innerHTML = "";
  resultsGrid.innerHTML = "";

  sortedResults.forEach((result) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${result.provider}</td>
      <td>$${result.price}</td>
      <td>${formatDuration(result.durationMinutes)}</td>
      <td>${result.rating} ★</td>
      <td>${result.policy}</td>
      <td><a href="${result.link}" target="_blank" rel="noreferrer">Open</a></td>
    `;
    resultsTable.appendChild(row);

    const card = document.createElement("div");
    card.className = "result-card";
    card.innerHTML = `
      <h3>${result.provider}</h3>
      <div class="price">$${result.price}</div>
      <div class="meta">${category}: ${origin} → ${destination}</div>
      <div class="meta">Estimated duration: ${formatDuration(result.durationMinutes)}</div>
      <div class="meta">${result.policy}</div>
      <div class="meta">Rating: ${result.rating} ★</div>
      <div class="meta">Seats left for ${travelers}: ${Math.max(12 - travelers, 0)}</div>
      <a class="ghost-button" href="${result.link}" target="_blank" rel="noreferrer">
        View provider
      </a>
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

const buildSuggestions = (value, listElement, inputElement) => {
  const trimmedValue = value.trim().toLowerCase();
  listElement.innerHTML = "";

  if (!trimmedValue) {
    listElement.classList.remove("active");
    return;
  }

  const matches = locationOptions
    .filter((option) => option.name.toLowerCase().includes(trimmedValue))
    .slice(0, 6);

  if (matches.length === 0) {
    listElement.classList.remove("active");
    return;
  }

  matches.forEach((option) => {
    const item = document.createElement("li");
    item.innerHTML = `${option.name}<strong>${option.type} · ${option.code}</strong>`;
    item.addEventListener("click", () => {
      inputElement.value = option.name;
      listElement.classList.remove("active");
    });
    listElement.appendChild(item);
  });

  listElement.classList.add("active");
};

const hideSuggestions = (listElement) => {
  listElement.classList.remove("active");
};

originInput.addEventListener("input", (event) => {
  buildSuggestions(event.target.value, originSuggestions, originInput);
});

destinationInput.addEventListener("input", (event) => {
  buildSuggestions(event.target.value, destinationSuggestions, destinationInput);
});

originInput.addEventListener("blur", () => {
  setTimeout(() => hideSuggestions(originSuggestions), 150);
});

destinationInput.addEventListener("blur", () => {
  setTimeout(() => hideSuggestions(destinationSuggestions), 150);
});

detectLocationButton.addEventListener("click", () => {
  locationStatus.textContent = "Detecting location…";
  if (!navigator.geolocation) {
    locationStatus.textContent = "Location services are not supported on this device.";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      locationStatus.textContent = `Detected near ${position.coords.latitude.toFixed(
        2
      )}, ${position.coords.longitude.toFixed(2)}.`;
    },
    () => {
      locationStatus.textContent =
        "Location permission denied. Enter a city, airport, or station instead.";
    },
    { enableHighAccuracy: true, timeout: 4000 }
  );
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const category = document.querySelector("#category").value;
  const travelers = Number(document.querySelector("#travelers").value);
  const origin = originInput.value.trim();
  const destination = destinationInput.value.trim();

  if (!category || !origin || !destination) return;

  const showDelay = setTimeout(() => {
    showLoading();
  }, 900);

  const simulatedDuration = Math.floor(900 + Math.random() * 1500);
  setTimeout(() => {
    clearTimeout(showDelay);
    hideLoading();
    renderResults(category, origin, destination, travelers);
  }, simulatedDuration);
});

sortBy.addEventListener("change", () => {
  const category = document.querySelector("#category").value || "Flights";
  const travelers = Number(document.querySelector("#travelers").value) || 1;
  const origin = originInput.value.trim() || "Paris, France";
  const destination = destinationInput.value.trim() || "Berlin, Germany";
  renderResults(category, origin, destination, travelers);
});

travelDate.value = new Date().toISOString().split("T")[0];
renderResults("Flights", "Paris, France", "Berlin, Germany", 2);
