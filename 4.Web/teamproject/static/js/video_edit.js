//return a DOM object
// var video = document.getElementById('videoID'); //or
// var video = $('#videoID').get(0); //or
// var video = $('#videoID')[0];
 
//return a jQuery object
var $video = $('#myVideo');

//Play/Pause control clicked
$('.btnPlay').on('click', function() {
    if($video[0].paused) {
        $video[0].play();
    }
    else {
        $video[0].pause();
    }
    return false;
});

//get HTML5 video time duration
$video.on('loadedmetadata', function() {
    $('.duration').text($video[0].duration);
});
 
//update HTML5 video current play time
$video.on('timeupdate', function() {
    $('.current').text($video[0].currentTime);
});

//get HTML5 video time duration
$video.on('loadedmetadata', function() {
    $('.duration').text($video[0].duration);
});
 
//update HTML5 video current play time
$video.on('timeupdate', function() {
    var $currentPos = $video[0].currentTime; //Get currenttime
    var $maxduration = $video[0].duration; //Get video duration
    var $percentage = 100 * $currentPos / $maxduration; //in %
    $('.maxduration').text($maxduration);
    $('.currentPos').text($currentPos);
    $('.percentage').text($percentage);
    $('.timeBar').css('width', $percentage+'%');
});


//Drag, search
var $timeDrag = false;   /* Drag status */
$('.progressBar').mousedown(function(e) {
    $timeDrag = true;
    $updatebar(e.pageX);
});
$(document).mouseup(function(e) {
    if($timeDrag) {
        $timeDrag = false;
        $updatebar(e.pageX);
    }
});
$(document).mousemove(function(e) {
    if($timeDrag) {
        $updatebar(e.pageX);
    }
});
 
//update Progress Bar control
var $updatebar = function(x) {
    var $progress = $('.progressBar');
    var $maxduration = $video[0].duration; //Video duraiton
    var $position = x - $progress.offset().left; //Click pos
    var $percentage = 100 * $position / $progress.width();
 
    //Check within range
    if($percentage > 100) {
        $percentage = 100;
    }
    if($percentage < 0) {
        $percentage = 0;
    }
 
    //Update progress bar and video currenttime
    $('.timeBar').css('width', $percentage+'%');
    $video[0].currentTime = $maxduration * $percentage / 100;
};