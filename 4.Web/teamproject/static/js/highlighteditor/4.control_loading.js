let video = document.querySelector(".video");
let video3 = document.querySelector(".video2");

const canvas = document.getElementById("canv");
const ctx = canvas.getContext("2d");
let slider = document.getElementById('slider');

let video_size = {'w': 0, 'h': 0};
let filename = 'in.mp4';
let time_start = 0;
let time_end = 1;
let time_start2 = 0;
let time_end2 = 1;
let crop = [null, null];
let ffmpeg = null;
let selected_file = null;
let heap_limit = null;

let video2 = $('.video');
var maxduration;
let $analysis_time = null;
let $dataset = null
let $resultregion = $('.result');
var $analysisSvg = $('#analysisSvg');
var $analysisGraph = $('#analysisGraph');
var $searchSvg = $('#searchSvg');
var $searchGraph = $('#searchGraph');
let highlight_rate = null;
let k_data=null;
let a_data = null;
let d_data = null;
let search_array = null;
let analysisLoading = $('.analysisLoading');
let analysisLoadingTitle = $('.analysisLoadingTitle');
let searchgameLoading = $('.searchgameLoading');
let searchgameLoadingTitle = $('.searchgameLoadingTitle');
let $hancan = null;
let left_margin = 0;

$(function() {
	///////////////////////////////////analysis start, end control

	video2.on('loadedmetadata', function() {
		maxduration = video2[0].duration;
    });
	
	function searchGame(){
		searchgameLoading.show();
		searchgameLoadingTitle.show();
		$('#searchGame').css('visibility', 'hidden');

		$.ajax({url: 'startSearch', 
		type: 'POST',
		data: {'search_start': 0,
				'search_end': video2[0].duration,
		}
	})
		.done(function(data){
				alert(data.search_list.length);

				search_array = data.search_list;
				console.log('time'+data.alltime);
				console.log('search'+ search_array);
				console.log('max', maxduration)
				
				//d3.js
				var $hancan2 = 900 / Number(maxduration).toFixed(0);
				// var $left_margin2 =$hancan * (time_start).toFixed(0);
				var $left_margin2=0;
				$searchSvg.css('margin-left' ,$left_margin2);
				$searchSvg.css('width',900 - $left_margin2);
				$searchGraph.css('width', 900-$left_margin2);
				
				var searchSvg = d3.select('#searchSvg');
				
				searchSvg.selectAll('bar')
				.data(search_array)  //사용할 데이터 지정
				.enter()         
				.append('rect')
				.attr('height', function(d,i) {return d* 50})  //도형 크기
				.attr('width', $hancan2)
				.attr('x', function(d,i){return (($hancan2) * i)})   //도형 위치
				.attr('y', function(d,i){return (100-search_array[i]*50)}) //도형 위치
				.attr('background-color', '#cccccc')
				.attr('class', 'search');

				$('#searchGame').css('visibility', 'visible');
				searchgameLoading.hide();
				searchgameLoadingTitle.hide();
			
		})
	};

	$('.analysisBtn').on('click', function(){
	
		analysisLoading.show();
		analysisLoadingTitle.show();

		console.log('start'+ time_start);
		console.log('end' + time_end);
		
		// svg없애기
		while($analysisSvg.firstChild){
            $analysisSvg.removeChild(deletegraph.lastChild);
		};


		$.ajax({url: 'analysis', 
				type: 'POST',
				data: {'analysis_start': time_start,
						'analysis_end': time_end,
				},
		})
		.done(function(data2){
			$analysis_time = data2.analysis_time;
			$dataset = data2.highlight_rate;
			highlight_rate = data2.highlight_rate;
			console.log('highlight', highlight_rate);
			k_data = data2.k_data;
			a_data = data2.a_data;
			d_data = data2.d_data; 
			console.log('time'+ $analysis_time);
			console.log('dataset'+ $dataset);
			
			//d3.js
			$hancan = 900 / Number(maxduration).toFixed(0);
			left_margin =$hancan * (time_start).toFixed(0);
			alert(left_margin)
			$analysisSvg.css('margin-left' ,left_margin);
			// $analysisSvg.css('width',900 - left_margin);
			// $analysisGraph.css('width', 900-left_margin);
			
			var analysisSvg = d3.select('#analysisSvg');
			
			analysisSvg.selectAll('bar')
			.data($dataset)  //사용할 데이터 지정
			.enter()         
			.append('rect')
			.attr('height', function(d,i) {return d* 50})  //도형 크기
			.attr('width', $hancan)
			.attr('x', function(d,i){return (($hancan) * i)})   //도형 위치
			.attr('y', function(d,i){return (100-$dataset[i]*50)}) //도형 위치
			.attr('background-color', '#cccccc')
			.attr('class', 'highlightrate');

			$('.hide_until_analysis').css('visibility', 'visible');
			// analysisLoading.css('visibility', 'hidden');
			analysisLoading.hide();
			analysisLoadingTitle.hide();
			// analysisLoading.remove();
			// analysisLoadingTitle.remove();

		})	
	});


	$('#radiocheckBtn').click(function(){
		// alert($("input[name=df]:checked").val());
		if ( $("input[name=df]:checked").val()== 'highlight'){
			$dataset=highlight_rate;
		};
		if ( $("input[name=df]:checked").val()== 'k'){
			$dataset=k_data;
		};
		if ($("input[name=df]:checked").val()== 'd'){
			$dataset=d_data;
		};
		if ($("input[name=df]:checked").val()== 'a'){
			$dataset=a_data;
		};
		
		// alert(data);
		const deletegraph = document.getElementById('analysisSvg');

		while(deletegraph.firstChild){
            deletegraph.removeChild(deletegraph.lastChild);
		};

		$hancan = 900 / Number(maxduration).toFixed(0);
		var left_margin =$hancan * (time_start).toFixed(0);
		$analysisSvg.css('margin-left' ,left_margin);
		// $analysisSvg.css('width',900 - left_margin);
		// $analysisGraph.css('width', 900-left_margin);
		
		var analysisSvg = d3.select('#analysisSvg');
		
		analysisSvg.selectAll('bar')
		.data($dataset)  //사용할 데이터 지정
		.enter()         
		.append('rect')
		.attr('height', function(d,i) {return d* 50})  //도형 크기
		.attr('width', $hancan)
		.attr('x', function(d,i){return (($hancan) * i)})   //도형 위치
		.attr('y', function(d,i){return (100-$dataset[i]*50)}) //도형 위치
		.attr('background-color', 'red')
		.attr('class', $("input[name=df]:checked").val())
	});

	

	$(".video").bind("loadedmetadata", function (e) {

		video_size = {'w': this.videoWidth, 'h': this.videoHeight};
		$('.hide_until_load').removeClass('hidden');
		noUiSlider.create(slider2, {
			start: [0, this.duration],
			connect: true,
			range: {
				'min': 0,
				'max': this.duration
			}
		});
		slider2.noUiSlider.on('update', (range)=>{
			update_slider_fields2(range);
		});
		update_slider_fields2();
	}).bind('loadeddata', function(e) {
		// noinspection JSIgnoredPromiseFromCall
		e.target.play();  // start playing
	}).on('pause', (e)=>{
		console.log('Paused: ', e.target.currentTime)
	});

	$('.slider_control2').on('change', (e)=>{
		$analysis_time = null;
		$dataset = null; 
		set_slider2();
	});

	let drawing2 = false;
	$("#canv2").mousedown((e)=>{
		let pos = getMousePos(canvas, e);
		drawing2 = true;
		console.log('click', pos);
		crop = [pos, null]
	}).mousemove(function(e) {
		if(!drawing2)
			return;
		let pos = getMousePos(canvas, e);
		crop = [crop[0], pos];
	}).on('mouseup', function(e) {
		if(!drawing2)
			return;
		let pos = getMousePos(canvas, e);
		console.log('Mouse Up', pos);
		crop = [crop[0], pos];
		drawing2 = false;
		if(crop[0].x === crop[1].x && crop[0].y === crop[1].y)
			crop = [null, null];
		console.log(crop);
	});

	$('.slider_time_pos2').mousedown((e)=>{
		let ele = e.target;
		let last_pos = e.clientX;
		function mup(e, ele){
			console.log('up');
			document.onmousemove = null;
			document.onmouseup = null;
		}
		function mmov(e, ele){
			let delta = e.clientX - last_pos;
			console.log('Delta:', delta);
			last_pos = e.clientX;
			let total_percent = (ele.offsetLeft+delta)/ele.parentElement.offsetWidth;
			console.log(total_percent);
			video.currentTime = video.duration * total_percent
		}
		document.onmousemove = (e)=>{mmov(e, ele)};
		document.onmouseup = (e)=>{mup(e, ele)};
	});

	function update_slider_fields2(range){
		if(!range || range.length < 2)
			return;
		document.querySelectorAll('.slider_control2').forEach(function(input) {
			// noinspection JSUndefinedPropertyAssignment
			input.value = range[input.dataset.pos];
		});
		time_start2 = parseFloat(range[0]);
		time_end2 = parseFloat(range[1]);
	}
	
	function set_slider2(){
		let vals = [];
		document.querySelectorAll('.slider_control2').forEach(function(input) {
			vals.push(input.value)
		});
		console.log(vals);
		slider.noUiSlider.set(vals);
	}
	
	
	function getMousePos2(canvas, evt) {
		let rect = canvas2.getBoundingClientRect();
		return {
			x: (evt.clientX - rect.left) / rect.width,
			y: (evt.clientY - rect.top) / rect.height
		};
	}
	
	function unscale2(coords, rect){
		return{
			'x': coords.x * rect.width,
			'y': coords.y * rect.height
		}
	}
	

	$('.saveBtn').on('click', function(){
        $.ajax({url: 'savevideo', 
                type: 'POST',
                data: {'save_start': time_start2,
                        'save_end': time_end2,
                },
                success: function(data3){
					$save_file = data3.data;
					// alert($save_file);
					// alert(data3.new_path)
					alert('저장완료')

					// $(".video2").attr("src", data3.new_path);

                    }
        });  
        // $('.video2').css('visibility', 'visible');
	});


// //////////////////////////////////////////
	console.log('Loaded DOM.');
	ffmpeg = new FFMPEG(document.querySelector(".download_links"));
	try{
		heap_limit = performance.memory.jsHeapSizeLimit;
		console.debug("Heap limit found:", heap_limit)
	}catch{}

	$("#video_selector").change(function (e) {
		let fileInput = e.target;
		let fileUrl = window.URL.createObjectURL(fileInput.files[0]);
		filename = fileInput.files[0].name;
		selected_file = fileInput.files[0];
		// alert(filename);
		$(".video").attr("src", fileUrl);
		e.target.remove();
	});

	$("#mute_toggle").click(function (){
		$(video).prop('muted', !$(video).prop('muted'));
	});

	$(".video").bind("loadedmetadata", function (e) {
		// maxduration=$('.video').duration;
		video_size = {'w': this.videoWidth, 'h': this.videoHeight};
		$('.hide_until_load').removeClass('hidden');
		
		searchgameLoading.show();
		searchgameLoadingTitle.show();
		$('#searchGame').css('visibility', 'hidden');
		searchGame();

		noUiSlider.create(slider, {
			start: [0, this.duration],
			connect: true,
			range: {
				'min': 0,
				'max': this.duration
			}
		});
		slider.noUiSlider.on('update', (range)=>{
			update_slider_fields(range);
		});
		update_slider_fields();
	}).bind('loadeddata', function(e) {
		// noinspection JSIgnoredPromiseFromCall
		e.target.play();  // start playing
	}).on('pause', (e)=>{
		console.log('Paused: ', e.target.currentTime)
	});

	$('.slider_control').on('change', (e)=>{
		$analysis_time = null;
		$dataset = null; 
		set_slider();
	});

	let drawing = false;
	$("#canv").mousedown((e)=>{
		let pos = getMousePos(canvas, e);
		drawing = true;
		console.log('click', pos);
		crop = [pos, null]
	}).mousemove(function(e) {
		if(!drawing)
			return;
		let pos = getMousePos(canvas, e);
		crop = [crop[0], pos];
	}).on('mouseup', function(e) {
		if(!drawing)
			return;
		let pos = getMousePos(canvas, e);
		console.log('Mouse Up', pos);
		crop = [crop[0], pos];
		drawing = false;
		if(crop[0].x === crop[1].x && crop[0].y === crop[1].y)
			crop = [null, null];
		console.log(crop);
	});

	$('.slider_time_pos').mousedown((e)=>{
		let ele = e.target;
		let last_pos = e.clientX;
		function mup(e, ele){
			console.log('up');
			document.onmousemove = null;
			document.onmouseup = null;
		}
		function mmov(e, ele){
			let delta = e.clientX - last_pos;
			console.log('Delta:', delta);
			last_pos = e.clientX;
			let total_percent = (ele.offsetLeft+delta)/ele.parentElement.offsetWidth;
			console.log(total_percent);
			video.currentTime = video.duration * total_percent
		}
		document.onmousemove = (e)=>{mmov(e, ele)};
		document.onmouseup = (e)=>{mup(e, ele)};
	});

	$("#run_ffmpeg").click(() => {
		if(heap_limit){
			if(selected_file.size * 2.5 > (heap_limit - performance.memory.usedJSHeapSize)){
				if(!confirm("The given file is likely to crash your browser!\nContinue?")){
					return
				}
			}
		}
		let cmd = build_ffmpeg_string(true);
		let ts = (time_start?time_start.toFixed(2):0);
		let te = (time_end?time_end.toFixed(2):0);
		let duration = te - ts;
		let progress_callback = (prog) => {
			if(prog.done){
				document.querySelector(".ffmpeg_log").textContent = "Conversion complete.";
			}else {
				let percent = (prog['time'] / duration) * 100;
				document.querySelector(".ffmpeg_log").textContent = percent.toFixed(2) + "% complete.";
			}
		};
		console.log('Running FFMPEG:', cmd);
		ffmpeg.start(selected_file, cmd, progress_callback);
	});
});


function update_slider_fields(range){
	if(!range || range.length < 2)
		return;
	document.querySelectorAll('.slider_control').forEach(function(input) {
		// noinspection JSUndefinedPropertyAssignment
		input.value = range[input.dataset.pos];
	});
	time_start = parseFloat(range[0]);
	time_end = parseFloat(range[1]);
}

function set_slider(){
	let vals = [];
	document.querySelectorAll('.slider_control').forEach(function(input) {
		vals.push(input.value)
	});
	console.log(vals);
	slider.noUiSlider.set(vals);
}


function getMousePos(canvas, evt) {
	let rect = canvas.getBoundingClientRect();
	return {
		x: (evt.clientX - rect.left) / rect.width,
		y: (evt.clientY - rect.top) / rect.height
	};
}

function unscale(coords, rect){
	return{
		'x': coords.x * rect.width,
		'y': coords.y * rect.height
	}
}

function crop_box(crop, in_width, in_height){
	let rect = {'width': in_width, 'height': in_height};
	let p1 = unscale(crop[0], rect), p2 = unscale(crop[1],rect);
	let x = Math.min(p1.x, p2.x);
	let y = Math.min(p1.y, p2.y);
	let w = Math.abs(p1.x - p2.x);
	let h = Math.abs(p1.y - p2.y);
	return {
		'x': Math.floor(x),
		'y': Math.floor(y),
		'w': Math.floor(w),
		'h': Math.floor(h)
	}
}

function pause_toggle(){
	console.log('toggle play');
	if(video.paused){
		video.play().finally(()=>{$(".play_toggle").html('&#10074;&#10074;')});
	}else{
		video.pause();
		$(".play_toggle").html('&#9654;')
	}
}

function build_ffmpeg_string(for_browser_run=false){
	let ts = (time_start?time_start.toFixed(2):0);
	let te = (time_end?time_end.toFixed(2):0);
	let mpeg = for_browser_run?'': 'ffmpeg ';
	mpeg+= '-ss '+ts+' -i "'+filename+'"';
	if(for_browser_run && (!crop[0] || !crop[1])){
		mpeg+=' -vf showinfo'
	}
	mpeg+=' -movflags faststart -t '+(te-ts).toFixed(4)+' ';
	if(crop[0] && crop[1]){
		let rect = canvas.getBoundingClientRect();
		let box = crop_box(crop, rect.width, rect.height);
		ctx.strokeStyle="#FF0000";
		ctx.strokeRect(box.x, box.y, box.w, box.h);
		box = crop_box(crop, video_size.w, video_size.h);
		mpeg+= '-filter:v "crop='+box.w+':'+box.h+':'+box.x+':'+box.y;
		if(for_browser_run){
			mpeg+=', showinfo';
		}
		mpeg+= '" ';
	}
	let fn = for_browser_run ? encodeURI(filename.replace(/\.[^/.]+$/, "")) : 'out';
	mpeg+='-c:a copy '+fn+'.mp4';
	return mpeg;
}

function update(){
	canvas.width = $(video).width();
	canvas.height = $(video).height();
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	if (video.currentTime < time_start)
		video.currentTime = time_start;
	if (video.currentTime > time_end)
		video.currentTime = time_start;
	let complete_percent = 100 * (video.currentTime / video.duration);
	$(".slider_time_pos").css("left", complete_percent + "%");
	$(".current_time").text(video.currentTime.toFixed(2));
	// noinspection JSCheckFunctionSignatures
	ctx.drawImage(video, 0, 0, canvas.width, canvas.height); //TODO: Subimage using crop.

	let mpeg = build_ffmpeg_string(false);
	if($('.ffmpeg').text() !== mpeg) {
		$('.ffmpeg').text(mpeg);
	}
	requestAnimationFrame(update.bind(this)); // Tell browser to trigger this method again, next animation frame.
}

update(); //Start rendering
