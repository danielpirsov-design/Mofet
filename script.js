const searchForm = document.querySelector("#searchForm");
const resultsGrid = document.querySelector("#resultsGrid");
const resultsSummary = document.querySelector("#resultsSummary");
const sortBy = document.querySelector("#sortBy");
const loadingOverlay = document.querySelector("#loadingOverlay");
const prevPageButton = document.querySelector("#prevPage");
const nextPageButton = document.querySelector("#nextPage");
const pageIndicator = document.querySelector("#pageIndicator");

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

const formatDuration = (duration) => `Estimated duration: ${duration}`;
const destinationInput = document.querySelector("#destination");
const adultsInput = document.querySelector("#adults");
const childrenInput = document.querySelector("#children");
const datesInput = document.querySelector("#dates");
const showAllInput = document.querySelector("#showAll");
const resultsState = {
  category: "Flights",
  destination: "Paris, France",
  travelers: 2,
  showAll: false,
  page: 1,
  pageSize: 6,
  adults: 2,
  children: 0,
  dates: "",
  sort: "price",
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

const updateResultsSummary = (category, destination, travelers, showAll, total, page, pageCount) => {
  const categoryLabel = showAll ? "All categories" : category;
  resultsSummary.textContent = `${categoryLabel} results for ${destination} • ${
    travelers
  } traveler${travelers === 1 ? "" : "s"} • ${total} options`;
  pageIndicator.textContent = `Page ${page} of ${pageCount || 1}`;
};

const renderResults = (destination, travelers, showAll, payload) => {
  resultsGrid.innerHTML = "";
  payload.results.forEach((result) => {
    const card = document.createElement("div");
    card.className = "result-card";
    card.innerHTML = `
      <h3>${result.provider}</h3>
      <div class="price">$${result.price}</div>
      <div class="meta">${result.category} to ${destination}</div>
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
  updateResultsSummary(
    resultsState.category,
    destination,
    travelers,
    showAll,
    payload.total,
    payload.page,
    payload.pageCount
  );
  prevPageButton.disabled = payload.page <= 1;
  nextPageButton.disabled = payload.page >= payload.pageCount;
  resultsState.page = payload.page;
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

const buildSearchParams = ({
  category,
  destination,
  adults,
  children,
  dates,
  showAll,
  page,
  sort,
}) => {
  const params = new URLSearchParams();
  params.set("category", category);
  params.set("destination", destination);
  params.set("adults", String(adults));
  params.set("children", String(children));
  if (dates) params.set("dates", dates);
  if (showAll) params.set("showAll", "true");
  if (page) params.set("page", String(page));
  if (sort) params.set("sort", sort);
  return params;
};

const parseSearchParams = () => {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  const destination = params.get("destination");
  const adults = Number(params.get("adults") || 0);
  const children = Number(params.get("children") || 0);
  const dates = params.get("dates") || "";
  const showAll = params.get("showAll") === "true";
  const page = Number(params.get("page") || 1);
  const sort = params.get("sort") || "price";
  if (!category || !destination) return null;
  return { category, destination, adults, children, dates, showAll, page, sort };
};

const openResultsInNewTab = (params) => {
  const url = `${window.location.pathname}?${params.toString()}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

const fetchResults = async ({ category, destination, adults, children, dates, showAll, page }) => {
  const params = buildSearchParams({
    category,
    destination,
    adults,
    children,
    dates,
    showAll,
    page,
    sort: resultsState.sort,
  });
  params.set("pageSize", String(resultsState.pageSize));
  const response = await fetch(`/api/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to load results");
  }
  return response.json();
};

const loadResults = async ({ page }) => {
  try {
    showLoading();
    const payload = await fetchResults({
      category: resultsState.category,
      destination: resultsState.destination,
      adults: resultsState.adults,
      children: resultsState.children,
      dates: resultsState.dates,
      showAll: resultsState.showAll,
      page,
    });
    renderResults(resultsState.destination, resultsState.travelers, resultsState.showAll, payload);
  } catch (error) {
    resultsSummary.textContent = "Unable to load results. Please try again.";
    resultsGrid.innerHTML = "";
  } finally {
    hideLoading();
  }
};

prevPageButton.addEventListener("click", () => {
  loadResults({ page: resultsState.page - 1 });
});

nextPageButton.addEventListener("click", () => {
  loadResults({ page: resultsState.page + 1 });
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const category = document.querySelector("#category").value;
  const adults = Number(adultsInput.value);
  const children = Number(childrenInput.value);
  const destination = destinationInput.value.trim();
  const dates = datesInput.value.trim();
  const showAll = showAllInput.checked;

  if (!category || !destination || Number.isNaN(adults) || Number.isNaN(children)) {
    return;
  }

  const travelers = adults + children;
  resultsState.category = category;
  resultsState.destination = destination;
  resultsState.travelers = travelers;
  resultsState.showAll = showAll;
  resultsState.adults = adults;
  resultsState.children = children;
  resultsState.dates = dates;
  resultsState.sort = sortBy.value;
  resultsState.page = 1;
  const params = buildSearchParams({
    category,
    destination,
    adults,
    children,
    dates,
    showAll,
    page: 1,
    sort: resultsState.sort,
  });
  setTimeout(() => {
    loadResults({ page: 1 });
    openResultsInNewTab(params);
  }, 1600);
});

sortBy.addEventListener("change", () => {
  const category = document.querySelector("#category").value || "Flights";
  const adults = Number(adultsInput.value) || 1;
  const children = Number(childrenInput.value) || 0;
  const destination = destinationInput.value.trim() || "Paris, France";
  const dates = datesInput.value.trim();
  const showAll = showAllInput.checked;
  resultsState.category = category;
  resultsState.destination = destination;
  resultsState.travelers = adults + children;
  resultsState.showAll = showAll;
  resultsState.adults = adults;
  resultsState.children = children;
  resultsState.dates = dates;
  resultsState.sort = sortBy.value;
  resultsState.page = 1;
  loadResults({ page: resultsState.page });
});

const seededSearch = parseSearchParams();
if (seededSearch) {
  const { category, destination, adults, children, dates, showAll, page, sort } = seededSearch;
  document.querySelector("#category").value = category;
  adultsInput.value = String(adults || 1);
  childrenInput.value = String(children || 0);
  destinationInput.value = destination;
  datesInput.value = dates;
  showAllInput.checked = showAll;
  sortBy.value = sort;
  resultsState.category = category;
  resultsState.destination = destination;
  resultsState.travelers = adults + children;
  resultsState.showAll = showAll;
  resultsState.adults = adults;
  resultsState.children = children;
  resultsState.dates = dates;
  resultsState.sort = sort;
  resultsState.page = page;
  loadResults({ page });
} else {
  loadResults({ page: resultsState.page });
}
