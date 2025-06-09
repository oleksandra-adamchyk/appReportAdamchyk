const images = [
  {
    preview: 'https://picsum.photos/200/150?random=1',
    original: 'https://picsum.photos/800/600?random=1',
    description: 'Зображення 1',
  },
  {
    preview: 'https://picsum.photos/200/150?random=2',
    original: 'https://picsum.photos/800/600?random=2',
    description: 'Зображення 2',
  },
  {
    preview: 'https://picsum.photos/200/150?random=3',
    original: 'https://picsum.photos/800/600?random=3',
    description: 'Зображення 3',
  },
  {
    preview: 'https://picsum.photos/200/150?random=4',
    original: 'https://picsum.photos/800/600?random=4',
    description: 'Зображення 4',
  },
  {
    preview: 'https://picsum.photos/200/150?random=5',
    original: 'https://picsum.photos/800/600?random=5',
    description: 'Зображення 5',
  },
  {
    preview: 'https://picsum.photos/200/150?random=6',
    original: 'https://picsum.photos/800/600?random=6',
    description: 'Зображення 6',
  },
  {
    preview: 'https://picsum.photos/200/150?random=7',
    original: 'https://picsum.photos/800/600?random=7',
    description: 'Зображення 7',
  },
  {
    preview: 'https://picsum.photos/200/150?random=8',
    original: 'https://picsum.photos/800/600?random=8',
    description: 'Зображення 8',
  },
];
  
  const gallery = document.querySelector('.gallery');
  
  const markup = images
    .map(
      ({ preview, original, description }) => `
      <li>
        <img src="${preview}" data-source="${original}" alt="${description}">
      </li>
    `
    )
    .join('');
  
  gallery.insertAdjacentHTML('beforeend', markup);
  
  gallery.addEventListener('click', (event) => {
    const img = event.target.closest('img');
    if (!img) return;
  
    const originalSrc = img.dataset.source;
    const description = img.alt;
  
    const instance = basicLightbox.create(`
      <img src="${originalSrc}" alt="${description}">
    `);
    instance.show();
  });