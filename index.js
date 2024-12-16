// Update for script.js

// Function to fetch products from the API using async/await
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const products = await response.json();
        return products; // Return the fetched products
    } catch (error) {
        console.error('Error fetching products:', error);
        return []; // Return an empty array if there's an error
    }
}

// Function to display products with pagination
let currentIndex = 0;
const ITEMS_PER_PAGE = 10;
let allProducts = [];

function displayProducts(filteredProducts) {
    const productsContainer = document.getElementById('productsContainer');

    // Display items based on the current index and limit
    const itemsToDisplay = filteredProducts.slice(currentIndex, currentIndex + ITEMS_PER_PAGE);

    itemsToDisplay.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="price">$${product.price}</p>
            <p class="category">${product.category}</p>
            <button>Add to Cart</button>
        `;
        productsContainer.appendChild(productDiv);
    });

    currentIndex += ITEMS_PER_PAGE; // Update the index for the next batch

    // Show or hide the Load More button
    const loadMoreButton = document.getElementById('loadMore');
    if (currentIndex >= filteredProducts.length) {
        loadMoreButton.style.display = 'none';
    } else {
        loadMoreButton.style.display = 'block';
    }
}

// Filter and reset pagination
function filterProducts(products, searchQuery = '') {
    const category = document.getElementById('category').value;
    const priceRange = document.getElementById('priceRange').value;

    let filteredProducts = products;

    // Filter by category
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    // Filter by price range
    if (priceRange !== 'all') {
        if (priceRange === 'low') {
            filteredProducts = filteredProducts.filter(product => product.price < 50);
        } else if (priceRange === 'medium') {
            filteredProducts = filteredProducts.filter(product => product.price >= 50 && product.price <= 100);
        } else if (priceRange === 'high') {
            filteredProducts = filteredProducts.filter(product => product.price > 100);
        }
    }

    // Filter by search query (case-insensitive match with title or description)
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(product => {
            return product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   product.description.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }

    // Reset pagination and display products
    currentIndex = 0;
    document.getElementById('productsContainer').innerHTML = ''; // Clear existing products
    displayProducts(filteredProducts);
}

// Initial fetch and display of products
async function init() {
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = ''; // Clear any existing content

    // Add shimmer loading elements
    for (let i = 0; i < 6; i++) {
        const shimmerDiv = document.createElement('div');
        shimmerDiv.classList.add('shimmer');
        productsContainer.appendChild(shimmerDiv);
    }

    allProducts = await fetchProducts(); // Fetch products using async/await
    if (allProducts.length > 0) {
        // Remove shimmer effect and apply filters
        productsContainer.innerHTML = ''; // Clear shimmer
        filterProducts(allProducts);

        // Event listeners for filter changes
        document.getElementById('category').addEventListener('change', () => {
            filterProducts(allProducts); // Filter products whenever category is changed
        });

        document.getElementById('priceRange').addEventListener('change', () => {
            filterProducts(allProducts); // Filter products whenever price range is changed
        });

        document.getElementById('search').addEventListener('input', (e) => {
            const searchQuery = e.target.value;
            filterProducts(allProducts, searchQuery); // Filter products whenever search input changes
        });

        // Event listener for Load More button
        document.getElementById('loadMore').addEventListener('click', () => {
            displayProducts(allProducts);
        });
    } else {
        alert('Failed to fetch products!');
    }
}

// Call init() function to initialize the page
init();
