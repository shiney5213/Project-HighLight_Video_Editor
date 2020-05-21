//return a DOM object
// var video = document.getElementById('videoID'); //or
// var video = $('#videoID').get(0); //or
// var video = $('#videoID')[0];
 
//return a jQuery object
var $video = $('#myVideo');
var $video2 = $('#myVideo');

/////1. 버튼으로 조작
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

/////2. 비디오에서 조작
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


/////3. progressBar에서 조작
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

//////////////////////////////////////////////////////
//start, end time select in progress bar
var $start_time_array = [];
var $end_time_array = [];
var $start_time_array2=[];
var $end_time_array2 = [];
var $time_array=[];
var $time_array2=[];
var $canvas_position = [];

//javascript
// var canvas = $('.myCanvas')[0];
// var ctx = canvas.getContext('2d');

var $timeDrag2 = false;   /* Drag status */

//update Progress Bar control
var $canvas_color = '';
var $updatebar2 = function(x) {
    var $progress2 = $('.progressBar2');
    var $maxduration2 = $video[0].duration; //Video duraiton
    var $position = x - $progress2.offset().left; //Click pos
    var $percent = 100 * $position / $progress2.width();
    
    $time_array.push($maxduration2 * $percent / 100);
    $canvas_position.push($position);


    //배열에 같은 값 제거
    $.each($time_array,function(i,value){
        if($time_array2.indexOf(value) == -1 ) $time_array2.push(value);
    });

    

    //Check within range
    if($percent > 100) {
        $percent = 100;
    }
    if($percent < 0) {
        $percent = 0;
    }
    if($status=='start'){
        
        $start_time_array.push($maxduration2 * $percent / 100);

        //배열에 같은 값 제거
        $.each($start_time_array,function(i,value){
            if($start_time_array2.indexOf(value) == -1 ) $start_time_array2.push(value);
        });

        //배열 값 표시
        $('.starttime').text($start_time_array2)

    }
    if($status=='end'){
        $end_time_array.push($maxduration2 * $percent / 100);

        //배열에 같은 값 제거
        
        $.each($end_time_array,function(i,value){
            if($end_time_array2.indexOf(value) == -1 ) $end_time_array2.push(value);
        });

        //배열 값 표시
        $('.endtime').text($end_time_array2)
    }
 
    //Update progress bar and video currenttime
    $('.timeBar2').css('width', $percent+'%');
    // $video[0].currentTime = $maxduration2 * $percentage2 / 100;
};


// var $start_time = $(.).get();
var $status = 'start'
$('.start_btn').on('click', function(){
    $status = 'start';
});
$('.end_btn').on('click', function(){
    $status = 'end';
});

var $timeDrag2 = false;   /* Drag status */
if($status=='start'){
    $('.progressBar').mousedown(function(e) {
        $timeDrag = true;
        $updatebar(e.pageX);
    });
    $('.progressBar2').mousedown(function(e) {
        $timeDrag2 = true;
        $updatebar2(e.pageX);
    });
    $(document).mouseup(function(e) {
        if($timeDrag2) {
            $timeDrag2 = false;
            $updatebar2(e.pageX);   // e.pageX : 화면에서 x좌표
        }
    });
    $(document).mousemove(function(e) {
        if($timeDrag2) {
            $updatebar2(e.pageX);
        }
    });
}

if($status=='end'){
    $('.progressBar').mousedown(function(e) {
        $timeDrag = true;
        $updatebar(e.pageX);
    });
    $('.progressBar2').mousedown(function(e) {
        $timeDrag2 = true;
        $updatebar2(e.pageX);
    });
    $(document).mouseup(function(e) {
        if($timeDrag2) {
            $timeDrag2 = false;
            $updatebar2(e.pageX);   // e.pageX : 화면에서 x좌표
        }
    });
    $(document).mousemove(function(e) {
        if($timeDrag2) {
            $updatebar2(e.pageX);
        }
    });
}

$('.END_btn').on('click', function(){ 
    //오름차순
    $start_time_array2.sort(function(a, b){
        return a - b;
    });
    $('.starttimearray').text($start_time_array2)
    $end_time_array2.sort(function(a, b){
        return a - b;
    });
    $('.endtimearray').text($end_time_array2)
    $('.canvasposition').text($canvas_position)
    $('.timearray').text($time_array)


    $('.canvasBar').css('width' ,200 );
    // 순서: 위, 오른쪽, 아래, 왼쪽
    $('.canvasBar').css('margin-left' , 100);

    //for문
    for (var i = 0; i < $time_array2.length; i++) {
        alert($time_array2[i]);
    }
});


