const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const minPrice = document.getElementById("minPrice");
const maxPrice = document.getElementById("maxPrice");
const searchButton = document.getElementById("searchButton");
const cart = document.getElementById("cart");
const products = document.getElementById("products");
const totalPriceElement = document.getElementById("totalPrice");

let data = [];
let cartItems = [];

const api = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    data = await response.json();
    showProducts(data);
  } catch (error) {
    console.log(error);
  }
};

const filterProducts = () => {
  let filteredData = [...data];

  const searchQuery = searchInput.value.toLowerCase();
  const category = categorySelect.value;
  const minPriceValue = minPrice.value ? parseFloat(minPrice.value) : 0;
  const maxPriceValue = maxPrice.value ? parseFloat(maxPrice.value) : Infinity;

  if (searchQuery) {
    filteredData = filteredData.filter((product) =>
      product.title.toLowerCase().includes(searchQuery)
    );
  }

  if (category && category !== "all") {
    filteredData = filteredData.filter((product) => product.category === category);
  }

  if (minPriceValue) {
    filteredData = filteredData.filter((product) => product.price >= minPriceValue);
  }
  if (maxPriceValue) {
    filteredData = filteredData.filter((product) => product.price <= maxPriceValue);
  }

  showProducts(filteredData);
};

const showProducts = (productsData) => {
  const html = productsData
    .map((product) => {
      return `
        <div class="product" style="border: 1px solid #ccc; padding: 10px; margin: 10px;">
            <img src="${product.image}" alt="${product.title}" style="width: 100px;">
            <h2>${(product.title.length > 22 ? product.title.slice(0, 20) + "..." : product.title)}</h2>
            <p>${product.category}</p>
            <p>${(product.description.length > 60 ? product.description.slice(0, 60) + "..." : product.description)}</p>
            <p>Price: $${product.price}</p>
            <button class="addToCart" data-product-id="${product.id}">Add to Cart</button>
        </div>`;
    })
    .join("");
  products.innerHTML = html;

  document.querySelectorAll(".addToCart").forEach(button => {
    button.addEventListener("click", (event) => {
      const productId = parseInt(event.target.getAttribute("data-product-id"));
      addToCart(productId);
    });
  });
};

const addToCart = (productId) => {
  const product = data.find(p => p.id === productId);
  const existingItem = cartItems.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }

  updateCartDisplay();
};

const removeFromCart = (productId) => {
  const itemIndex = cartItems.findIndex(item => item.id === productId);
  
  if (itemIndex > -1) {
    const item = cartItems[itemIndex];

    if (item.quantity > 1) {
      item.quantity--; 
    } else {
      cartItems.splice(itemIndex, 1);
    }

    updateCartDisplay(); 
  }
};

const updateCartDisplay = () => {
  const cartHtml = cartItems
    .map((item) => {
      return `
        <li>
          ${item.title} - $${item.price} x ${item.quantity}
          <button onclick="removeFromCart(${item.id})">Remove</button>
        </li>`;
    })
    .join("");
  cart.innerHTML = cartHtml;

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  totalPriceElement.textContent = totalPrice.toFixed(2);
};

searchButton.addEventListener("click", filterProducts);

window.onload = api;
