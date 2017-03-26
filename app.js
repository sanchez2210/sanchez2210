
var files;
var songsAmount=0;
var imagesAmount=0;
var trackNumber = 0;
var source = document.getElementById("playersource");
var player = document.getElementById("player");
var songs = document.getElementById("songs");
var shuffle = false;
var filepicker = document.getElementById("filepicker");
var nextButton = document.getElementById("next");
var prevButton = document.getElementById("prev");
var shuffleButton = document.getElementById("shuffle");
var imagesContainter = document.getElementById("imagesContainer");
var console = document.getElementById("console");

var req = new XMLHttpRequest();
var filesJson;
req.open("GET",/*"https://s3-sa-east-1.amazonaws.com/wixtestbucket/*/"files.json");
req.addEventListener("load",function () {
    filesJson = JSON.parse(this.responseText);
    songsAmount = parseInt(filesJson.songs);
    imagesAmount = parseInt(filesJson.images);
    init();
});
req.send();

consoleLog("Screen width: "+ screen.width +", Screen Heigth: "+ screen.height);
player.addEventListener("error", function(e){consoleLog(JSON.stringify(e));})

var jssor_1_slider_init = function() {

    var jssor_1_SlideshowTransitions = [
        {$Duration:1200,$Opacity:2}
    ];

    var jssor_1_options = {
        $AutoPlay: true,
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

    /*responsive code begin*/
    /*remove responsive code if you don't want the slider scales while window resizing*/
    function ScaleSlider() {
        var refSize = jssor_1_slider.$Elmt.parentNode.clientWidth;
        if (refSize) {
            refSize = Math.min(refSize, 600);
            jssor_1_slider.$ScaleWidth(refSize);
        }
        else {
            window.setTimeout(ScaleSlider, 30);
        }
    }
    ScaleSlider();
    $Jssor$.$AddEvent(window, "load", ScaleSlider);
    $Jssor$.$AddEvent(window, "resize", ScaleSlider);
    $Jssor$.$AddEvent(window, "orientationchange", ScaleSlider);
    /*responsive code end*/
};


function init() { //This code starts everything as soon as files.json is read
    trackNumber = 0;
    songs.innerHTML = "";
    for (var i = 0; i< songsAmount ; i++) {

        var li = document.createElement("li");
        li.setAttribute("class", "song");
        li.innerHTML= i + ".mp3";
        li.id = i;

        li.addEventListener("click", (function(i){
            trackNumber=i;
            playTrack(i);
        }).bind(null,i),false);

        songs.appendChild(li);
    }

    for(var j = 0; j < imagesAmount ; j++){

        var div = document.createElement("div");
        var img = document.createElement("img");
        img.setAttribute("data-u","image");
        img.src = "img/" + j + ".jpg";
        div.appendChild(img);
        imagesContainter.appendChild(div);

    }
    jssor_1_slider_init();
    loadTrack(trackNumber);
};

prevButton.addEventListener("click", prevSong,false);
nextButton.addEventListener("click", nextSong,false);
player.addEventListener("ended", nextSong, false);
shuffleButton.addEventListener("click",toggleShuffle,false);


function prevSong(){
    trackNumber = shuffle ? getRNG() : (songsAmount + (--trackNumber)) % songsAmount;
    if(!player.paused || player.ended)
        playTrack(trackNumber);
    else
        loadTrack(trackNumber);
}
function nextSong(){
    trackNumber = shuffle ? getRNG() : ++trackNumber%songsAmount;
    if(!player.paused || player.ended)
        playTrack(trackNumber);
    else
        loadTrack(trackNumber);
}

function loadTrack(i) { //load only no play
    var src = "https://s3-sa-east-1.amazonaws.com/wixtestbucket/music/" + i + ".mp3";
    source.src = src;
    setCurrent(i);
    player.load();
}

function playTrack(i){ //load and play
    loadTrack(i);
    player.play();
}

function setCurrent(i){ //Sets a class selector of song-current for styling;
    var current = document.querySelector(".song-current");
    if(current)
        current.classList.remove("song-current");
    document.getElementById(i).classList.add("song-current");
}

function toggleShuffle(){
    shuffle = !shuffle;
}

function getRNG(){
    var num = trackNumber;
    while (num == trackNumber && songsAmount>1){
        num = Math.floor(Math.random()*songsAmount);
    }
    console.log(num);
    return num;
}

function consoleLog(input){
    console.innerHTML += input + "<br>";
}