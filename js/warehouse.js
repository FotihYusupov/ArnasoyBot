const URL = "http://193.187.96.97:4002/api"

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const id = urlParams.get('id');

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

const partiesList = window.document.querySelector("#partiesList")
const paginationList = window.document.querySelector("#pagination")

function parseTimestampToDate(timestamp) {
  var date = new Date(timestamp * 1000);
  
  var day = String(date.getDate()).padStart(2, '0');
  var month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  var year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

async function getParties(page = 1) {
  partiesList.innerHTML = ""; // Clear existing content
  
  // Create the header row
  partiesList.innerHTML = `
    <li class="flex justify-between border-b-4">
      <p class="text-lg font-bold text-center w-[5%]">Id</p>
      <p class="text-lg font-bold text-center w-[20%]">Invoice</p>
      <p class="text-lg font-bold text-center w-[35%]">Invoice Date</p>
      <p class="text-lg font-bold text-center w-[30%]">Transport</p>
    </li>
  `;
  
  // Fetch parties data from API
  let partiesRes = await fetch(`${URL}/parties?filter[warehouse]=${id}&page=${page}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Removed colon from Bearer token
    }
  });
  
  // Parse response to JSON
  partiesRes = await partiesRes.json();
  
  // Populate partiesList with data
  for (const item of partiesRes.data) {
    partiesList.innerHTML += `
      <li class="flex justify-between border-b-4 py-[10px]">
        <p class="w-[5%] text-center">${item.id}</p>
        <p class="w-[20%] text-center">${item.invoice}</p>
        <p class="w-[35%] text-center">${parseTimestampToDate(item.invoiceDate)}</p>
        <p class="w-[30%] text-center">${item.transportNumber}</p>
      </li>
    `;
  }
  
  // Add pagination controls
  partiesList.innerHTML += `
    <div class="flex justify-center mt-4">
      <button onclick="prevPage()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}" ${page === 1 ? 'disabled' : ''}>Prev</button>
      <button onclick="nextPage()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded ${page === partiesRes._meta.totalPages ? 'opacity-50 cursor-not-allowed' : ''}" ${page === partiesRes._meta.totalPages ? 'disabled' : ''}>Next</button>
    </div>
  `;
  
  // Return current page number for further use if needed
  return page;
}

// Function to handle previous page click
async function prevPage() {
  currentPage--;
  if (currentPage < 1) {
    currentPage = 1;
  }
  await getParties(currentPage);
}

// Function to handle next page click
async function nextPage() {
  currentPage++;
  await getParties(currentPage);
}

let currentPage = 1; // Initial page

// Initial call to fetch and display parties
getParties(currentPage);
