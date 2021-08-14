function showProductList(list, idContainer){
    let container = document.getElementById(idContainer);
    for (let element of list){
        container.innerHTML += `<h1>${element.name}</h1>`;
        container.innerHTML += `<p>Descripción: ${element.description}</p>`;
        container.innerHTML += `<p>Costo: ${element.cost}</p>`;
        container.innerHTML += `<p>Moneda: ${element.currency}</p>`;
        container.innerHTML += "<img src="+element.imgSrc+"><br>";
        container.innerHTML += `<p>Disponibles: ${element.soldCount}</p>`;
    }
}

function obtainProductList(){
    fetch('https://japdevdep.github.io/ecommerce-api/product/all.json')
    .then(response => response.json())
    .then(json => showProductList(json, "main"))
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", obtainProductList());