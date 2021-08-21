var currentProductsArray = [];

function showProductsList() {

    let htmlContentToAppend = "";   
    for (let i = 0; i < currentProductsArray.length; i++) {//Se inicia un contador para recorrer el arreglo de productos currentProductsArray. 
        let product = currentProductsArray[i];

        //Se agregan los valores del objeto dentro de un div en HTML (imagen, descripción, etc...) 
        htmlContentToAppend += ` 
        <a href="product-info.html" class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-3">
                        <img src="` + product.imgSrc + `"  class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">`+ product.name + `</h4>
                            <small class="text-muted">` + product.soldCount + ` vendidos</small>
                        </div>
                        <p class="mb-1">` + product.description + `</p>
                        <p class="mb-1">` + product.currency + ` ` + product.cost + `</p>
                    </div>
                </div>
            </a>
            `
    }

    document.getElementById("prod-list-container").innerHTML = htmlContentToAppend; // Se llama al div Id= prod-list-container del HTML 
    // y se le agregan todos los valores contenidos en htmlContentToAppend.
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentProductsArray = resultObj.data;
            showProductsList(currentProductsArray);
        }
    });
});