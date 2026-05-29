const datos = [
    { edad: 21, peso: 54, estatura: 1.52, genero: 'F' },
    { edad: 19, peso: 55, estatura: 1.55, genero: 'F' },
    { edad: 24, peso: 85, estatura: 1.79, genero: 'M' },
    { edad: 20, peso: 80, estatura: 1.59, genero: 'M' },
    { edad: 21, peso: 75, estatura: 1.56, genero: 'F' },
    { edad: 22, peso: 83, estatura: 1.60, genero: 'F' },
    { edad: 20, peso: 85, estatura: 1.68, genero: 'F' },
    { edad: 19, peso: 53, estatura: 1.55, genero: 'F' },
    { edad: 20, peso: 70, estatura: 1.72, genero: 'M' },
    { edad: 22, peso: 70, estatura: 1.78, genero: 'M' },
    { edad: 19, peso: 72, estatura: 1.75, genero: 'M' },
    { edad: 21, peso: 96, estatura: 1.77, genero: 'M' },
    { edad: 28, peso: 89, estatura: 1.76, genero: 'M' },
    { edad: 19, peso: 65, estatura: 1.79, genero: 'M' },
    { edad: 22, peso: 85, estatura: 1.85, genero: 'M' },
    { edad: 21, peso: 100, estatura: 1.73, genero: 'M' },
    { edad: 24, peso: 58, estatura: 1.65, genero: 'M' },
    { edad: 21, peso: 57, estatura: 1.58, genero: 'M' },
    { edad: 42, peso: 73, estatura: 1.64, genero: 'F' },
    { edad: 17, peso: 58, estatura: 1.64, genero: 'F' },
    { edad: 20, peso: 52, estatura: 1.52, genero: 'F' },
    { edad: 25, peso: 52, estatura: 1.56, genero: 'M' }
];

//margen
const margen = { top:30, right:30, bottom:70, left:60};
const ancho = 800 - margen.left - margen.right;
const alto = 600 - margen.top - margen.bottom;

//definiedno escalas... ---------------------------------------------
//en X mapea la edad al ancho de la pantalla
const escalaX = d3.scaleLinear()
    .domain([0, d3.max(datos, d => d.edad) + 3]) //el 3 es un margen extra para por si a caso
    .range([0, ancho]);

//en Y ajusta la altura
const escalaY = d3.scaleLinear()
    .domain([0, d3.max(datos, d => d.estatura) + 0.2]) //0.2 para que no quede sobre la linea
    .range([alto, 0]); //se invierte el ragno porque crece al reves

//en el RADIO sera por peso. de 2 a 20 pixeles mas o menos
const escalaRadio = d3.scaleLinear()
    .domain([0, d3.max(datos, d => d.peso)])
    .range([2, 20]);

//aqui meojr hago una funcion individual como en C o java
const obtenerColor = (genero) => {
    return genero == 'M' ? "#93C572" : "#ADD8E6"
}
/*
console.log(`La estatura máxima es ${max}`);
console.log(`La estatura mínima es ${min}`);
console.log(`La extensión es:`);
console.log(extension);
*/

//ahora si el lienzo --------------------------------------
const lienzo = d3
    .select("#contenedor")
    .append("svg")
    .attr("width", ancho + margen.left + margen.right)
    .attr("height", alto + margen.top + margen.bottom)
    .append("g")
    .attr("transform", `translate(${margen.left},${margen.top})`);
    //tienene que ser `` para que se envien como argumentos a una funcion. es una INTERPOLACION

    // eje X
    lienzo.append("g")
        .attr("transform", `translate(0, ${alto})`)
        .call(d3.axisBottom (escalaX));
    
    //eje Y
    lienzo.append("g")
        .call(d3.axisLeft(escalaY));

//en lugar de "const" es "let para que carge solito en la pagina cuando se abre"
let circulos = lienzo
    .selectAll("circle")
    .data(datos)
    .enter()
    .append("circle")
    .attr("r", 0)
    .attr("cx", d => escalaX(d.edad)) //que en X se base en la edad
    .attr("cy", d => escalaY(d.estatura)) //que en Y se base en la estatura
    .attr("fill", d => obtenerColor(d.genero)) //que jale la funcion y aplique segun el genero
    .attr("opacity", 0.7)
    .attr("r", 0) //que inicie invisible en la animacion
    .transition()
    .duration(1500)
    .attr("r", (d) => escalaRadio(d.peso)); //que crezcan los circulos segun el peso

//aqui los eventos (filtros)--------------------------------------------------
const actualizarGrafica = function (datosFiltrados){
    //enlazo los datos actuales a los circulos
    circulos = lienzo.selectAll("circle").data(datosFiltrados);

    //aqui va el que hace cada dato segun el caso
    //ENTER: si aparece un nuevo elemento, los crea (lo mismo que )
    circulos
        .enter()
        .append("circle")
        .attr("r", 0)
        .attr("cx", d => escalaX(d.edad)) //que en X se base en la edad
        .attr("cy", d => escalaY(d.estatura)) //que en Y se base en la estatura
        .attr("fill", d => obtenerColor(d.genero)) //que jale la funcion y aplique segun el genero
        .attr("r", 0) //que inicie invisible en la animacion
        .transition()
        .duration(1500)
        .attr("r", (d) => escalaRadio(d.peso)); //que crezcan los circulos segun el peso

    //UPDATE: los elementos que se quedan, se mantienen en sus coordenadas
    circulos.transition()
        .duration(1000)
        .attr("cx", d => escalaX(d.edad)) //que en X se base en la edad
        .attr("cy", d => escalaY(d.estatura))//que en Y se base en la estatura
        .attr("r", (d) => escalaRadio(d.peso)) //que crezcan los circulos segun el peso
        .attr("fill", d => obtenerColor(d.genero)); //que jale la funcion y aplique segun el genero
    
    //EXIT: los elementos que no pasaron el filtro se encogen y se borran
    circulos.exit()
        .transition()
        .duration(1000)
        .attr("r", 0)
        .remove();
}

//aqui los botones----------------------------------------------------
const botones = d3.selectAll("button[value]").on("click", function (event){
    event.preventDefault();
    const boton = event.currentTarget;
    const filtro = boton.value;
    let datosFiltrados = null;

    //Ahora segun el caso del "value"
    switch(filtro){
        case "hombre":
            datosFiltrados = datos.filter((d) => d.genero == "M");
            break;
        case "mujer":
            datosFiltrados = datos.filter((d) => d.genero == "F");
            break;
        case "altos":
            datosFiltrados = datos.filter((d) => d.estatura > 1.60);
            break;
        case "par":
            datosFiltrados = datos.filter((d) => d.edad % 2 == 0);
            break;
        case "non":
            datosFiltrados = datos.filter((d) => d.edad % 2 != 0);
            break;
        default:
            datosFiltrados = datos; //muetra todos al presionar el boton de reset
            break;
    }

    actualizarGrafica(datosFiltrados);
});

actualizarGrafica(datos);