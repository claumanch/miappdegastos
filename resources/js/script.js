const form = document.getElementById("transactionForm");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  let transactionFormData = new FormData(form);
  let transactionObj = convertFormDataToTransactionObj(transactionFormData);
  saveTransactionObj(transactionObj);
  insertRowInTransactionTable(transactionObj);
  form.reset();
})

document.addEventListener("DOMContentLoaded", function (event) {
  drawCategory();
  let transactionObjArray = JSON.parse(localStorage.getItem("transactionData"));
  transactionObjArray.forEach(function (arrayElement) {
    insertRowInTransactionTable(arrayElement);
  }
  );
})

function insertRowInTransactionTable(transactionObj) {
  let transactionTableRef = document.getElementById("transactionTable");
  let newTransactionRowRef = transactionTableRef.insertRow(-1);
  newTransactionRowRef.setAttribute("data-transaction-id", transactionObj["transactionId"]);
  let newTransactionType = newTransactionRowRef.insertCell(0);
  newTransactionType.textContent = transactionObj["transactionType"];

  let newTransactionDescription = newTransactionRowRef.insertCell(1);
  newTransactionDescription.textContent = transactionObj["transactionDescription"];

  let newTransactionAmount = newTransactionRowRef.insertCell(2);
  newTransactionAmount.textContent = transactionObj["transactionAmount"];

  let newTransactionCategory = newTransactionRowRef.insertCell(3);
  newTransactionCategory.textContent = transactionObj["transactionCategory"];

  let newDeleteCell = newTransactionRowRef.insertCell(4);
  let deleteButton = document.createElement("button");
  deleteButton.textContent = "X";
  newDeleteCell.appendChild(deleteButton);

  deleteButton.addEventListener("click", (event) => {
    let transactionRow = event.target.parentNode.parentNode;
    let transactionId = transactionRow.getAttribute("data-transaction-id");
    transactionRow.remove();
    deleteTransactionObj(transactionId);
  });

}


function getNewTransactionId() {
  let lastTransactionId = localStorage.getItem("lastTransactionId") || "-1";
  let newTransactionId = JSON.parse(lastTransactionId) + 1;
  localStorage.setItem("lastTransactionId", JSON.stringify(newTransactionId));
  return newTransactionId;
}

function convertFormDataToTransactionObj(transactionFormData) {
  let transactionType = transactionFormData.get("transactionType");
  let transactionDescription = transactionFormData.get("transactionDescription");
  let transactionAmount = transactionFormData.get("transactionAmount");
  let transactionCategory = transactionFormData.get("transactionCategory");
  let transactionId = getNewTransactionId();
  return {
    "transactionType": transactionType,
    "transactionDescription": transactionDescription,
    "transactionAmount": transactionAmount,
    "transactionCategory": transactionCategory,
    "transactionId": transactionId
  };
}

function drawCategory() {
  let allCategories = [
    "Work",
    "Rent",
    "Transport",
    "Eat&Fun",
  ];
  for (let index = 0; index < allCategories.length; index++) {
    insertCategory(allCategories[index]);
  }
}


// Añadir categoria de forma dinamica
function insertCategory(categoryName) {
  const selectElement = document.getElementById("transactionCategory");
  let htmlToInsert = `<option> ${categoryName} </option>`;
  selectElement.insertAdjacentHTML("beforeend", htmlToInsert);
}

// Eliminar del LS la transacción
function deleteTransactionObj(transactionId) {
  let transactionObjArray = JSON.parse(localStorage.getItem("transactionData"));
  let transactionIndexArray = transactionObjArray.findIndex(element => element.transactionId == transactionId);
  transactionObjArray.splice(transactionIndexArray, 1);
  // Convierto en formato JSON el nuevo array después de eliminar la transacción
  let transactionArrayJSON = JSON.stringify(transactionObjArray);
  // Guardo el array en local Storage
  localStorage.setItem("transactionData", transactionArrayJSON);
}

function saveTransactionObj(transactionObj) {
  let myTransactionArray =
    JSON.parse(localStorage.getItem("transactionData")) || [];
  myTransactionArray.push(transactionObj);
  // Convierto el array de transacciones a formato JSON
  let transactionArrayJSON = JSON.stringify(myTransactionArray);
  // Guardo el array en formato JSON en el local Store
  localStorage.setItem("transactionData", transactionArrayJSON);
}
