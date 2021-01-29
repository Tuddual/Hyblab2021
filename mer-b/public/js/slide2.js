let initSlide2 = function(){

  d3.select('#boutonBegin').on('click', function(){
    if(getAffichage().longitude){
      mySlidr.slide('page-3');
      setActif(3);
    }
  });

};

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function(position) {
    let affichage = getAffichage();
    affichage.latitude = position.coords.latitude;
    affichage.longitude = position.coords.longitude;

    let adresseInput = document.getElementById("adresse");
    adresseInput.value = "Adresse ok !";
    let boutonBegin = document.getElementById("boutonBegin");
    boutonBegin.className = boutonBegin.className.replace(/\bdisable\b/g, "");

  });
} else {
  /* la géolocalisation n'est pas disponible */
}

let inputDistance = document.getElementById('distance');
inputDistance.addEventListener("input", function(event){
  let distanceDisplay = document.getElementById('distanceActuel');
  distanceDisplay.innerHTML = event.target.value + " km";
  let affichage = getAffichage();
  affichage.distance = event.target.value;
});

window.addEventListener("load", function(){

  // Add a keyup event listener to our input element
  var name_input = document.getElementById('adresse');
  name_input.addEventListener("keyup", function(event){hinter(event)});

  // create one global XHR object 
  // so we can abort old requests when a new one is make
  window.hinterXHR = new XMLHttpRequest();
});

// Autocomplete for form
function hinter(event) {

  // retireve the input element
  var input = event.target;

  // retrieve the datalist element
  var huge_list = document.getElementById('huge_list');

  // minimum number of characters before we start to generate suggestions
  var min_characters = 0;

  if (input.value.length < min_characters ) { 
      return;
  } else { 

      // abort any pending requests
      window.hinterXHR.abort();

      window.hinterXHR.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {

              // We're expecting a json response so we convert it to an object
              var response = JSON.parse( this.responseText ); 

              // clear any previously loaded options in the datalist
              huge_list.innerHTML = "";
              response.features.forEach(function(item) {
                  // Create a new <option> element.
                  var option = document.createElement('option');
                  option.value = item.properties.label;
                  let coordinate = item.geometry.coordinates[0] + ',' + item.geometry.coordinates[1];
                  option.setAttribute('data-value', coordinate);
                  huge_list.appendChild(option);
              });
          }
      };

      window.hinterXHR.open("GET", "https://api-adresse.data.gouv.fr/search/?q=" + input.value, true);
      window.hinterXHR.send()
  }
}

document.querySelector('input').oninput = function(input) {
  let textInput = input.srcElement.value;
  var huge_list = document.getElementById('huge_list');

  huge_list.childNodes.forEach(element => {
    if(element.getAttribute && element.value == textInput){
      let geometry = element.getAttribute("data-value");
      let affichage = getAffichage();
      let coordinates = geometry.split(",");
      affichage.latitude = coordinates[1];
      affichage.longitude = coordinates[0];
      let boutonBegin = document.getElementById("boutonBegin");
      boutonBegin.className = boutonBegin.className.replace(/\bdisable\b/g, "");
    }
  })
};