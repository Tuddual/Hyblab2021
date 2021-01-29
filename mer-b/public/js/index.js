// init du slider (qui peut aussi dfaire des fondus enchainé)
let mySlidr = slidr.create('slidr',{
  breadcrumbs: false,
  controls: 'none',
  direction: 'vertical',
  fade: true,
  keyboard: true,
  overflow: true,
  pause: false,
  theme: '#222',
  timing: { 'fade': '0.5s ease-in' },
  touch: true,
  transition: 'linear'
}).start();

mySlidr.add('h', ['page-3', 'page-4', 'page-5', 'page-6', 'page-7', 'page-8'], "fade");


// on init les slides
initSlide1();
initSlide2();
initSlide3();
initSlideFin();

function setActif(id){
  let breadcrumbActive = document.getElementsByClassName("breadcrumb-active");
  if(breadcrumbActive[0]){
    breadcrumbActive[0].classList.remove("breadcrumb-active");
  }
  let breadcrumb = document.getElementById("breadcrumb-page-" + id);
  breadcrumb.classList.add("breadcrumb-active");
}

setActif(1);

function addEventListenerBreadcrumbs(){
  let breadcrumbActive = document.getElementsByClassName("breadcrumb");
  for(let breadcrumb of breadcrumbActive){
    let page = breadcrumb.id.replace("breadcrumb-", "");
    let id = page.replace("page-", "");
    breadcrumb.addEventListener("click", function(){
      if((id <= 2 || getAffichage().longitude != "") && (id <= 4 || getAffichage().moment != "") && (id <= 5 || getAffichage().type != "")
      && (id <= 5 || getAffichage().mer != "") && (id <= 6 || getAffichage().ciel != "")){
        if(id == 9 && getAffichage().amenagement == ""){
          mySlidr.slide("page-fin");
          setActif("fin");
          getPlagesSlideFin();
        }
        else {
          mySlidr.slide(page);
          setActif(id);
          if(id == "fin"){
            getPlagesSlideFin();
          }
          else if(id == 4 && getAffichage().moment == ""){
            let reponse = {json: "dawn"};
            updateElement("moment", reponse);
          }
        }
      }
    })
  }
}

addEventListenerBreadcrumbs();

var volumeGeneral = 0.15;

function addEventListenerSound() {
	let boutonSon = document.getElementById("boutonSon");
	let volume = document.getElementById("volumeSon");
	
	let previous = "";
	boutonSon.addEventListener("click", function(){
		if(volume.innerHTML == "volume_up"){
			audioMer.volume = 0.05;
			audioPort.volume = 0.05;
			volumeGeneral = 0.05;
			volume.innerHTML= "volume_down";
			previous = "up";
		}
		else if (volume.innerHTML == "volume_down"){
			if(previous == "up"){
				audioMer.volume= 0;
				audioPort.volume= 0;
				volumeGeneral = 0;
				volume.innerHTML= "volume_off";
			}
			if(previous == "off"){
				audioMer.volume = 0.15;
				audioPort.volume = 0.15;
				volumeGeneral = 0.15;
				volume.innerHTML= "volume_up";
			}
		}
		else if (volume.innerHTML == "volume_off"){
			audioMer.volume = 0.05;
			audioPort.volume = 0.05;
			volumeGeneral = 0.05;
			volume.innerHTML = "volume_down";
			previous = "off";
		}
	})
}

addEventListenerSound();