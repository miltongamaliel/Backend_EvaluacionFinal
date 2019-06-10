
$(document).ready(function(){
  bloqueBuscador.inicializaSetSearch();
  bloqueBuscador.inicializaIonRangeSlider();
  $(bloqueBuscador.tarjetaMuestra).css("display","none");
  $(bloqueBuscador.bannerVerMas).css("display","none");
})

// Eventos de objetos en el DOM
$("#buscar").on("click", function(){
  bloqueBuscador.requestAJAX();
});

$("#ciudad").on("change",function(){
  console.log("A cambiado la cd seleccionada a: ",bloqueBuscador.selectorCiudad.val());
  bloqueBuscador.filtrarTarjetasPorSelectores();
  })

$("#tipo").on("change",function(){
  console.log("Ha cambiado el tipo de casa a: ",bloqueBuscador.selectorTipo.val());
  bloqueBuscador.filtrarTarjetasPorSelectores();
})
// Objeto que encapsula el código por métodos.
var bloqueBuscador = {
  //Inicializador del elemento Slider. esta es lanzada desde el document.ready()
    selectorCiudad : $("#ciudad"),
    selectorTipo: $("#tipo"),
    bannerVerMas : $(".card-stacked .card-action"),
    arregloJSON: {},
    tarjetaMuestra: $(".lista .horizontal"),
    contenedorDeTarjetas: $(".lista"),
    elementoOptionDeSelect: ">option:first",
    valorMinimoDeSlider: 0,
    valorMaximoDeSlider: 0,
    inicializaIonRangeSlider: function() {
    $("#rangoPrecio").ionRangeSlider({
      type: "double",
      grid: false,
      min: 0,
      max: 100000,
      from: 0000,
      to:100000,
      prefix: "$",
      onFinish: function(data) {
        var valores =[];
        console.log(data.from, " a ", data.to);
        bloqueBuscador.valorMinimoDeSlider = data.from;
        bloqueBuscador.valorMaximoDeSlider= data.to;
        return valores ;
      }
    })
  },
  // Inicializa función que hace visible/Esconde la ventana de busqueda personalizada. esta es lanzada desde el document.ready()
  inicializaSetSearch: function() {
    let busqueda = $('#checkPersonalizada')
    busqueda.on('change', (e) => {
      if (this.customSearch == false) {
        this.customSearch = true
      } else {
        this.customSearch = false
        bloqueBuscador.selectorCiudad.addClass("browser-default");
        bloqueBuscador.selectorTipo.addClass("browser-default");
        var  elementoOptionDeSelect = "#tipo"+ bloqueBuscador.elementoOptionDeSelect;
        bloqueBuscador.remueveUnatributo(elementoOptionDeSelect, "disabled");
        elementoOptionDeSelect = "#ciudad"+ bloqueBuscador.elementoOptionDeSelect;
        bloqueBuscador.remueveUnatributo(elementoOptionDeSelect, "disabled");
        bloqueBuscador.inicializaIonRangeSlider;
      }
      $('#personalizada').toggleClass('invisible')
    })
  },
  requestAJAX: function() {
    $.ajax({
      method: "POST",
      url: 'http://localhost:8080',
      data: "",
      success: function(response) {
        bloqueBuscador.arregloJSON = response;
        var arregloDeSelector = {},
            idNuevoElemento = "",
            categoria = "",
            i = 0;
        bloqueBuscador.depuraArregloYCargaEnSelect(response, bloqueBuscador.selectorCiudad);
        bloqueBuscador.depuraArregloYCargaEnSelect(response, bloqueBuscador.selectorTipo);
        response.forEach(function(element){
          idNuevoElemento = "E"+i;
          bloqueBuscador.descargaDatosdelJsonAlElementoDOM(element, idNuevoElemento);
          i= i+1;
        })
      }
    });
  },
  filtrarTarjetasPorSelectores: function(){
    var idNuevoElemento = "",
        i = 0;
    var ciudadSeleccionada = bloqueBuscador.selectorCiudad.val(),
        tipoSeleccionado = bloqueBuscador.selectorTipo.val(),
        valorMinimoSlider =parseInt($(rangoPrecio).data("from")),
        valorMaximoSlider =parseInt($(rangoPrecio).data("to"));
    bloqueBuscador.removerElemento(".tarjeta"),
    elementoPrecio=0;
    console.log("valor de slider desde filtrarTarjetas es: ", $(rangoPrecio).data("from"));
    bloqueBuscador.arregloJSON.forEach(function(element){
      elementoPrecio =element.Precio;
      console.log("elementoPrecio antes de remover simbolos: " + elementoPrecio);
      elementoPrecio = bloqueBuscador.eliminarCaracteresNoNumericosDeUnaCadena(elementoPrecio);
//      elementoPrecio = parseInt(elementoPrecio.substr(1));
       console.log("elementoPrecio DESPUES de remover simbolos: " + elementoPrecio);

      if(element.Ciudad==ciudadSeleccionada && ciudadSeleccionada!="Escoge una ciudad"&&element.Tipo==tipoSeleccionado&&tipoSeleccionado!="Escoge un tipo"&&  elementoPrecio>=valorMinimoSlider&& elementoPrecio<=valorMaximoSlider  ){
        idNuevoElemento = "E" + i;
        bloqueBuscador.descargaDatosdelJsonAlElementoDOM(element, idNuevoElemento);
            i = i+1;
      }else if(element.Ciudad==ciudadSeleccionada && ciudadSeleccionada!="Escoge una ciudad" &&tipoSeleccionado=="Escoge un tipo"&&  elementoPrecio>=valorMinimoSlider&& elementoPrecio<=valorMaximoSlider){
        idNuevoElemento = "E" + i;
        bloqueBuscador.descargaDatosdelJsonAlElementoDOM(element, idNuevoElemento);
            i = i+1;
      }else if(element.Tipo==tipoSeleccionado&&tipoSeleccionado!="Escoge un tipo"&&ciudadSeleccionada=="Escoge una ciudad"&&  elementoPrecio>=valorMinimoSlider&& elementoPrecio<=valorMaximoSlider){
        idNuevoElemento = "E" + i;
        bloqueBuscador.descargaDatosdelJsonAlElementoDOM(element, idNuevoElemento);
            i = i+1;
      }
  })
},
  eliminarCaracteresNoNumericosDeUnaCadena: function(cadena){
    var arregloDeCadena = [],
    arregloDeCadenaTemporal = [],
    resultadoDeCadena="";
    arregloDeCadena=cadena.split("");
    arregloDeCadena.forEach(function(e){
      if(e>=0&&e<=9){
        arregloDeCadenaTemporal.push(e);
      }
    });
    resultadoDeCadena = arregloDeCadenaTemporal.join("");
    return resultadoDeCadena;
  },
  removerElemento: function(elemento) {
    $(elemento).remove();
  },
  // Esta función se encarga de leer el objeto json, extrae todas las ciudades y Tipos de casa, los depura y descarga en los selectores correspondientes del DOM
  depuraArregloYCargaEnSelect: function(arreglo, selector) {
    var elementoDeUnArreglo = [];
    if(selector ==bloqueBuscador.selectorCiudad){
      bloqueBuscador.removerElemento("#ciudad>.elementoDeUnSelect");
    }else{
      bloqueBuscador.removerElemento("#tipo>.elementoDeUnSelect");
    }
    arreglo.forEach(function(element){
      if(selector ==bloqueBuscador.selectorCiudad){
        elementoDeUnArreglo.push(element.Ciudad);
      }else{
        elementoDeUnArreglo.push(element.Tipo);
      }
    })
    var elementoActual = "";
    for (var i = 0; i < elementoDeUnArreglo.length; i++) {
      elementoActual = elementoDeUnArreglo[i];
      for (var i1 = 0; i1 < elementoDeUnArreglo.length - 1; i1++) {
        if (elementoActual == elementoDeUnArreglo[i1] && i != i1) {
          elementoDeUnArreglo.splice(i1, 1);
          i1 = 0;
        }
      }
    }
    var  elementoOptionDeSelect = "";
    if(selector ==bloqueBuscador.selectorCiudad){
      elementoOptionDeSelect = "#ciudad"+ bloqueBuscador.elementoOptionDeSelect;
    }else{
      elementoOptionDeSelect = "#tipo"+ bloqueBuscador.elementoOptionDeSelect;
    }
    elementoDeUnArreglo.sort().forEach(function(element){
      $(elementoOptionDeSelect).clone(true).appendTo($(selector)).text(element).removeAttr("selected").removeAttr("disabled").attr("value", element).addClass("elementoDeUnSelect");
    })
  },
  ocultarUnElemento: function(idDelElemento){
    $(idDelElemento).css({"display":"none"});
  },
  remueveUnatributo: function(objeto, atributo) {
    if(objeto == "#tipo>option:first"){
      $(objeto).attr("value", "Escoge un tipo").removeAttr(atributo);
    }else{
      $(objeto).attr("value", "Escoge una ciudad").removeAttr(atributo);
    }
  },
  agregaUnAtributo: function(objeto, atributo) {
    $("#tipo>option:first").attr("value", "Escoge un tipo").removeAttr("disabled");
  },
  descargaDatosdelJsonAlElementoDOM:
  function(elementoArregloActual, idNuevoElemento) {
    var etiquetaIdElemento = "#"+idNuevoElemento;
    $(bloqueBuscador.tarjetaMuestra).clone(true).appendTo(bloqueBuscador.contenedorDeTarjetas).attr({"id": idNuevoElemento,"class":"card horizontal tarjeta"}).css("display","");
    $(etiquetaIdElemento).find(".card-content div:nth-child(1) b").text("Direccion: " + elementoArregloActual.Direccion);
    $(etiquetaIdElemento).find(".card-content div:nth-child(2) b").text("Ciudad: " + elementoArregloActual.Ciudad);
    $(etiquetaIdElemento).find(".card-content div:nth-child(3) b").text("Teléfono: " + elementoArregloActual.Telefono);
    $(etiquetaIdElemento).find(".card-content div:nth-child(4) b").text("Código postal:  " + elementoArregloActual.Codigo_Postal);
    $(etiquetaIdElemento).find(".card-content div:nth-child(5) b").text("Precio: " + elementoArregloActual.Precio);
    $(etiquetaIdElemento).find(".card-content div:nth-child(6) b").text("Tipo: " + elementoArregloActual.Tipo);
  }
}
