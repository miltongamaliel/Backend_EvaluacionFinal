//Inicializador del elemento Slider
$("#rangoPrecio").ionRangeSlider({
  type: "double",
  grid: false,
  min: 0,
  max: 100000,
  from: 1000,
  to: 20000,
  prefix: "$",
  onFinish: function(data){
    console.log(data.from, " a ",data.to);
  }
})

/*
$("#buscar").on("click", function(){

      $.ajax({
        method: "POST",
        url: 'http://localhost:8080',
        data: "",
        success: function(response){
        cargaEnSelectores(response);

        }
      })
});

*/

/*
$("#ciudad").on("change",function(){
  console.log("Ha cambiado el valor de ciudad a: ",$("#ciudad").val());
})
*/


/*
$("#tipo").on("change",function(){
  var etiquetaIdElemento = "",
      inputTipo = $("#tipo").val(),
      valorTipo= "",
      contenedorElementos = $(".lista");
  console.log("Ha cambiado el valor de ciudad a: ",$("#tipo").val());

  for (var i = 0; i < 99; i++) {
    etiquetaIdElemento = "#E"+i;
    $(etiquetaIdElemento).remove();

  }

})

*/

    function cargaEnSelectores(response){
    console.log("El Server a generado una respuesta");
    var objetoElemento = $(".lista .horizontal"),
      ciudadActual = "",
      tipoActual = "",
      arregloDeCiudades = [],
      arregloDeTipo = [],
      contenedorElementos = $(".lista"),
      bannerVerMas = $(".card-stacked .card-action"),
      etiquetaIdElemento = "",
      busqPersonalizada = $("#checkPersonalizada").checked,
      selectorPrecio = $("#rangoPrecio");
    bannerVerMas.css({
        "display": "none"
      }),
      selectorCiudad = $("#ciudad"),
      selectorTipo = $("#tipo");

    /*
    $(objetoElemento).remove();
    */


      response.forEach(function(element) {
      arregloDeCiudades.push(element.Ciudad);
      arregloDeTipo.push(element.Tipo);
    })



    /*
    for (var i = 0; i < arregloDeCiudades.length; i++) {
      ciudadActual = arregloDeCiudades[i];
      for (var i1 = 0; i1 < arregloDeCiudades.length - 1; i1++) {
        if (ciudadActual == arregloDeCiudades[i1] && i != i1) {
          arregloDeCiudades.splice(i1, 1);
          i1 = 0;
        }
      }
    }
    */


    // El siguiente bloque de for "ArregloDeTipo" no fue transladado ya que es una copia de bloque for anterior"arregloDeCiudades".
    for (var i = 0; i < arregloDeTipo.length; i++) {
      tipoActual = arregloDeTipo[i];
      for (var i1 = 0; i1 < arregloDeTipo.length - 1; i1++) {
        if (tipoActual == arregloDeTipo[i1] && i != i1) {
          arregloDeTipo.splice(i1, 1);
          i1 = 0;
        }
      }
    }
    // Termina bloque no copiado.



    /*
    $("#ciudad>option:first").attr("value", "Escoje una ciudad").removeAttr("disabled");
    */

    /*
    $("#tipo>option:first").attr("value", "Escoje un tipo").removeAttr("disabled");
    */

    /*   Se copia este bloque como agregaElementoAUnSelect pero sin el ciclo for
    for (var i = 0; i < arregloDeCiudades.length; i++) {
      $("#ciudad>option:first").clone(true).appendTo($(selectorCiudad)).text(arregloDeCiudades[i]).removeAttr("selected").removeAttr("disabled").attr("value", arregloDeCiudades[i]);
    }
    */
    // El siguiente bloque de for "ArregloDeTipo" no fue transladado ya que es una copia de bloque for anterior"arregloDeCiudades".
    for (var i = 0; i < arregloDeTipo.length; i++) {
      $("#tipo>option:first").clone(true).appendTo($(selectorTipo)).text(arregloDeTipo[i]).removeAttr("selected").removeAttr("disabled").attr("value", arregloDeTipo[i]);
    }
    // Se termina bloque no copiado



// Se copia bloque sin el ciclo for al elemento
    for (var i = 0; i < response.length; i++) {
      idElmemento = "E" + i;
      etiquetaIdElemento = "#E" + i;
      $(objetoElemento).clone(true).appendTo(contenedorElementos).attr("id", idElmemento);
      $(etiquetaIdElemento).each(function() {
        $(this).find(".card-content div:nth-child(1) b").text("Direccion: " + response[i].Direccion);
        $(this).find(".card-content div:nth-child(2) b").text("Ciudad: " + response[i].Ciudad);
        $(this).find(".card-content div:nth-child(3) b").text("Teléfono: " + response[i].Telefono);
        $(this).find(".card-content div:nth-child(4) b").text("Código postal:  " + response[i].Codigo_Postal);
        $(this).find(".card-content div:nth-child(5) b").text("Precio: " + response[i].Precio);
        $(this).find(".card-content div:nth-child(6) b").text("Tipo: " + response[i].Tipo);
      });
    }
}








function setSearch() {
  var selectorCiudad = $("#ciudad"),
  selectorTipo = $("#tipo");
  let busqueda = $('#checkPersonalizada')
  busqueda.on('change', (e) => {
    if (this.customSearch == false) {
      this.customSearch = true

    } else {
      this.customSearch = false
      selectorCiudad.addClass("browser-default");
      selectorTipo.addClass("browser-default");
    }
    $('#personalizada').toggleClass('invisible')
  })
}

setSearch()
