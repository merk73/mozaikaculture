const people = window.MOZAIKA_PEOPLES || [];
const slug = document.body.dataset.personSlug;
const person = people.find((item) => item.slug === slug) || people[0];

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value || "";
}

function renderInfoAside(personData) {
  const aside = document.querySelector(".person-info aside");
  if (!aside || !personData.population) return;

  aside.insertAdjacentHTML(
    "beforeend",
    `<span>Численность</span><strong>${personData.population}</strong>`,
  );
}

function renderImmersion(personData) {
  const info = document.querySelector(".person-info");
  if (!info || !personData.immersion?.length) return;

  const items = personData.immersion
    .map((item, index) => {
      const visual = item.image
        ? `
          <figure class="immersion-media">
            <img src="${item.image}" alt="${item.title}" loading="lazy" decoding="async" />
          </figure>
        `
        : "";

      return `
        <article class="immersion-step reveal-on-scroll ${index % 2 ? "is-reversed" : ""} ${item.image ? "" : "is-text-only"}">
          ${visual}
          <div class="immersion-copy">
            <p class="overline">${item.kicker}</p>
            <h3>${item.title}</h3>
            <p>${item.text}</p>
            <div class="immersion-tags">
              ${item.details.map((detail) => `<span>${detail}</span>`).join("")}
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  const sources = (personData.sourceLinks || [])
    .map(([label, href]) => `<a href="${href}" target="_blank" rel="noreferrer">${label}</a>`)
    .join("");

  info.insertAdjacentHTML(
    "afterend",
    `
      <section class="person-immersion section-shell" aria-labelledby="immersion-title">
        <div class="immersion-head reveal-on-scroll">
          <p class="overline">погружение</p>
          <h2 id="immersion-title">Листай как визуальный рассказ.</h2>
          <p>Каждый блок соединяет проверенную справку, живой контекст и иллюстрацию к теме.</p>
        </div>
        <div class="immersion-flow">
          ${items}
        </div>
        <div class="person-sources reveal-on-scroll">
          <span>Источники и сверка</span>
          <div>${sources}</div>
        </div>
      </section>
    `,
  );
}

function initRevealAnimation() {
  const items = document.querySelectorAll(".reveal-on-scroll");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.18 },
  );

  items.forEach((item) => observer.observe(item));
}

if (person) {
  document.title = `${person.name} · Мозаика культур`;
  document.body.style.setProperty("--person-title-max", `${person.titleMax || 118}px`);

  document.querySelector(".person-route")?.remove();

  document.querySelectorAll("[data-person-name]").forEach((node) => {
    node.textContent = person.name;
  });

  setText("[data-person-region]", person.region);
  setText("[data-person-language]", person.language);
  setText("[data-person-lead]", person.lead);
  setText("[data-person-focus]", person.focus);
  setText("[data-person-area]", person.areaLabel);
  setText("[data-person-summary]", person.summary);

  const imageSlot = document.querySelector("[data-person-image]");
  if (imageSlot && person.image) {
    imageSlot.innerHTML = `<img src="${person.image}" alt="${person.name}" />`;
    imageSlot.classList.add("has-image");
  }

  const facts = document.querySelector("[data-person-facts]");
  if (facts) {
    facts.innerHTML = person.facts.map((fact) => `<span>${fact}</span>`).join("");
  }

  const sections = document.querySelector("[data-person-sections]");
  if (sections) {
    sections.innerHTML = person.sections
      .map(
        ([title, text]) => `
          <article>
            <span>${title}</span>
            <p>${text}</p>
          </article>
        `,
      )
      .join("");
  }

  renderInfoAside(person);
  renderImmersion(person);
  initRevealAnimation();
}
