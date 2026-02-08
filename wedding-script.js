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
function initRSVPForm() {
  const form = document.getElementById("rsvpForm");
  const additionalQuestions = document.getElementById("additional-questions");

  if (!form) {
    console.error("Форма RSVP не найдена");
    return;
  }

  // Изначально скрываем дополнительные вопросы
  if (additionalQuestions) {
    additionalQuestions.style.display = "none";
    // Устанавливаем начальное состояние
    additionalQuestions.style.opacity = "0";
    additionalQuestions.style.height = "0";
    additionalQuestions.style.overflow = "hidden";
    additionalQuestions.style.transition =
      "opacity 0.3s ease, height 0.3s ease";
  }

  // Отслеживаем изменение радиокнопок
  const attendingRadios = form.querySelectorAll(
    'input[name="entry.1166974658"]',
  );

  console.log("Найдено радиокнопок:", attendingRadios.length);

  // Добавляем обработчики изменения для всех радиокнопок
  attendingRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      console.log(
        "Изменена радиокнопка:",
        this.value,
        "checked:",
        this.checked,
      );

      // Проверяем, выбрана ли кнопка "Да"
      const isYesSelected =
        this.value === "Да, обязательно буду!" && this.checked;

      if (additionalQuestions) {
        if (isYesSelected) {
          console.log("Показываем дополнительные вопросы");

          // Показываем блок
          additionalQuestions.style.display = "block";
          additionalQuestions.style.overflow = "hidden";

          // Получаем высоту содержимого
          const height = additionalQuestions.scrollHeight + "px";

          // Анимация появления
          requestAnimationFrame(() => {
            additionalQuestions.style.height = height;
            additionalQuestions.style.opacity = "1";
          });
        } else {
          console.log("Скрываем дополнительные вопросы");

          // Анимация скрытия
          additionalQuestions.style.height = "0";
          additionalQuestions.style.opacity = "0";

          // После анимации скрываем полностью
          setTimeout(() => {
            additionalQuestions.style.display = "none";
            // Сбрасываем поля формы, если выбрано "Нет"
            clearAdditionalFields();
          }, 300);
        }
      }
    });
  });

  // Создаем iframe если его нет
  if (!document.getElementById("hidden_iframe")) {
    const iframe = document.createElement("iframe");
    iframe.name = "hidden_iframe";
    iframe.id = "hidden_iframe";
    iframe.style.display = "none";
    document.body.appendChild(iframe);
  }

  // Отладочная информация
  console.log("Все радиокнопки формы:");
  const allRadios = form.querySelectorAll('input[type="radio"]');
  allRadios.forEach((radio, i) => {
    console.log(`Радио ${i}: name="${radio.name}", value="${radio.value}"`);
  });

  // Функция для очистки полей при выборе "Нет"
  function clearAdditionalFields() {
    const inputs = additionalQuestions.querySelectorAll(
      "input, select, textarea",
    );
    inputs.forEach((input) => {
      if (input.type === "checkbox" || input.type === "radio") {
        input.checked = false;
      } else {
        input.value = "";
      }
    });
  }
}

// Функция для обработки отправки формы
function handleFormSubmit(event) {
  console.log("handleFormSubmit вызвана");

  const form = document.getElementById("rsvpForm");
  const formSuccess = document.getElementById("formSuccess");

  // Проверяем обязательные поля - ПРАВИЛЬНЫЕ ID!
  const nameField = form.querySelector('input[name="entry.1065046570"]');
  const attendingField = form.querySelector(
    'input[name="entry.1166974658"]:checked',
  );

  if (!nameField || !nameField.value.trim()) {
    alert("Пожалуйста, введите ваше имя");
    if (event) event.preventDefault();
    return false;
  }

  if (!attendingField) {
    alert("Пожалуйста, выберите, будете ли вы присутствовать");
    if (event) event.preventDefault();
    return false;
  }

  console.log("Форма валидна, отправляем...");

  if (form && formSuccess) {
    // Небольшая задержка перед показом сообщения
    setTimeout(() => {
      form.style.display = "none";
      formSuccess.style.display = "block";
      formSuccess.classList.add("show");

      // Плавная прокрутка к сообщению
      setTimeout(() => {
        formSuccess.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }, 500);
  }

  // Форма отправится через iframe
  return true;
}

// Функция для показа успешного сообщения (совместимость со старым onsubmit)
function showSuccess() {
  console.log("showSuccess вызвана");

  const form = document.getElementById("rsvpForm");
  const formSuccess = document.getElementById("formSuccess");

  if (form && formSuccess) {
    // Небольшая задержка перед показом сообщения
    setTimeout(() => {
      form.style.display = "none";
      formSuccess.style.display = "block";
      formSuccess.classList.add("show");

      // Плавная прокрутка к сообщению
      setTimeout(() => {
        formSuccess.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }, 500);
  }

  // Возвращаем true, чтобы форма отправилась
  return true;
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
