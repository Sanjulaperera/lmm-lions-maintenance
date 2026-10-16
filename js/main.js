const progressFill = document.getElementById("progress-fill");
let progressFrame = 0;

function updateProgress() {
  progressFrame = 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
  progressFill.style.transform = `scaleX(${progress})`;
}

function onScroll() {
  if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
}

updateProgress();
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);

const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const menuLabel = menuButton.querySelector(".sr-only");
const menuIcon = menuButton.querySelector(".menu-icon");
const closeIcon = menuButton.querySelector(".close-icon");

function setMenu(open) {
  mobileMenu.hidden = !open;
  menuButton.setAttribute("aria-expanded", String(open));
  menuIcon.hidden = open;
  closeIcon.hidden = !open;
  menuLabel.textContent = open ? "Close menu" : "Open menu";
  document.body.style.overflow = open ? "hidden" : "";
}

menuButton.addEventListener("click", () => setMenu(mobileMenu.hidden));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !mobileMenu.hidden) setMenu(false);
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024 && !mobileMenu.hidden) setMenu(false);
});

const filterButtons = document.querySelectorAll(".filter-btn");
const workItems = [...document.querySelectorAll(".work-item")];

function applyFilter(value) {
  filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.filter === value));
  });

  let featured = false;
  workItems.forEach((item) => {
    const show = value === "all" || item.dataset.category === value;
    item.hidden = !show;
    const isFeatured = show && !featured;
    item.classList.toggle("is-featured", isFeatured);
    if (show) featured = true;
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => applyFilter(button.dataset.filter));
});

const serviceOptions = [
  "Fencing",
  "Decking",
  "Landscaping",
  "Retaining wall",
  "Paving & paths",
  "Gates & screens",
  "Something else",
];

const form = document.getElementById("quote-form");
const formAlert = document.getElementById("form-alert");
const successPanel = document.getElementById("quote-success");
const successMessage = document.getElementById("success-message");

const fields = ["name", "phone", "email", "suburb", "service", "details"];

function fieldError(id) {
  return document.getElementById(`${id}-error`);
}

function clearErrors() {
  formAlert.hidden = true;
  formAlert.textContent = "";
  fields.forEach((id) => {
    const input = form.elements[id];
    const error = fieldError(id);
    input.removeAttribute("aria-invalid");
    input.removeAttribute("aria-describedby");
    error.hidden = true;
    error.textContent = "";
  });
}

function showError(id, message) {
  const input = form.elements[id];
  const error = fieldError(id);
  input.setAttribute("aria-invalid", "true");
  input.setAttribute("aria-describedby", `${id}-error`);
  error.hidden = false;
  error.textContent = message;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();

  const values = {
    name: form.elements.name.value.trim(),
    phone: form.elements.phone.value.trim(),
    email: form.elements.email.value.trim(),
    suburb: form.elements.suburb.value.trim(),
    service: form.elements.service.value.trim(),
    details: form.elements.details.value.trim(),
  };

  const errors = {};
  const digits = values.phone.replace(/[\s()+-]/g, "");

  if (values.name.length < 2 || values.name.length > 80) errors.name = "Please enter your name.";
  if (!/^\d{8,12}$/.test(digits)) errors.phone = "Please enter a valid phone number.";
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "That email doesn’t look right.";
  }
  if (values.suburb.length < 2 || values.suburb.length > 60) errors.suburb = "Which suburb is the job in?";
  if (!serviceOptions.includes(values.service)) errors.service = "Pick the closest option.";
  if (values.details.length > 1500) errors.details = "Please keep it under 1500 characters.";

  const errorIds = Object.keys(errors);
  if (errorIds.length > 0) {
    formAlert.hidden = false;
    formAlert.textContent = "A few details need fixing.";
    errorIds.forEach((id) => showError(id, errors[id]));
    form.elements[errorIds[0]].focus();
    return;
  }

  const firstName = values.name.split(" ")[0];
  successMessage.textContent = `Thanks ${firstName} — we’ve got your ${values.service.toLowerCase()} enquiry and will call you back shortly.`;
  form.hidden = true;
  successPanel.hidden = false;
});
