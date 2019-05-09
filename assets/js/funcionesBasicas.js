//Funcion que obtiene la fecha de hace X dias atras
function obtenerDiasAnteriores(num) {
    let hoy = new Date();
    let semanaEnMilisegundos = 1000 * 60 * 60 * 24 * num;
    let resta = hoy.getTime() - semanaEnMilisegundos; //getTime devuelve milisegundos de esa fecha
    let fechaDentroDeUnaSemana = new Date(resta);

    let dia = fechaDentroDeUnaSemana.getDate();
    let mes = fechaDentroDeUnaSemana.getMonth();
    let año = fechaDentroDeUnaSemana.getFullYear();

    if (dia.toString().length == 1) {
        dia = "0" + dia;
    }

    if (mes.toString().length == 1) {
        mes = "0" + mes;
    }
    let fechaHaceUnaSemana = dia + "/" + mes + "/" + año;
    return fechaHaceUnaSemana;
}

//Funcion que obtiene la fecha actual
function obtenerFechaActual() {
    let date = new Date();
    dia = date.getDate();
    mes = date.getMonth();
    año = date.getFullYear();
    let hora = date.getHours();
    let minutos = date.getMinutes();

    if (minutos.toString() < 0) {
        hora--;
        minutos = 59 + (minutos + 1);
    }

    if (hora.toString().length == 1) {
        hora = "0" + hora;
    }

    if (minutos.toString().length == 1) {
        minutos = "0" + minutos;
    }

    if (dia.toString().length == 1) {
        dia = "0" + dia;
    }

    if (mes.toString().length == 1) {
        mes = "0" + mes;
    }
    let fechaActual = año + mes + dia + hora + minutos;
    return fechaActual;
}

//Obtener la hora actual - 30 min
function obtenerHora(num) {
    let date = new Date();
    let hora = date.getHours();
    let minutos = date.getMinutes() - num;

    if (minutos.toString() < 0) {
        hora--;
        minutos = 59 + (minutos + 1);
    }

    if (hora.toString().length == 1) {
        hora = "0" + hora;
    }

    if (minutos.toString().length == 1) {
        minutos = "0" + minutos;
    }

    return tiempo = hora + ":" + minutos;
}

//Esta funcion se encarga de procesar toda la informacion de todas las gasolineras
function procesarGasolineras(gasolinera) {
    let lat = gasolinera["Latitud"];
    lat = lat.replace(",", ".");
    lat = parseFloat(lat);

    let long = gasolinera["Longitud (WGS84)"];
    long = long.replace(",", ".");
    long = parseFloat(long);

    let pre95 = gasolinera["Precio Gasolina 95 Protección"];
    let pre98 = gasolinera["Precio Gasolina  98"];
    let preDi = gasolinera["Precio Gasoleo A"];
    let preDiA = gasolinera["Precio Nuevo Gasoleo A"];
    let rotulo = gasolinera["Rótulo"];
    let horario = gasolinera["Horario"];
    let direccion = gasolinera["Dirección"];
    let localidad = gasolinera["Localidad"];

    if (pre95 == null) {
        pre95 = "No disponible";
    } else {
        pre95 = pre95.replace(",", ".");
    }

    if (pre98 == null) {
        pre98 = "No disponible";
    } else {
        pre98 = pre98.replace(",", ".");
    }

    if (preDi == null) {
        preDi = "No disponible";
    } else {
        preDi = preDi.replace(",", ".");
    }

    if (preDiA == null) {
        preDiA = "No disponible";
    } else {
        preDiA = preDiA.replace(",", ".");
    }

    let obj = {
        lat: lat,
        long: long,
        pre95: pre95,
        pre98: pre98,
        preDi: preDi,
        preDiA: preDiA,
        rotulo: rotulo,
        horario: horario,
        direccion: direccion,
        localidad: localidad
    };

    return obj;
}