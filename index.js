import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://add-to-card-6c078-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputElement = document.getElementById("input-add-to-cart");
const btnElement = document.getElementById("btn-add-to-cart");
const shoppingListElement = document.getElementById("shopping-list");

btnElement.addEventListener("click", handleClick);

onValue(shoppingListInDB, function (snapshopt) {
  if (snapshopt.exists()) {
    const shoppingListArr = Object.entries(snapshopt.val());
    clearShoppingListElement();
    for (let i = 0; i < shoppingListArr.length; i++) {
      let shoppingList = shoppingListArr[i];
      let shoppingListValue = shoppingList[1];
      if (shoppingListValue !== "") {
        addItemToShoppingListElement(shoppingList);
      }
    }
  } else {
    shoppingListElement.textContent = "No items in the list... yet!";
  }
});

function handleClick() {
  let inputValue = inputElement.value;
  push(shoppingListInDB, inputValue);
  clearInputFieldElement();
}

function clearShoppingListElement() {
  shoppingListElement.innerHTML = "";
}

function clearInputFieldElement() {
  inputElement.value = "";
}

function addItemToShoppingListElement(item) {
  let itemID = item[0];
  let itemValue = item[1];
  const newLiElement = document.createElement("li");
  newLiElement.textContent = itemValue;
  newLiElement.addEventListener("click", () => {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
    remove(exactLocationOfItemInDB);
  });
  shoppingListElement.appendChild(newLiElement);
}
