const menu = document.getElementById("menu");
const currentOrder = document.getElementById("cart");
const totalPrice = document.getElementById("total");
const placeOrderBtn = document.getElementById("placebtn");
const clearbtn = document.getElementById("clearbtn");
const orderHistory = document.getElementById("order-history");
const serviceTypeSection = document.getElementById("service-section");
const serviceTypeSelect = document.getElementById("service-type");

let total = 0;

serviceTypeSection.addEventListener("change", () => {
  const selectedService = serviceTypeSelect.value;
  showCurrentOrder()
  calculateTotal()
  alert(`Service type changed to: ${selectedService}`);
});




const STORAGE_KEY = "orders";
const current_order = [];

const toMoney = v => Number(v ?? 0);
const moneyText = v => `£${toMoney(v).toFixed(2)}`;

function loadOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function formatDate(iso) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? String(iso) : d.toLocaleString("en-GB");
}

function calculateTotal() {
   total = current_order.reduce((sum, item) => sum + toMoney(item.price), 0);

  if (serviceTypeSelect.value === "delivery") {
    const deliveryFee = 3.50;
    total += deliveryFee;
  }
  totalPrice.textContent = `Total: ${moneyText(total)}`;
}

function showCurrentOrder() {
  currentOrder.innerHTML = "";

  current_order.forEach((item, index) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const btn = document.createElement("button");

    span.textContent = `${item.name} - ${moneyText(item.price)}`;
    btn.type = "button";
    btn.textContent = "Remove";

    btn.addEventListener("click", () => {
      current_order.splice(index, 1);
      showCurrentOrder();
      calculateTotal();
    });

    li.appendChild(span);
    li.appendChild(btn);
    currentOrder.appendChild(li);
  });
      const servOptions = document.createElement("span");
      if (serviceTypeSelect.value === "delivery") {
        servOptions.textContent = " (Delivery Fee Applied : £3.50)";
       currentOrder.appendChild(servOptions);
      }else{
        servOptions.textContent = "Service: " + serviceTypeSelect.value ;
        currentOrder.appendChild(servOptions);
      }
     

}

function renderMenuItems(data) {
  menu.innerHTML = "";

  (data.categories || []).forEach(category => {
    const section = document.createElement("section");
    const heading = document.createElement("h3");
    const itemDivs = document.createElement("div");

    heading.textContent = category.name ?? "Menu";
    section.appendChild(heading);

    (category.items || []).forEach(item => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = `${item.name} - ${moneyText(item.price)}`;

      btn.addEventListener("click", () => {
        current_order.push({
          id: item.id,
          name: item.name,
          price: toMoney(item.price),
          station: item.station
        });
        showCurrentOrder();
        calculateTotal();
      });

      itemDivs.appendChild(btn);
    });

    section.appendChild(itemDivs);
    menu.appendChild(section);
  });
}

async function fetchMenuItems() {
  try {
    const response = await fetch("data/menu.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    renderMenuItems(data);
    showCurrentOrder();
    calculateTotal();
  } catch {
    menu.innerHTML = "<p style='color:red;'>Failed to load menu.</p>";
  }
}

function showOrders() {
  const orders = loadOrders();
  orderHistory.innerHTML = "";

  orders.slice().reverse().forEach((order, idxFromNewest) => {
    const wrapper = document.createElement("div");
    const header = document.createElement("div");
    const title = document.createElement("span");
    const meta = document.createElement("span");
    const itemsList = document.createElement("ul");
    const total = document.createElement("div");

    const displayNumber = orders.length - idxFromNewest;

    title.textContent = `Order ${displayNumber} `;
    meta.textContent = `(${formatDate(order.placedAt)})`;
    header.appendChild(title);
    header.appendChild(meta);

    (order.items || []).forEach(it => {
      const li = document.createElement("li");
      li.textContent = `${it.name} - ${moneyText(it.price)}`;
      itemsList.appendChild(li);
    });

    total.textContent = `Total: ${moneyText(order.total)}`;

    wrapper.appendChild(header);
    wrapper.appendChild(itemsList);
    wrapper.appendChild(total);

    orderHistory.appendChild(wrapper);
  });
}

clearbtn.addEventListener("click", () => {
  current_order.length = 0;
  showCurrentOrder();
  calculateTotal();
});

placeOrderBtn.addEventListener("click", () => {
  if (current_order.length === 0) {
    alert("Your order is empty!");
    return;
  }



  const newOrder = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    placedAt: new Date().toISOString(),
    items: current_order.map(i => ({
      id: i.id,
      name: i.name,
      price: toMoney(i.price),
      station: i.station
    })),
    total: Number(total.toFixed(2)),
    serviceType: serviceTypeSelect.value
  };

  const orders = loadOrders();
  orders.push(newOrder);
  saveOrders(orders);

  alert("Thank you for your order!");

  current_order.length = 0;
  showCurrentOrder();
  calculateTotal();
  showOrders();
});

fetchMenuItems();
showOrders();
