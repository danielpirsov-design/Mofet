const loadingOverlay = document.getElementById("loadingOverlay");
const searchButton = document.getElementById("searchButton");
const closeLoading = document.getElementById("closeLoading");
const searchInput = document.getElementById("searchInput");

const showLoading = () => {
  loadingOverlay.classList.add("active");
  loadingOverlay.setAttribute("aria-hidden", "false");
};

const hideLoading = () => {
  loadingOverlay.classList.remove("active");
  loadingOverlay.setAttribute("aria-hidden", "true");
};

searchButton.addEventListener("click", () => {
  if (!searchInput.value.trim()) {
    searchInput.focus();
    return;
  }
  showLoading();
});

closeLoading.addEventListener("click", hideLoading);

loadingOverlay.addEventListener("click", (event) => {
  if (event.target === loadingOverlay) {
    hideLoading();
  }
});
