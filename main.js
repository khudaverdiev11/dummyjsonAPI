document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const productContainer = document.getElementById("productContainer");
  const paginationContainer = document.getElementById("pagination");
  let currentPage = 1;

  // Function to fetch and display products
  const fetchProducts = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();

      // Update productContainer with the fetched data
      productContainer.innerHTML = "";
      const totalProducts = data.total;
      data.products.forEach((product) => {
        // Customize how you want to display each product
        const productElement = document.createElement("div");
        productElement.classList.add("product");

        productElement.innerHTML = `<h2>${product.title}</h2>
                                <p>Description: ${product.description}</p>
                                <p>Price: ${product.price}$</p>
                                <p>Discount: ${product.discountPercentage}%</p>
                                <p>Category: ${product.category}</p>
                                <p>Stock: ${product.stock}</p>
                                <img src="${product.thumbnail}" alt="${product.title}">`;
        productContainer.appendChild(productElement);
        productElement.addEventListener("click", () => {
          openProductDetailsPage(product.id);
        });
      });

      // Update pagination
      updatePagination(totalProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Event listener for search input
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== "") {
      fetchProducts(`https://dummyjson.com/products/search?q=${searchTerm}`);
    } else {
      // If search input is empty, fetch all products
      handlePagination(10);
    }
  });

  // Fetch and populate categories dropdown
  const fetchCategories = async () => {
    try {
      const response = await fetch("https://dummyjson.com/products/categories");
      const categories = await response.json();

      // Populate categoryFilter dropdown
      categoryFilter.innerHTML = '<option value="">All Categories</option>';
      categories.forEach((category) => {
        var optionElement = document.createElement("option");
        optionElement.value = category;
        optionElement.textContent = category;
        categoryFilter.appendChild(optionElement);
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch categories on page load
  fetchCategories();

  // Event listener for category filter
  categoryFilter.addEventListener("change", () => {
    const selectedCategory = categoryFilter.value;
    if (selectedCategory !== "") {
      fetchProducts(
        `https://dummyjson.com/products/category/${selectedCategory}`
      );
    } else {
      // If no category selected, fetch all products
      handlePagination(10);
    }
  });

  // Function to update pagination buttons
  const updatePaginationButtons = (totalPages) => {
    // Generate pagination buttons
    let paginationHTML =
      '<button class="page-link" data-page="1">&laquo; First Page</button>';
    for (let i = 1; i <= totalPages; i++) {
      paginationHTML += `<button class="page-link" data-page="${i}">${i}</button>`;
    }
    paginationHTML += `<button class="page-link" data-page="${totalPages}">Last Page &raquo;</button>`;

    // Update paginationContainer with the generated buttons
    paginationContainer.innerHTML = paginationHTML;

    // Highlight the current page
    const pageButtons = paginationContainer.querySelectorAll(".page-link");
    pageButtons.forEach((button) => {
      const pageNumber = parseInt(button.dataset.page);
      if (pageNumber === currentPage) {
        button.classList.add("current-page");
      } else {
        button.classList.remove("current-page");
      }
    });
  };

  // Function to handle pagination
  const handlePagination = (limit, page = 1) => {
    const skip = (page - 1) * limit;
    fetchProducts(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
  };
  // Fetch all products on page load
  handlePagination(10);

  // Function to update pagination based on totalProducts
  const updatePagination = (totalProducts) => {
    const totalPages = Math.ceil(totalProducts / 10); // Assuming 10 items per page
    updatePaginationButtons(totalPages);
  };

  // Event listener for pagination clicks
  paginationContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("page-link")) {
      const clickedPage = parseInt(event.target.dataset.page);
      if (!isNaN(clickedPage)) {
        currentPage = clickedPage;
        handlePagination(10, currentPage);
      }
    }
  });

  function openProductDetailsPage(productId) {
    // Redirect to the product details page with the product ID as a query parameter
    window.location.href = `productDetails.html?productId=${productId}`;
  }
});
