const removeProduct = (name) => {
  let productTitle = JSON.parse(sessionStorage.getItem("productTitle"));
  let index = productTitle.indexOf(name);
  productTitle.splice(index, 1);
  const removedProdct = document.getElementById(name);
  removedProdct.remove();
  sessionStorage.setItem("productTitle", JSON.stringify(productTitle));
};
const updateProductList = (name) => {
  const productList = document.getElementById("product-list");
  const noProducts = document.getElementById("no-products");
  if (noProducts) {
    noProducts.remove();
    noProducts.remove();
  }
  const product = document.createElement("div");
  product.setAttribute("class", "product-list-item col btn btn-warning w-100");
  product.setAttribute("id", name);
  const productNameElement = document.createElement("div");
  productNameElement.innerHTML = name.substring(0, 15) + "...";
  const prooductRemoveBtn = document.createElement("button");
  prooductRemoveBtn.setAttribute("class", "btn");
  prooductRemoveBtn.innerHTML = "X";
  prooductRemoveBtn.setAttribute("onclick", `removeProduct('${name}')`);
  product.appendChild(productNameElement);
  product.appendChild(prooductRemoveBtn);
  productList.appendChild(product);
  return;
};
const addProduct = (name) => {
  let productTitle = JSON.parse(sessionStorage.getItem("productTitle"));
  if (productTitle) {
    productTitle.push(name);
  } else {
    productTitle = [name];
  }
  sessionStorage.setItem("productTitle", JSON.stringify(productTitle));
  updateProductList(name);
  return;
};
const getProductData = async () => {
  sessionStorage.clear();
  let names = [];
  let links = [];
  const res = await fetch(
    "https://www.material-depot-backend.materialdepot.in/api/products/all-products",
    {
      method: "GET",
    }
  );
  const json = await res.json();
  const products = json.products;
  console.log(products);
  const orderList = document.getElementById("order-list");
  products.forEach((product) => {
    if (!links.includes(product.imageURL)) {
      names.push(product.name);
      links.push(product.imageURL);
      const listItem = document.createElement("div");
      listItem.innerHTML = product.name;
      listItem.setAttribute("onclick", `addProduct("${product.name}")`);
      listItem.setAttribute("class", "list-item");
      orderList.appendChild(listItem);
    }
  });
  sessionStorage.setItem("names", JSON.stringify(names));
  sessionStorage.setItem("links", JSON.stringify(links));
};
const displayQR = () => {
  const productNames = JSON.parse(
    sessionStorage.getItem("currentProductNames")
  );
  const productLinks = JSON.parse(
    sessionStorage.getItem("currentProductLinks")
  );
  //   const qrCodeContainer = document.getElementById("qr-code-container");
  let qrCodes = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossorigin="anonymous"
      />
      <script
        src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
        integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
        crossorigin="anonymous"
      ></script>
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
        integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
        crossorigin="anonymous"
      ></script>
      <script
        src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
        integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
        crossorigin="anonymous"
      ></script>
      <title>QR code Generator</title>
      <style>
        .qr-code-col {
          display: flex;
          /* width: 50px; */
          height: 305px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          /* margin: 30px; */
        }
        .img-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 120px;
          height: 120px;
          background-color: #f0efef;
          border-radius: 10px 10px 0px 0px;
        }
        .img-container img {
          width: 90px;
          height: 90px;
        }
        .product-text {
          text-align: center;
          border-radius: 10px;
          font-weight: 500;
          background-color: #ffdb15;
          width: 150px;
          font-size: 12px;
          padding: 8px;
        }
        .brand-text {
          margin-top: 10px;
          font-weight: 500;
          font-size: 12px;
        }
      </style>
    </head>
    <body onload="displayQR()">
      <div id="qr-code-container" class="row">`;
  let sectionBreakIndexes = JSON.parse(
    sessionStorage.getItem("sectionBreakIndexes")
  );
  productNames.forEach((name, index) => {
    console.log("this is sectionBreakIndexes", sectionBreakIndexes, index);
    qrCodes += `<div style="border-bottom: 1px solid grey;${
      sectionBreakIndexes.includes(index) &&
      "border-left:1px solid grey; height: 305px;"
    }" class="col-2 qr-code-col">
      <div class="img-container">
        <img
          src="${productLinks[index]}"
          alt=""
        />
      </div>
      <div class="product-text">${
        name.length <= 40 ? name : name.substring(0, 40) + " . . ."
      }</div>
      <div class="brand-text">MATERIAL DEPOT</div>
    </div>`;
    
  });
  qrCodes += `</div>
</body>
</html>`;
  //   qrCodeContainer.innerHTML = qrCodes;
  const win = window.open("", "", "");
  win.document.write(qrCodes);
  win.document.close();
  win.print();
};
const generateQR = async () => {
  const productTitle = JSON.parse(sessionStorage.getItem("productTitle"));
  let currentProductNames = [];
  let currentProductLinks = [];
  let names = JSON.parse(sessionStorage.getItem("names"));
  let links = JSON.parse(sessionStorage.getItem("links"));
  productTitle.forEach((title) => {
    if (title) {
      names.forEach((name, index) => {
        if (title.includes(name)) {
          currentProductNames.push(name);
          currentProductLinks.push(links[index]);
        }
      });
    }
  });
  sessionStorage.setItem(
    "currentProductNames",
    JSON.stringify(currentProductNames)
  );
  sessionStorage.setItem(
    "currentProductLinks",
    JSON.stringify(currentProductLinks)
  );
  //   window.location.href = "/qrCodes.html";
  console.log(currentProductLinks);
  displayQR();
};
const handleOrderData = (event) => {
  console.log("Handling order data");
  let productTitle = [];
  let sectionBreak = [];
  let sectionBreakIndexes = [];
  const rows = event.target.result.split("\n");
  const headingRow = rows[0];
  const headingCell = headingRow.split(",");
  const productTitleIndex = headingCell.indexOf("Lineitem name");
  const orderBreakIndex = headingCell.indexOf("Name");
  rows.shift();
  rows.forEach((row, index) => {
    const cell = row.split(",");
    const orderBreak = cell[orderBreakIndex];
    if (!sectionBreak.includes(orderBreak)) {
      sectionBreak.push(orderBreak);
      sectionBreakIndexes.push(index);
    }
    if (cell[productTitleIndex]) {
      productTitle.push(cell[productTitleIndex]);
      addProduct(cell[productTitleIndex]);
    }
  });
  console.log("section", sectionBreak);
  sectionBreakIndexes.pop();
  sectionBreakIndexes.shift();
  sessionStorage.setItem(
    "sectionBreakIndexes",
    JSON.stringify(sectionBreakIndexes)
  );
};
const handleOrderCSV = (event) => {
  const fileList = event.target.files;
  console.log(fileList);
  const reader = new FileReader();
  console.log(reader);
  reader.onload = handleOrderData;
  const data = reader.readAsText(fileList[0]);
};
const ordersCSV = document.getElementById("orders-csv");
ordersCSV.addEventListener("change", handleOrderCSV);

//dropdown
function showDropdown() {
  document.getElementById("order-list").classList.toggle("show");
  let search = document.getElementById("search");
  if (search.style.display == "none") {
    search.style.display = "flex";
  } else {
    search.style.display = "none";
  }
}

function filterFunction() {
  let search = document.getElementById("search");
  let filter = search.value.toUpperCase();
  let orderList = document.getElementById("order-list");
  let listItem = orderList.getElementsByTagName("div");
  for (let i = 0; i < listItem.length; i++) {
    txtValue = listItem[i].textContent || listItem[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      listItem[i].style.display = "";
    } else {
      listItem[i].style.display = "none";
    }
  }
}
// const checkCart = async () => {
//   // const res = await fetch(
//   //   "https://materia-depot.myshopify.com/admin/api/2021-07/checkouts.json",
//   //   { method: "get" }
//   // );
//   // const json = await res.json();
//   // console.log(json);
//   checkouts.forEach((checkout) => {
//     const currentTime = Date.now();
//     const cartTime = Date.parse(checkout.updated_at);
//     const timeDifference = (currentTime - cartTime) / 3_600_000;
//     const email = checkout.email;
//     const cartItems = checkout.line_items;
//     const cartURL = checkout.abandoned_checkout_url;
//     if (timeDifference >= 1) {
//       console.log(cartItems);
//       console.log(cartURL);
//       console.log("send Email to:", email);
//     }
//   });
// };

// checkCart();
