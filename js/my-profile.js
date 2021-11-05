/*Función para guardar los datos personales en localStorage.*/
function savePersonalInfo() {
    /*Para esto necesitamos guardar los valores ingresados en cada dato en un registro.*/
    let personalInfo = {};

    personalInfo.firstName = document.getElementById("firstName").value;
    personalInfo.secondName = document.getElementById("secondName").value;
    personalInfo.firstSurname = document.getElementById("firstSurname").value;
    personalInfo.secondSurname = document.getElementById("secondSurname").value;
    personalInfo.emailAddress = document.getElementById("emailAddress").value;
    personalInfo.telNumber = document.getElementById("telNumber").value;

    /*Convertimos el registro a JSON con stringify y lo guardamos en localStorage.*/
    localStorage.setItem("profile", JSON.stringify(personalInfo));
}

/*Función para traer los valores guardados en localStorage y mostrarlos en cada input.*/
function getSavedPersonalInfo() {
    /*Convertimos el JSON guardado en localStorage a registro JS con parse para poder manejarlo y mostrar en cada input los valores guardados.*/
    let personalInfo = JSON.parse(localStorage.getItem("profile"));

    if (personalInfo != null) {
        document.getElementById("firstName").value = personalInfo.firstName;
        document.getElementById("secondName").value = personalInfo.secondName;
        document.getElementById("firstSurname").value = personalInfo.firstSurname;
        document.getElementById("secondSurname").value = personalInfo.secondSurname;
        document.getElementById("emailAddress").value = personalInfo.emailAddress;
        document.getElementById("telNumber").value = personalInfo.telNumber;
    };
}

/*Para poder subir una imagen desde el equipo.
Llamamos al input de type= file. Evento change: cuando el usuario confirma un cambio en el valor de un elemento.*/
document.getElementById("inputSelectImage").addEventListener("change", function (e) {
    /*Usamos FileReader para que la página lea ficheros (en este caso una imagen) guardados en el equipo. Los convierte a URL (base64).*/
    let reader = new FileReader();

    /*Después de que se lea la imagen, la guardamos en localStorage.*/
    reader.addEventListener("load", function (e) {
        localStorage.setItem("recentImage", reader.result);
    });

    /*Indicamos la posición del arreglo de ficheros (0 porque es la primera y es una sola).*/
    reader.readAsDataURL(this.files[0]);
});

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    document.getElementById("saveChanges").addEventListener("click", function (e) {
        /*Después de hacer click en el botón de guardar cambios, ejecutamos para guardar los datos en localStorage.*/
        savePersonalInfo();
    });

    /*Después de cargar el contenido de DOM, ejecutamos para traer los valores guardados en localStorage y mostrarlos.*/
    getSavedPersonalInfo();

    /*Para traer la imagen guardada en localStorage y mostrarla.*/
    let recentImageDataUrl = localStorage.getItem("recentImage");

    /*Si hay una imagen cargada, se llama al img con src="" y se le setea la URL contenida en la var recentImageDataUrl.*/
    if (recentImageDataUrl != null) {
        document.getElementById("imgPreview").setAttribute("src", recentImageDataUrl);
    }
});