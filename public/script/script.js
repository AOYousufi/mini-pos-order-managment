const menu = document.getElementById('menu')








function renderMenuItems(data){

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
                console.log(`Added ${item.name} to order`);
                
            })
             itemDivs.appendChild(btn)
        })

        section.appendChild(itemDivs)
    menu.appendChild(section)
    })

   
}

async function fetchMenuItems() {


    const response = await fetch('data/menu.json')

    const data = await response.json()
    renderMenuItems(data)



}

fetchMenuItems()