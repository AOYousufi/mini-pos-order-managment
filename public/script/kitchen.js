

const showOrder = document.getElementById("showorders");



 
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const listOrder = document.createElement("ul");
  
 
   
    let grillOrders = [];
    orders.forEach(order =>{
      
     order.items.forEach(item => {
            item.station === "GRILL" ? grillOrders.push({"orderid": order.id, item}) : null
        })
    })
    

    console.log(grillOrders);

    grillOrders.forEach(order => {
  const items = document.createElement("li");
        items.textContent = `Order ID: ${order.orderid}, Item Name: ${order.item.name}`;
        listOrder.appendChild(items);
    });
  
    showOrder.appendChild(listOrder);
}

window.addEventListener("storage", (e)=>{
    if(e.key === "orders"){
        showOrder.innerHTML = "";
        loadOrders();
    }
})
loadOrders();

    




