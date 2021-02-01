var audioPort = new Audio('sound/sonSirene.wav');

function updateElement(element, reponse){
    let valeur = reponse.json;
    let affichage = getAffichage();

    if(element == "moment" ){
      let planteJour = document.getElementById("planteJour");
      let planteNuit = document.getElementById("planteNuit");
      let planteSoleil = document.getElementById("planteSoleil");
      if(reponse.json == "day" || reponse.json == "indifferent"){
        planteJour.style.display = 'block';
        planteNuit.style.display = "none";
        planteSoleil.style.display = "none";
      }
      else if(reponse.json == "night"){
        planteJour.style.display = 'none';
        planteNuit.style.display = "block";
        planteSoleil.style.display = "none";
      }
      else {
        planteJour.style.display = 'none';
        planteNuit.style.display = "none";
        planteSoleil.style.display = "block";
      }
    }
    if(element == "amenagement"){
      if(affichage[element].includes(valeur)){
        affichage[element] = affichage[element].replace(valeur + ',','');
        sketchCiel.updateSketchCiel();
      }
      else {
        if(valeur == "harbor"){
		      audioPort.volume = volumeGeneral;
          audioPort.play();
        }
        affichage[element] += valeur + ',';
      }
    }
    else {
      affichage[element] = valeur;
    }

    sketchCiel.updateSketchCiel(element, reponse);
    let root = document.documentElement;

    if(element == "moment" && reponse.json == "night"){
      root.style.setProperty('--citation-color', "white");
      root.style.setProperty('--breadcrumb-color', "#274652");
      root.style.setProperty('--bouton-texte-color', "#203443");
      root.style.setProperty('--bouton-bg-color', '#000D12');
      root.style.setProperty('--bouton-bg-slider', '#000D12');
      document.body.style.backgroundImage = "url('img/FondsTextures/fondnuit.png')";
    }
    else if(element == "moment" && (reponse.json == "day" || reponse.json == "indifferent")){
      root.style.setProperty('--breadcrumb-color', "#9DF5FF");
      root.style.setProperty('--bouton-texte-color', "#203443");
      root.style.setProperty('--citation-color', "#203443");
      root.style.setProperty('--bouton-bg-color', '#203443');
      root.style.setProperty('--bouton-bg-slider', '#00C0D2');
      document.body.style.backgroundImage = "url('img/FondsTextures/fondjour.png')";
    }
    else if(element == "moment"){
      root.style.setProperty('--citation-color', "white");
      root.style.setProperty('--breadcrumb-color', "#D07BBC");
      root.style.setProperty('--bouton-texte-color', "#71265F");
      root.style.setProperty('--bouton-bg-color', '#49083A');
      root.style.setProperty('--bouton-bg-slider', '#49083A');
      document.body.style.backgroundImage = "url('img/FondsTextures/fondsoleil.png')";
    }
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

function resetDisplay(){
  let planteJour = document.getElementById("planteJour");
  let planteNuit = document.getElementById("planteNuit");
  let planteSoleil = document.getElementById("planteSoleil");
  planteJour.style.display = 'none';
  planteNuit.style.display = "none";
  planteSoleil.style.display = "none";
  let root = document.documentElement;
  root.style.setProperty('--breadcrumb-color', "#9DF5FF");
  root.style.setProperty('--bouton-texte-color', "#203443");
  root.style.setProperty('--citation-color', "#203443");
  root.style.setProperty('--bouton-bg-color', '#203443');
  document.body.style.backgroundImage = "url('img/FondsTextures/fonddebut.png')";
  document.getElementsByClassName('stepperBouton')[0].style.left = 0;
  document.getElementById("topLeftLogo").style.display='none';

  let boutonsVisited = Array.from(document.getElementsByClassName("boutonVisited"));
  for(let i = 0; i < boutonsVisited.length; i++){
    boutonsVisited[i].setAttribute("class", "bouton");
  }
}