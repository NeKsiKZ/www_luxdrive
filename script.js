document.addEventListener("DOMContentLoaded", () => {
  const fleetContainer = document.getElementById("fleet");
  const searchInput = document.getElementById("search");
  const brandFilter = document.getElementById("brandFilter");
  const sortSelect = document.getElementById("sortSelect");
  const carModal = document.getElementById("carModal");
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");
  const themeToggle = document.getElementById("themeToggle");
  const promoModal = document.getElementById("promoModal");
  const promoBtn = document.querySelector(".secondary");

  
  promoBtn.addEventListener("click", () => {
    promoModal.innerHTML = `
    <h2>Aktualne Promocje</h2>
    <ul style="list-style: disc; margin-left: 1.5rem;">
      <li><strong>7 dni wynajmu:</strong> -10% zniżki</li>
      <li><strong>Weekend (pt-nd):</strong> -15% na wybrane modele</li>
      <li><strong>Dla stałych klientów:</strong> 1 dzień gratis co 5 wynajmów</li>
    </ul>
    <button id="closePromo">Zamknij</button>
  `;
    promoModal.showModal();
  });

  promoModal.addEventListener("click", (e) => {
    if (e.target.id === "closePromo") {
      promoModal.close();
    }
  });

  let cars = [];

  // Wczytaj dane z cars.json
  fetch("cars.json")
    .then((res) => res.json())
    .then((data) => {
      cars = data.samochody;
      displayCars(cars);
    })
    .catch((err) => {
      fleetContainer.innerHTML = "<p>Błąd ładowania danych floty.</p>";
      console.error("Fetch error:", err);
    });

  // Wyświetl samochody
  function displayCars(data) {
    fleetContainer.innerHTML = "";
    data.forEach((car) => {
      const tile = document.createElement("div");
      tile.className = "car-tile";
      tile.innerHTML = `
        <div class="car-header">
          <h3>${car.marka} ${car.model}</h3>
        </div>
        <div class="car-image">
          <img src="${car.obraz}" alt="${car.marka} ${car.model}">
        </div>
        <div class="car-specs">
          <ul class="specs-list">
            <li>Moc: ${car.moc || "brak danych"} KM</li>
            <li>Silnik: ${car.silnik || "brak danych"}</li>
            <li>Napęd: ${car.naped || "brak danych"}</li>
          </ul>
        </div>
        <div class="car-footer">
          <div class="car-price">Cena: <span>${car.cena} zł/dzień</span></div>
          <div class="car-actions">
            <button class="details-btn" data-id="${car.id}">Szczegóły</button>
            <button class="rent-btn">Rezerwuj</button>
          </div>
        </div>
      `;
      fleetContainer.appendChild(tile);
    });
  }

  // Filtrowanie i sortowanie
  function updateDisplay() {
    let filtered = [...cars];
    const search = searchInput.value.toLowerCase();
    const brand = brandFilter.value;
    const sort = sortSelect.value;

    if (search) {
      filtered = filtered.filter(
        (car) =>
          car.marka.toLowerCase().includes(search) ||
          car.model.toLowerCase().includes(search)
      );
    }

    if (brand) {
      filtered = filtered.filter((car) => car.marka === brand);
    }

    switch (sort) {
      case "price-asc":
        filtered.sort((a, b) => a.cena - b.cena);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.cena - a.cena);
        break;
      case "name":
        filtered.sort((a, b) =>
          `${a.marka} ${a.model}`.localeCompare(`${b.marka} ${b.model}`)
        );
        break;
    }

    displayCars(filtered);
  }

  searchInput.addEventListener("input", updateDisplay);
  brandFilter.addEventListener("change", updateDisplay);
  sortSelect.addEventListener("change", updateDisplay);

  // Modal szczegółów auta
  fleetContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("details-btn")) {
      const id = e.target.dataset.id;
      const car = cars.find((c) => c.id == id);
      if (car) {
        carModal.innerHTML = `
          <h2>${car.marka} ${car.model}</h2>
          <img src="${car.obraz}" alt="${car.marka} ${car.model}">
          <p><strong>Cena:</strong> ${car.cena} zł/dzień</p>
          <p style="margin-top: 1rem;">${car.opis || "Dodatkowe dane są niedostępne w tym JSON."}</p>
          <button id="closeModal">Zamknij</button>
        `;
        carModal.showModal();
      }
    }
  });

  carModal.addEventListener("click", (e) => {
    if (e.target.id === "closeModal") {
      carModal.close();
    }
  });


  // Opinie klientów
  fetch("review.json")
    .then((res) => res.json())
    .then((opinions) => {
      const carousel = document.querySelector(".testimonial-carousel");
      if (!carousel) return;

      opinions.forEach((opinion) => {
        const div = document.createElement("div");
        div.className = "testimonial";
        div.innerHTML = `
        <div class="stars">${"★".repeat(opinion.rating)}${"☆".repeat(5 - opinion.rating)}</div>
        <blockquote>
          <p>"${opinion.review}"</p>
        </blockquote>
        <div class="reviewer-name">– ${opinion.name}</div>
      `;
        carousel.appendChild(div);
      });

      // Powiel opinie jeszcze raz dla efektu loop
      opinions.forEach((opinion) => {
        const div = document.createElement("div");
        div.className = "testimonial";
        div.innerHTML = `
        <div class="stars">${"★".repeat(opinion.rating)}${"☆".repeat(5 - opinion.rating)}</div>
        <blockquote>
          <p>"${opinion.review}"</p>
        </blockquote>
        <div class="reviewer-name">– ${opinion.name}</div>
      `;
        carousel.appendChild(div);
      });
    })
    .catch((err) => {
      console.error("Błąd ładowania opinii:", err);
    });


  const carousel = document.querySelector(".testimonial-carousel");
  if (carousel) {
    let scrollPos = carousel.scrollWidth - carousel.clientWidth;
    const scrollSpeed = 0.4;
    let isPaused = false;

    function scroll() {
      if (!isPaused) {
        scrollPos += scrollSpeed;
        if (scrollPos >= carousel.scrollWidth - carousel.clientWidth) {
          scrollPos = 0;
        }
        carousel.scrollLeft = scrollPos;
      }
      requestAnimationFrame(scroll);
    }

    carousel.addEventListener("mouseenter", () => {
      isPaused = true;
    });
    carousel.addEventListener("mouseleave", () => {
      isPaused = false;
    });

    scroll();
  }


  // Walidacja formularza
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !message) {
      formMessage.textContent = "Wszystkie pola są wymagane.";
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      formMessage.textContent = "Nieprawidłowy adres email.";
      return;
    }

    formMessage.textContent = "Wiadomość została wysłana!";
    contactForm.reset();
  });

  // Tryb ciemny/jasny
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });

    const availabilityModal = document.getElementById("availabilityModal");
  const availabilityList = document.getElementById("availabilityList");
  const availabilityBtn = document.querySelector(".cta");
  const closeAvailabilityBtn = document.getElementById("closeAvailability");


  availabilityBtn.addEventListener("click", () => {
    if (cars.length === 0) {
      availabilityList.innerHTML = "<li>Brak danych o dostępności samochodów.</li>";
    } else {
      availabilityList.innerHTML = cars.map(car => {
        const status = car.dostepnosc ? "Dostępny" : "Niedostępny";
        const statusClass = car.dostepnosc ? "available" : "unavailable";
        return `<li><strong>${car.marka} ${car.model}</strong> – <span class="${statusClass}">${status}</span></li>`;
      }).join("");
    }
    availabilityModal.showModal();
  });

  closeAvailabilityBtn.addEventListener("click", () => {
    availabilityModal.close();
  });

});
