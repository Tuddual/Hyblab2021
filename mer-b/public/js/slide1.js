var audioMer = new Audio('sound/400632__inspectorj__ambience-seaside-waves-close-a.wav');

let initSlide1 = function(){
  d3.select('#boutonGoSlide2').on('click', function(){
    audioMer.play();
    audioMer.loop = true;
	audioMer.volume = volumeGeneral;
    setActif(2);
    document.getElementById("topLeftLogo").style.display='block';
    mySlidr.slide('page-2');
  });
};