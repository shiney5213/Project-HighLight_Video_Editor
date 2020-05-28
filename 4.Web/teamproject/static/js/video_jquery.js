$(function(){
    var $video = $('#myVideo');
    var $video2 = $('#myVideo');
    


    /////////////////////비디오에서 재생시간 설정
    $video.on('loadedmetadata', function() {
        $('.duration').text($video[0].duration);
    });
    
    $video.on('timeupdate', function() {
        $('.current').text($video[0].currentTime);
    });

    $video.on('loadedmetadata', function() {
        $('.duration').text($video[0].duration);
    });
    
    $video.on('timeupdate', function() {
        var $currentPos = $video[0].currentTime; //Get currenttime
        var $maxduration = $video[0].duration; //Get video duration
        var $percentage = 100 * $currentPos / $maxduration; //in %
        $('.maxduration').text($maxduration);
        $('.currentPos').text($currentPos);
        $('.percentage').text($percentage);
        $('.timeBar').css('width', $percentage+'%');
    });

    /////////////////////////// progressBar에서 조작
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

    $('.save_btn').on('click', function(){
        //form 태그 만들고 post방식으로 보내기
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
        $('.timeBar2').css('width', $percentage+'%');


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
   

    //////////////////////////analysis start, end control
    var $analysisStatus = 'start';
    var $analysis_start_array = [];
    var $analysis_start_array2 = [];
    var $analysis_end_array = [];
    var $analysis_end_array2 = [];
    var $analysis_start_position = [];
    var $analysis_start_position2 = [];
    var $analysis_end_position = [];
    var $analysis_end_position2 = [];

     // 버튼
     $('.analysisStartBtn').on('click', function(){
        $analysisStatus = 'start';
        // alert($analysisStatus);
    });

    $('.analysisEndBtn').on('click', function(){
        $analysisStatus = 'end';
        // alert($analysisStatus);
    });


    $('.analysisBar').on('click',function(e){
        // alert('click success')
        $analysisTime(e.pageX);
    });    

    var $analysisTime = function(x){
        var $analysisBar = $('.analysisBar');
        var $maxduration4 = $video[0].duration; //Video duraiton
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
            $analysis_start_array.push($maxduration4 * $percent4 / 100);
            $analysis_start_position.push($percent4);

            //배열에 같은 값 제거
            $.each($analysis_start_array,function(i,value){
                if($analysis_start_array2.indexOf(value) == -1 ) $analysis_start_array2.push(value);
            });
            $.each($analysis_start_position,function(i,value){
                if($analysis_start_position2.indexOf(value) == -1 ) $analysis_start_position2.push(value);
            });

            // alert($analysis_start_array2)
    
            //배열 값 표시
            $('.analysisStart').text($analysis_start_array2)
        };
    
        if($analysisStatus=='end'){
            $analysis_end_array.push($maxduration4 * $percent4 / 100);
            $analysis_end_position.push($percent4);

            //배열에 같은 값 제거
            $.each($analysis_end_array,function(i,value){
                if($analysis_end_array2.indexOf(value) == -1 ) $analysis_end_array2.push(value);
            });
            $.each($analysis_end_position,function(i,value){
                if($analysis_end_position2.indexOf(value) == -1 ) $analysis_end_position2.push(value);
            });
            }
        
            //배열 값 표시
            $('.analysisEnd').text($analysis_end_array2)
    

        if ($analysis_start_array2.length==$analysis_end_array2.length){
            var $final_len = Number($analysis_start_array2.length)-1;
            var $start =$analysis_start_position2[$final_len] ;
            var $end = $analysis_end_position2[$final_len] ;
            var $div_width = ($end - $start) + '%';
            var $barname = 'analysisBarCanvas'+$final_len;
            // $('.divwidth').text($div_width)

            var $createBar = $('<div></div>',{
                css: {'background-color':'DarkSalmon',
                    'margin-left' : $start  + '%',
                    'width': $div_width,
                    },
                class: $barname,
                id: 'barCanvas',
                })
            $('.colorAnalysisBar').append($createBar)
        };

    };
    $('.pleaseAnalysis').on('click', function(){
        $.ajax({url: 'analysis', 
                type: 'POST',
                data: {'analysis_start_array': $analysis_start_array2,
                        'analysis_end_array': $analysis_end_array2,
                        },
                success: function(data){
                        alert(data['result']);
                    }
                    }
                );                
    });

    // $.jqplot.config.enablePlugins = true;
    //     var s1 = [2, 6, 7, 10];
    //     var ticks = ['a', 'b', 'c', 'd'];
         
    //     plot1 = $.jqplot('chart1', [s1], {
    //         // Only animate if we're not using excanvas (not in IE 7 or IE 8)..
    //         animate: !$.jqplot.use_excanvas,
    //         seriesDefaults:{
    //             renderer:$.jqplot.BarRenderer,
    //             pointLabels: { show: true }
    //         },
    //         axes: {
    //             xaxis: {
    //                 renderer: $.jqplot.CategoryAxisRenderer,
    //                 ticks: ticks
    //             }
    //         },
    //         highlighter: { show: false }
    //     });
     
    //     $('#chart1').bind('jqplotDataClick', 
    //         function (ev, seriesIndex, pointIndex, data) {
    //             $('#info1').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data);
    //         }
    //     );

    // A Bar chart from a single series will have all the bar colors the same.
    // var s1 = [15, 8];

    // var ticks = ['Clients', 'Prospects'];
    
    // $('#chart1').jqplot([s1], {
    //     title:'Default Bar Chart',
    //     seriesDefaults:{
    //                     renderer:$.jqplot.BarRenderer
    //     },
    //     axes:{
    //             xaxis:{
    //                     renderer: $.jqplot.CategoryAxisRenderer,
    //                     ticks: ticks
    //             }
    //     }
    // });

    var line =[['2013/12/25',15],['2013/12/26',22],['2013/12/27',11],['2013/12/28',32],  
          ['2013/12/29',41],['2013/12/30',23]];

    $('#chart1').jqplot([line],{
            title: 'Bar Chart',
            axes:{
                xaxis:{
                    // 날짜 형태로 입력을 하기위해서는 Date형식의 Renderer을 사용합니다.
                    renderer:$.jqplot.DateAxisRenderer,
                    tickOptions:{ // 축에관한 옵션                    
                        // 입력된 값이 날짜형태로 인식되기 위해서 format 형식을 정해주고 입력값도
                        // yyyy/mm/dd 형식으로 입력해야만 정상적으로 나타납니다.
                        formatString:'%y/%m/%d'
                    } 
                }
            }
        });
/////////////// d3.js:https://www.tutorialsteacher.com/d3js/create-bar-chart-using-d3js
    var svg = d3.select("svg"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin


    var xScale = d3.scaleBand().range([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range([height, 0]);

    var g = svg.append("g")
         .attr("transform", "translate(" + 100 + "," + 100 + ")")
         .call(d3.axisBottom(xScale));

    d3.csv("../static/highlight/data/bar-data.csv", function(error, data) {
        if (error) {
        throw error;
        }

        xScale.domain(data.map(function(d) { return d.year; }));
        yScale.domain([0, d3.max(data, function(d) { return d.value; })]);

        g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

        g.append("g")
        .call(d3.axisLeft(yScale).tickFormat(function(d){
        return "$" + d;
        }).ticks(10));


        g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(d.year); })
        .attr("y", function(d) { return yScale(d.value); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(d.value); });
    });



//////////////d3js: 그래프 성공
// d3.csv("../static/highlight/data/bar-data.csv", d3.autoType).then(function (data) {
//     d3.select("body")
//       .selectAll('.d3graph')  //선택한 태그 뒤에 붙임
//       .data(data)
//       .enter()
//       .append("div")
//       .style("width", function(d) { return d.amount * 40 + "px"; })
//       .style("height", "15px")
//       .style('background-color', 'yellow')      
//       ;
//   });




 //////////////////////////////////////////
});

