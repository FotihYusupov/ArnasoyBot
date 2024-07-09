const URL = "http://192.168.1.102:4002/api";

const clientsList = window.document.querySelector("#partyClient");
const logistList = window.document.querySelector("#partyLogist");
const warehousesList = window.document.querySelector("#warehousesList");
const productCategoriesList = window.document.querySelector("#productsList");

const token = JSON.parse(window.localStorage.getItem("token"));
async function getMe() {
  if (!token) {
    window.location.pathname = "/login.html";
    return;
  }
  let res = await fetch(`${URL}/users/get-me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer: ${token}`,
    },
  });
  res = await res.json();
  if (!res.status) {
    window.localStorage.removeItem("token");
    window.location.pathname = "/login.html";
    return;
  }
}

getMe();

async function renderItems() {
  let resId = await fetch(`${URL}/parties/generate-id`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  resId = await resId.json();
  partyId.textContent = `Id: ${resId.id}`;
  let resClients = await fetch(`${URL}/clients`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  resClients = await resClients.json();
  for (item of resClients.data) {
      clientsList.innerHTML += `<option value=${item._id}>${item.name}</option>`;
  }
  for (item of resClients.data) {
      logistList.innerHTML += `<option value=${item._id}>${item.name}</option>`;
  }
  let resWarehouses = await fetch(`${URL}/warehouses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  resWarehouses = await resWarehouses.json();
  for (item of resWarehouses.data) {
    warehousesList.innerHTML += `<option value=${item._id}>${item.name}</option>`;
  }
}

renderItems();
var counter = 0;

async function renderProductsList(increment = false) {
  if (increment) {
    counter += 1;
  }

  let resProductCategories = await fetch(`${URL}/product-categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  resProductCategories = await resProductCategories.json();
  
  const hero = document.createElement("div");
  hero.classList = 'flex mt-[10px] border-b-4 mb-[10px]';
  hero.id = `wrapper-${counter}`;
  
  const wrapper = document.createElement("div");

  const selectLabel = document.createElement("label");
  selectLabel.textContent = "Mahsulot turi";
  selectLabel.htmlFor = `productCategorySelect-${counter}`;
  selectLabel.classList = "block mb-1";

  const select = document.createElement("select");
  select.id = `productCategorySelect-${counter}`;
  select.classList = "w-full mb-2 px-4 py-2 text-gray-900 bg-white border rounded-md focus:outline-none focus:border-blue-500 hover:border-blue-400";
  select.required = true; // Make select required

  for (const item of resProductCategories.data) {
    const option = document.createElement("option");
    option.textContent = item.name;
    option.value = item._id;
    select.appendChild(option);
  }
  
  wrapper.appendChild(selectLabel);
  wrapper.appendChild(select);
  
  const priceLabel = document.createElement("label");
  priceLabel.textContent = "Narxi";
  priceLabel.htmlFor = `priceInp-${counter}`;
  priceLabel.classList = "block mb-1";

  const priceInp = document.createElement("input");
  priceInp.placeholder = "Narxi";
  priceInp.type = "number";
  priceInp.min = 0;
  priceInp.id = `priceInp-${counter}`;
  priceInp.classList = "w-[48%] mb-2 px-4 py-2 text-gray-900 bg-white border rounded-md focus:outline-none focus:border-blue-500 hover:border-blue-400";
  priceInp.value = resProductCategories.data[0].price;
  priceInp.required = true; // Make price input required
  
  const labelWrapper = document.createElement("div")
  labelWrapper.classList = "flex"
  const salePriceLabel = document.createElement("label");
  salePriceLabel.textContent = "Miqdori";
  salePriceLabel.htmlFor = `salePriceInp-${counter}`;
  salePriceLabel.classList = "w-[47%] mr-[10px] mb-1";

  const salePriceInp = document.createElement("input");
  salePriceInp.placeholder = "Miqdori";
  salePriceInp.type = "number";
  salePriceInp.min = 1;
  salePriceInp.id = `salePriceInp-${counter}`;
  salePriceInp.classList = "w-[47%] mr-[10px] mb-2 px-4 py-2 text-gray-900 bg-white border rounded-md focus:outline-none focus:border-blue-500 hover:border-blue-400";
  salePriceInp.value = 0;
  salePriceInp.required = true; // Make sale price input required
  
  labelWrapper.appendChild(salePriceLabel)
  labelWrapper.appendChild(priceLabel);
  wrapper.appendChild(labelWrapper)
  wrapper.appendChild(salePriceInp);
  wrapper.appendChild(priceInp);
  
  const plusWrapper = document.createElement('div');
  plusWrapper.innerHTML = `
    <div class="ml-[10px]">
      <div id="plus" class="flex justify-between mt-[33px] mb-[20px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="#006400"><path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path></svg>
      </div>
      ${
        counter == 0 ? `<p></p>` : `<div class="mt-[20px]" id="minus">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="#D30000"><path d="M5 11V13H19V11H5Z"></path></svg>
      </div>`
      }
    </div>
  `;

  hero.appendChild(wrapper);
  hero.appendChild(plusWrapper);

  plusWrapper.querySelector('#plus').addEventListener('click', () => {
    renderProductsList(true);
  });

  if (counter != 0) {
    plusWrapper.querySelector('#minus').addEventListener('click', () => {
      const heroes = document.querySelectorAll('.flex.mt-\\[10px\\].border-b-4.mb-\\[10px\\]');
      if (heroes.length > 1) {
        hero.remove();
      }
    });
  }

  document.getElementById('productCategoriesList').appendChild(hero);
  
  select.addEventListener("input", async (e) => {
    let resProductCategories = await fetch(`${URL}/product-categories?filter[_id]=${e.target.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    resProductCategories = await resProductCategories.json();
    const findCategory = resProductCategories.data.find(el => el._id === e.target.value);
    priceInp.value = findCategory.price;
    salePriceInp.value = findCategory.saledPrice;
  });
}

renderProductsList();

const incomeForm = document.querySelector("#incomeForm")

incomeForm.addEventListener("submit", () => {
  try {
    
  } catch (err) {
    console.log("hello")
  }
})