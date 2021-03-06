
let contenu = getQuestions();

function setTexte(id){
    let texte = document.getElementById("page-" + (id + 3)).querySelector("#questionText");
    let question = contenu.questions[id];
    texte.innerHTML = question.question;
    let containerReponses = document.getElementById("page-" + (id + 3)).querySelector("#containerReponses");
    containerReponses.innerHTML = "";
    if(question.multiple){
      for(let reponse of question.reponses){
        let containerReponse = document.createElement("div");
        containerReponse.setAttribute("class", "containerReponse");
  
        let newReponse = document.createElement("div");
        newReponse.innerHTML = reponse.texte;
        newReponse.setAttribute("class", "bouton");
        containerReponse.appendChild(newReponse);
  
        if(reponse.citations){
          let citation = document.createElement("div");
          citation.setAttribute("class", "citation");
          citation.innerHTML = reponse.citations[getRandomInt(reponse.citations.length)];
          containerReponse.appendChild(citation);  
        }

        containerReponses.appendChild(containerReponse);
  
        newReponse.addEventListener("click", function(element){
          if(element.target.classList.contains("boutonVisited")){
            element.target.setAttribute("class", "bouton");
          }
          else {
            element.target.setAttribute("class", "boutonVisited");
          }
          
          updateElement(question.element, reponse);
          //next(id + 1);
        });
      }

      let containerReponse = document.createElement("div");
      containerReponse.setAttribute("class", "containerReponse");

      let newReponse = document.createElement("div");
      newReponse.innerHTML = "<i class='material-icons'>east</i>";
      newReponse.setAttribute("class", "materialBouton");
      containerReponse.appendChild(newReponse);

      containerReponses.appendChild(containerReponse);

      newReponse.addEventListener("click", function(){
        //updateElement(question.element, reponse);
        next(id + 1);
      });
    }
    else if (question.stepper){
      /**création du stepper **/
      containerReponses.style.maxWidth = "950px";

      let stepperDiv = document.createElement("div");
      stepperDiv.setAttribute("class", "stepper");

      let stepperSpaceDiv = document.createElement("div");
      stepperSpaceDiv.setAttribute("class", "stepperSpace");
      
      let stepperBouton = document.createElement("div");
      stepperBouton.setAttribute("class", "stepperBouton");
      let stepperBoutonImg = document.createElement("img");
      stepperBoutonImg.setAttribute("class", "stepperBoutonImg");
      if(question.reponses[0].img){
        stepperBoutonImg.src = question.reponses[0].img;
        stepperBoutonImg.addEventListener("mousedown", function(e){
          e.preventDefault()
        });
      }

      stepperBouton.appendChild(stepperBoutonImg);

      let isDown = false;
      let mousePosition;
      let offsetX = 0;
      
      stepperDiv.addEventListener('mousedown', function(e){
        isDown = true;
        if((e.offsetX - 65) > 0){
          stepperBouton.style.left = (e.offsetX - 65) + "px";
        }
        else {
          stepperBoutonImg.style.left = 0;
        }
      });

      stepperBouton.addEventListener('mousedown', function(e) {
        isDown = true;
        offsetX = stepperBouton.offsetLeft - e.clientX;
      }, true);

      document.addEventListener('mouseup', function() {
        if(isDown){
          isDown = false;
          let x = stepperBouton.style.left.replace("px", "");
          if(x < 83){
            stepperBouton.style.left = 0;
            updateElement(question.element, question.reponses[0]);
            stepperBoutonImg.src = question.reponses[0].img;
          }
          else if(x > 83 && x < 249){
            stepperBouton.style.left = 146 + "px";
            updateElement(question.element, question.reponses[1]);
            stepperBoutonImg.src = question.reponses[1].img;
          }
          else if(x > 249 && x < 415){
            stepperBouton.style.left = 313 + "px";
            updateElement(question.element, question.reponses[2]);
            stepperBoutonImg.src = question.reponses[2].img;
          }
          else {
            stepperBouton.style.left = 468 + "px";
            updateElement(question.element, question.reponses[3]);
            stepperBoutonImg.src = question.reponses[3].img;
          }
        }
      }, true);
    
      document.addEventListener('mousemove', function(event) {
        //event.preventDefault();
        if (isDown) {
            mousePosition = {
    
                x : event.clientX,
                y : event.clientY
    
            };
            if((mousePosition.x + offsetX) > 0 && (mousePosition.x + offsetX) < 468) {
              stepperBouton.style.left = (mousePosition.x + offsetX) + 'px';
            }
            
            let x = stepperBouton.style.left.replace("px", "");
            if(x < 83){
              updateElement(question.element, question.reponses[0]);
              stepperBoutonImg.src = question.reponses[0].img;
            }
            else if(x > 83 && x < 249){
              updateElement(question.element, question.reponses[1]);
              stepperBoutonImg.src = question.reponses[1].img;
            }
            else if(x > 249 && x < 415){
              updateElement(question.element, question.reponses[2]);
              stepperBoutonImg.src = question.reponses[2].img;
            }
            else {
              updateElement(question.element, question.reponses[3]);
              stepperBoutonImg.src = question.reponses[3].img;
            }
        }
      }, true);

      stepperSpaceDiv.appendChild(stepperBouton);
      stepperDiv.appendChild(stepperSpaceDiv);
      containerReponses.appendChild(stepperDiv);

      /* pour passer */
      let containerReponse = document.createElement("div");
      containerReponse.setAttribute("class", "containerReponse");
      containerReponse.style.paddingBottom = "0px";

      let newReponse = document.createElement("div");
      newReponse.innerHTML = "Indifférent";

      newReponse.addEventListener("click", function(){
        let reponse = {json : "indifferent"};
        
        updateElement(question.element, reponse);
        next(id + 1);
      });

      newReponse.setAttribute("class", "bouton");
      newReponse.style.marginTop = "0px";
      containerReponse.appendChild(newReponse);
      containerReponses.appendChild(containerReponse);

      let reponseChoisie = document.createElement("div");
      reponseChoisie.innerHTML = "<i class='material-icons'>east</i>";
      reponseChoisie.setAttribute("class", "materialBouton");
      reponseChoisie.style.verticalAlign = "top";
      reponseChoisie.style.marginTop = "0px";

      containerReponses.appendChild(reponseChoisie);

      reponseChoisie.addEventListener("click", function(){
        next(id + 1);
      });

      /**affichage des réponses **/
      let reponsesStepper = document.createElement("div");
      reponsesStepper.setAttribute("class", "containerStepperReponse");

      for(let reponse of question.reponses){
        if(reponse.texte != "Indifférent"){
          let reponseStepper = document.createElement("div");
          reponseStepper.setAttribute("class", "stepperReponse");
          reponseStepper.innerHTML = reponse.texte;
          reponsesStepper.appendChild(reponseStepper);
        }
      }
      containerReponses.appendChild(reponsesStepper);
    }
    else {
      for(let reponse of question.reponses){

        let containerReponse = document.createElement("div");
        containerReponse.setAttribute("class", "containerReponse");
  
        if(reponse.img){
          let containerReponseImg = document.createElement("div");
          containerReponseImg.setAttribute("class", "containerImgReponse");
  
          let newReponseImg = document.createElement("img");
          newReponseImg.src = reponse.img;
          containerReponseImg.appendChild(newReponseImg);
          containerReponse.appendChild(containerReponseImg);
          if(reponse.json == "ecriture"){
            newReponseImg.style.marginBottom = "-5px";
          }
        }
        let newReponse = document.createElement("div");
        newReponse.innerHTML = reponse.texte;
        newReponse.setAttribute("class", "bouton");
        containerReponse.appendChild(newReponse);
  
        if(reponse.citations){
          let citation = document.createElement("div");
          citation.setAttribute("class", "citation");
          citation.innerHTML = reponse.citations[getRandomInt(reponse.citations.length)];
          containerReponse.appendChild(citation);  
        }
  
        containerReponses.appendChild(containerReponse);
  
        newReponse.addEventListener("click", function(){
          updateElement(question.element, reponse);
          next(id + 1);
        });
      }
    }
    
  }

  function next(id){
    if(id == 1){
      let reponse = {json: "dawn"};
      updateElement("moment", reponse);
    }
    if(id < contenu.questions.length){
      if(id + 3 == 9){
        if(getAffichage().amenagement == ""){
          next(id + 1);
        }
        else {
          mySlidr.slide('page-' + (id + 3));
          setActif(id + 3);    
        }
      }
      else {
        mySlidr.slide('page-' + (id + 3));
        setActif(id + 3);
      }
    }
    else {
      mySlidr.slide('page-fin');
      setActif("fin");
      getPlagesSlideFin();
    }
  }

  
let initSlide3 = function(){
    for(let i = 0; i < contenu.questions.length; i++){
      setTexte(i);
    }
};