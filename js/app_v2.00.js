// This is the configuration file. ---- ONLY edit this part of the code.

config = {
    songs: 4, // Background music files to read.
    slides: 9, // This is the number of files (image or video) that the slideshow should include.
    shuffleSongs: true, // true OR false.
    shuffleSlides: false, // true OR false.
    idle : 5000, //This is the amount of time in milliseconds that each slide should stay on display, not including transitions.
    source: "https://s3-sa-east-1.amazonaws.com/wixtestbucket/" // This place should contain the "music" and "slides" folders.
};

//-----------------------------------------------------------
//-----------------------------------------------------------



var trackNumber = 0;
var player = new Audio();
var slidesContainer = document.getElementById("slidesContainer");
var slidesEvent = new Event('built-slides');
var arrangeEvent = new Event('arranged-slides');
var detectedVideos = [];
var jssor_1_slider;
var tempSlides = [];


var songsAmount = config.songs;
var slidesAmount = config.slides;
var shuffleSongs = config.shuffleSongs;
var shuffleSlides = config.shuffleSlides;
var sourcePrefix = config.source;

buildSlides();

document.addEventListener('built-slides',arrangeSlides,false);

document.addEventListener('arranged-slides',main,false);

function jssor_1_slider_init() {

    var jssor_1_SlideshowTransitions = [
        {$Duration:2500,$Opacity:2,$Brother:{$Duration:4000,$Opacity:2}}
    ];
    var jssor_1_options = {
        $AutoPlay: true,
        $Idle: config.idle,
        $FillMode: 1,
        $SlideshowOptions: {
            $Class: $JssorSlideshowRunner$,
            $Transitions: jssor_1_SlideshowTransitions,
            $TransitionsOrder: 1
        }
    };

    jssor_1_slider = new $JssorSlider$("jssor_1", jssor_1_options);
};


function main() {
    jssor_1_slider_init();
    player.addEventListener("ended", nextSong, false);
    playTrack(shuffleSongs ? getRNG(null,songsAmount) : 0);
    updateDimensions();
    addResumeListeners();
    // jssor_1_slider.$On($JssorSlider$.$EVT_SLIDESHOW_START,function(slideIndex, progress,progressStart,idleStart,idleEnd,progressEnd){
    //     if (detectedVideos.indexOf((slideIndex+1).toString()) >= 0){
    //         fadeOut(4000);
    //     }
    //     else if (player.paused) {
    //         fadeIn(3000);
    //     }
    // });
    jssor_1_slider.$On($JssorSlider$.$EVT_SLIDESHOW_END,function(slideIndex, progress,progressStart,idleStart,idleEnd,progressEnd){
        if (detectedVideos.indexOf((slideIndex+1).toString()) >= 0){
            jssor_1_slider.$Pause();
            console.log(document.getElementById(slideIndex+1));
            document.getElementById(slideIndex+1).firstChild.currentTime = 0;
            document.getElementById(slideIndex+1).firstChild.play();
        }
    });
};


function buildSlides() {

    for( var i = 1; i <= slidesAmount ; i++){

        var div = document.createElement("div");
        div.id = i;

        var img = document.createElement("img");
        img.src = sourcePrefix + "slides/" + i + ".jpg";
        img.alt = img.src + " not found.";
        img.setAttribute("data-u","image");
        

        var video = document.createElement("video");
        video.src= sourcePrefix + "slides/" + i + ".mp4";
        
        
        img.addEventListener('load', (function(div,img){
            div.appendChild(img);
            tempSlides.push(div);
            if(tempSlides.length == slidesAmount)
                 document.dispatchEvent(slidesEvent);
        }).bind(null,div,img),false);
        
        img.addEventListener('error', function(div,video){
            div.className = "video";
            div.appendChild(video);
            tempSlides.push(div);
            if(tempSlides.length == slidesAmount)
                document.dispatchEvent(slidesEvent);
        }.bind(null,div,video));
    }
}

function arrangeSlides() {
    var temp;

    if(shuffleSlides)
        tempSlides = shuffleArray(tempSlides);
    else
        tempSlides.sort(function(a,b){
            if (a.id > b.id)
                return 1;
            else return -1;
        });


    tempSlides.forEach(function(element){
        temp = element;
        if (element.className == "video"){
            detectedVideos.push(element.id);
        }
        slidesContainer.appendChild(temp);
    });
    document.dispatchEvent(arrangeEvent);
}

function shuffleArray(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[currentIndex].id = currentIndex+1;
    array[randomIndex] = temporaryValue;
  }

  return array;
}


function addResumeListeners(){
    detectedVideos.forEach(function(i){
        document.getElementById(i).firstChild.addEventListener('ended',function(){
            jssor_1_slider.$Play();
        });
    });
}

function updateDimensions() {
    document.querySelectorAll("video").forEach(function(video){
        var testRatio = video.videoWidth / video.videoHeight - jssor_1_slider.$OriginalWidth() / jssor_1_slider.$OriginalHeight();
        if (testRatio > 0){
            video.width = jssor_1_slider.$OriginalWidth();
        }
        else if (testRatio < 0) {
            video.videoHeight = jssor_1_slider.$OriginalHeight();
        }
        else {
            video.width = jssor_1_slider.$OriginalWidth();
            video.height = jssor_1_slider.$OriginalHeight();
        }
    });
}

function prevSong(){
    trackNumber = shuffleSongs ? getRNG(trackNumber,songsAmount) : (songsAmount + (--trackNumber)) % songsAmount;
    if(!player.paused || player.ended)
        playTrack(trackNumber);
    else
        loadTrack(trackNumber);
    return trackNumber;
}
function nextSong(){
    trackNumber = shuffleSongs ? getRNG(trackNumber,songsAmount) : ++trackNumber%songsAmount;
    if(!player.paused || player.ended)
        playTrack(trackNumber);
    else
        loadTrack(trackNumber);
    return trackNumber;
    ;
}

function loadTrack(i) { //load only no play
    var src = sourcePrefix + "music/" + (i + 1) /* this makes it 1 indexed. */ + ".mp3";
    player.src = src;
    player.load();
}

function playTrack(i){ //load and play
    loadTrack(i);
    player.play();
}

// function fadeOut(milliseconds = 0){
//     var steps = 10;
//     var stepDuration = milliseconds / steps;

//     reduceVolume();
//     function reduceVolume(){
//         if( player.volume == 0 ){
//             player.pause();
//         }
//         else
//         {
//             var dec = parseInt(player.volume.toFixed(2).replace(/\d./i,"")) - 10;
//             if(player.volume == 1){
//                 dec = 90;
//             }
//             player.volume = "0." + dec;
//             setTimeout(reduceVolume, stepDuration);
//         }
//     }
// }

// function fadeIn(milliseconds = 0){
//     var steps = 10;
//     var stepDuration = milliseconds / steps;

//     raiseVolume();
//     function raiseVolume(){
//         if ( player.volume != 1 )
//         {
//             if(player.volume == 0){
//                 player.play();
//             }
//             var dec = parseInt(player.volume.toFixed(2).replace(/\d./i,"")) + 10;
//             if (dec==100)
//                 player.volume = 1;
//             else 
//                 player.volume = "0." + dec;

//             setTimeout(raiseVolume,stepDuration);
//         }
//     }
// }

function getRNG(i = null,max = 2){
    var num = i;
    while (num == i){
        num = Math.floor(Math.random()*max);
    }
    return num;
}