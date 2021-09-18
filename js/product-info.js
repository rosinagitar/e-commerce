var product = [];
var commentsArray = [];

let prodName = document.getElementById("prodName");
let prodCategory = document.getElementById("prodCategory");
let prodDescription = document.getElementById("prodDescription");
let prodCurrency = document.getElementById("prodCurrency");
let prodCost = document.getElementById("prodCost");
let prodSoldCount = document.getElementById("prodSoldCount");

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCT_INFO_URL).then(function (resultObj) { /*Obtenemos toda la info del producto que está en JSON y la mostramos en HTML.*/
        if (resultObj.status === "ok") {

            product = resultObj.data;

            prodName.innerHTML = product.name;
            prodCategory.innerHTML = product.category;
            prodDescription.innerHTML = product.description;
            prodCurrency.innerHTML = product.currency + " " + product.cost;
            prodSoldCount.innerHTML = product.soldCount;
        }
    });
});

/*Obtenemos la lista de comentarios que está en JSON y la mostramos en HTML.*/
function showCommentsList() {
    let htmlContentToAppend = "";

    for (let i = 0; i < commentsArray.length; i++) { /*Se inicia un contador para recorrer el arreglo de productos currentProductsArray.*/
        let comment = commentsArray[i];

        /*Se agregan los valores del objeto dentro de un div en HTML.*/
        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">Puntaje: `+ drawStars(comment.score) + `
                          </h4>
                            
                            <small class="text-muted">` + comment.dateTime + `</small>
                        </div>
                        <p class="mb-1">` + comment.description + `</p>
                        <p class="mb-1">Usuario: ` + comment.user + `</p>
                    </div>
                </div>
            </div>
            `
        /*Se llama al div= comments-list-container del HTML y se le agregan todos los valores contenidos en HTMLContentToAppend.*/
        document.getElementById("comments-list-container").innerHTML = htmlContentToAppend;
    }
}

document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
        /*Si no hay error, se carga la lista y se muestra.*/
        if (resultObj.status === "ok") {

            commentsArray = resultObj.data;

            showCommentsList(commentsArray);
        }
    });
});

/*Función para agregar nuevo comentario.*/
function addComment() {
    let htmlContentToAppend = "";
    let description = document.getElementById("commDescription").value;
    let score = document.getElementById("commScore").value;
    let user = localStorage.getItem("username");

    let date = new Date(); /*Función preestablecida para obtener fecha y hora.*/
    let day = date.getDate(); /*Obtenemos cada parte de la fecha y hora (día, mes, minuto...)*/
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if (month < 10) { /*Si tienen menos de 2 cifras, agrego 0 adelante.*/
        month = `0${month}`;
    }
    if (day < 10) {
        day = `0${day}`;
    }
    let hour = date.getHours();
    if (hour < 10) {
        hour = `0${hour}`;
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    let seconds = date.getSeconds();
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    let dateTime = `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`; /*Fecha y hora ordenada.*/

    /*Se agregan los valores dentro de un div en HTML.*/
    htmlContentToAppend = `
        <div class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">Puntaje: `+ drawStars(score) + `
                          </h4>
                            
                            <small class="text-muted">` + dateTime + `</small>
                        </div>
                        <p class="mb-1">` + description + `</p>
                        <p class="mb-1">Usuario: ` + user + `</p>
                    </div>
                </div>
            </div>
            `
/*Se llama al div= comments-list-container del HTML y se le agregan todos los valores del nuevo comentario.*/
    document.getElementById("comments-list-container").innerHTML += htmlContentToAppend;
    document.getElementById("commDescription").value = ""; /*Después de dar click, el campo "cuerpo" queda en blanco*/
}

/*Función para aplicar el puntaje en estrellas*/
function drawStars(stars) {
    let number = parseInt(stars);
    let htmlContentToAppend = "";

    for (let i = 1; i <= number; i++) { /*Esta variable recorre desde el 1 hasta el número del puntaje marcado.*/
        htmlContentToAppend += `<span class="fa fa-star checked"></span>` /*Estrella pintada.*/
    }
    for (let j = number + 1; j <= 5; j++) { /*Esta variable recorre desde una posición más adelante del puntaje marcado hasta el 5.*/
        htmlContentToAppend += `<span class="fa fa-star"></span>` /*Estrella sin pintar.*/
    }

    return htmlContentToAppend;
}