const searchForm = document.querySelector("#searchForm");
const resultsGrid = document.querySelector("#resultsGrid");
const sortBy = document.querySelector("#sortBy");
const loadingOverlay = document.querySelector("#loadingOverlay");

const citySuggestions = [
  "Paris, France",
  "Berlin, Germany",
  "Rome, Italy",
  "Barcelona, Spain",
  "Lisbon, Portugal",
  "Amsterdam, Netherlands",
  "Vienna, Austria",
  "Zurich, Switzerland",
  "London, United Kingdom",
  "New York, USA",
  "Tokyo, Japan",
  "Singapore",
  "Dubai, UAE",
];

const providerLinkBuilders = {
  Emirates: (destination) =>
    `https://www.emirates.com/english/book/?destination=${destination}`,
  Lufthansa: (destination) =>
    `https://www.lufthansa.com/us/en/flight-search?destination=${destination}`,
  "Qatar Airways": (destination) =>
    `https://www.qatarairways.com/en/book.html?to=${destination}`,
  "SNCF / TGV INOUI": (destination) =>
    `https://www.sncf-connect.com/en-en/trip?arrival=${destination}`,
  "Deutsche Bahn": (destination) =>
    `https://www.bahn.com/en?arrival=${destination}`,
  Eurostar: (destination) =>
    `https://www.eurostar.com/search?arrival=${destination}`,
  FlixBus: (destination) =>
    `https://www.flixbus.com/search?arrivalCity=${destination}`,
  "National Express": (destination) =>
    `https://www.nationalexpress.com/en?destination=${destination}`,
  Megabus: (destination) =>
    `https://us.megabus.com/journey-planner?destination=${destination}`,
  Hertz: (destination) =>
    `https://www.hertz.com/rentacar/reservation/?location=${destination}`,
  Sixt: (destination) =>
    `https://www.sixt.com/booking/?location=${destination}`,
  Avis: (destination) =>
    `https://www.avis.com/en/reservation?location=${destination}`,
  DFDS: (destination) =>
    `https://www.dfds.com/en/passenger-ferries/search?destination=${destination}`,
  "Stena Line": (destination) =>
    `https://www.stenaline.com/book?destination=${destination}`,
  "Brittany Ferries": (destination) =>
    `https://www.brittany-ferries.co.uk/search?destination=${destination}`,
  Nextbike: (destination) =>
    `https://www.nextbike.net/en/locations?search=${destination}`,
  Bird: (destination) =>
    `https://www.bird.co/map/?location=${destination}`,
  Mobike: (destination) =>
    `https://mobike.com/global/search?location=${destination}`,
  Omio: (destination) => `https://www.omio.com/search?to=${destination}`,
  Rome2Rio: (destination) => `https://www.rome2rio.com/map/${destination}`,
  "12Go": (destination) => `https://12go.asia/en?to=${destination}`,
  "Booking.com": (destination) =>
    `https://www.booking.com/searchresults.html?ss=${destination}`,
  Airbnb: (destination) =>
    `https://www.airbnb.com/s/${destination}/homes`,
  Hipcamp: (destination) =>
    `https://www.hipcamp.com/en-US/search?search_term=${destination}`,
};

const resultsByCategory = {
  Flights: [
    {
      provider: "Emirates",
      price: 642,
      duration: "7h 25m",
      rating: 4.8,
      seats: 6,
      details: [
        "Direct flight • Economy Flex",
        "1 checked bag + cabin bag",
        "Changeable with low fee",
      ],
      site: "Emirates",
    },
    {
      provider: "Lufthansa",
      price: 589,
      duration: "8h 05m",
      rating: 4.6,
      seats: 4,
      details: ["1 stop • Premium Economy", "Flexible cancellation", "Skytrax 4★"],
      site: "Lufthansa",
    },
    {
      provider: "Qatar Airways",
      price: 714,
      duration: "7h 55m",
      rating: 4.9,
      seats: 9,
      details: ["Direct flight • Business", "Lounge access", "Priority boarding"],
      site: "Qatar Airways",
    },
  ],
  Trains: [
    {
      provider: "SNCF / TGV INOUI",
      price: 164,
      duration: "3h 02m",
      rating: 4.5,
      seats: 12,
      details: ["First class seat", "Wi-Fi onboard", "Free cancellation"],
      site: "SNCF / TGV INOUI",
    },
    {
      provider: "Deutsche Bahn",
      price: 142,
      duration: "3h 40m",
      rating: 4.4,
      seats: 8,
      details: ["ICE train", "Seat reservation", "Flexible ticket"],
      site: "Deutsche Bahn",
    },
    {
      provider: "Eurostar",
      price: 198,
      duration: "2h 15m",
      rating: 4.7,
      seats: 5,
      details: ["Standard Premier", "Fast-track boarding", "Changeable fare"],
      site: "Eurostar",
    },
  ],
  Buses: [
    {
      provider: "FlixBus",
      price: 46,
      duration: "6h 20m",
      rating: 4.1,
      seats: 20,
      details: ["Reserved seat", "Air conditioning", "2 bags included"],
      site: "FlixBus",
    },
    {
      provider: "National Express",
      price: 52,
      duration: "5h 50m",
      rating: 4.0,
      seats: 11,
      details: ["Extra legroom", "Onboard Wi-Fi", "Flexible ticket"],
      site: "National Express",
    },
    {
      provider: "Megabus",
      price: 39,
      duration: "6h 10m",
      rating: 3.9,
      seats: 14,
      details: ["Seat guarantee", "No change fees", "USB charging"],
      site: "Megabus",
    },
  ],
  "Car rentals": [
    {
      provider: "Hertz",
      price: 78,
      duration: "Per day",
      rating: 4.3,
      seats: 7,
      details: ["SUV • Automatic", "Full insurance", "Free cancellation"],
      site: "Hertz",
    },
    {
      provider: "Sixt",
      price: 64,
      duration: "Per day",
      rating: 4.5,
      seats: 9,
      details: ["Compact • Hybrid", "Unlimited mileage", "Pay on pickup"],
      site: "Sixt",
    },
    {
      provider: "Avis",
      price: 72,
      duration: "Per day",
      rating: 4.4,
      seats: 5,
      details: ["Midsize • Automatic", "Premium cover", "Priority desk"],
      site: "Avis",
    },
  ],
  Ferries: [
    {
      provider: "DFDS",
      price: 94,
      duration: "4h 30m",
      rating: 4.6,
      seats: 16,
      details: ["Cabin upgrade", "Car pickup", "Flexible ticket"],
      site: "DFDS",
    },
    {
      provider: "Stena Line",
      price: 88,
      duration: "5h 10m",
      rating: 4.4,
      seats: 10,
      details: ["Lounge access", "Vehicle space", "Changeable fare"],
      site: "Stena Line",
    },
    {
      provider: "Brittany Ferries",
      price: 102,
      duration: "6h 00m",
      rating: 4.5,
      seats: 7,
      details: ["Sea view cabin", "Pet friendly", "Dining credit"],
      site: "Brittany Ferries",
    },
  ],
  "Bikes & micro-mobility": [
    {
      provider: "Nextbike",
      price: 12,
      duration: "Per day",
      rating: 4.2,
      seats: 22,
      details: ["City bike", "Helmet included", "Unlimited rides"],
      site: "Nextbike",
    },
    {
      provider: "Bird",
      price: 8,
      duration: "Per hour",
      rating: 4.0,
      seats: 15,
      details: ["E-scooter", "50 km range", "Dockless pickup"],
      site: "Bird",
    },
    {
      provider: "Mobike",
      price: 10,
      duration: "Per day",
      rating: 4.1,
      seats: 18,
      details: ["Smart lock", "City zone map", "24/7 support"],
      site: "Mobike",
    },
  ],
  "Combined transport": [
    {
      provider: "Omio",
      price: 186,
      duration: "4h 05m",
      rating: 4.4,
      seats: 9,
      details: ["Train + bus", "1 change", "Cheapest fare"],
      site: "Omio",
    },
    {
      provider: "Rome2Rio",
      price: 214,
      duration: "3h 20m",
      rating: 4.3,
      seats: 6,
      details: ["Flight + rail", "Fastest route", "Flexible timing"],
      site: "Rome2Rio",
    },
    {
      provider: "12Go",
      price: 172,
      duration: "4h 40m",
      rating: 4.2,
      seats: 11,
      details: ["Bus + ferry", "2 changes", "Low cost"],
      site: "12Go",
    },
  ],
  Accommodations: [
    {
      provider: "Booking.com",
      price: 138,
      duration: "Per night",
      rating: 4.5,
      seats: 6,
      details: ["4★ boutique hotel", "Free cancellation", "Breakfast included"],
      site: "Booking.com",
    },
    {
      provider: "Airbnb",
      price: 116,
      duration: "Per night",
      rating: 4.7,
      seats: 4,
      details: ["2-bedroom apartment", "Self check-in", "Kitchen + laundry"],
      site: "Airbnb",
    },
    {
      provider: "Hipcamp",
      price: 74,
      duration: "Per night",
      rating: 4.6,
      seats: 8,
      details: ["Eco campsite", "Pet friendly", "Parking included"],
      site: "Hipcamp",
    },
  ],
};

const formatDuration = (duration) => `Estimated duration: ${duration}`;
const destinationInput = document.querySelector("#destination");

const slugifyProvider = (provider) =>
  provider
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "")
    .trim();

const buildProviderLink = (provider, category, destination) => {
  const encodedDestination = encodeURIComponent(destination);
  const builder = providerLinkBuilders[provider];
  if (builder) return builder(encodedDestination);
  const encodedCategory = encodeURIComponent(category);
  return `https://www.${slugifyProvider(
    provider
  )}.com/?category=${encodedCategory}&destination=${encodedDestination}`;
};

const getCityMatch = (value) => {
  const query = value.trim().toLowerCase();
  if (query.length < 2) return null;
  return (
    citySuggestions.find((city) =>
      city.toLowerCase().startsWith(query)
    ) || null
  );
};

const renderResults = (category, destination, travelers) => {
  const baseResults = resultsByCategory[category] || [];
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
      <ul>
        ${result.details.map((detail) => `<li>${detail}</li>`).join("")}
      </ul>
      <a href="${buildProviderLink(
        result.site,
        category,
        destination
      )}" target="_blank" rel="noreferrer">Open provider</a>
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

destinationInput.addEventListener("input", (event) => {
  const match = getCityMatch(event.target.value);
  if (match && match.length > event.target.value.length) {
    event.target.value = match;
  }
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const category = document.querySelector("#category").value;
  const travelers = Number(document.querySelector("#travelers").value);
  const destination = destinationInput.value.trim();

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
  const destination = destinationInput.value.trim() || "Paris, France";
  renderResults(category, destination, travelers);
});

renderResults("Flights", "Paris, France", 2);
