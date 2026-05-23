const datos = [
    { edad: 21, estatura: 1.52 }, { edad: 19, estatura: 1.55 },
    { edad: 24, estatura: 1.79 }, { edad: 20, estatura: 1.59 },
    { edad: 21, estatura: 1.56 }, { edad: 22, estatura: 1.60 },
    { edad: 20, estatura: 1.68 }, { edad: 19, estatura: 1.55 },
    { edad: 20, estatura: 1.72 }, { edad: 22, estatura: 1.78 },
    { edad: 19, estatura: 1.75 }, { edad: 21, estatura: 1.77 },
    { edad: 28, estatura: 1.76 }, { edad: 19, estatura: 1.79 },
    { edad: 22, estatura: 1.85 }, { edad: 21, estatura: 1.73 },
    { edad: 24, estatura: 1.65 }, { edad: 21, estatura: 1.58 },
    { edad: 42, estatura: 1.64 }, { edad: 17, estatura: 1.64 },
    { edad: 20, estatura: 1.52 }, { edad: 25, estatura: 1.56 }
];

const margen = { top:30, right:30, botton:70, left:60};
const ancho = 800 - margen.left - margen.right;
const alto = 600 - margen.top - margen.bottom;

//variables globales
let xActual = 50;
let edadAnterior = null;
const anchoBarra = 35;
const espacioEntreBarras = 4;
const espacioEntreGrupos = 45;

datos.forEach(d => {
    if (edadAnterior !== null && d.edad !== edadAnterior) {
        xActual += espacioEntreGrupos; // Salto de grupo
    }
    
    d.posicionX = xActual; // guardamos el X exacto en el dato de la posicion
    
    xActual += anchoBarra + espacioEntreBarras; // avanzamos para la siguiente barra
    edadAnterior = d.edad;
});

const setup = function() {

    //primero los ordeno de menor a mayor
    datos.sort((a, b) => a.edad - b.edad);

    //para agrupar por edad...
    datosAgrupados = d3.group(datos, (d) => d.edad); //esto crea un "arreglo" de cada edad

    crearSVG();
    crearEjes();
    crearBarras();
};

const crearSVG = function () {
    lienzo = d3 .select("#contenedor")
        .append("svg")
        .attr("width", ancho + margen.left + margen.right)
        .attr("height", alto + margen.top + margen.bottom)
        .append("g") //usamos g para agregar todos los datos del svg en un grupo y moverlo como tal
        .attr("transform", `translate(${margen.left},${margen.top})`);
};

//en ejeX, el scaleband se usa para los datos categoricos (textos)
/*Agarra el ancho total disponible (range) y lo divide en "bandas" 
según la cantidad de datos (domain). 
El padding(0.2) deja un 20% de espacio vacío entre cada barra. */
const crearEjes = function () {
    //escala para los grupos de edades...
    escalaX0 = d3.scaleBand()
        .range([0, ancho])
        .domain(Array.from(datosAgrupados.keys())) //saca un arreglo de las edades diferentes
        .padding(0.1); //es como un 10% de espacio entre grupos

    //necesito saber cuantos grupos hay
    const cantidadGrupos = d3.max(Array.from(datosAgrupados.values()), (d) => d.length);

    escalaX1 = d3.scaleBand()
        .domain(d3.range(cantidadGrupos)) //segun cuantos grupos de edades, se va calculando
        .range([0, escalaX0.bandwidth()])
        .padding(0.05); //espacio entre barras dentro del grupo

    lienzo.append("g")
        .attr("transform", `translate(0, ${alto})`)
        .call(d3.axisBottom(escalaX0))
        .selectAll("text")
        .style("font-size", "14px");

    
    //para el eje Y
    escalaY = d3.scaleLinear().domain([0, 2.0]).range([alto, 0]);

    lienzo.append("g").call(d3.axisLeft(escalaY));
};


const crearBarras = function () {
    lienzo
        .selectAll("rect")
        .data(datos)
        .enter()
        .append("rect")
        .attr("x", (d) => d.posicionX)
        .attr("y", (d) => escalaY(d.estatura))
        .attr("width", 35)
        .attr("height", (d) => alto - escalaY(d.estatura))
        .attr("fill", function(d){
            if (d.edad == "24") {
                return "#f07a7a";
            } else {
                return "#69b3a2";
            }
        });
    };

setup();