//Iniciamos el mapa
window.map = L.map('map');

//Iniciamos la ruta
window.ruta;
window.rutaExistente = 0;

let fechaHora;

//Funcion que genera los marcadores de cada gasolinera en el mapa
function mostrarMarcadores(lat, long, map, rotulo, horario, pre95, pre98, preDi, preDiA) {
    let textoPopUp = "<div class ='letrasMapa'> <h2 class='rotulo'><b>" + rotulo + "</b></h2><br><span class = 'horario'>Horario:</span> " + horario + "<br><hr>";
    if (pre95 == "No disponible") {
        textoPopUp += "<span class ='gasolina95'>Gasolina 95:</span> " + pre95 + "<br>";
    }
    else {
        textoPopUp += "<span class ='gasolina95'>Gasolina 95:</span> " + pre95 + "&euro;<br>";
    }
    if (pre98 == "No disponible") {
        textoPopUp += "<span class ='gasolina98'>Gasolina 98:</span> " + pre98 + "<br>";
    }
    else {
        textoPopUp += "<span class ='gasolina98'>Gasolina 98:</span> " + pre98 + "&euro;<br>";
    }
    if (preDi == "No disponible") {
        textoPopUp += "<span class ='diesel'>Diesel:</span> " + preDi + "<br>";
    }
    else {
        textoPopUp += "<span class ='diesel'>Diesel:</span> " + preDi + "&euro;<br>";
    }
    if (preDiA == "No disponible") {
        textoPopUp += "<span class ='dieselR33'>Diesel R33:</span> " + preDiA + "<br>";
    }
    else {
        textoPopUp += "<span class ='dieselR33'>Diesel R33:</span> " + preDiA + "&euro;<br>";
    }

    textoPopUp += "<a class = 'comoLlegar' onclick='comoLlegar(" + lat + "," + long + ")'>Como llegar</a>"

    textoPopUp += "</div>";

    var greenIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    var redIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    if (horario.length == 8) {
        L.marker([lat, long], { icon: greenIcon }).addTo(map)
            .bindPopup(textoPopUp);
    }
    else {
        L.marker([lat, long], { icon: redIcon }).addTo(map)
            .bindPopup(textoPopUp);
    }

}

function comoLlegar(latDestino, longDestino) {

    if (compartirUbicacion == 1) {
        if (window.rutaExistente == 1) {
            /*window.ruta.spliceWaypoints(2, 0);
            window.ruta.hide();*/
            window.map.removeControl(window.ruta);
        }

        window.ruta = L.Routing.control({
            waypoints: [
                L.latLng(latitudAct, longitudAct),
                L.latLng(latDestino, longDestino)
            ],
            collapsible: true,
            createMarker: function () { return null; },
            language: 'es',
            profile: 'car'
        })
            .addTo(map);

        window.rutaExistente = 1;
    }
    else {
        navigator.geolocation.getCurrentPosition(function (position) {
            window.latitudAct = position.coords.latitude;
            window.longitudAct = position.coords.longitude;

            window.map.setView([position.coords.latitude, position.coords.longitude], 15);

            var blueIcon = new L.Icon({
                iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            L.marker([position.coords.latitude, position.coords.longitude], { icon: blueIcon }).addTo(map)
                .bindPopup('Su posicion actual')
                .openPopup();

            compartirUbicacion = 1;

            comoLlegar(latDestino, longDestino);
        })
    }
}

function actualitzarMarcadors(fechaHora) {
    $.ajax({
        url: "https://api.mlab.com/api/1/databases/gasolineras/collections/gasolinera?q={'FechaHora': '" + fechaHora + "'}&l=1600&apiKey=DOZZAytBV3N46Futm-V4gJcR-3SdUIqb",
        headers: {
            "x-requested-with": "xhr"
        },
        ContentType: 'application/json',

        success: function (response) {

            //Si el usurio no acepta la geolocalizacion, se mostrara en el mapa la vista de toda cataluña
            window.map.setView([41.837, 1.539], 9);

            //Iniciamos la ruta
            window.ruta = "";

            L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            /*Legend specific*/
            var legend = L.control({ position: "bottomleft" });

            legend.onAdd = function (map) {
                var div = L.DomUtil.create("div", "legend");
                div.innerHTML += '<h4 class="tituloLeyenda">Leyenda</h4>';
                div.innerHTML += '<span class="leyenda"><img src="assets/images/azul.png">Posición actual</span><br>';
                div.innerHTML += '<span class="leyenda"><img src="assets/images/verde.png">24H</span><br>';
                div.innerHTML += '<span class="leyenda"><img src="assets/images/rojo.png">Horaio variable</span><br>';

                return div;
            };

            legend.addTo(map);

            //Guardamos el array con todas las gasolinares
            let gasolineras = response;

            let obj;
            let arrayObjetos = [];
            let dataSet = [];

            //Si el usuario acepta compartir su ubicacion se ejecutara esta parte
            navigator.geolocation.getCurrentPosition(function (position) {
                window.latitudAct = position.coords.latitude;
                window.longitudAct = position.coords.longitude;

                window.map.setView([position.coords.latitude, position.coords.longitude], 15);

                /*L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);*/

                var blueIcon = new L.Icon({
                    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });

                L.marker([position.coords.latitude, position.coords.longitude], { icon: blueIcon }).addTo(map)
                    .bindPopup('Su posicion actual')
                    .openPopup();

                compartirUbicacion = 1;

            })

            for (let i = 0; i < gasolineras.length; i++) {

                obj = procesarGasolineras(gasolineras[i])

                arrayObjetos.push(obj);

            }

            dataSet = pasarDatosArray(arrayObjetos);

            let table = $('#tabla').DataTable({
                data: dataSet,
                "sScrollY": "100%",
                "sScrollX": "100%",
                "language": {
                    "lengthMenu": "Mostrar _MENU_ campos por pagina",
                    "zeroRecords": "No hay resultados",
                    "info": "Pagina _PAGE_ de _PAGES_",
                    "infoEmpty": "No hay ningun dato disponible",
                    "infoFiltered": "(filtered from _MAX_ total records)",
                    "search": "Buscar: ",
                    "loadingRecords": "Cargando...",
                    "processing": "Procesando...",
                    "paginate": {
                        "first": "Primero",
                        "last": "Última",
                        "next": "Siguiente",
                        "previous": "Anterior"
                    },
                },
                columns: [
                    { title: "Marca" },
                    { title: "Sin plomo 95" },
                    { title: "Sin plomo 98" },
                    { title: "Diesel" },
                    { title: "Diesel R33" },
                    { title: "Direccion" },
                    { title: "Municipio" }
                ]
            });

            //Bucle que recorre el array de gasolineras para obtener los datos
            for (let i = 0; i < gasolineras.length; i++) {

                obj = procesarGasolineras(gasolineras[i])

                mostrarMarcadores(obj.lat, obj.long, map, obj.rotulo, obj.horario, obj.pre95, obj.pre98, obj.preDi, obj.preDiA);

            };

        }

    })
}

$(document).ready(function () {

    window.compartirUbicacion = 0;

    //Obtener la fecha de actualizacion de datos mas reciente y sus gasolineras
    $.ajax({
        url: "https://api.mlab.com/api/1/databases/gasolineras/collections/gasolinera?l=1&s={'FechaHora': -1}&f={'FechaHora': 1}&apiKey=DOZZAytBV3N46Futm-V4gJcR-3SdUIqb",
        headers: {
            "x-requested-with": "xhr"
        },
        ContentType: 'application/json',

        success: function (response) {

            actualitzarMarcadors(response[0]["FechaHora"]);
            //console.log("dfhlgdjklfg " + fechaHora)
        }
    })

    //Obtiene 
    $.ajax({
        url: "https://api.mlab.com/api/1/databases/gasolineras/collections/historial?s={'FechaHora': -1}&l=32&apiKey=DOZZAytBV3N46Futm-V4gJcR-3SdUIqb",
        headers: {
            "x-requested-with": "xhr"
        },
        ContentType: 'application/json',

        success: function (response) {

            //Guardamos el array con todas las gasolinares
            let historial = response;

            //Generamos el grafico de barras con las medias del dia actual

            generarGrafico(historial[0]["Media 95"], historial[0]["Media 98"], historial[0]["Media Diesel"], historial[0]["Media Diesel A"]);


            /*if (i == historial.length - 1) {
                generarGrafico(historial[i]["Media 95"], historial[i]["Media 98"], historial[i]["Media Diesel"], historial[i]["Media Diesel A"]);
            }*/


            //Generamos el grafico de linias con las medias de los ultimos 6 dias
            generarGrafico2(historial);
        }
    });

    //Escondemos por defecto uno de los graficos al cargar la pagina
    $("#myChart").hide();

    //Esta funcion permite cambiar entre los dos graficos haciendo click al boton
    $(".cambiarGrafico").click(function () {
        if ($("#myChart").is(':visible')) {
            $("#myChart").hide();
            $("#canvas").show();
        } else {
            $("#canvas").hide();
            $("#myChart").show();
        }
    })

});

