document.addEventListener('DOMContentLoaded', () => {
  const payButton = document.getElementById('payButton');

const grandTotalElement = document.getElementById('grandTotal');

function loadFromLocalStorage() {
  const storedData = JSON.parse(localStorage.getItem("OrderData"));
  if (storedData) {
      storedData.forEach(item => {
          const row = `
              <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${item.total.toFixed(2)}</td>
              </tr>
          `;
          orderTableBody.innerHTML += row;
          
      });
  }

}

const grandTotal = localStorage.getItem("GrandTotal");
if (grandTotal) {
  grandTotalElement.textContent = `$${parseFloat(grandTotal).toFixed(2)}`;
} else {
  grandTotalElement.textContent = '$0.00';
}
  


// Call this on page load to repopulate table
loadFromLocalStorage();


payNowBtn.addEventListener('click', () => {
    
  localStorage.removeItem("OrderData");
    localStorage.removeItem("GrandTotal");

} );

});