//Declaración de los elementos que van a recibir los inputs
const titleInput = document.getElementById("title")
const yearInput = document.getElementById("year")
const descriptionInput = document.getElementById("description")
const imageInput = document.getElementById("image")
const genreInput = document.getElementById("genre")
const buttonInput = document.getElementById("button")
let editFilmId = null

//Validaciones Regex (todas las casillas del formulario deben validarse)
const yearRegex = /^[0-9]{4}$/ //Exige 4 cifras numéricas

let allFilms = [];

const deleteItem = (id) => {
    const index = allFilms.findIndex(obj => obj.id === id);

    if (index !== -1) {
        allFilms.splice(index, 1);
        paintTable(allFilms);
    }
};


function editItem(id) {
    editFilmId = id;

    const editFilm = allFilms.find(film => film.id === id);

    if (!editFilm) return;

    titleInput.value = editFilm.title;
    yearInput.value = editFilm.year;
    descriptionInput.value = editFilm.description;
    imageInput.value = editFilm.image;
    genreInput.value = editFilm.genre;

    buttonInput.textContent = "Actualizar datos";
}

function updateFilm() {
    if (editFilmId === null) return;

    const editedFilm = {
        id: editFilmId,
        image: imageInput.value,
        title: titleInput.value,
        year: yearInput.value,
        genre: genreInput.value,
        description: descriptionInput.value
    };

    const index = allFilms.findIndex(film => film.id === editFilmId);

    if (index !== -1) {
        allFilms[index] = editedFilm;
    }

    editFilmId = null;
    buttonInput.textContent = "Añadir película";

    paintTable(allFilms);
}

function paintTable(arrayOfFilms) { //Creo la función de creación de tabla fuera para reutilizarla
    let tbody = document.querySelector("tbody")
    tbody.innerHTML = "" // En cada click, vacío el body para evitar seguir guardando datos duplicados

    arrayOfFilms.forEach(film => { // Una vez almacenado el array, creo una tabla y añado los datos:
        let row = document.createElement("tr") //Creo una fila
        let columnImage = document.createElement("td") // Creo la primera columna
        let filmImage = document.createElement("img")
        filmImage.src = film.image // Que contendrá la "imagen"
        filmImage.width = 120
        filmImage.height = 150
        columnImage.appendChild(filmImage)
        row.appendChild(columnImage)

        let columnTitle = document.createElement("td") //Creo la segunda columna
        columnTitle.textContent = film.title //Que contentrá el "título"
        row.appendChild(columnTitle)

        let columnYear = document.createElement("td") //Creo la tercera columna
        columnYear.textContent = film.year //Que contendrá el "año"
        row.appendChild(columnYear)

        let columnGenre = document.createElement("td") //Creo la cuarta columna
        columnGenre.textContent = film.genre //Que contendrá el "género"
        row.appendChild(columnGenre)

        let columnDescription = document.createElement("td") // Creo la quinta columna
        columnDescription.textContent = film.description //Que contendrá la "descripción"
        row.appendChild(columnDescription)

        let columnAction = document.createElement("td") // Creo la sexta columna
        let deleteButton = document.createElement("button")
        deleteButton.addEventListener("click", function (e) {
            deleteItem(film.id)

        })
        let editButton = document.createElement("button")


        editButton.addEventListener("click", function (e) {
            editItem(film.id)

        })

        deleteButton.textContent = "borrar"
        editButton.textContent = "editar"

        columnAction.appendChild(deleteButton)
        columnAction.appendChild(editButton)
        row.appendChild(columnAction)

        tbody.appendChild(row) // Por cada película: 1 fila, 5 columnas
    })
}

const button = document.getElementById("button") // Botón "Añadir película"

// Cuando pulso el botón "Añadir película"...
button.addEventListener("click", function (event) {
    event.preventDefault() //evitar su función por defecto

    if (editFilmId !== null) {
        //Valido que todos los inputs tengan algún valor
        if (
            titleInput.value.trim() === "" ||
            yearInput.value.trim() === "" ||
            descriptionInput.value.trim() === "" ||
            imageInput.value.trim() === "" ||
            genreInput.value.trim() === "") {
            alert("Todos los campos son obligatorios");
            return
        }

        //Declaración de las variables necesarias para las siguientes validaciones
        let currentYear = new Date().getFullYear()
        let yearValue = yearInput.value

        //Valido que el input "año" sean 4 cifras numéricas entre 1800 y el año actual
        if (!yearRegex.test(yearValue)) {
            alert("Introducir un año de valor numérico de 4 cifras");
            return
        }

        //Valido que el input "año" esté entre 1800 y el año actual
        if (Number(yearValue) < 1800 || Number(yearValue) > currentYear) {
            alert(`El año debe estar entre 1800 y ${currentYear}`)
            return
        }

        updateFilm()
        return
    }

    //Valido que todos los inputs tengan algún valor
    if (
        titleInput.value.trim() === "" || // ".trim()" detecta que no haya campos vacíos ni campos rellenados solo con "espacios"
        yearInput.value.trim() === "" ||
        descriptionInput.value.trim() === "" ||
        imageInput.value.trim() === "") {
        alert("Todos los campos son obligatorios");
        return
    }

    //Declaración de las variables necesarias para las siguientes validaciones
    let currentYear = new Date().getFullYear()
    let yearValue = yearInput.value

    //Valido que el input "año" sean 4 cifras numéricas entre 1800 y el año actual
    if (!yearRegex.test(yearValue)) {
        alert("Introducir un año de valor numérico de 4 cifras"); //popup
        return //Uso "return" para evitar que se guarden películas con el año erróneo
    }

    //Valido que el input "año" esté entre 1800 y el año actual
    if (Number(yearValue) < 1800 || Number(yearValue) > currentYear) {
        alert(`El año debe estar entre 1800 y ${currentYear}`)
        return
    }

    // Voy almacenando los "value" de los inputs en el array:
    allFilms.push({ //Cada objeto va a ser una película
        id: new Date().getSeconds(),
        image: imageInput.value,
        title: titleInput.value,
        year: yearInput.value,
        genre: genreInput.value,
        description: descriptionInput.value
    })
    return paintTable(allFilms)
});

const filterButtonInput = document.getElementById("filterButton"); // botón "filtrar por género"
const filterTitleInput = document.getElementById("filterTitle"); // botón "filtrar por título"

function filters() {
    let genreFiltered = filterButtonInput.value
    let filteredTitle = filterTitleInput.value

    const filteredFilms = allFilms.filter(film => {
        const matchesGenre = genreFiltered === "Todos" || film.genre === genreFiltered;

        const matchesTitle = film.title.toLowerCase().includes(filteredTitle.toLowerCase());

        return matchesGenre && matchesTitle;
    })
    paintTable(filteredFilms);
}

filterButtonInput.addEventListener("change", filters);
filterTitleInput.addEventListener("input", filters); //Hay que dar "enter" para que entienda el cambio
