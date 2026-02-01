

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


const grill = loadedOrder.map (order =>{
    if (order.items[0].station == "GRILL") {
        return order;
    }
    
})
console.log(grill)
console.log(loadedOrder[6].items[0].station)
