// Таймер обратного отсчета
function initCountdown() {
  // Дата свадьбы (год, месяц-1, день, час, минута)
  const weddingDate = new Date(2026, 3, 29, 15, 0, 0).getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    // Вычисление времени
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Обновление DOM элементов
    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;

    // Если обратный отсчет завершен
    if (distance < 0) {
      clearInterval(countdownInterval);
      document.querySelector(".countdown-timer").innerHTML =
        '<h2 style="font-family: var(--font-primary); font-size: 2.5rem; color: var(--accent-color);">Сегодня наш день!</h2>';
    }
  }

  // Обновление каждую секунду
  const countdownInterval = setInterval(updateCountdown, 1000);

  // Первоначальное обновление
  updateCountdown();
}

// Обработка формы подтверждения
const scriptURL =
  "https://script.google.com/macros/s/AKfycbzUn6lxm_3c1OKTe5ZUVGkuKYwc0V_qT3LPA4DEl1tbvhGiq1kPTwQGYIDBptt5nrJ7/exec";

function initRSVPForm() {
  const form = document.getElementById("rsvpForm");
  const additionalQuestions = document.getElementById("additional-questions");
  const formSuccess = document.getElementById("formSuccess");

  additionalQuestions.style.display = "none";
  additionalQuestions.style.opacity = "0";
  additionalQuestions.style.height = "0";
  additionalQuestions.style.overflow = "hidden";
  additionalQuestions.style.transition = "opacity 0.3s ease, height 0.3s ease";

  const radios = form.querySelectorAll('input[name="attendance"]');
  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.value === "Да, обязательно буду!" && radio.checked) {
        additionalQuestions.style.display = "block";
        const height = additionalQuestions.scrollHeight + "px";
        requestAnimationFrame(() => {
          additionalQuestions.style.height = height;
          additionalQuestions.style.opacity = "1";
        });
      } else {
        additionalQuestions.style.height = "0";
        additionalQuestions.style.opacity = "0";
        setTimeout(() => {
          additionalQuestions.style.display = "none";
          clearAdditionalFields();
        }, 300);
      }
    });
  });

  function clearAdditionalFields() {
    additionalQuestions
      .querySelectorAll("input")
      .forEach((input) => (input.value = ""));
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.querySelector('input[name="name"]').value.trim();
    const attendance = form.querySelector(
      'input[name="attendance"]:checked',
    )?.value;
    if (!name || !attendance) {
      alert("Пожалуйста, заполните обязательные поля");
      return;
    }

    const partner = form.querySelector('input[name="partner"]').value.trim();
    const children = form.querySelector('input[name="children"]').value.trim();
    const data = { name, attendance, partner, children };

    try {
      await fetch(scriptURL, {
        method: "POST",
        body: new URLSearchParams(data),
      });
      form.style.display = "none";
      formSuccess.style.display = "block";
      formSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (err) {
      console.error("Ошибка отправки:", err);
      alert("Произошла ошибка. Попробуйте позже.");
    }
  });
}

// Анимация появления элементов при скролле
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Элементы для анимации
  const animatedElements = document.querySelectorAll(
    ".detail-card, .gallery-item, .time-unit",
  );

  animatedElements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(element);
  });

  // Добавление класса для видимости
  const style = document.createElement("style");
  style.textContent = `
        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
  document.head.appendChild(style);
}

// Маска для телефона
function initPhoneMask() {
  const phoneInput = document.getElementById("phone");

  phoneInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 0) {
      if (value[0] === "7" || value[0] === "8") {
        value = "7" + value.substring(1);
      } else {
        value = "7" + value;
      }
    }

    let formattedValue = "";

    if (value.length > 0) {
      formattedValue = "+7";
      if (value.length > 1) {
        formattedValue += " (" + value.substring(1, 4);
      }
      if (value.length >= 4) {
        formattedValue += ") " + value.substring(4, 7);
      }
      if (value.length >= 7) {
        formattedValue += "-" + value.substring(7, 9);
      }
      if (value.length >= 9) {
        formattedValue += "-" + value.substring(9, 11);
      }
    }

    e.target.value = formattedValue;
  });
}

// Lazy loading для изображений
function initLazyLoading() {
  const images = document.querySelectorAll(".gallery-item img");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.opacity = "0";

        img.onload = () => {
          img.style.transition = "opacity 0.5s ease";
          img.style.opacity = "1";
        };

        observer.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// Инициализация всех функций
document.addEventListener("DOMContentLoaded", function () {
  console.log("Свадебное приглашение загружено!");

  try {
    // Инициализация всех модулей
    initCountdown();
    initRSVPForm();
    initScrollAnimations();
    initPhoneMask();
    initLazyLoading();

    // Предзагрузка изображений для плавности
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      if (img.complete) {
        img.style.opacity = "1";
      }
    });
  } catch (error) {
    console.error("Ошибка при инициализации:", error);
  }
});

// Дополнительные утилиты
function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error("Ошибка сохранения в localStorage:", e);
    return false;
  }
}

function getFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Ошибка чтения из localStorage:", e);
    return null;
  }
}

// Экспорт функций для использования в консоли (для отладки)
window.weddingApp = {
  initCountdown,
  initRSVPForm,
  saveToLocalStorage,
  getFromLocalStorage,
};
