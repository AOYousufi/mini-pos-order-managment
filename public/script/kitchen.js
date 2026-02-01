const showOrder = document.getElementById("showorders");

function loadOrders() {
  try {
    const raw = localStorage.getItem("orders");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}


console.log("Orders loaded:", loadOrders());

const loadedOrder = loadOrders();   


loadedOrder.map (order =>{
    console.log(order.items[0].station);
})

console.log(loadedOrder[6].items[0].station)
    function displayOrders() {
  const orders = loadOrders();
  showOrder.innerHTML = orders.map(order => `
    <div class="order">
      <h3>Order #${order.id}</h3>
      <p>Items: ${order.items.join(", ")}</p>
      <p>Total: £${order.total.toFixed(2)}</p>
    </div>
  `).join("");
}
