const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const kitchenSource = fs.readFileSync(
  path.join(__dirname, "../public/script/kitchen.js"), "utf8"
);

function setupKitchen(initialOrders) {
  const values = new Map([["orders", initialOrders]]);
  const handlers = {};

  function element(tagName) {
    return {
      tagName,
      children: [],
      textContent: "",
      listeners: {},
      appendChild(child) { this.children.push(child); },
      replaceChildren(...children) { this.children = children; },
      addEventListener(type, handler) { this.listeners[type] = handler; },
      click() { this.listeners.click?.(); },
    };
  }

  const display = element("section");
  const document = {
    getElementById: (id) => id === "showorders" ? display : null,
    createElement: element,
  };
  const localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  const window = {
    addEventListener: (type, handler) => { handlers[type] = handler; },
  };

  vm.runInNewContext(kitchenSource, { document, localStorage, window });
  return {
    display,
    read: () => JSON.parse(values.get("orders")),
    write: (orders) => values.set("orders", JSON.stringify(orders)),
    notifyStorage: () => handlers.storage({ key: "orders" }),
  };
}

test("serves one of two identical grill items without serving the other", () => {
  const kitchen = setupKitchen(JSON.stringify([{
    id: "order-1",
    items: [
      { name: "Burger", station: "GRILL", status: "pending" },
      { name: "Burger", station: "GRILL", status: "pending" },
      { name: "Cola", station: "DRINKS", status: "pending" },
    ],
  }]));

  assert.equal(kitchen.display.children[0].children.length, 2);
  kitchen.display.children[0].children[0].children[0].click();

  assert.equal(kitchen.read()[0].items[0].status, "served");
  assert.equal(kitchen.read()[0].items[1].status, "pending");
  assert.equal(kitchen.read()[0].items[2].status, "pending");
  assert.equal(kitchen.display.children[0].children.length, 1);

  kitchen.display.children[0].children[0].children[0].click();
  assert.equal(kitchen.read()[0].items[1].status, "served");
  assert.equal(kitchen.display.children[0].textContent, "No grill orders waiting.");
});

test("keeps concurrent updates from another station", () => {
  const kitchen = setupKitchen(JSON.stringify([{
    id: "order-1", items: [{ name: "Burger", station: "GRILL", status: "pending" }],
  }]));
  const button = kitchen.display.children[0].children[0].children[0];

  kitchen.write([
    { id: "order-1", items: [{ name: "Burger", station: "GRILL", status: "pending" }] },
    { id: "order-2", items: [{ name: "Tea", station: "CAFE", status: "served" }] },
  ]);
  button.click();

  assert.equal(kitchen.read()[1].items[0].status, "served");
  assert.equal(kitchen.read()[0].items[0].status, "served");
});

test("invalid local storage and storage events do not crash the kitchen", () => {
  const kitchen = setupKitchen("{invalid");
  assert.equal(kitchen.display.children[0].textContent, "No grill orders waiting.");

  kitchen.write([{ id: "new", items: [{ name: "Chips", station: "GRILL" }] }]);
  kitchen.notifyStorage();
  assert.equal(kitchen.display.children[0].children.length, 1);
});
