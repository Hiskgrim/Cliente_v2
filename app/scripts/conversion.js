function getUnidades(num){
    switch(num)
    {
        case 1: return 'PRIMERO';
        case 2: return 'SEGUNDO';
        case 3: return 'TERCERO';
        case 4: return 'CUARTO';
        case 5: return 'QUINTO';
        case 6: return 'SEXTO';
        case 7: return 'SEPTIMO';
        case 8: return 'OCTAVO';
        case 9: return 'NOVENO';
    }
    return '';
}

function getDecenas(numero){
    decena = Math.floor(numero/10);
    unidad = numero-(decena*10);
    switch(decena)
    {   
        case 0: return getUnidades(unidad);
        case 1: return 'DECIMO'+getUnidades(unidad);
        case 2: return 'VIGÉSIMO '+getUnidades(unidad);
        case 3: return 'TRIGÉSIMO '+getUnidades(unidad);
        case 4: return 'CUADRAGÉSIMO '+getUnidades(unidad);
        case 5: return 'QUINCUAGÉSIMO '+getUnidades(unidad);
        case 6: return 'SEXAGÉSIMO '+getUnidades(unidad);
        case 7: return 'SEPTUAGÉSIMO '+getUnidades(unidad);
        case 8: return 'OCTAGÉSIMO '+getUnidades(unidad);
        case 9: return 'NONAGÉSIMO '+getUnidades(unidad);
    }
    return '';
}

function numeroALetras(numero) {
    if(numero == 0){
        return 'CERO ';
    }else{
        return getDecenas(numero);
    }
}