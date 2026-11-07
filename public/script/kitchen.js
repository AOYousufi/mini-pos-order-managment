const showOrder = document.getElementById("showorders");

function readOrders() {
  try {
    const parsed = JSON.parse(localStorage.getItem("orders") || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadOrders() {
  const orders = readOrders();
  const list = document.createElement("ul");
  let pendingCount = 0;

  showOrder.replaceChildren();

  orders.forEach((order) => {
    if (!Array.isArray(order.items)) return;

    order.items.forEach((item, itemIndex) => {
      if (item.station !== "GRILL" || item.status === "served") return;
      pendingCount += 1;

      const row = document.createElement("li");
      const serveButton = document.createElement("button");
      row.textContent = `Order ID: ${order.id}, Item Name: ${item.name}, Status: pending `;
      serveButton.type = "button";
      serveButton.textContent = "Serve";

      serveButton.addEventListener("click", () => {
        // Read the latest copy so updates from other kitchen stations are kept.
        const latestOrders = readOrders();
        const targetOrder = latestOrders.find((entry) => entry.id === order.id);
        const targetItem = targetOrder?.items?.[itemIndex];
        if (targetItem?.station === "GRILL" && targetItem.status !== "served") {
          targetItem.status = "served";
          localStorage.setItem("orders", JSON.stringify(latestOrders));
        }
        loadOrders();
      });

      row.appendChild(serveButton);
      list.appendChild(row);
    });
  });

  if (pendingCount) {
    showOrder.appendChild(list);
  } else {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No grill orders waiting.";
    showOrder.appendChild(emptyMessage);
  }
}

window.addEventListener("storage", (event) => {
  if (event.key === "orders") loadOrders();
});

loadOrders();
