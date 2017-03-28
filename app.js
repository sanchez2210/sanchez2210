var moviesAmount = 0;
var songsAmount=0;
var imagesAmount=0;
var trackNumber = 0;
var source = document.getElementById("playersource");
var player = document.getElementById("player");
var shuffle = false;
var imagesContainer = document.getElementById("imagesContainer");
var slidesEvent = new Event('built-slides');


config = {
    songs: 4,
    images: 2,
    movies:1, 
    clips: 0,
    shuffle: true,
    idle : 1000,
    movies_positions: [1]
};
songsAmount = config.songs;
imagesAmount = config.images;
moviesAmount = config.movies;
shuffle = (config.shuffle == 'true');

buildSlides();
document.addEventListener('built-slides',init,false);

function jssor_1_slider_init() {

    var jssor_1_SlideshowTransitions = [
        {$Duration:4000,$Opacity:2,$Brother:{$Duration:4000,$Opacity:2}}
    ];
    var jssor_1_options = {
        $AutoPlay: true,
        $Idle: config.idle,
        $FillMode: 1,
        $SlideshowOptions: {
            $Class: $JssorSlideshowRunner$,
            $Transitions: jssor_1_SlideshowTransitions,
            $TransitionsOrder: 1
        },
        $ArrowNavigatorOptions: {
            $Class: $JssorArrowNavigator$
        },
        $BulletNavigatorOptions: {
            $Class: $JssorBulletNavigator$
        }
    };

    var jssor_1_slider = new $JssorSlider$("jssor_1", jssor_1_options);
};


function init() {
    trackNumber = 0;
    jssor_1_slider_init();
    loadTrack(trackNumber);
    player.addEventListener("ended", nextSong, false);
};


function buildSlides() {
    var slideCount = imagesAmount + moviesAmount;

    for( var i = 0; i < slideCount ; i++){

        var event = new Event ('checked-source');

        var div = document.createElement("div");

        var img = document.createElement("img");
        img.src = "img/" + i + ".jpg";
        img.alt = img.src + " not found.";
        img.setAttribute("data-u","image");

        var video = document.createElement("video");
        video.src= "img/" + i + ".mp4";
        
        img.addEventListener('load', (function(div,img){
            div.appendChild(img);
            imagesContainer.appendChild(div);
            if(imagesContainer.childElementCount-1 == slideCount)
                document.dispatchEvent(slidesEvent);
        }).bind(null,div,img),false);
        
        img.addEventListener('error', function(div,video){
            div.appendChild(video);
            imagesContainer.appendChild(div);
            if(imagesContainer.childElementCount-1 == slideCount)
                document.dispatchEvent(slidesEvent);
        }.bind(null,div,video));
        
    }
}


function prevSong(){
    trackNumber = shuffle ? getRNG() : (songsAmount + (--trackNumber)) % songsAmount;
    if(!player.paused || player.ended)
        playTrack(trackNumber);
    else
        loadTrack(trackNumber);
    return trackNumber;
}
function nextSong(){
    trackNumber = shuffle ? getRNG() : ++trackNumber%songsAmount;
    if(!player.paused || player.ended)
        playTrack(trackNumber);
    else
        loadTrack(trackNumber);
    return trackNumber;
}

function loadTrack(i) { //load only no play
    var src = /*"https://s3-sa-east-1.amazonaws.com/wixtestbucket/music/" +*/ "music/" + i + ".mp3";
    source.src = src;
    setCurrent(i);
    player.load();
}

function playTrack(i){ //load and play
    loadTrack(i);
    player.play();
}

function fadeOut(milliseconds = 0){
    var steps = 10;
    var stepDuration = milliseconds / steps;

    reduceVolume();

    function reduceVolume(){
        if( player.volume == 0 ){
            player.pause()
            return
        }
        else
        {
            var dec = parseInt(player.volume.toFixed(2).replace(/\d./i,"")) - 10;
            if(player.volume == 1){
                dec = 90;
            }
            console.log(dec);
            player.volume = "0." + dec;
            setTimeout(reduceVolume, stepDuration);
        }
    }

}

function fadeIn(milliseconds = 0){
    var steps = 10;
    var stepDuration = milliseconds / steps;

    raiseVolume();

    function raiseVolume(){
        if( player.volume == 1 ){
            return
        }
        else 
        {
            if(player.volume == 0){
                player.play();
                console.log("play");
            }
            var dec = parseInt(player.volume.toFixed(2).replace(/\d./i,"")) + 10;
            console.log(dec);
            if (dec==100)
                player.volume = 1;
            else 
                player.volume = "0." + dec;

            setTimeout(raiseVolume,stepDuration);
        }
    }

}

function setCurrent(i){ //Sets a class selector of song-current for styling;
    var current = document.querySelector(".song-current");
    if(current){
        current.classList.remove("song-current");
        document.getElementById(i).classList.add("song-current");
    }
}

function toggleShuffle(){
    shuffle = !shuffle;
    return shuffle;
}

function getRNG(){
    var num = trackNumber;
    while (num == trackNumber && songsAmount>1){
        num = Math.floor(Math.random()*songsAmount);
    }
    return num;
}

function consoleLog(input){
    console.innerHTML += input + "<br>";
}