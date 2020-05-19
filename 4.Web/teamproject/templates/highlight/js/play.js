var $s_t = $('form[name=start]');
var $s_b = $('start_button');
var $st= $('#st')



/////play, pause toggle
function play(){
    if(videocontrol.paused){
        videocontrol.play();
    }else{
        videocontrol.pause();
    }
};



/////입력한 시간에 시작하기
// $('.start_button').click(function(){
//     alert($st.val());
// });


$('.start_button').click(function(){
    var param = {time: $('#st').val()};
    $.get('/highlight/videoView', param, function(data){
        alert(data)
    })
});