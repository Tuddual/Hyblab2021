let initSlideFin = function(){

    d3.select('#goback').on('click', function(){
      mySlidr.slide('page-1');
      setActif(1);
      initSlide1();
      affichageReset();
      sketchCiel.resetSketchCiel();
      resetDisplay();
      var root = document.documentElement;
      root.style.setProperty('--breadcrumb-color', "#6e889b");
      root.style.setProperty('--bouton-texte-color', "#203443");
    });
  
    d3.select('#goback').on('mouseover', function(){
      
    });
  
    d3.select('#goback').on('mouseout', function(){
      
    });
  };

function getPlagesSlideFin(){
  
  let plages = getPlages();
  console.log(plages);
}

var cards = document.getElementsByClassName("cartePostale");
var playing = false;

for(let card of cards){
  card.addEventListener('click',function() {
    if(playing)
      return;
    
    playing = true;
    anime({
      targets: card,
      scale: [{value: 1}, {value: 1.4}, {value: 1, delay: 250}],
      rotateY: {value: '+=180', delay: 200},
      rotate: {value: '+=0', delay: 0},
      easing: 'easeInOutSine',
      duration: 400,
      complete: function(anim){
         playing = false;
      }
    });
  });
}

function updateSlideFin(plages, criteres){
  console.log(criteres);
  console.log(plages);
  let loading = document.getElementById("loading");
  loading.style.display = "none";
  let cartesPostalesList = document.getElementsByClassName("cartePostaleContainer");
  plages.forEach((element, index) => {


    cartesPostalesList[index].style.display = "inline-block";

    let cartePostale = document.getElementById("cp" + (index + 1));
    console.log(cartePostale);

    let imgPlage = cartePostale.querySelector(".imgCarte");
    imgPlage.style.backgroundImage = "url('"+ element.photo + "')";

    let nomPlage = cartePostale.querySelector(".nomPlage");
    element.nom = element.nom.replaceAll("_", " ");
    nomPlage.innerHTML = element.nom;
    let temperature = cartePostale.querySelector(".temperatureRelle");
    temperature.innerHTML = element.weather.temperature + '°C';
    let leverSoleil = cartePostale.querySelector(".leverSoleil");

    let dateLever = new Date(element.weather.sunrise);
    if(dateLever.getMinutes() < 10){
      leverSoleil.innerHTML = new Date(element.weather.sunrise).getHours() + ":0" + new Date(element.weather.sunrise).getMinutes();
    }
    else {
      leverSoleil.innerHTML = new Date(element.weather.sunrise).getHours() + ":" + new Date(element.weather.sunrise).getMinutes();
    }

    let coucherSoleil = cartePostale.querySelector(".coucherSoleil");
    let datecoucher = new Date(element.weather.sunset);
    if(datecoucher.getMinutes() < 10){
      coucherSoleil.innerHTML = new Date(element.weather.sunset).getHours() + ":0" + new Date(element.weather.sunset).getMinutes();
    }
    else {
      coucherSoleil.innerHTML = new Date(element.weather.sunset).getHours() + ":" + new Date(element.weather.sunset).getMinutes();
    }

    let date = cartePostale.querySelector("#date");
    if((new Date(element.time).getMonth() + 1)<10){
      date.innerHTML = new Date(element.time).getDate() + '/0' + (new Date(element.time).getMonth() + 1);
    }
    else {
      date.innerHTML = new Date(element.time).getDate() + '/' + (new Date(element.time).getMonth() + 1);
    }

    let heure = cartePostale.querySelector("#heure");
    if(new Date(element.time).getMinutes() < 10){
      heure.innerHTML = new Date(element.time).getHours() + ":0" + new Date(element.time).getMinutes();
    }
    else {
      heure.innerHTML = new Date(element.time).getHours() + ":" + new Date(element.time).getMinutes();
    }

    if(element.phare){
      let phare = cartePostale.querySelector(".phareNom");
      phare.innerHTML = element.phare.name;
    }

    let itineraire = cartePostale.querySelector(".itineraire");
    itineraire.setAttribute("href", "https://www.google.com/maps/dir/" + getAffichage().latitude + ",+" + getAffichage().longitude + " /" + element.latitude + "," + element.longitude + "/")
  });
}