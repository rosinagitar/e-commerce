const ORDER_ASC_BY_COST = "1-2";
const ORDER_DESC_BY_COST = "2-1";
const ORDER_BY_SOLD_COUNT = "Relevancia";
var currentProductsArray = [];
var currentSortCriteria = undefined;
var minCost = undefined;
var maxCost = undefined;

/*Ordeno los productos de 3 formas diferentes, indicadas en las const de arriba*/
function sortProducts(criteria, array){
    let result = [];
    
    /*A sort le indico con esa función anónima la forma en la que quiero ordenar*/
    if (criteria === ORDER_ASC_BY_COST){
        result = array.sort(function(a, b){

    /*Esto es necesario para que los valores tipo texto se transformen en números*/
        let aCost = parseInt(a.cost);
        let bCost = parseInt(b.cost);
            
    /*Si el costo de A es mayor que el costo de B, el costo de B(más barato) aparece 1ro en la lista*/
        if (aCost < bCost){return -1;}
        if (aCost > bCost){return 1;}
        return 0;
        });
    } else if (criteria === ORDER_DESC_BY_COST){
        result = array.sort(function(a, b){

        let aCost = parseInt(a.cost);
        let bCost = parseInt(b.cost);

        if (aCost > bCost){return -1;}
        if (aCost < bCost){return 1;}
        return 0;
        });
    } else if (criteria === ORDER_BY_SOLD_COUNT){
        result = array.sort(function(a, b){
            let aSoldCount = parseInt(a.soldCount);
            let bSoldCount = parseInt(b.soldCount);

            if (aSoldCount > bSoldCount){return -1;}
            if (aSoldCount < bSoldCount){return 1;}
            return 0;
        });
    }
    return result;
}

function showProductsList() {

    let htmlContentToAppend = "";   
    for (let i = 0; i < currentProductsArray.length; i++) {//Se inicia un contador para recorrer el arreglo de productos currentProductsArray. 
        let product = currentProductsArray[i];

        if (((minCost == undefined) || (minCost != undefined && parseInt(product.cost) >= minCost)) &&
        ((maxCost == undefined) || (maxCost != undefined && parseInt(product.cost) <= maxCost))){ //El if indica si está entre el mínimo y el máximo.

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
}

/*Usa las 2 func anteriores: primero ordena y luego muestra*/
function sortAndShowProducts(sortCriteria, productsArray){
    currentSortCriteria = sortCriteria;

/*Si la lista de prod no está undefined, se setea en la var currentProductsArray la lista de prod*/    
    if(productsArray != undefined){
        currentProductsArray = productsArray;
    }

/*Ordena la lista contenida en currentProductsArray*/    
    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    //Muestro los productos ordenados
    showProductsList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
/*Si no hay error, se carga la lista ordenada (por defecto) y se muestra*/        
        if (resultObj.status === "ok") {
            sortAndShowProducts(ORDER_ASC_BY_COST, resultObj.data);
        }
    });

/*Después de hacer click en cada botón, se muestra la lista ordenada según el criterio puesto como parámetro*/   
    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_COST);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_COST);
    });
    
    document.getElementById("sortBySoldCount").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_SOLD_COUNT);
    });

/*Después de hacer click en el botón, se borran los rangos de precio ingresados en cada campo y se restablece la lista*/   
    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCostMin").value = "";
        document.getElementById("rangeFilterCostMax").value = "";

        minCost = undefined;
        maxCost = undefined;

        showProductsList();
    });

/*Después de hacer click, si se cumple lo del if, se transforma el valor de minCost en números usando parseInt. Sino, quedan undefined*/    
    document.getElementById("rangeFilterCost").addEventListener("click", function(){
        minCost = document.getElementById("rangeFilterCostMin").value;
        maxCost = document.getElementById("rangeFilterCostMax").value;

        if ((minCost != undefined) && (minCost != "") && (parseInt(minCost)) >= 0){
            minCost = parseInt(minCost);
        }
        else{
            minCost = undefined;
        }

        if ((maxCost != undefined) && (maxCost != "") && (parseInt(maxCost)) >= 0){
            maxCost = parseInt(maxCost);
        }
        else{
            maxCost = undefined;
        }

/*Luego de la función anterior, los valores devueltos van a ser números o undefined. Ahora se llama a esta función para mostrar la lista*/
        showProductsList();
    });
});