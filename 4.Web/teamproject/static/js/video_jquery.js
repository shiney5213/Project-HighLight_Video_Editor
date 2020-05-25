$(function(){
    var $video = $('#myVideo');
    var $video2 = $('#myVideo');
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
    var $status ='start' ;

    var $updatebar3 = function(x) {
        $('.status').text($status);
        $('.modify').text($modify);
        
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
        if($status=='start' && !$modify){
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
        };
    
        if($status=='end' && !$modify){
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
        };
    };


       

    var $modifytime = function(x) {
        var $progress4 = $('.progressBar2');
        var $maxduration4 = $video[0].duration; //Video duraiton
        var $position4 = x - $progress4.offset().left; //Click pos
        var $percent4 = 100 * $position4 / $progress4.width();
    
        //Check within range
        if($percent4 > 100) {
            $percent4 = 100;
        }
        if($percent4 < 0) {
            $percent34 = 0;
        }
    
        var $input_num = $maxduration4 * $percent4 / 100;
        alert($input_num)
        var $dif = 100;
        var $close_num=0;
        // $('.minnum').text($input_num);
    
        for (var i = 0; i<$start_time_array2.length; i++){
    
            if($dif < $start_time_array2[i]-$input_num){
                $dif = $start_time_array2[i]-$input_num;
                $close_num = $start_time_array2[i]
                // $('.minnum').text($close_num);
            }
        }
        for (var i = 0; i<$end_time_array2.length; i ++){
            if($dif < $end_time_array2[i]-$input_num){
                $dif = $end_time_array2[i]-$input_num;
                $close_num = $end_time_array2[i]
            }
        }
    };

    var $modifystatus = function(){
        // 추가일때
        if(!$modify){
            $('.progressBar2').on('click',function(e){
                $updatebar3(e.pageX);
            });
        //수정일때
        }else{
            $('.progressBar2').on('click',function(e){
                $modifytime(e.pageX);
            });
        }
    }    

    // 버튼
    $('.start_btn').on('click', function(){
        $status = 'start';
        $modify = false;
        $modifystatus();
    });

    $('.end_btn').on('click', function(){
        $status = 'end';
        $modify = false;   
        $modifystatus();
    });

    $('.modify_btn').on('click', function(){
        $modify= true;
        $modifystatus();
    });

    $('.check_btn').on('click', function(){ 
    
        //오름차순
        $start_time_array2.sort(function(a, b){
            return a - b;
        });
        $end_time_array2.sort(function(a, b){
            return a - b;
        });
        $('.starttimearray').text($start_time_array2.length)
        $('.endtimearray').text($end_time_array2.length)


        if ($start_time_array2.length == $start_time_array2.length && $modify==false){
            var $final_len = Number($start_time_array2.length)-1;
            var $start =$start_position2[$final_len] ;
            var $end = $end_position2[$final_len] ;
            var $div_width = ($end - $start) + '%';
            var $barname = 'barCanvas'+$final_len;
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
    
        // if (start_time_array2.length == start_time_array2.length && $modify==false){
        //     var $final_len = $final_end.length;
        //     // 100 * $position3 / $progress3.width();
        //     for (var i=0; i<$final_len; i ++){
        //         var $start =$start_position2[i] ;
        //         var $end = $end_position2[i] ;
        //         var $div_width = ($end - $start) + '%';
        //         var $barname = 'barCanvas'+i
        //         $('.divwidth').text($div_width)
    
        //         var $createBar = $('<div></div>',{
        //             css: {'background-color':'DarkSalmon',
        //                 'margin-left' : $start  + '%',
        //                 'width': $div_width,
        //                 },
        //             class: $barname,
        //             id: 'barCanvas',
        //             })
        //         $('.progressBar4').append($createBar)
        //     }
        // }
        if($final_end.length > $final_start.length && !$modify){
            alert('start 지점을 추가하세요');
        };
        if($final_end.length < $final_start.length && !$modify){
            alert('end 지점을 추가하세요');
        };
    });
});

