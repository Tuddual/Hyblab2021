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
      mySlidr.slide(page);
      setActif(id);
      if(id == 4 && getAffichage().moment == ""){
        let reponse = {json: "dawn"};
        updateElement("moment", reponse);
      }
    })
  }
}

addEventListenerBreadcrumbs();


function addEventListenerSound() {
	let boutonSon = document.getElementById("boutonSon");
	let volume = document.getElementById("volumeSon");
	let previous = "";
	boutonSon.addEventListener("click", function(){
		if(volume.innerHTML == "volume_up"){
			audio.volume = 0.05;
			volume.innerHTML= "volume_down";
			previous = "up";
		}
		else if (volume.innerHTML == "volume_down"){
			if(previous == "up"){
				audio.volume= 0;
				volume.innerHTML= "volume_off";
			}
			if(previous == "off"){
				audio.volume = 0.15;
				volume.innerHTML= "volume_up";
			}
		}
		else if (volume.innerHTML == "volume_off"){
			audio.volume = 0.05;
			volume.innerHTML = "volume_down";
			previous = "off";
		}
	})
}

addEventListenerSound();