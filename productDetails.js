document.addEventListener("DOMContentLoaded", function () {
  const productDetailsContainer = document.getElementById(
    "productDetailsContainer"
  );

  // Get the product ID from the query parameter in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("productId");

  // Fetch detailed information for the selected product
  fetch(`https://dummyjson.com/products/${productId}`)
    .then((response) => response.json())
    .then((productDetails) => {
      // Display detailed information
      productDetailsContainer.innerHTML = `
                <h2>${productDetails.title}</h2>
                <p>Price: ${productDetails.price}$</p>
                <p>Discount: ${productDetails.discountPercentage}%</p>
                <p>Category: ${productDetails.category}</p>
                <p>Stock: ${productDetails.stock}</p>
                <img src="${productDetails.thumbnail}" alt="${productDetails.title}">
            `;
    })
    .catch((error) => {
      console.error("Error fetching product details:", error);
    });

  // Go back one step in the browser's history
  const backButton = document.getElementById("backButton");
  backButton.addEventListener("click", function () {
    window.history.back();
  });
});
