const people = Array.isArray(window.MOZAIKA_PEOPLES) ? window.MOZAIKA_PEOPLES : [];

const locations = {
  nanai: [43, 66], ulchi: [43, 59], nivkh: [50, 60], orochi: [47, 70], udege: [42, 76],
  negidal: [40, 53], evenki: [30, 49], evens: [46, 35], chukchi: [85, 15], koryaks: [70, 29],
  itelmens: [72, 46], aleuts: [88, 51], eskimos: [90, 19], yukaghirs: [55, 16], chuvans: [70, 16],
  kereks: [79, 24], tazy: [44, 82], oroks: [54, 68], alyutors: [75, 31], kamchadals: [73, 52],
};

const mapPoints = document.querySelector("[data-map-points]");
const mapDetail = document.querySelector("[data-map-detail]");
const mapName = document.querySelector("[data-map-name]");
const mapRegion = document.querySelector("[data-map-region]");
const mapText = document.querySelector("[data-map-text]");
const mapLink = document.querySelector("[data-map-link]");
const mapImage = document.querySelector("[data-map-image]");
const detailNumber = document.querySelector(".detail-number");
const peopleGrid = document.querySelector("[data-people-grid]");
const peopleSearch = document.querySelector("[data-people-search]");
const emptyState = document.querySelector("[data-empty-state]");

function pageLink(slug) {
  return `../peoples/${slug}.html`;
}

function renderMapDetail(person, index) {
  if (!person) return;
  mapName.textContent = person.name;
  mapRegion.textContent = person.region || person.areaLabel || "Дальний Восток";
  mapText.textContent = person.cardText || person.summary || "Откройте страницу народа, чтобы узнать больше.";
  mapLink.href = pageLink(person.slug);
  mapImage.src = person.image;
  detailNumber.textContent = String(index + 1).padStart(2, "0");
  mapDetail.animate(
    [{ opacity: 0.55, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }],
    { duration: 280, easing: "cubic-bezier(.2,.78,.2,1)" },
  );
}

function renderMap() {
  people.forEach((person, index) => {
    const position = locations[person.slug] || [50, 50];
    const button = document.createElement("button");
    button.className = "map-point";
    button.type = "button";
    button.style.left = `${position[0]}%`;
    button.style.top = `${position[1]}%`;
    button.setAttribute("aria-label", person.name);
    button.addEventListener("click", () => {
      mapPoints.querySelectorAll(".map-point").forEach((point) => point.classList.remove("is-active"));
      button.classList.add("is-active");
      renderMapDetail(person, index);
    });
    mapPoints.append(button);
  });

  const first = people[0];
  const firstPoint = mapPoints.querySelector(".map-point");
  firstPoint?.classList.add("is-active");
  renderMapDetail(first, 0);
}

function createPeopleCard(person, index) {
  const card = document.createElement("a");
  card.className = "people-card";
  card.classList.toggle("is-long-name", person.name.length > 9);
  card.href = pageLink(person.slug);
  card.dataset.search = `${person.name} ${person.region || ""} ${person.areaLabel || ""}`.toLowerCase();
  card.style.setProperty("--reveal-index", String(index % 5));
  card.innerHTML = `
    <div class="card-meta"><span>${String(index + 1).padStart(2, "0")}</span><span>${person.areaLabel || "Дальний Восток"}</span></div>
    <img src="${person.image}" alt="" loading="lazy" />
    <h3>${person.name}</h3>
    <p>${person.cardText || person.summary || "Открыть материал о народе."}</p>
  `;
  return card;
}

function renderPeople() {
  people.forEach((person, index) => peopleGrid.append(createPeopleCard(person, index)));
}

peopleSearch?.addEventListener("input", () => {
  const query = peopleSearch.value.trim().toLowerCase();
  let visible = 0;
  peopleGrid.querySelectorAll(".people-card").forEach((card) => {
    const matches = !query || card.dataset.search.includes(query);
    card.hidden = !matches;
    if (matches) visible += 1;
  });
  emptyState.hidden = visible > 0;
});

renderMap();
renderPeople();

const revealTargets = document.querySelectorAll(
  ".section-heading, .map-layout, .catalog-head, .people-card, .library-copy, .library-route",
);
revealTargets.forEach((target) => target.setAttribute("data-reveal", ""));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.025, rootMargin: "0px 0px -5%" },
);
revealTargets.forEach((target) => revealObserver.observe(target));

const betaHeader = document.querySelector("[data-header]");
let lastScrollY = window.scrollY;
let headerFramePending = false;

function updateHeader() {
  const currentY = window.scrollY;
  betaHeader?.classList.toggle("is-compact", currentY > 80 && currentY >= lastScrollY);
  lastScrollY = currentY;
  headerFramePending = false;
}

window.addEventListener("scroll", () => {
  if (headerFramePending) return;
  headerFramePending = true;
  requestAnimationFrame(updateHeader);
}, { passive: true });

const heroVisual = document.querySelector(".hero-visual img");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

if (heroVisual && finePointer.matches) {
  document.querySelector(".beta-hero")?.addEventListener("pointermove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 12;
    const y = (event.clientY / window.innerHeight - 0.5) * 8;
    heroVisual.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
  document.querySelector(".beta-hero")?.addEventListener("pointerleave", () => {
    heroVisual.style.transform = "translate3d(0, 0, 0)";
  });
}
