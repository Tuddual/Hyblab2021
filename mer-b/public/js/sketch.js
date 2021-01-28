let sketchCiel = function(p) {
    let imgCielJour;
    let imgCielNuit;
    let imgCielSoleil;

    let imgNuagesJour;
    let imgNuagesNuit;
    let imgNuagesSoleil;

    let imgMerAgiteeJour;
    let imgMerAgiteeNuit;
    let imgMerAgiteeSoleil;
    let imgMerCalmeJour;
    let imgMerCalmeNuit;
    let imgMerCalmeSoleil;

    let imgSolGaletJour;
    let imgSolGaletNuit;
    let imgSolGaletSoleil;
    let imgSolSableJour;
    let imgSolSableNuit;
    let imgSolSableSoleil;
    let imgSolRochersJour;
    let imgSolRochersNuit;
    let imgSolRochersSoleil;

    let imgPhareJour;
    let imgPhareNuit;
    let imgPhareSoleil;

    let imgPortJour;
    let imgPortNuit;
    let imgPortSoleil;

    let imgParkingJour;
    let imgParkingNuit;
    let imgParkingSoleil;

    let imgFondCoupeJour;
    let imgFondCoupeNuit;
    let imgFondCoupeSoleil;

    let imgPlanteJour;
    let imgPlanteNuit;
    let imgPlanteSoleil;

    /**affichee**/
    let imgdisplayCiel;
    let cielY = -1;
    let imgdisplayNuages;
    let nuagesY = -1;
    let imgdisplayMer;
    let merY = -1;
    let imgdisplaySol;
    let solY = -1;
    let imgdisplayPhare;
    let phareY = -1;
    let imgdisplayPort;
    let imgdisplayParking;
    let imgdisplayFondCoupe;

    /*pluie*/
    var rain = [];
    var rainingNow = false;

    /**orage**/
    var xCoord1 = 0;
    var yCoord1 = 0;
    var xCoord2 = 0;
    var yCoord2 = 0;
    var step = 0;
    var orage = false;

    var backgroundColorNuit = "#031D27";
    var backgroundColorJour = "#4fbece";
    var backgroundColorSoleil = "#69315e";

    var backgroundColor = "#afdde2";

    p.setup = function(){
      fade = 0

      p.createCanvas(p.windowWidth, p.windowHeight);
      //p.background(250);
      img = p.loadImage('img/plage.jpg');
      imgCielJour = p.loadImage('img/Ciel/cieljour.png');
      imgCielNuit = p.loadImage('img/Ciel/cielnuit.png');
      imgCielSoleil = p.loadImage('img/Ciel/cielsoleil.png');

      imgNuagesJour = p.loadImage('img/Nuages/nuagesjour.png');
      imgNuagesNuit = p.loadImage('img/Nuages/nuagesnuit.png');
      imgNuagesSoleil = p.loadImage('img/Nuages/nuagesoleil.png');

      imgMerAgiteeJour = p.loadImage('img/Mer/MerAgitee/meragiteejour.png');
      imgMerAgiteeNuit = p.loadImage('img/Mer/MerAgitee/meragiteenuit.png');
      imgMerAgiteeSoleil = p.loadImage('img/Mer/MerAgitee/meragiteesoleil.png');
      imgMerCalmeJour = p.loadImage('img/Mer/MerCalme/mercalmejour.png');
      imgMerCalmeNuit = p.loadImage('img/Mer/MerCalme/mercalmenuit.png');
      imgMerCalmeSoleil = p.loadImage('img/Mer/MerCalme/mercalmesoleil.png');

      imgSolGaletJour = p.loadImage('img/Sol/Galet/galetjour.png');
      imgSolGaletNuit = p.loadImage('img/Sol/Galet/galetnuit.png');
      imgSolGaletSoleil = p.loadImage('img/Sol/Galet/galetsoleil.png');
      imgSolSableJour = p.loadImage('img/Sol/Sable/sablejour.png');
      imgSolSableNuit = p.loadImage('img/Sol/Sable/sablenuit.png');
      imgSolSableSoleil = p.loadImage('img/Sol/Sable/sablesoleil.png');

      imgSolRochersJour = p.loadImage('img/Sol/Rochers/sablerocherjour.png');
      imgSolRochersNuit = p.loadImage('img/Sol/Rochers/sablerochernuit.png');
      imgSolRochersSoleil = p.loadImage('img/Sol/Rochers/sablerochersoleil.png');

      imgPhareJour = p.loadImage('img/Phare/pharejour.png');
      imgPhareNuit = p.loadImage('img/Phare/pharenuit.png');
      imgPhareSoleil = p.loadImage('img/Phare/pharesoleil.png');

      imgPortJour = p.loadImage('img/Port/portjour.png');
      imgPortNuit = p.loadImage('img/Port/portnuit.png');
      imgPortSoleil = p.loadImage('img/Port/portsoleil.png');

      imgParkingJour = p.loadImage('img/Parking/parkingjour.png');
      imgParkingNuit = p.loadImage('img/Parking/parkingnuit.png');
      imgParkingSoleil = p.loadImage('img/Parking/parkingsoleil.png');

      imgFondCoupeJour = p.loadImage('img/FondsTextures/fondjourcouper.png');
      imgFondCoupeNuit = p.loadImage('img/FondsTextures/fondnuitcouper.png');
      imgFondCoupeSoleil = p.loadImage('img/FondsTextures/fondsoleilcouper.png');

      imgPlanteJour = p.loadImage('img/Plante/plantesjour.png');
      imgPlanteNuit = p.loadImage('img/Plante/plantesnuit.png');
      imgPlanteSoleil = p.loadImage('img/Plante/plantessoleil.png');

      for (i = 0; i < 100; i++) {
        rain[i] = new Rain(p.random(50, p.windowWidth), p.random(0, -3000));
      }

      xCoord2 = 0;
      yCoord2 = p.windowHeight;

    }

    p.draw = function() {
      affichage = getAffichage();
      animationCiel();

      if (rainingNow == true && cielY == 0) {
        //background(100);
        for (i = 0; i < rain.length; i++) {
          rain[i].dropRain();
          rain[i].splash();
        }
      }

      if(imgdisplayFondCoupe && rainingNow && cielY == 0){
        p.image(imgdisplayFondCoupe, 0, 0, p.windowWidth, p.windowHeight);
      }

      /*if(imgdisplayPlante){
        p.image(imgdisplayPlante, 0, 0, p.windowWidth, p.windowHeight);
      }*/
    }
      
    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    }

    animationCiel = function(){
      step += 1;
      
      if(imgdisplayCiel){
        if(cielY > 0){
          cielY -= 2;
        }
        p.image(imgdisplayCiel, 0, cielY, p.windowWidth, p.windowHeight);
      }
      if(imgdisplayNuages){
        if(nuagesY > 0){
          nuagesY -= 2;
        }
        p.image(imgdisplayNuages, 0, nuagesY, p.windowWidth, p.windowHeight);
      }
      if(orage && cielY == 0){
        for (var i = 0; i < 20; i++) {
          xCoord1 = xCoord2;
          yCoord1 = yCoord2;
          xCoord2 = xCoord1 + p.int(p.random(-20, 20));
          yCoord2 = yCoord1 + p.int(p.random(0, 20));
          p.strokeWeight(p.random(1, 6));
          p.strokeJoin(p.MITER);
          p.line(xCoord1, yCoord1, xCoord2, yCoord2);
  
          if (((xCoord2 > p.width) | (xCoord2 < 0) | (yCoord2 > p.height) | (yCoord2 < 0)) && step > 30){
            step = 0;
            //p.clear();
            //animationCiel();
            xCoord2 = p.int(p.random(p.width/2 + 200, p.width));
            yCoord2 = 0;
            p.stroke(255, 255, p.random(0, 255));
          }
        }
      }
      
      if(imgdisplayPhare){
        if(phareY > 0){
          phareY -= 2;
        }
        p.image(imgdisplayPhare, 0, phareY, p.windowWidth, p.windowHeight);
      }


      if(imgdisplaySol){
        if(solY > 0){
          solY -= 2;
        }
        p.image(imgdisplaySol, 0, solY, p.windowWidth, p.windowHeight);
      }

      if(imgdisplayMer){
        if(merY > 0){
          merY -= 4;
        }
        p.image(imgdisplayMer, 0, merY, p.windowWidth, p.windowHeight);
      }

      if(imgdisplayPort){
        p.image(imgdisplayPort, 0, 0, p.windowWidth, p.windowHeight);
      }

      if(imgdisplayParking){
        p.image(imgdisplayParking, 0, 0, p.windowWidth, p.windowHeight);
      }

    }

    sketchCiel.resetSketchCiel = function(){
      console.log("reset");
      imgdisplayCiel = undefined;
      imgdisplayMer = undefined;
      imgdisplaySol = undefined;
      imgdisplayPhare = undefined;
      imgdisplayPort = undefined;
      imgdisplayParking = undefined;
      imgdisplayNuages = undefined;
      backgroundColor = "#B6F6FC";
      imgdisplayFondCoupe = undefined;
      imgdisplayFond = undefined;
      imgdisplayPlante = undefined;

      cielY = -1;
      merY = -1;
      solY = -1;
      phareY = -1;
      nuagesY = -1;

      
      p.clear();
     }

    sketchCiel.updateSketchCiel = function(){
      if(affichage.ciel == 'bad'){
        rainingNow = true;
      }
      else if(affichage.ciel == 'stormy'){
        rainingNow = true;
        orage = true;
      }
      else {
        for (i = 0; i < 100; i++) {
          rain[i] = new Rain(p.random(50, p.windowWidth), p.random(0, -3000));
        }
        rainingNow = false;
        orage = false;
      }


      if(affichage.moment == "day" || affichage.moment == "indifferent"){
        imgdisplayFondCoupe = imgFondCoupeJour;
        imgdisplayPlante = imgPlanteJour;

        if(affichage.ciel || affichage.ciel == "indifferent") {
          if(cielY == -1){
            cielY = 200;
          }

          if(affichage.ciel == "cloudy" || affichage.ciel == "bad" || affichage.ciel == "stormy"){
            imgdisplayNuages = imgNuagesJour;
            if(nuagesY == -1){
              nuagesY = 200;
            }
          }
          imgdisplayCiel = imgCielJour;
        }

        if(affichage.mer){
          if(affichage.mer == "calm" || affichage.mer == "indifferent"){
            imgdisplayMer = imgMerCalmeJour;
          }
          else if(affichage.mer == "hectic"){
            imgdisplayMer = imgMerAgiteeJour;
          }

          if(merY == -1){
            merY = 200;
          }
        }

        if(affichage.type){
          if(affichage.type == "pebble"){
            imgdisplaySol = imgSolGaletJour;
          }
          else if(affichage.type == "sand" || affichage.type == "indifferent"){
            imgdisplaySol = imgSolSableJour;
          }
          else if(affichage.type == "rocks"){
            imgdisplaySol = imgSolRochersJour;
          }

          if(solY == -1){
            solY = 100;
          }
        }
        
        if(affichage.amenagement.includes("lighthouse")){
          imgdisplayPhare = imgPhareJour;
          if(phareY == -1){
            phareY = 100;
          }
        }
        else {
          imgdisplayPhare = undefined;
          phareY = -1;
        }

        if(affichage.amenagement.includes("harbor")){
          imgdisplayPort = imgPortJour;
        }
        else {
          imgdisplayPort = undefined;
        }

        if(affichage.amenagement.includes("parking")){
          imgdisplayParking = imgParkingJour;
        }
        else {
          imgdisplayParking = undefined;
        }

      }
      else if(affichage.moment == "night"){
        imgdisplayFondCoupe = imgFondCoupeNuit;

        imgdisplayPlante = imgPlanteNuit;

        if(affichage.ciel || affichage.ciel == "indifferent"){
          if(cielY == -1){
            cielY = 200;
          } 
          if(affichage.ciel == "cloudy" || affichage.ciel == "bad" || affichage.ciel == "stormy"){
            imgdisplayNuages = imgNuagesNuit;
            if(nuagesY == -1){
              nuagesY = 200;
            }
          }
          imgdisplayCiel = imgCielNuit;
        }

        if(affichage.mer){
          if(affichage.mer == "calm" || affichage.mer == "indifferent"){
            imgdisplayMer = imgMerCalmeNuit;
          }
          else if(affichage.mer == "hectic"){
            imgdisplayMer = imgMerAgiteeNuit;
          }

          if(merY == -1){
            merY = 200;
          }
        }

        if(affichage.type){
          if(affichage.type == "pebble"){
            imgdisplaySol = imgSolGaletNuit;
          }
          else if(affichage.type == "sand" || affichage.type == "indifferent"){
            imgdisplaySol = imgSolSableNuit;
          }
          else if(affichage.type == "rocks"){
            imgdisplaySol = imgSolRochersNuit;
          }

          if(solY == -1){
            solY = 100;
          }
        }

        if(affichage.amenagement.includes("lighthouse")){
          imgdisplayPhare = imgPhareNuit;

          if(phareY == -1){
            phareY = 100;
          }
        }
        else {
          imgdisplayPhare = undefined;
          phareY = -1;
        }

        if(affichage.amenagement.includes("harbor")){
          imgdisplayPort = imgPortNuit;
        }
        else {
          imgdisplayPort = undefined;
        }

        if(affichage.amenagement.includes("parking")){
          imgdisplayParking = imgParkingNuit;
        }
        else {
          imgdisplayParking = undefined;
        }
      }
      else if(affichage.moment){
        imgdisplayFondCoupe = imgFondCoupeSoleil;

        imgdisplayPlante = imgPlanteSoleil;

        if(affichage.ciel || affichage.ciel == "indifferent"){
          if(cielY == -1){
            cielY = 200;
          } 
          if(affichage.ciel == "cloudy" || affichage.ciel == "bad" || affichage.ciel == "stormy"){
            imgdisplayNuages = imgNuagesSoleil;
            if(nuagesY == -1){
              nuagesY = 200;
            }
          }
          imgdisplayCiel = imgCielSoleil;
        }
        
        if(affichage.mer){
          if(affichage.mer == "calm" || affichage.mer == "indifferent"){
            imgdisplayMer = imgMerCalmeSoleil;
          }
          else if(affichage.mer == "hectic"){
            imgdisplayMer = imgMerAgiteeSoleil;
          }

          if(merY == -1){
            merY = 200;
          }
        }

        if(affichage.type){
          if(affichage.type == "pebble" ){
            imgdisplaySol = imgSolGaletSoleil;
          }
          else if(affichage.type == "sand" || affichage.type == "indifferent"){
            imgdisplaySol = imgSolSableSoleil;
          }
          else if(affichage.type == "rocks"){
            imgdisplaySol = imgSolRochersSoleil;
          }

          if(solY == -1){
            solY = 100;
          }
        }

        if(affichage.amenagement.includes("lighthouse")){
          imgdisplayPhare = imgPhareSoleil;

          if(phareY == -1){
            phareY = 100;
          }
        }
        else {
          imgdisplayPhare = undefined;
          phareY = -1;
        }

        if(affichage.amenagement.includes("harbor")){
          imgdisplayPort = imgPortSoleil;
        }
        else {
          imgdisplayPort = undefined;
        }

        if(affichage.amenagement.includes("parking")){
          imgdisplayParking = imgParkingSoleil;
        }
        else {
          imgdisplayParking = undefined;
        }
      }
    }

    function Rain(x, y) {
      this.x = x;
      this.y = y;
      //this.gravity = 9.8;
      this.length = 15;
      this.r = 0;
      this.opacity = 200;
    
    
      this.dropRain = function() {
        p.noStroke();
        p.fill(255);
        //rect(this.x, this.y,3,15);
        p.ellipse(this.x, this.y, 3, this.length);
        this.y = this.y + 6 //+ frameCount/60;
        if (this.y > 540) {
          this.length = this.length - 5;
          //this.y= random(0,-100);
        }
        if (this.length < 0) {
          this.length = 0;
        }
      }
    
      this.splash = function() {
        p.strokeWeight(2);
        //stroke(245, 200/frameCount);
        p.stroke(245, this.opacity);
        p.noFill();
        if (this.y > 500) {
          p.ellipse(this.x, 550, this.r * 2, this.r / 2);
          this.r++;
          this.opacity = this.opacity - 10;
    
          //keep the rain dropping
          if (this.opacity < 0) {
            this.y = p.random(0, -100);
            this.length = 15;
            this.r = 0;
            this.opacity = 200;
          }
        }
      }
    }
    
    
  };
  new p5(sketchCiel, 'displayCanvas');