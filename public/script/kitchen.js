

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
       const serveBtn = document.createElement("button");
       serveBtn.textContent = "Serve";
       serveBtn.addEventListener("click", () => {
           order.status = "served"
           console.log(`Order ${order.orderid} served`);
           orders.forEach(o =>{
               o.items.forEach(i =>{
                   if(i.name === order.item.name && o.id === order.orderid){
                       i.status = "served"
                   }
               })
           });
            localStorage.setItem("orders", JSON.stringify(orders)); 
            showOrder.innerHTML = "";
            loadOrders(); 
       });
        items.textContent = `Order ID: ${order.orderid}, Item Name: ${order.item.name} , Status: ${order.item.status || "pending"} `;
        listOrder.appendChild(items);
        listOrder.appendChild(serveBtn);
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

    




