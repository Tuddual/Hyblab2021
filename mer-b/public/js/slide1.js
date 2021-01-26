var audio = new Audio('sound/400632__inspectorj__ambience-seaside-waves-close-a.wav');

let initSlide1 = function(){
  d3.select('#boutonGoSlide2').on('click', function(){
    audio.play();
    audio.loop = true;
	audio.volume = 0.15;
    setActif(2);
    mySlidr.slide('page-2');
  });
};