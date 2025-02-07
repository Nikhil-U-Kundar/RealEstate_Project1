
  function updateCartCount() {
    cartCount.textContent = cart.length;
  }

  function updateCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
      const li = document.createElement('li');
      li.textContent = `${item.propertyName} - $${item.price.toLocaleString()}`;

      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.classList.add('btn-remove');
      removeButton.addEventListener('click', () => {
        removeFromCart(index);
      });

      li.appendChild(removeButton);
      cartItemsContainer.appendChild(li);
      total += item.price;
    });

    cartTotal.textContent = total.toLocaleString();
  }

  function addToCart(propertyData) {
    cart.push(propertyData);
    updateCartCount();
    updateCart();
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    updateCart();
  }

  if (searchButton) {
    searchInput.addEventListener("input", filterProperties);
    searchButton.addEventListener("click", filterProperties);
  }

  properties.forEach(property => {
    const addToCartButton = property.querySelector("[data-add-to-cart]");
    const propertyName = property.querySelector("[data-header]").textContent;
    const address = property.querySelector(".property-details").textContent;
    const priceText = property.querySelector(".property-details .card-text").textContent;
    const price = parseFloat(priceText.replace(/\D/g, ''));

    const propertyData = {
      propertyName,
      address,
      price
    };

    addToCartButton.addEventListener('click', () => {
      addToCart(propertyData);
    });
  });

