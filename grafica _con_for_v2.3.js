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
const ancho = 1300 - margen.left - margen.right;
const alto = 600 - margen.top - margen.bottom;

//dato maximo y minimo
const max = d3.max(datos, (d) => d.estatura);
const min = d3.min(datos, (d) => d.estatura);
const extension = d3.extent(datos, (d) => d.estatura);

console.log(`La estatura máxima es ${max}`);
console.log(`La estatura mínima es ${min}`);
console.log(`La extensión es:`);
console.log(extension);

//escala X para las Edades (de 0 a la edad maxima)
const escalaX = d3.scaleLinear()
    .domain([0, d3.max(datos, d => d.edad)])
    .range([0, ancho]);

//escala Y para la estatura
const escalaY = d3.scaleLinear()
    .domain([0, d3.max(datos, d=> d.peso)])
    .range([alto, 0]); //aqui invierto el rango porque el 0 es arriba

const lienzo = d3
    .select("#contenedor")
    .append("svg")
    .attr("width", ancho + margen.left + margen.right)
    .attr("height", alto + margen.top + margen.bottom)
    .append("g")
    .attr("transform", `translate(${margen.left},${margen.top})`);

    // eje X
    lienzo.append("g")
        .attr("transform", "translate(0, ${alto})")
        .call(d3.axisBottom (escalaX));
    
    //eje Y
    lienzo.append("g")
        .call(d3.axisLeft(escalaY));

const circulos = lienzo
    .selectAll("circle")
    .data(datos)
    .enter()
    .append("circle")
    .attr("r", 0)
    .attr("cx", (d, i) => 20 + i * 60)
    .attr("cy", alto / 2)
    .attr("fill", (d, i) => color(i % 6))
    .transition()
    .duration(5000)
    .attr("r", (d) => escala(d.valor));