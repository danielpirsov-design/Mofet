const searchForm = document.querySelector("#searchForm");
const resultsGrid = document.querySelector("#resultsGrid");
const sortBy = document.querySelector("#sortBy");
const loadingOverlay = document.querySelector("#loadingOverlay");

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
      link: "https://www.emirates.com/",
    },
    {
      provider: "Lufthansa",
      price: 589,
      duration: "8h 05m",
      rating: 4.6,
      seats: 4,
      details: ["1 stop • Premium Economy", "Flexible cancellation", "Skytrax 4★"],
      link: "https://www.lufthansa.com/",
    },
    {
      provider: "Qatar Airways",
      price: 714,
      duration: "7h 55m",
      rating: 4.9,
      seats: 9,
      details: ["Direct flight • Business", "Lounge access", "Priority boarding"],
      link: "https://www.qatarairways.com/",
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
      link: "https://www.sncf.com/",
    },
    {
      provider: "Deutsche Bahn",
      price: 142,
      duration: "3h 40m",
      rating: 4.4,
      seats: 8,
      details: ["ICE train", "Seat reservation", "Flexible ticket"],
      link: "https://www.bahn.com/",
    },
    {
      provider: "Eurostar",
      price: 198,
      duration: "2h 15m",
      rating: 4.7,
      seats: 5,
      details: ["Standard Premier", "Fast-track boarding", "Changeable fare"],
      link: "https://www.eurostar.com/",
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
      link: "https://www.flixbus.com/",
    },
    {
      provider: "National Express",
      price: 52,
      duration: "5h 50m",
      rating: 4.0,
      seats: 11,
      details: ["Extra legroom", "Onboard Wi-Fi", "Flexible ticket"],
      link: "https://www.nationalexpress.com/",
    },
    {
      provider: "Megabus",
      price: 39,
      duration: "6h 10m",
      rating: 3.9,
      seats: 14,
      details: ["Seat guarantee", "No change fees", "USB charging"],
      link: "https://us.megabus.com/",
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
      link: "https://www.hertz.com/",
    },
    {
      provider: "Sixt",
      price: 64,
      duration: "Per day",
      rating: 4.5,
      seats: 9,
      details: ["Compact • Hybrid", "Unlimited mileage", "Pay on pickup"],
      link: "https://www.sixt.com/",
    },
    {
      provider: "Avis",
      price: 72,
      duration: "Per day",
      rating: 4.4,
      seats: 5,
      details: ["Midsize • Automatic", "Premium cover", "Priority desk"],
      link: "https://www.avis.com/",
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
      link: "https://www.dfds.com/",
    },
    {
      provider: "Stena Line",
      price: 88,
      duration: "5h 10m",
      rating: 4.4,
      seats: 10,
      details: ["Lounge access", "Vehicle space", "Changeable fare"],
      link: "https://www.stenaline.com/",
    },
    {
      provider: "Brittany Ferries",
      price: 102,
      duration: "6h 00m",
      rating: 4.5,
      seats: 7,
      details: ["Sea view cabin", "Pet friendly", "Dining credit"],
      link: "https://www.brittany-ferries.co.uk/",
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
      link: "https://www.nextbike.net/",
    },
    {
      provider: "Bird",
      price: 8,
      duration: "Per hour",
      rating: 4.0,
      seats: 15,
      details: ["E-scooter", "50 km range", "Dockless pickup"],
      link: "https://www.bird.co/",
    },
    {
      provider: "Mobike",
      price: 10,
      duration: "Per day",
      rating: 4.1,
      seats: 18,
      details: ["Smart lock", "City zone map", "24/7 support"],
      link: "https://mobike.com/",
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
      link: "https://www.omio.com/",
    },
    {
      provider: "Rome2Rio",
      price: 214,
      duration: "3h 20m",
      rating: 4.3,
      seats: 6,
      details: ["Flight + rail", "Fastest route", "Flexible timing"],
      link: "https://www.rome2rio.com/",
    },
    {
      provider: "12Go",
      price: 172,
      duration: "4h 40m",
      rating: 4.2,
      seats: 11,
      details: ["Bus + ferry", "2 changes", "Low cost"],
      link: "https://12go.asia/",
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
      link: "https://www.booking.com/",
    },
    {
      provider: "Airbnb",
      price: 116,
      duration: "Per night",
      rating: 4.7,
      seats: 4,
      details: ["2-bedroom apartment", "Self check-in", "Kitchen + laundry"],
      link: "https://www.airbnb.com/",
    },
    {
      provider: "Hipcamp",
      price: 74,
      duration: "Per night",
      rating: 4.6,
      seats: 8,
      details: ["Eco campsite", "Pet friendly", "Parking included"],
      link: "https://www.hipcamp.com/",
    },
  ],
};

const formatDuration = (duration) => `Estimated duration: ${duration}`;

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
      <a href="${result.link}" target="_blank" rel="noreferrer">Open provider</a>
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
