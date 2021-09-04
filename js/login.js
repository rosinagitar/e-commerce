//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
/*document.addEventListener("DOMContentLoaded", function(e){

});*/

function checkUsernameAndPassword(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if((username !=="") && (password !=="")){
        setUser();
        window.location.href="home.html";
    } else {
        alert("Debe completar ambos campos");
    }
}

/*Con esta función guardo el nombre de usuario en el navegador*/
function setUser(){
    let name = document.getElementById("username").value;
    localStorage.setItem("username", name);
}