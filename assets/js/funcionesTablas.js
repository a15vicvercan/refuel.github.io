function pasarDatosArray(gasolineras) {
    let array = [];
    let arrayDatos = [];

    for (let i = 0; i < gasolineras.length; i++) {
        arrayDatos = [gasolineras[i].rotulo, gasolineras[i].pre95, gasolineras[i].pre98, gasolineras[i].preDi, gasolineras[i].preDiA, gasolineras[i].direccion, gasolineras[i].localidad];
        array.push(arrayDatos);
    }

    return array;

}

//Funcion que muestra en la tabla las gasolineras cercanas en un radio de 5km
function mostrarTablaGasolineras(rotulo, pre95, pre98, preDi, preDiA, direccion, localidad) {
    let tablaGasolineras = "<tr><td>" + rotulo + "</td><td>" + pre95 + "</td><td>" + pre98 + "</td><td>" + preDi + "</td><td>" + preDiA + "</td><td>" + direccion + "</td><td>" + localidad + "</td></tr>";

    $(".tablaGasolineras").html(tablaGasolineras);
}

//Funcion que ordena la table de precios por orden descendente o ascendente 
function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("tabla");
    switching = true;
    dir = "asc";

    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;

            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];

            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {

            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}