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
//start, end time select in progress bar2
var $time_array=[];
var $time_array2=[];
var $canvas_position = [];
var $canvas_position2 = [];

// mouse handling
var $timeDrag2 = false;   /* Drag status */
$('.progressBar2').mousedown(function(e) {
    $timeDrag2 = true;
    $updatebar2(e.pageX);    // e.pageX : 화면에서 x좌표
});
$(document).mouseup(function(e) {
    if($timeDrag2) {
        $timeDrag2 = false;
        $updatebar2(e.pageX);  
    }
});
$(document).mousemove(function(e) {
    if($timeDrag2) {
        $updatebar2(e.pageX);
    }
});


//update Progress Bar control
var $updatebar2 = function(x) {
    var $progress2 = $('.progressBar2');
    var $maxduration2 = $video[0].duration; //Video duraiton
    var $position = x - $progress2.offset().left; //Click pos
    var $percent = 100 * $position / $progress2.width();
    
    //Check within range
    if($percent > 100) {
        $percent = 100;
    }
    if($percent < 0) {
        $percent = 0;
    }

    $time_array.push($maxduration2 * $percent / 100);
    $canvas_position.push($percent);


    //배열에 같은 값 제거
    $.each($time_array,function(i,value){
        if($time_array2.indexOf(value) == -1 ) $time_array2.push(value);
    });

    $.each($canvas_position,function(i,value){
        if($canvas_position2.indexOf(value) == -1 ) $canvas_position2.push(value);
    });


    //div append해서 canvas bar 그리기

    var $array_index = $time_array2.length;
    var $barname = 'canvasBar'+$array_index;

    
    $('.timearray').text($time_array2)
    // alert($canvas_position2[$array_index-1]+'%')
    $('.canvasarray').text($canvas_position2)



    if($array_index == 1){
        var $createBar = $('<div></div>',{
            css: {'background-color':'DarkSalmon',
                'margin-left' : 0,
                'width': $canvas_position2[$array_index-1]+'%',
                },
            class: $barname,
            id: 'canvasBar',
            })
        $('.progressBar3').append($createBar)
    }else if($array_index%2==0){
        var $createBar = $('<div></div>',{
            css: {'background-color':'DarkSeaGreen',
                'margin-left' :$canvas_position2[$array_index-2]+'%' ,
                'width': ($canvas_position2[$array_index-1] -$canvas_position2[$array_index-2]) +'%',
            class: $barname},
            id: 'canvasBar',
            })
        $('.progressBar3').append($createBar)
    } else{
        var $createBar = $('<div></div>',{
            css: {'background-color':'DarkSalmon',
                'margin-left' :$canvas_position2[$array_index-2]+'%' ,
                'width': ($canvas_position2[$array_index-1] -$canvas_position2[$array_index-2]) +'%',
                },
            class: $barname,
            id: 'canvasBar',
            })
        $('.progressBar3').append($createBar) 
    }
};

//////////////////////////////////////////////////////////////////
//상태값으로 확인하기
var $start_time_array = [];
var $start_time_array2 = [];
var $end_time_array = [];
var $end_time_array2 = [];
var $final_start = [];
var $final_end = [];
var $start_position = [];
var $start_position2 = [];
var $end_position = [];
var $end_position2 = [];
var $modify = false;
var $timeDrag2 = false;


//start/end status toggle
var $status = 'start'
$('.start_btn').on('click', function(){
    $status = 'start';
    $modify = false;
});
$('.end_btn').on('click', function(){
    $status = 'end';
    $modify = false;
});


//마우스 상태
   /* Drag status */
//추가일때
if($status=='start' && $modify==false){
    $('.progressBar2').mousedown(function(e) {
        $timeDrag2 = true;
        $updatebar3(e.pageX);
    });
    $(document).mouseup(function(e) {
        if($timeDrag2) {
            $timeDrag2 = false;
            $updatebar3(e.pageX);   // e.pageX : 화면에서 x좌표
        }
    });
    $(document).mousemove(function(e) {
        if($timeDrag2) {
            $updatebar3(e.pageX);
        }
    });
}
if($status=='start'&& $modify==false){
    $('.progressBar2').mousedown(function(e) {
        $timeDrag2 = true;
        $updatebar3(e.pageX);
    });
    $(document).mouseup(function(e) {
        if($timeDrag2) {
            $timeDrag2 = false;
            $updatebar3(e.pageX);   // e.pageX : 화면에서 x좌표
        }
    });
    $(document).mousemove(function(e) {
        if($timeDrag2) {
            $updatebar3(e.pageX);
        }
    });
}else{
    alert($modify)
    $('.progressBar2').mousedown(function(e) {
        $timeDrag2 = true;
        $modifytime(e.pageX);
    });
    $(document).mouseup(function(e) {
        if($timeDrag2) {
            $('.minnum').text($modify);

            $timeDrag2 = false;
            $modifytime(e.pageX);   // e.pageX : 화면에서 x좌표
        }
    });
    $(document).mousemove(function(e) {
        if($timeDrag2) {
            $('.minnum').text($modify);

            $modifytime(e.pageX);
        }
    });
}


var $updatebar3 = function(x) {
    var $progress3 = $('.progressBar2');
    var $maxduration3 = $video[0].duration; //Video duraiton
    var $position3 = x - $progress3.offset().left; //Click pos
    var $percent3 = 100 * $position3 / $progress3.width();
    
    //Check within range
    if($percent3 > 100) {
        $percent3 = 100;
    }
    if($percent3 < 0) {
        $percent3 = 0;
    }
    
    //start_array
    if($status=='start'){
        $start_time_array.push($maxduration3 * $percent3 / 100);
        $start_position.push($percent3);

        //배열에 같은 값 제거
        $.each($start_time_array,function(i,value){
            if($start_time_array2.indexOf(value) == -1 ) $start_time_array2.push(value);
        });
        $.each($start_position,function(i,value){
            if($start_position2.indexOf(value) == -1 ) $start_position2.push(value);
        });

        //배열 값 표시
        $('.starttime').text($start_time_array2)

    }
    if($status=='end'){
        $end_time_array.push($maxduration3 * $percent3 / 100);
        $end_position.push($percent3);

        //배열에 같은 값 제거
        $.each($end_time_array,function(i,value){
            if($end_time_array2.indexOf(value) == -1 ) $end_time_array2.push(value);
        });
        $.each($end_position,function(i,value){
            if($end_position2.indexOf(value) == -1 ) $end_position2.push(value);
        });

        //배열 값 표시
        $('.endtime').text($end_time_array2)
        }
    }
    
    // else{
    //     var $input_num = $maxduration3 * $percent3 / 100;
    //     var $dif = 100;
    //     var $close_num=0;

    //     for (var i = 0; i<$start_time_array2.length; i++);
    //         $('.minnum').text($start_time_array2[i]);

    //         if($dif < $start_time_array2[i]-$input_num){
    //             $dif = $start_time_array2[i]-$input_num;
    //             $close_num = $start_time_array2[i]
    //             $('.minnum').text($close_num);

    //         }
    //     for (var i = 0; i<$end_time_array2.length; i ++);
    //         if($dif < $end_time_array2[i]-$input_num){
    //             $dif = $end_time_array2[i]-$input_num;
    //             $close_num = $end_time_array2[i]
    //         }
    // }

$('.check_btn').on('click', function(){ 
    $modify = false;
    //오름차순
    $start_time_array2.sort(function(a, b){
        return a - b;
    });
    $end_time_array2.sort(function(a, b){
        return a - b;
    });

    $('.starttimearray').text($start_time_array2.length)
    $('.endtimearray').text($end_time_array2.length)
    // $('.canvasposition').text($canvas_position2)

    $final_start = $start_time_array2;
    $final_end = $end_time_array2;

    if (($final_end.length == $final_start.length) && ($modify==false)){
        var $final_len = $final_end.length;

        // 100 * $position3 / $progress3.width();
        for (var i=0; i<$final_len; i ++){
            var $start =$start_position2[i] ;
            var $end = $end_position2[i] ;
            var $div_width = ($end - $start) + '%';
            var $barname = 'barCanvas'+i
            $('.divwidth').text($div_width)

            var $createBar = $('<div></div>',{
                css: {'background-color':'DarkSalmon',
                    'margin-left' : $start  + '%',
                    'width': $div_width,
                    },
                class: $barname,
                id: 'barCanvas',
                })
            $('.progressBar4').append($createBar)
        }
    }
    if (($final_end.length > $final_start.length) && ($modify==false)){
        alert('start 지점을 추가하세요')
    }
    if(($final_end.length < $final_start.length) && ($modify==false)){
        alert('end 지점을 추가하세요')
    } 
    
});


//수정일때
$('.modify_btn').on('click', function(){
    $modify= true;
    $('.minnum').text($modify);

});


// if($modify){
//     alert($modify)
//     $('.progressBar2').mousedown(function(e) {
//         $timeDrag2 = true;
//         $modifytime(e.pageX);
//     });
//     $(document).mouseup(function(e) {
//         if($timeDrag2) {
//             $('.minnum').text($modify);

//             $timeDrag2 = false;
//             $modifytime(e.pageX);   // e.pageX : 화면에서 x좌표
//         }
//     });
//     $(document).mousemove(function(e) {
//         if($timeDrag2) {
//             $('.minnum').text($modify);

//             $modifytime(e.pageX);
//         }
//     });
// }

// if(($status=='end')&& ($modify == true)){
//     $('.progressBar2').mousedown(function(e) {
//         $timeDrag2 = true;
//         $modifytime(e.pageX);
//     });
//     $(document).mouseup(function(e) {
//         if($timeDrag2) {
//             $timeDrag2 = false;
//             $modifytime(e.pageX);   // e.pageX : 화면에서 x좌표
//         }
//     });
//     $(document).mousemove(function(e) {
//         if($timeDrag2) {
//             $modifytime(e.pageX);
//         }
//     });
// }


var $modifytime = function(x) {
    var $progress4 = $('.progressBar2');
    var $maxduration4 = $video[0].duration; //Video duraiton
    var $position4 = x - $progress4.offset().left; //Click pos
    var $percent4 = 100 * $position4 / $progress3.width();

    //Check within range
    if($percent4 > 100) {
        $percent4 = 100;
    }
    if($percent4 < 0) {
        $percent34 = 0;
    }

    var $input_num = $maxduration4 * $percent4 / 100;
    var $dif = 100;
    var $close_num=0;
    $('.minnum').text($input_num);

    // $('.minnum').text($start_time_array2);

    for (var i = 0; i<$start_time_array2.length; i++);

        if($dif < $start_time_array2[i]-$input_num){
            $dif = $start_time_array2[i]-$input_num;
            $close_num = $start_time_array2[i]
            // $('.minnum').text($close_num);

        }
    for (var i = 0; i<$end_time_array2.length; i ++);
        if($dif < $end_time_array2[i]-$input_num){
            $dif = $end_time_array2[i]-$input_num;
            $close_num = $end_time_array2[i]
        }
}



