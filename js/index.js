const URL = "http://192.168.1.102:4002/api"

const token = JSON.parse(window.localStorage.getItem("token"))
async function getMe () {
  if (!token) {
    window.location.pathname = '/login.html'
    return
  }
  let res = await fetch(`${URL}/users/get-me`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer: ${token}`
    }
  })
  res = await res.json()
  if(!res.status) {
    window.localStorage.removeItem("token")
    window.location.pathname = '/login.html'
    return
  }
}

getMe()

async function getWarehouses() {
  try {
    let res = await fetch(`${URL}/warehouses`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    res = await res.json();
    console.log(res);

    const warehousesWrapper = window.document.querySelector("#warehouses");
    const warehousesList = document.createDocumentFragment();

    for (const item of res.data) {
      const p = document.createElement("p");
      p.className = "block p-[30px] bg-blue-500 mb-2 rounded text-center text-lg";
      p.textContent = item.name;
      warehousesList.appendChild(p);
    }

    warehousesWrapper.innerHTML = '';
    warehousesWrapper.appendChild(warehousesList);
  } catch (err) {
    console.error('Fetch error: ', err);
  }
}

getWarehouses();
