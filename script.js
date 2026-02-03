const searchForm = document.querySelector("#searchForm");
const resultsGrid = document.querySelector("#resultsGrid");
const sortBy = document.querySelector("#sortBy");
const loadingOverlay = document.querySelector("#loadingOverlay");
const categorySelect = document.querySelector("#category");
const integrationGrid = document.querySelector("#integrationGrid");
const locationOptions = document.querySelector("#location-options");
const locationInputs = document.querySelectorAll(".location-input");
const filterPanels = document.querySelectorAll(".filter-panel");

const locationSuggestions = [
  "Paris, France",
  "London, UK",
  "Rome, Italy",
  "Barcelona, Spain",
  "Berlin, Germany",
  "Lisbon, Portugal",
  "Amsterdam, Netherlands",
  "Athens, Greece",
  "Dubai, UAE",
  "New York, USA",
  "Los Angeles, USA",
  "Tokyo, Japan",
  "Singapore, Singapore",
  "Bangkok, Thailand",
  "Sydney, Australia",
  "Cape Town, South Africa",
  "Mexico City, Mexico",
  "Toronto, Canada",
];

const providerMap = {
  Flights: [
    {
      provider: "Skyline Travel",
      price: 249,
      duration: "2h 35m",
      rating: 4.6,
      seats: 9,
      tags: ["economy", "direct", "city break", "short haul"],
    },
    {
      provider: "CloudWing",
      price: 312,
      duration: "3h 20m",
      rating: 4.8,
      seats: 5,
      tags: ["premium", "flexible", "business"],
    },
    {
      provider: "SunJet",
      price: 198,
      duration: "2h 50m",
      rating: 4.4,
      seats: 11,
      tags: ["budget", "carry-on", "weekend"],
    },
  ],
  Trains: [
    {
      provider: "BlueRail Express",
      price: 189,
      duration: "3h 10m",
      rating: 4.4,
      seats: 4,
      tags: ["fast", "wifi", "city center"],
    },
    {
      provider: "EuroTrack",
      price: 162,
      duration: "3h 45m",
      rating: 4.5,
      seats: 10,
      tags: ["quiet car", "first class", "panoramic"],
    },
    {
      provider: "MetroLine",
      price: 139,
      duration: "4h 05m",
      rating: 4.1,
      seats: 14,
      tags: ["budget", "regional"],
    },
  ],
  Buses: [
    {
      provider: "MetroMove",
      price: 142,
      duration: "5h 20m",
      rating: 4.2,
      seats: 7,
      tags: ["overnight", "usb", "recliner"],
    },
    {
      provider: "RoadRunner",
      price: 118,
      duration: "5h 55m",
      rating: 4.1,
      seats: 12,
      tags: ["budget", "express"],
    },
    {
      provider: "CityLink",
      price: 132,
      duration: "5h 05m",
      rating: 4.0,
      seats: 18,
      tags: ["eco", "downtown"],
    },
  ],
  "Car rentals": [
    {
      provider: "DriveNow",
      price: 75,
      duration: "Daily",
      rating: 4.3,
      seats: 6,
      tags: ["compact", "automatic", "airport pickup"],
    },
    {
      provider: "CityKeys",
      price: 92,
      duration: "Daily",
      rating: 4.6,
      seats: 4,
      tags: ["suv", "free cancellation"],
    },
    {
      provider: "RoadTrip",
      price: 68,
      duration: "Daily",
      rating: 4.1,
      seats: 5,
      tags: ["budget", "manual", "fuel efficient"],
    },
  ],
  Ferries: [
    {
      provider: "Coastal Lines",
      price: 215,
      duration: "4h 00m",
      rating: 4.7,
      seats: 12,
      tags: ["sea view", "cabin", "pets"],
    },
    {
      provider: "HarborLink",
      price: 198,
      duration: "4h 30m",
      rating: 4.5,
      seats: 8,
      tags: ["family", "snacks"],
    },
    {
      provider: "IslandWay",
      price: 176,
      duration: "5h 10m",
      rating: 4.3,
      seats: 16,
      tags: ["day trip", "budget"],
    },
  ],
  Bikes: [
    {
      provider: "PedalPro",
      price: 28,
      duration: "Per hour",
      rating: 4.6,
      seats: 20,
      tags: ["city bike", "helmet included"],
    },
    {
      provider: "CycleNow",
      price: 32,
      duration: "Per hour",
      rating: 4.4,
      seats: 15,
      tags: ["e-bike", "guided"],
    },
    {
      provider: "TrailRide",
      price: 36,
      duration: "Per hour",
      rating: 4.2,
      seats: 10,
      tags: ["mountain", "trail"],
    },
  ],
  Taxis: [
    {
      provider: "CityCab",
      price: 34,
      duration: "20 min",
      rating: 4.3,
      seats: 4,
      tags: ["airport", "standard"],
    },
    {
      provider: "RapidRide",
      price: 41,
      duration: "18 min",
      rating: 4.5,
      seats: 5,
      tags: ["premium", "priority pickup"],
    },
    {
      provider: "MetroTaxi",
      price: 29,
      duration: "25 min",
      rating: 4.1,
      seats: 4,
      tags: ["budget", "shared"],
    },
  ],
  Stays: [
    {
      provider: "Blue Harbor Hotel",
      price: 140,
      duration: "Per night",
      rating: 4.5,
      seats: 6,
      tags: ["hotel", "breakfast", "spa"],
    },
    {
      provider: "Urban Loft Apartments",
      price: 122,
      duration: "Per night",
      rating: 4.4,
      seats: 4,
      tags: ["apartment", "kitchen", "central"],
    },
    {
      provider: "Seaside House",
      price: 176,
      duration: "Per night",
      rating: 4.7,
      seats: 8,
      tags: ["house", "family", "beach"],
    },
    {
      provider: "Vintage BNB",
      price: 98,
      duration: "Per night",
      rating: 4.2,
      seats: 3,
      tags: ["bnb", "budget", "historic"],
    },
  ],
};

const integrationProviders = [
  { name: "Booking", category: "Stays", status: "Awaiting API key" },
  { name: "Airbnb", category: "Stays", status: "Awaiting API key" },
  { name: "Expedia", category: "Stays", status: "Awaiting API key" },
  { name: "Skyscanner", category: "Flights", status: "Awaiting API key" },
  { name: "Amadeus", category: "Flights", status: "Awaiting API key" },
  { name: "Rome2Rio", category: "Trains/Buses", status: "Awaiting API key" },
  { name: "FerryHopper", category: "Ferries", status: "Awaiting API key" },
  { name: "Rentalcars.com", category: "Car rentals", status: "Awaiting API key" },
  { name: "Ride-hailing partners", category: "Taxis", status: "Awaiting API key" },
];

const formatDuration = (duration) => `Estimated duration: ${duration}`;

const normalizeValue = (value) => value.toLowerCase();

const updateLocationOptions = (value) => {
  const query = value.trim().toLowerCase();
  const matches = locationSuggestions.filter((item) =>
    item.toLowerCase().includes(query)
  );
  const options = (query ? matches : locationSuggestions).slice(0, 8);
  locationOptions.innerHTML = "";
  options.forEach((optionValue) => {
    const option = document.createElement("option");
    option.value = optionValue;
    locationOptions.appendChild(option);
  });
};

const setActiveFilters = (category) => {
  filterPanels.forEach((panel) => {
    const categories = panel.dataset.categories.split(" ");
    if (categories.includes(category)) {
      panel.classList.add("active");
    } else {
      panel.classList.remove("active");
    }
  });
};

const getSelectedPropertyTypes = () => {
  return Array.from(
    document.querySelectorAll('.filter-panel[data-categories="Stays"] input[type="checkbox"]')
  )
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
};

const getSearchQuery = (category) => {
  const destination = document.querySelector("#destination").value.trim();
  const routeFrom = document.querySelector("#routeFrom").value.trim();
  const routeTo = document.querySelector("#routeTo").value.trim();
  const stayLocation = document.querySelector("#stayLocation").value.trim();
  const taxiPickup = document.querySelector("#taxiPickup").value.trim();
  const taxiDropoff = document.querySelector("#taxiDropoff").value.trim();
  const carPickup = document.querySelector("#carPickup").value.trim();
  const carDropoff = document.querySelector("#carDropoff").value.trim();
  const bikePickup = document.querySelector("#bikePickup").value.trim();

  const queryParts = [destination];
  if (["Flights", "Trains", "Buses", "Ferries"].includes(category)) {
    queryParts.push(routeFrom, routeTo);
  }
  if (category === "Stays") {
    queryParts.push(stayLocation);
  }
  if (category === "Taxis") {
    queryParts.push(taxiPickup, taxiDropoff);
  }
  if (category === "Car rentals") {
    queryParts.push(carPickup, carDropoff);
  }
  if (category === "Bikes") {
    queryParts.push(bikePickup);
  }

  return queryParts.filter(Boolean).join(" ").trim();
};

const buildSearchSummary = (category, destination, travelers) => {
  const summaryParts = [];
  if (destination) {
    summaryParts.push(`Destination: ${destination}`);
  }

  if (["Flights", "Trains", "Buses", "Ferries"].includes(category)) {
    const routeFrom = document.querySelector("#routeFrom").value.trim();
    const routeTo = document.querySelector("#routeTo").value.trim();
    if (routeFrom || routeTo) {
      summaryParts.push(`Route: ${routeFrom || "?"} → ${routeTo || "?"}`);
    }
  }

  if (category === "Car rentals") {
    const pickup = document.querySelector("#carPickup").value.trim();
    const dropoff = document.querySelector("#carDropoff").value.trim();
    if (pickup || dropoff) {
      summaryParts.push(`Pickup/Drop-off: ${pickup || "?"} → ${dropoff || "?"}`);
    }
  }

  if (category === "Bikes") {
    const bikePickup = document.querySelector("#bikePickup").value.trim();
    const bikeType = document.querySelector("#bikeType").value;
    if (bikePickup) summaryParts.push(`Pickup: ${bikePickup}`);
    summaryParts.push(`Bike type: ${bikeType}`);
  }

  if (category === "Taxis") {
    const taxiPickup = document.querySelector("#taxiPickup").value.trim();
    const taxiDropoff = document.querySelector("#taxiDropoff").value.trim();
    if (taxiPickup || taxiDropoff) {
      summaryParts.push(`Ride: ${taxiPickup || "?"} → ${taxiDropoff || "?"}`);
    }
  }

  if (category === "Stays") {
    const stayLocation = document.querySelector("#stayLocation").value.trim();
    const stayRooms = document.querySelector("#stayRooms").value;
    const stayRating = document.querySelector("#stayRating").value;
    const types = getSelectedPropertyTypes();
    if (stayLocation) summaryParts.push(`Location: ${stayLocation}`);
    summaryParts.push(`Rooms: ${stayRooms}`);
    summaryParts.push(`Rating: ${stayRating}`);
    if (types.length) summaryParts.push(`Types: ${types.join(", ")}`);
  }

  summaryParts.push(`Travelers: ${travelers}`);
  return summaryParts;
};

const renderResults = (category, destination, travelers) => {
  const results = providerMap[category] || providerMap.Flights;
  const searchQuery = getSearchQuery(category);
  const queryTokens = searchQuery
    ? normalizeValue(searchQuery).split(/\s+/).filter(Boolean)
    : [];
  const sortedResults = [...results].sort((a, b) => {
    if (sortBy.value === "price") return a.price - b.price;
    if (sortBy.value === "duration") {
      return a.duration.localeCompare(b.duration);
    }
    return b.rating - a.rating;
  });

  const filteredResults = queryTokens.length
    ? sortedResults.filter((result) => {
        const searchable = normalizeValue(
          [result.provider, ...(result.tags || [])].join(" ")
        );
        return queryTokens.some((token) => searchable.includes(token));
      })
    : sortedResults;

  const summaryParts = buildSearchSummary(category, destination, travelers);

  resultsGrid.innerHTML = "";
  if (!filteredResults.length) {
    const card = document.createElement("div");
    card.className = "result-card empty";
    card.innerHTML = `
      <h3>No matches yet</h3>
      <div class="meta">
        Try another keyword or adjust your filters to see more results.
      </div>
    `;
    resultsGrid.appendChild(card);
    return;
  }

  filteredResults.forEach((result) => {
    const card = document.createElement("div");
    card.className = "result-card";
    card.innerHTML = `
      <h3>${result.provider}</h3>
      <div class="price">$${result.price}</div>
      <div class="meta">${category}</div>
      ${summaryParts.map((item) => `<div class="meta">${item}</div>`).join("")}
      <div class="meta">Highlights: ${(result.tags || []).join(", ")}</div>
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

const renderIntegrations = () => {
  integrationGrid.innerHTML = "";
  integrationProviders.forEach((provider) => {
    const card = document.createElement("div");
    card.className = "integration-card";
    card.innerHTML = `
      <strong>${provider.name}</strong>
      <span>Category: ${provider.category}</span>
      <span>Status: ${provider.status}</span>
    `;
    integrationGrid.appendChild(card);
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

const getDestinationValue = (category) => {
  const destination = document.querySelector("#destination").value.trim();
  if (destination) return destination;
  if (category === "Stays") return document.querySelector("#stayLocation").value.trim();
  if (category === "Taxis") return document.querySelector("#taxiDropoff").value.trim();
  if (["Flights", "Trains", "Buses", "Ferries"].includes(category)) {
    return document.querySelector("#routeTo").value.trim();
  }
  if (category === "Car rentals") return document.querySelector("#carDropoff").value.trim();
  if (category === "Bikes") return document.querySelector("#bikePickup").value.trim();
  return "";
};

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const category = categorySelect.value;
  const travelers = Number(document.querySelector("#travelers").value);
  const destination = getDestinationValue(category) || "Any location";

  if (!category) return;

  showLoading();
  setTimeout(() => {
    hideLoading();
    renderResults(category, destination, travelers);
  }, 1600);
});

sortBy.addEventListener("change", () => {
  const category = categorySelect.value || "Flights";
  const travelers = Number(document.querySelector("#travelers").value) || 1;
  const destination = getDestinationValue(category) || "Paris, France";
  renderResults(category, destination, travelers);
});

categorySelect.addEventListener("change", (event) => {
  setActiveFilters(event.target.value);
});

locationInputs.forEach((input) => {
  input.addEventListener("input", (event) => {
    updateLocationOptions(event.target.value);
  });
});

updateLocationOptions("");
setActiveFilters("Flights");
renderIntegrations();
renderResults("Flights", "Paris, France", 2);
