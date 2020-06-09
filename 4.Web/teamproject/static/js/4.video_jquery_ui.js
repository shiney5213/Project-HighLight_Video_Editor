$(function(){
    var video = $('#myVideo');
    var maxduration;

    ////////////////////play, pause기능
    $('.btnPlay').on('click', function(){ 
        if(video[0].paused) {
            video[0].play();
        }
        else {
            video[0].pause();
        }
        return false;
    });

    ///////////////////////비디오에서 재생시간 설정
    video.on('loadedmetadata', function() {
        maxduration = video[0].duration;
        $('.progressStartTime').text(0);
        $('.progressEndTime').text(maxduration);
    });
     
    video.on('timeupdate', function() {
        $('.durationText').text(video[0].currentTime);
        var currentPos = video[0].currentTime; //Get currenttime
        var percentage = 100 * currentPos / maxduration; //in %
        $('.progressTimeBar').css('width', percentage+'%');
        $('.progressIcon').css('margin-left', ((100 * currentPos-14 )/maxduration)+'%');
    });

    /////////////////////////// progressBar에서 조작
    // var timeDrag = false;   /* Drag status */
    // $('.progressBar').mousedown(function(e) {
    //     timeDrag = true;
    //     // alert(timeDrag)
    //     progressUpdatebar(e.pageX);
    // });
    // $(document).mouseup(function(e) {
    //     if(timeDrag) {
    //         timeDrag = false;
    //         progressUpdatebar(e.pageX);
    //     }
    // });
    // $(document).mousemove(function(e) {
    //     if(timeDrag) {
    //         progressUpdatebar(e.pageX);
    //     }
    // });

    $('.progressBar').on('click', function(e){
        progressUpdateBar(e.pageX);
    });
    
    //update Progress Bar control
    var progressUpdateBar = function(x) {
        var progress = $('.progressBar');
        var position = x - progress.offset().left; //Click pos
        var percentage = 100 * position / progress.width();
        var percentageIcon =100 * (x-5 - progress.offset().left)/progress.width();
    
        //Check within range
        if(percentage > 100) {
            percentage = 100;
        }
        if(percentage < 0) {
            percentage = 0;
        }
        //start icon 보이게하기
        $('.progressIcon').css('margin-left', (percentageIcon)+'%');

        //Update progress bar and video currenttime
        $('.progressTimeBar').css('width', percentage+'%');
        alert(percentage);
        video[0].currentTime = maxduration * percentage / 100;
        // video[0].currentTime = 155;
        
        // console.log(maxduration);
        // console.log(percentage);
        // console.log('currentTime'+maxduration * percentage / 100);
    };


    ///////////////////////////////////analysis start, end control
    var $analysisStatus = 'start';
    let $analysis_start_array = [];
    let $analysis_start_array2 = [];
    var $analysis_end_array = [];
    var $analysis_end_array2 = [];
    var $analysis_start_position = [];
    var $analysis_start_position2 = [];
    var $analysis_end_position = [];
    var $analysis_end_position2 = [];
    var $resultregion = $('.result');

     // 버튼
     $('.analysisStartBtn').on('click', function(){
        $analysisStatus = 'start';
    });

    $('.analysisEndBtn').on('click', function(){
        $analysisStatus = 'end';
    });

    $('.analysisBar').on('click',function(e){
        $analysisTime(e.pageX);
    });   

    var $analysisTime = function(x){
        var $analysisBar = $('.analysisBar');
        var $position4 = x - $analysisBar.offset().left; //Click pos
        var $percent4 = 100 * $position4 / $analysisBar.width();
            
                //Check within range
        if($percent4 > 100) {
            $percent4 = 100;
        }
        if($percent4 < 0) {
            $percent4 = 0;
        }
        //start_array
        if($analysisStatus=='start'){
            // alert('start start')
            $analysis_start_array.push(maxduration * $percent4 / 100);
            $analysis_start_position.push($percent4);

            //배열에 같은 값 제거
            $.each($analysis_start_array,function(i,value){
                if($analysis_start_array2.indexOf(value) == -1 ) $analysis_start_array2.push(value);
            });
            $.each($analysis_start_position,function(i,value){
                if($analysis_start_position2.indexOf(value) == -1 ) $analysis_start_position2.push(value);
            });

            $('.analysisStartIcon').css('margin-left', 100 * (x-5 - $analysisBar.offset().left)/$analysisBar.width()+'%');
            $('.analysisStartIcon').css('visibility','visible');

            // console.log('start'+$analysis_start_array2)
            
        };
    
        if($analysisStatus=='end'){
            $analysis_end_array.push(maxduration * $percent4 / 100);
            $analysis_end_position.push($percent4);

            //배열에 같은 값 제거
            $.each($analysis_end_array,function(i,value){
                if($analysis_end_array2.indexOf(value) == -1 ) $analysis_end_array2.push(value);
            });
            $.each($analysis_end_position,function(i,value){
                if($analysis_end_position2.indexOf(value) == -1 ) $analysis_end_position2.push(value);
            });
            }
            //버튼 생기게 하기
            $('.analysisEndIcon').css('margin-left', 100 * (x-5 - $analysisBar.offset().left)/$analysisBar.width()+'%');
            $('.analysisEndIcon').css('visibility','visible');
            // console.log('end'+$analysis_end_array2)
    
        if ($analysis_start_array2.length==$analysis_end_array2.length){
            var $final_len = Number($analysis_start_array2.length)-1;
            var $start =$analysis_start_position2[$final_len] ;
            var $end = $analysis_end_position2[$final_len] ;
            var $div_width = ($end - $start) + '%';
            var $barname = 'analysisBarCanvas'+$final_len;

            var $createBar = $('<div></div>',{
                css: {'background-color':'#ccc',
                    'margin-left' : $start  + '%',
                    'width': $div_width,
                    'height': 10,
                    },
                class: $barname,
                id: 'barCanvas',
                })
            // $('.analysisColorBar').append($createBar)
            $('.analysisBar').append($createBar)

        };
    };
    



    $('.resetAnalysisBtn').on('click',function(e){
        //배열 값 업애기,
        $analysis_start_array = [];
        $analysis_start_array2 = [];
        $analysis_end_array = [];
        $analysis_end_array2 = [];
        $analysis_start_position = [];
        $analysis_start_position2 = [];
        $analysis_end_position = [];
        $analysis_end_position2 = [];
        const deleteNode = document.getElementById('barCanvas');
        deleteNode.remove(deleteNode.firstChild);
        
        //result 부분 안보이게 처리
        $resultregion.css('visibility', 'hidden');

        //result값 모두 초기화
        $start_time_array = [];
        $start_time_array2 = [];
        $end_time_array = [];
        $end_time_array2 = [];
        $start_position = [];
        $start_position2 = [];
        $end_position = [];
        $end_position2 = [];
        $modify = false;
        $timeDrag2 = false;
        $status ='start' ;
        const deletegraph = document.getElementById('svg');
        while(deletegraph.firstChild){
            deletegraph.removeChild(deletegraph.lastChild);
        };
        //icon 안보이게 하기
        $('.analysisStartIcon').css('visibility', 'hidden');
        $('.analysisEndIcon').css('visibility', 'hidden');
        $('.highlightStartIcon').css('visibility', 'hidden');
        $('.highlightEndIcon').css('visibility', 'hidden');
    });  
    
    

    var $svg = $('#svg');
    var $graph = $('#graph');

    $('.pleaseAnalysis').on('click', function(){
        $.ajax({url: 'analysis', 
                type: 'POST',
                data: {'analysis_start_array': $analysis_start_array2,
                        'analysis_end_array': $analysis_end_array2,
                },
                success: function(data2){
                        var $analysis_time = data2['analysis_time'];
                        var $dataset = data2['rate_list']; 
                        
                        //d3.js
                        var $hancan = 600 / Number(maxduration).toFixed(0);
                        var $left_margin =$hancan * ($analysis_start_array2[0]).toFixed(0);
                        $svg.css('margin-left' ,$left_margin);
                        $svg.css('width',600 - $left_margin);
                        $graph.css('width', 600-$left_margin);
                        

                        var svg = d3.select('svg');
                        
                        svg.selectAll('bar')
                        .data($dataset)  //사용할 데이터 지정
                        .enter()         
                        .append('rect')
                        .attr('height', function(d,i) {return d* 50})  //도형 크기
                        .attr('width', $hancan)
                        .attr('x', function(d,i){return (($hancan) * i)})   //도형 위치
                        .attr('y', function(d,i){return (100-$dataset[i]*50)}) //도형 위치
                        .attr('background-color', '#cccccc');
                    }
        });  
        $resultregion.css('visibility', 'visible');

    });

 /////////////////////////highlight start, end time control
 var $start_time_array = [];
 var $start_time_array2 = [];
 var $end_time_array = [];
 var $end_time_array2 = [];
 var $start_position = [];
 var $start_position2 = [];
 var $end_position = [];
 var $end_position2 = [];
 var $modify = false;
 var $timeDrag2 = false;
 var $status ='start' ;

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
    //  오름차순

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
             css: {'background-color':'#cccccc',
                 'margin-left' : $start  + '%',
                 'width': $div_width,
                 'height': 10,
                 },
             class: $barname,
             id: 'barCanvas',
             })
         $('.highlightBar').append($createBar)
        

     };
     
     if($start_time_array2.length > $start_time_array2.length  && !$modify){
         alert('start 지점을 추가하세요');
     };
     if($start_time_array2.length < $start_time_array2.length  && !$modify){
         alert('end 지점을 추가하세요');
     };
 });

///////form 태그를 안보이게 만들고 post방식으로 보내기
 $('.save_btn').on('click', function(){
     //정보 넘기기
     function post_to_url(params){
         // method = meghod||'post';
         var form = document.createElement('form');
         form.setAttribute('method', 'post');
         form.setAttribute('action', 'download');
         form.setAttribute('id', 'hiddenform');
         form.setAttribute('name', 'hiddenform');

         $('.hiddenform').append(form);

         for(var key in params){
             var hiddenField = document.createElement('input');
             hiddenField.setAttribute('type', 'hidden');
             hiddenField.setAttribute('name', key);
             hiddenField.setAttribute('value', params[key]);
             form.appendChild(hiddenField);
         }
     }

     post_to_url({'startarray': $start_time_array2,
                 'endarray': $end_time_array2});

     //자동으로 submit하기
     document.hiddenform.submit();
 });

 var $highlightUpdate = function(x) {
     var $highlightBar = $('.highlightBar');
     var $position3 = x - $highlightBar.offset().left; //Click pos
    var $percent3 = 100 * $position3 / $highlightBar.width();
     
    console.log('position', $position3);
    console.log('percent3', $percent3);
    console.log('width',$highlightBar.width());
    console.log('left',  $highlightBar.offset().left);
    console.log('margin-lift',(100 * (x-5 - $highlightBar.offset().left) / $highlightBar.width()) );
    console.log('margin-lift',(100 * (x-5 - $highlightBar.offset().left) / $highlightBar.width())+'%');

    //Check within range
     if($percent3 > 100) {
         $percent3 = 100;
     }
     if($percent3 < 0) {
         $percent3 = 0;
     }

     //start_array
     if($status=='start' && !$modify){
         $start_time_array.push(maxduration * $percent3 / 100);
         $start_position.push($percent3);
 
         //배열에 같은 값 제거
         $.each($start_time_array,function(i,value){
             if($start_time_array2.indexOf(value) == -1 ) $start_time_array2.push(value);
         });
         $.each($start_position,function(i,value){
             if($start_position2.indexOf(value) == -1 ) $start_position2.push(value);
         });
 
         //start icon 보이게하기
        //  $('.highlightStartIcon').css('margin-left', (100 * (x-5 - $highlightBar.offset().left) / $highlightBar.width())+'%');
         $('.highlightStartIcon').css('margin-left', ($start_position2[0]-5)+'%');
        // $('.highlightStartIcon').css('visibility','visible');


     };
 
     if($status=='end' && !$modify){
         $end_time_array.push(maxduration * $percent3 / 100);
         $end_position.push($percent3);
 
         //배열에 같은 값 제거
         $.each($end_time_array,function(i,value){
             if($end_time_array2.indexOf(value) == -1 ) $end_time_array2.push(value);
         });
         $.each($end_position,function(i,value){
             if($end_position2.indexOf(value) == -1 ) $end_position2.push(value);
         });
 
         //end icon 보이게 하기
         $('.highlightEndIcon').css('margin-left',( $end_position2[0]-5)+'%');
        //  $('.highlightEndIcon').css('visibility','visible');
     };

     
    $start_time_array2.sort(function(a, b){
        return a - b;
    });
    $end_time_array2.sort(function(a, b){
        return a - b;
    });

    $('.starttimearray').text($start_time_array2.length)
    $('.endtimearray').text($end_time_array2.length)


 };



















 ////////////////해야 함.
 var $modifytime = function(x) {
     var $progress4 = $('.highlightBar');
     var $position4 = x - $progress4.offset().left; //Click pos
     var $percent4 = 100 * $position4 / $progress4.width();
 
     //Check within range
     if($percent4 > 100) {
         $percent4 = 100;
     }
     if($percent4 < 0) {
         $percent34 = 0;
     }
 
     var $input_num = maxduration * $percent4 / 100;
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
         $('.highlightBar').on('click',function(e){
             $highlightUpdate(e.pageX);
         });
     //수정일때
     }else{
         $('.highlightBar').on('click',function(e){
             $modifytime(e.pageX);
         });
     }
 }    

 //////////////////////////////////////////
});