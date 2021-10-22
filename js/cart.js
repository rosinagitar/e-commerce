let cartArray = [];
let currency2 = "UYU";

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

  htmlContentToAppend2 = `
        <tr>
        <td></td>
        <td></td>
        <td></td>
        <td><b>Suma de subtotales</b></td>
        <td><h5 class="mb-3" id="subtotals"></h5></td>
        </tr>`

  document.getElementById("cart-container").innerHTML = htmlContentToAppend + htmlContentToAppend2;
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
}

/*Función para sumar todos los subtotales. Seteamos en la var subtotal todo lo contenido en el id=subtotal+i.*/
function allSubtotals() {
  htmlContentToAppend = "";
  let subtotal = 0;

  for (let i = 1; i <= cartArray.length; i++) {
    subtotal += parseFloat(document.getElementById("subtotal" + i).textContent); /*Aplicamos parseFloat para convertir a números con decimales.*/
  }
  /*Pasamos la info al id=subtotals.*/
  document.getElementById("subtotals").innerHTML = subtotal;
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

      document.getElementById("uruguayanPesos").addEventListener("click", function (e) {
        currency2 = 'UYU'; /*La moneda seleccionada pasa a ser UYU.*/

        changeCurrency(); /*Transformo los valores a la moneda seleccionada.*/
      });

      document.getElementById("dollars").addEventListener("click", function (e) {
        currency2 = 'USD'; /*La moneda seleccionada pasa a ser USD.*/

        changeCurrency(); /*Transformo los valores a la moneda seleccionada.*/
      });
    });
});