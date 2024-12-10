import all from "../assets/all.json";


const batchSize = 10
let startIndex = 0
let endIndex = batchSize
let filteredProducts = all

function filterProducts({ category, name }) {

    filteredProducts = all.
        filter(product => {
            return category ? product.categoria.toLowerCase() === category.toLowerCase() : true
        })
        .filter((product) => {
            return name ? product.name.toLowerCase().includes(name.toLowerCase()) : true

        })


    startIndex = 0
    endIndex = batchSize

    loadMoreProducts(true)
}


function loadMoreProducts(reset = false) {
    const productsContainer = document.querySelector('.contaner-section-cards');

    if (reset) {
        productsContainer.innerHTML = ''
    }

    const fragment = document.createDocumentFragment()


    const nextBatch = filteredProducts.slice(startIndex, endIndex)

    if (nextBatch.length === 0 && startIndex === 0) {
        const p = document.createElement('p')
        p.textContent = 'Articulo no disponible'
        fragment.appendChild(p)
        productsContainer.appendChild(fragment)
    }

    nextBatch.forEach(product => {
        const article = document.createElement('article')

        article.innerHTML = `
            <header>
              ${" "}
              <img
                src=${`/images/${encodeURIComponent(product.image)}`}
                alt=${product.name}
                loading="lazy"
              />
            </header>
            <main>
              <h2>${product.name}</h2>
              <p>${product.categoria}</p>
            </main>
        `
        fragment.appendChild(article)
    })

    productsContainer.appendChild(fragment)
    startIndex += batchSize
    endIndex += batchSize
}

function setupIntersectionObserver() {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    const thresholdValue = isDesktop ? 1.0 : 0.1;
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            loadMoreProducts()
        }
    }, {
        root: null,
        rootMargin: '10px',
        threshold: thresholdValue
    })

    const sentinel = document.querySelector('.load-more-trigger')

    observer.observe(sentinel)

}

document.addEventListener('DOMContentLoaded', () => {
    loadMoreProducts()
    setupIntersectionObserver()

    const search = document.querySelector('.input-search')

    search.addEventListener('input', (event) => {
        const name = event.target.value
        filterProducts({ name })

    })

    const selectCategory = document.getElementById('select-category');
    const categoryModal = document.getElementById('category-modal');
    const categoryList = document.getElementById('category-list');
    const categoryText = document.getElementById('category-text');

    const categories = ['Pulseras', 'Anillos', 'Candongas y Topos'];

    categories.forEach(category => {
        const li = document.createElement('li')
        li.textContent = category
        li.addEventListener('click', () => {
            setTimeout(() => {
                categoryModal.style.display = 'none'

            }, 100)
            categoryText.textContent = category;
            filterProducts({ category })
        })

        categoryList.appendChild(li)

    })
    selectCategory.addEventListener('click', () => {

        if (categoryModal.style.display === 'none') {
            categoryModal.style.display = 'block';

        } else {
            categoryModal.style.display = 'none';
        }
    });

    document.addEventListener('click', (event) => {

        if (!selectCategory.contains(event.target) && !categoryModal.contains(event.target)) {
            categoryModal.style.display = 'none';
        }
    })
})