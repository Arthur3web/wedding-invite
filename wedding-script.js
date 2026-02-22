// Таймер обратного отсчёта
function initCountdown() {
  // Дата свадьбы (год, месяц-1, день, час, минута)
  const weddingDate = new Date(2026, 3, 29, 15, 0, 0).getTime();

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function updateCountdown() {
    const now = Date.now();
    const distance = weddingDate - now;

    if (distance <= 0) {
      clearInterval(interval);

      daysEl.textContent = 0;
      hoursEl.textContent = 0;
      minutesEl.textContent = 0;
      secondsEl.textContent = 0;

      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = days;
    hoursEl.textContent = hours;
    minutesEl.textContent = minutes;
    secondsEl.textContent = seconds;
  }

  let interval;
  updateCountdown();
  interval = setInterval(updateCountdown, 1000);
}

// RSVP форма
function initRSVPForm() {
  const form = document.getElementById("rsvpForm");
  const additional = document.getElementById("additional-questions");
  const loading = document.getElementById("formLoading");
  const scriptURL =
    "https://script.google.com/macros/s/AKfycbzb_orTVVkoHXqq5B2UdQpUAKqu1lZaIvCWWz1JbLS1QrGZ3_61X7FrqcwVdrcZGNx5/exec";

  additional.style.display = "none";
  additional.style.opacity = 0;
  additional.style.height = 0;
  additional.style.overflow = "hidden";
  additional.style.transition = "opacity 0.3s ease, height 0.3s ease";

  form.querySelectorAll('input[name="attendance"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.checked && radio.value === "Да, обязательно буду!") {
        additional.style.display = "block";
        const h = additional.scrollHeight + "px";
        requestAnimationFrame(() => {
          additional.style.height = h;
          additional.style.opacity = 1;
        });
      } else {
        additional.style.height = 0;
        additional.style.opacity = 0;
        setTimeout(() => {
          additional.style.display = "none";
          additional.querySelectorAll("input").forEach((i) => (i.value = ""));
        }, 300);
      }
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.querySelector('input[name="name"]').value.trim();
    const attendance = form.querySelector(
      'input[name="attendance"]:checked',
    )?.value;
    const partner = form.querySelector('input[name="partner"]').value.trim();

    if (!name || !attendance)
      return alert("Пожалуйста, заполните обязательные поля");

    loading.classList.add("active");
    const submitBtn = form.querySelector(".btn-submit");
    const origText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Отправляем…";

    try {
      const resp = await fetch(scriptURL, {
        method: "POST",
        body: new URLSearchParams({ name, attendance, partner }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const text = await resp.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        throw new Error("Сервер вернул неверный ответ: " + text);
      }

      if (result.status === "success") {
        form.style.display = "none";
        const success = document.getElementById("formSuccess");
        success.classList.add("show");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      } else throw new Error(result.message || "Ошибка сервера");
    } catch (err) {
      console.error("Ошибка отправки:", err);
      alert(
        "Не удалось отправить ответ. Проверьте соединение и попробуйте снова.",
      );
    } finally {
      loading.classList.remove("active");
      submitBtn.disabled = false;
      submitBtn.textContent = origText;
    }
  });
}

// Анимация при скролле
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );

  document.querySelectorAll(".gallery-item, .time-unit").forEach((el) => {
    el.style.opacity = 0;
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  const style = document.createElement("style");
  style.textContent = `.fade-in { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(style);
}

// Плавная загрузка изображений
function initImageLoading() {
  document.querySelectorAll(".gallery-item img").forEach((img) => {
    img.style.opacity = 0;
    img.style.transition = "opacity 0.5s ease";
    if (img.complete) img.style.opacity = 1;
    else img.addEventListener("load", () => (img.style.opacity = 1));
    img.addEventListener("error", () =>
      console.error("Ошибка загрузки:", img.src),
    );
  });
}

// Лайтбокс для галереи
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const images = Array.from(document.querySelectorAll(".gallery-item img"));
  let currentIndex = 0;

  function open(index) {
    currentIndex = index;
    lightboxImg.src = images[currentIndex].src;
    lightboxImg.alt = images[currentIndex].alt;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex].src;
    lightboxImg.alt = images[currentIndex].alt;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex].src;
    lightboxImg.alt = images[currentIndex].alt;
  }

  images.forEach((img, i) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", () => open(i));
  });

  document.getElementById("lightboxClose").addEventListener("click", close);
  document.getElementById("lightboxPrev").addEventListener("click", showPrev);
  document.getElementById("lightboxNext").addEventListener("click", showNext);

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
  });

  // Свайп на мобильных
  let touchStartX = 0;
  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  });
  lightbox.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) showPrev();
      else showNext();
    }
  });
}

// Инициализация всех функций
document.addEventListener("DOMContentLoaded", () => {
  console.log("Свадебное приглашение загружено!");
  try {
    initCountdown();
    initRSVPForm();
    initScrollAnimations();
    initImageLoading();
    initLightbox();
  } catch (err) {
    console.error("Ошибка при инициализации:", err);
  }
});
