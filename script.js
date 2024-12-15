document.addEventListener('DOMContentLoaded', () => {
  const quantityInputs = document.querySelectorAll('.quantity');
  const orderTableBody = document.getElementById('orderTableBody');
  const grandTotalElement = document.getElementById('grandTotal');
  const addToFavouritesBtn = document.getElementById('addToFavourites');
  const applyFavouritesBtn = document.getElementById('applyFavourites');
  const buyNowBtn = document.getElementById('buyNow');
  const checkoutPage = document.getElementById('checkoutPage');
  const checkoutForm = document.getElementById('checkoutForm');
  const payButton = document.getElementById('payButton');

  // Update order summary when quantity changes
  quantityInputs.forEach(input => {
      input.addEventListener('change', updateOrderSummary);
  });

  function updateOrderSummary() {
      // Clear existing table rows
      orderTableBody.innerHTML = '';
      let grandTotal = 0;

      // Add items with non-zero quantity to the table
      quantityInputs.forEach(input => {
          const quantity = parseInt(input.value);
          if (quantity > 0) {
              const price = parseFloat(input.dataset.price);
              const name = input.dataset.name;
              const total = quantity * price;
              grandTotal += total;

              const row = `
                  <tr>
                      <td>${name}</td>
                      <td>${quantity}</td>
                      <td>$${price.toFixed(2)}</td>
                      <td>$${total.toFixed(2)}</td>
                  </tr>
              `;
              orderTableBody.innerHTML += row;
          }
      });

      // Update grand total
      grandTotalElement.textContent = `$${grandTotal.toFixed(2)}`;
  }

  // Save Order to Favourites
  addToFavouritesBtn.addEventListener('click', () => {
      const favouriteOrder = [];
      quantityInputs.forEach(input => {
          const quantity = parseInt(input.value);
          if (quantity > 0) {
              favouriteOrder.push({
                  name: input.dataset.name,
                  quantity: quantity,
                  price: parseFloat(input.dataset.price)
              });
          }
      });
      localStorage.setItem('favouriteOrder', JSON.stringify(favouriteOrder));
      alert('Order saved to favourites!');
  });

  // Apply Favourites
  applyFavouritesBtn.addEventListener('click', () => {
      const favouriteOrder = JSON.parse(localStorage.getItem('favouriteOrder') || '[]');
      
      // Reset all quantities first
      quantityInputs.forEach(input => input.value = 0);

      // Apply favourite order quantities
      favouriteOrder.forEach(item => {
          const matchingInput = Array.from(quantityInputs).find(input => 
              input.dataset.name === item.name
          );
          if (matchingInput) {
              matchingInput.value = item.quantity;
          }
      });

      // Update order summary
      updateOrderSummary();
  });




// Function to save data to local storage
function saveToLocalStorage(name, quantity, price, total) {
    // Retrieve existing cart data or initialize an empty array
    let OrderData= JSON.parse(localStorage.getItem("OrderData")) || [];

    // Add the new item to the cart data
    OrderData.push({
        name: name,
        quantity: quantity,
        price: price,
        total: total
    });

    // Save updated cart data back to local storage
    localStorage.setItem("OrderData", JSON.stringify(OrderData));
    localStorage.setItem("TotalValue", parseFloat(grandTotalElement.innerText.replace("$", "")));
}
    

  // Navigate to Checkout Page
  buyNowBtn.addEventListener('click', () => {
    
    localStorage.removeItem("OrderData");
      localStorage.removeItem("GrandTotal");

      let grandTotal = 0;
    
// Iterate through the inputs to populate the table and store in local storage
quantityInputs.forEach(input => {
    const quantity = parseInt(input.value);
    if (quantity > 0) {
        const price = parseFloat(input.dataset.price);
        const name = input.dataset.name;
        const total = quantity * price;

        grandTotal += total; // Update grand total

        // Create table row
        const row = `
            <tr>
                <td>${name}</td>
                <td>${quantity}</td>
                <td>$${price.toFixed(2)}</td>
                <td>$${total.toFixed(2)}</td>
            </tr>
        `;
        orderTableBody.innerHTML += row;

        // Save to local storage
        saveToLocalStorage(name, quantity, price, total);
    }
});

localStorage.setItem("GrandTotal", grandTotal);

    window.location.href = "payment.html";
  });

  // Handle Payment
  checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic form validation can be expanded
      const allFieldsFilled = Array.from(checkoutForm.querySelectorAll('input, textarea'))
          .every(input => input.value.trim() !== '');

      if (allFieldsFilled) {
          // Calculate a random delivery date (3-5 days from now)
          const deliveryDate = new Date();
          deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 3) + 3);

          alert(`Thank you for your purchase! 
Your order will be delivered on ${deliveryDate.toDateString()}.`);

          // Reset everything
          checkoutForm.reset();
          checkoutPage.style.display = 'none';
          document.querySelector('.container').style.display = 'block';
          
          // Clear order summary
          orderTableBody.innerHTML = '';
          grandTotalElement.textContent = '$0.00';
          quantityInputs.forEach(input => input.value = 0);
      } else {
          alert('Please fill out all fields');
      }
  });
});