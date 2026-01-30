const menu = document.getElementById('menu')
const currentOrder = document.getElementById('cart')
const totalPrice = document.getElementById("total")

console.log(totalPrice)
const current_order = []



function calculateTotal(){

total = current_order.reduce((total, item)=> total + item.price, 0)
totalPrice.textContent = `Total: $${total.toFixed(2)}`
  
}
function showCurrentOrder(){

    currentOrder.innerHTML = ''

    current_order.forEach(order => {
        const li = document.createElement("li")
        const span = document.createElement("span")
        const btn = document.createElement("button")
        
        span.textContent = `${order.name} - $${order.price.toFixed(2)}`
        btn.type = "button"
        btn.textContent = "Remove"
        btn.addEventListener("click",() =>{
          const index = current_order.indexOf(order)
          if(index !== -1){
            current_order.splice(index, 1)
            showCurrentOrder()
            calculateTotal()
          }
        })
        li.appendChild(span)
        li.appendChild(btn)
       currentOrder.appendChild(li)
    });
     
}

function renderMenuItems(data){

    menu.innerHTML = ''

    data.categories.forEach(category =>{
        const section = document.createElement('section')

        const heading= document.createElement('h3')
        heading.textContent = category.name
        section.appendChild(heading)


        const itemDivs = document.createElement('div')

        category.items.forEach (item =>{
            const btn = document.createElement('button')
            btn.type = "button"
            btn.textContent = `${item.name} - $${item.price.toFixed(2)}`


            btn.addEventListener("click",()=>{
                current_order.push(item)
                showCurrentOrder()
                calculateTotal()
                
                console.log(`Added ${item.name} to order`);
                console.log(current_order);
            })
             itemDivs.appendChild(btn)
        })

        section.appendChild(itemDivs)
    menu.appendChild(section)
    })

   
}


async function fetchMenuItems() {
  try {
      
    const response = await fetch("data/menu.json");

    if (!response.ok) {
      throw new Error(`Failed to load menu.json (HTTP ${response.status})`);
    }

    const data = await response.json();
    renderMenuItems(data);
    showCurrentOrder(); 
  } catch (err) {
    console.error(err);
    menu.innerHTML = `<p style="color:red;">Could not load menu.json. Check path and run using a local server (Live Server).</p>`;
  }
}

fetchMenuItems()

