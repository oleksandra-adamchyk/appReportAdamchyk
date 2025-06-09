// Динамічна галерея з Pixabay API - ВИПРАВЛЕНА ВЕРСІЯ
const PIXABAY_KEY = "49759769-7f32cfe88a907b2cc03808f2c";
const THEMES = [
  "nature",
  "cat",
  "dog",
  "flowers",
  "child",
  "family",
  "friends",
  "party",
  "summer",
  "fun",
];
const IMAGE_COUNT = 9;

async function fetchImages() {
  // Пробуємо кожну тему по черзі до першого успіху
  for (let i = 0; i < THEMES.length; i++) {
    const theme = THEMES[i];
    try {
      const response = await fetch(
        `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(
          theme
        )}&image_type=photo&orientation=square&per_page=${IMAGE_COUNT}&safesearch=true`
      );

      if (!response.ok) {
        throw new Error(`Network or API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.hits && data.hits.length > 0) {
        console.log(`Завантажено зображення для теми: ${theme}`);
        return data.hits.map((hit) => ({
          preview: hit.webformatURL,
          original: hit.largeImageURL,
          description: hit.tags || theme,
        }));
      }
    } catch (e) {
      console.error(`Помилка для теми "${theme}":`, e);
      continue;
    }
  }
  return null;
}

// Альтернативна функція для завантаження зображень з усіх тем
async function fetchImagesFromAllThemes() {
  const allImages = [];

  for (const theme of THEMES) {
    try {
      const response = await fetch(
        `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(
          theme
        )}&image_type=photo&orientation=square&per_page=3&safesearch=true`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.hits && data.hits.length > 0) {
          const themeImages = data.hits.map((hit) => ({
            preview: hit.webformatURL,
            original: hit.largeImageURL,
            description: hit.tags || theme,
            theme: theme,
          }));
          allImages.push(...themeImages);
        }
      }
    } catch (e) {
      console.error(`Помилка для теми "${theme}":`, e);
    }
  }

  return allImages.length > 0 ? allImages : null;
}

// Основний код для відображення галереї
async function initGallery() {
  const gallery = document.querySelector(".gallery");

  if (!gallery) {
    console.error("Елемент галереї не знайдено");
    return;
  }

  // Показуємо індикатор завантаження
  gallery.innerHTML = `
    <div style="color: #666; font-size: 1.1em; padding: 2em; text-align: center;">
      <div>🔄 Завантаження зображень...</div>
    </div>
  `;

  try {
    const images = await fetchImages(); // або fetchImagesFromAllThemes()

    if (!images || !images.length) {
      gallery.innerHTML = `
        <div style="color: #888; font-size: 1.2em; padding: 2em; text-align: center;">
          Не вдалося знайти інтернет-зображення за жодною з тем.<br>
          Спробуйте оновити сторінку або перевірте підключення до інтернету.<br>
          API Pixabay може бути тимчасово недоступний або ліміт вичерпано.
        </div>
      `;
      return;
    }

    // Створюємо розмітку галереї у вигляді компактної сітки 3x3
    const markup = images
      .slice(0, 9) // Беремо тільки 9 зображень для сітки 3x3
      .map(
        ({ preview, original, description }) => `
        <div class="gallery-item">
          <img 
            src="${preview}" 
            alt="${description}"
            data-original="${original}"
            loading="lazy"
            onclick="openImageModal('${original}', '${description}')"
          />
        </div>
      `
      )
      .join("");

    // Застосовуємо CSS Grid стилі для квадратної сітки
    gallery.innerHTML = `
      <style>
        .gallery-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 8px;
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
          aspect-ratio: 1;
        }
        
        .gallery-item {
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .gallery-item:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          z-index: 10;
        }
        
        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          aspect-ratio: 1;
        }
        
        /* Адаптивність */
        @media (max-width: 768px) {
          .gallery-container {
            max-width: 90vw;
            gap: 6px;
            padding: 15px;
          }
        }
        
        @media (max-width: 480px) {
          .gallery-container {
            max-width: 95vw;
            gap: 4px;
            padding: 10px;
          }
        }
      </style>
      <div class="gallery-container">${markup}</div>
    `;
  } catch (error) {
    console.error("Помилка завантаження галереї:", error);
    gallery.innerHTML = `
      <div style="color: #d32f2f; font-size: 1.1em; padding: 2em; text-align: center;">
        ❌ Помилка завантаження зображень: ${error.message}
      </div>
    `;
  }
}

// Функція для відкриття модального вікна з великим зображенням
function openImageModal(imageUrl, description) {
  const modal = document.createElement("div");
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(0,0,0,0.8); display: flex; justify-content: center; 
    align-items: center; z-index: 1000; cursor: pointer;
  `;

  modal.innerHTML = `
    <div style="max-width: 90%; max-height: 90%; text-align: center;">
      <img src="${imageUrl}" alt="${description}" style="max-width: 100%; max-height: 100%; border-radius: 8px;">
      <p style="color: white; margin-top: 16px; font-size: 1.1em;">${description}</p>
      <p style="color: #ccc; margin-top: 8px; font-size: 0.9em;">Клікніть для закриття</p>
    </div>
  `;

  modal.onclick = () => document.body.removeChild(modal);
  document.body.appendChild(modal);
}

// Запускаємо галерею після завантаження DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGallery);
} else {
  initGallery();
}
