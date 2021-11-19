let cartArray = [];
let currency2 = "UYU";

let shippingPercentage = 0.15;
let total = 0;
let subtotal = 0;
let msgToShowHTML = document.getElementById("alertSpan");
let msgToShow = "";

/*Función para mostrar los productos del carrito. Creamos la var cost (guarda info de costo unitario y moneda convertidos -con función convert-)*/
function showCart() {
  let htmlContentToAppend = "";
  let i = 1;
  let cost = 0;

  for (let cartProduct of cartArray) {
    cost = convert(cartProduct.unitCost, cartProduct.currency);

    /*Al imput le ponemos un id dinámico (porque es un valor que va a actualizarse). Primero igualamos i=1. Luego en el for
    va cambiando a diferentes números. 
    Para el subtotal le ponemos el mismo id dinámico pero le agregamos la palabra subtotal antes (los id deben ser únicos). 
    Primero ese subtotal va a guardar el resultado de cartProduct.count * cartProduct.unitCost, y después cambia cuando se 
    aplica la función updateSubtotal.*/
    htmlContentToAppend += `
            <tr>
             <td class="w-25">
             <img src="${cartProduct.src}" class="img-fluid img-thumbnail">
             </td>
              <td> ${cartProduct.name}</td>
              <td id="unitCost${i}">${currency2} ${cost}</td>
              <td>
              <input type="number" id="${i}" onchange="updateSubtotal(${i});" value="${cartProduct.count}" min="1">
              </td>
              <td id="subtotal${i}">${cartProduct.count * cost}</td>
            </tr>`

    i++;
  }

  document.getElementById("cart-container").innerHTML = htmlContentToAppend;
  showShippingAndTotalCost();
}

/*Función para actualizar los subtotales al modificar la cantidad de productos. Seteamos en la var cost el valor del costo unitario ya convertido 
y en la var count el valor de cantidad (puesto en el input).*/
function updateSubtotal(i) {
  let cost = convert(cartArray[i - 1].unitCost, cartArray[i - 1].currency);
  let count = document.getElementById(i).value;

  /*Al id=subtotal+i le pasamos el resultado de la multiplicación.*/
  document.getElementById("subtotal" + i).innerHTML = count * cost;

  /*Mostramos la suma de todos los subtotales.*/
  allSubtotals();
  /*Calculamos el costo de envío y el costo total.*/
  showShippingAndTotalCost();
}

/*Función para sumar todos los subtotales. Seteamos en la var sub todo lo contenido en el id=subtotal+i.*/
function allSubtotals() {
  htmlContentToAppend = "";
  let sub = 0;

  for (let i = 1; i <= cartArray.length; i++) {
    sub += parseFloat(document.getElementById("subtotal" + i).textContent); /*Aplicamos parseFloat para convertir a números con decimales.*/
  }
  /*Pasamos la info al id=subtotals.*/
  document.getElementById("subtotals").innerHTML = sub;
  subtotal = sub;
}

/*Función para cambiar las monedas. A la var unitCost le seteamos los valores de los costos unitarios convertidos y a la var count el valor
ingresado como cantidad.*/
function changeCurrency() {
  let unitCost = 0;

  for (let i = 1; i <= cartArray.length; i++) {
    unitCost = convert(cartArray[i - 1].unitCost, cartArray[i - 1].currency);
    let count = document.getElementById(i).value;

    /*Al id=subtotal+i le pasamos el resultado de la multiplicación y al id=unitCost+i la moneda cambiada y los costos unitarios convertidos.*/
    document.getElementById("subtotal" + i).innerHTML = unitCost * count;
    document.getElementById("unitCost" + i).innerHTML = currency2 + " " + unitCost;
  }

  /*Mostramos la suma de todos los subtotales en la moneda seleccionada.*/
  allSubtotals();
  /*Calculamos el costo de envío y el costo total en la moneda seleccionada.*/
  showShippingAndTotalCost();
}

/*Función para convertir a diferentes monedas (UYU y USD).*/
function convert(cost, currency) {
  if (currency2 == 'UYU' && currency == 'USD') {
    cost = cost * 40;
  } else if (currency2 == 'USD' && currency == 'UYU') {
    cost = cost / 40;
  }
  return cost;
}

function getCart(url) {
  return fetch(url)
    .then(response => {
      return response.json();
    });
}

/*Función para calcular costo de envío y costo total.*/
function showShippingAndTotalCost() {
  let shippingCostHTML = document.getElementById("shippingCost");
  let totalCostHTML = document.getElementById("totalCost");

  /*Guardamos las cuentas y sus resultados en variables y se los pasamos a cada elemento HTML.*/
  let shippingCostToShow = Math.round(subtotal * shippingPercentage);
  let totalCostToShow = Math.round(subtotal + (subtotal * shippingPercentage));

  shippingCostHTML.innerHTML = shippingCostToShow;
  totalCostHTML.innerHTML = totalCostToShow;
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  getCart("https://japdevdep.github.io/ecommerce-api/cart/654.json")
    .then(response => {
      cartArray = response.articles;
      currency2 = 'UYU';

      /*Muestro carrito y todos los subtotales.*/
      showCart();
      allSubtotals();
      showShippingAndTotalCost();

      document.getElementById("uruguayanPesos").addEventListener("click", function (e) {
        currency2 = 'UYU'; /*La moneda seleccionada pasa a ser UYU.*/

        changeCurrency(); /*Transformo los valores a la moneda seleccionada.*/
      });

      document.getElementById("dollars").addEventListener("click", function (e) {
        currency2 = 'USD'; /*La moneda seleccionada pasa a ser USD.*/

        changeCurrency(); /*Transformo los valores a la moneda seleccionada.*/
      });
    });

  /*Después de clickear cada radio button, cambiamos el valor del porcentaje que corresponda y ejecutamos la función.*/
  document.getElementById("premiumradio").addEventListener("click", function (e) {
    shippingPercentage = 0.15;
    showShippingAndTotalCost();
  });

  document.getElementById("expressradio").addEventListener("click", function (e) {
    shippingPercentage = 0.07;
    showShippingAndTotalCost();
  });

  document.getElementById("standardradio").addEventListener("click", function (e) {
    shippingPercentage = 0.05;
    showShippingAndTotalCost();
  });

  /*Validaciones*/
  let buyForm = document.getElementById("buy-form");
  let creditCardForm = document.getElementById("credit-card-form");
  let wireTransferForm = document.getElementById("wire-transfer-form");

  /*Se validan los campos calle, número y esquina después de clickear el botón submit.*/
  buyForm.addEventListener("submit", function (e) {
    let streetInput = document.getElementById("street");
    let numberInput = document.getElementById("number");
    let cornerInput = document.getElementById("corner");

    /*Usamos esta variable booleana para indicar que hay campos incompletos*/
    let infoMissing = false;

    streetInput.classList.remove('is-invalid');
    numberInput.classList.remove('is-invalid');
    cornerInput.classList.remove('is-invalid');

    /*Si los campos están vacíos, se le agrega a cada input la clase invalid (se muestra: Campo obligatorio) y le pasamos el valor true 
    a infoMissing.*/
    if (streetInput.value === "") {
      streetInput.classList.add('is-invalid');
      infoMissing = true;
    }

    if (numberInput.value === "") {
      numberInput.classList.add('is-invalid');
      infoMissing = true;
    }

    if (cornerInput.value === "") {
      cornerInput.classList.add('is-invalid');
      infoMissing = true;
    }

    /*Si no hay campos vacíos, al elemento HTML del alert le agregamos la clase alert-success (verde), mostramos el mensaje y borramos
    los valores de los inputs.*/
    if (!infoMissing) {
      msgToShow = "¡Su compra se ha realizado con éxito!";
      document.getElementById("alertMessage").classList.add('alert-success');
      document.getElementById("street").value = "";
      document.getElementById("number").value = "";
      document.getElementById("corner").value = "";

      /*Si falta completar alguno, al elemento HTML del alert le agregamos la clase alert-danger (rojo) y mostramos el mensaje.*/
    } else if (infoMissing) {
      msgToShow = "Debe completar campos vacíos";
      document.getElementById('alertMessage').classList.add('alert-danger');
    }

    msgToShowHTML.innerHTML = msgToShow;
    /*Al elemento HTML del alert le agregamos la clase show para que se muestre.*/
    document.getElementById("alertMessage").classList.add('show');

    if (e.preventDefault) e.preventDefault();
    return false;
  });

  /*Se validan los campos de la modal de tarjeta de crédito.*/
  creditCardForm.addEventListener("submit", function (e) {
    let completeNameInput = document.getElementById("completeName");
    let cardNumberInput = document.getElementById("cardNumber");
    let expirationDateInput = document.getElementById("expirationDate");
    let cvvInput = document.getElementById("cvv");

    let infoMissing = false;

    completeNameInput.classList.remove('is-invalid');
    cardNumberInput.classList.remove('is-invalid');
    expirationDateInput.classList.remove('is-invalid');
    cvvInput.classList.remove('is-invalid');

    if (completeNameInput.value === "") {
      completeNameInput.classList.add('is-invalid');
      infoMissing = true;
    }

    if (cardNumberInput.value === "") {
      cardNumberInput.classList.add('is-invalid');
      infoMissing = true;
    }

    if (expirationDateInput.value === "") {
      expirationDateInput.classList.add('is-invalid');
      infoMissing = true;
    }

    if (cvvInput.value === "") {
      cvvInput.classList.add('is-invalid');
      infoMissing = true;
    }

    if (!infoMissing) {
      msgToShow = "¡Pago realizado con éxito!";
      document.getElementById("alertMessage").classList.add('alert-success');
      document.getElementById("completeName").value = "";
      document.getElementById("cardNumber").value = "";
      document.getElementById("expirationDate").value = "";
      document.getElementById("cvv").value = "";

    } else if (infoMissing) {
      msgToShow = "Debe completar campos vacíos";
      document.getElementById('alertMessage').classList.add('alert-danger');
    }

    msgToShowHTML.innerHTML = msgToShow
    document.getElementById("alertMessage").classList.add('show');

    if (e.preventDefault) e.preventDefault();
    return false;
  });

  /*Se validan los campos de la modal de transferencia bancaria.*/
  wireTransferForm.addEventListener("submit", function (e) {
    let completeNameInput = document.getElementById("completeName2");
    let idNumberInput = document.getElementById("idNumber");
    let emailInput = document.getElementById("email");

    let infoMissing = false;

    completeNameInput.classList.remove('is-invalid');
    idNumberInput.classList.remove('is-invalid');
    emailInput.classList.remove('is-invalid');

    if (completeNameInput.value === "") {
      completeNameInput.classList.add('is-invalid');
      infoMissing = true;
    }

    if (idNumberInput.value === "") {
      idNumberInput.classList.add('is-invalid');
      infoMissing = true;
    }

    if (emailInput.value === "") {
      emailInput.classList.add('is-invalid');
      infoMissing = true;
    }

    if (!infoMissing) {
      msgToShow = "Ya podés realizar la transferencia";
      document.getElementById("alertMessage").classList.add('alert-success');
      document.getElementById("completeName2").value = "";
      document.getElementById("idNumber").value = "";
      document.getElementById("email").value = "";

    } else if (infoMissing) {
      msgToShow = "Debe completar campos vacíos";
      document.getElementById('alertMessage').classList.add('alert-danger');
    }

    msgToShowHTML.innerHTML = msgToShow
    document.getElementById("alertMessage").classList.add('show');

    if (e.preventDefault) e.preventDefault();
    return false;
  })
});