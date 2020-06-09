from django.shortcuts import render
from django.shortcuts import render, HttpResponse
from django.shortcuts import get_object_or_404, redirect
from django.http import HttpResponse, JsonResponse
from django.conf import settings
from django.views import View
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from moviepy.video.io.ffmpeg_tools import ffmpeg_extract_subclip
from moviepy.editor import VideoFileClip, concatenate_videoclips
import cv2
from . import apps
import shutil
import random
from .dataAnalysis import preprocessing
from .dataAnalysis import modelpredict
import datetime
import os, time

global filename 

CSRF_COOKIE_SECURE = True

@csrf_exempt
def analysis(request):
    global filename

    filename = 'test.mp4'
    print('key',request.POST.keys())
    analysis_start = request.POST.get('analysis_start', '0')
    analysis_end =request.POST.get('analysis_end', '1')
 
    # analysis_start_list = analysis_start_list.split(',')
    # analysis_end_list=analysis_end_list.split(',')
    print(analysis_start, analysis_end)
    analysis_time = int(float(analysis_end)-float(analysis_start))

    analysisstarttime = int(float(analysis_start))
    analysisstarttime = str(datetime.timedelta(seconds=analysisstarttime))
    analysisendtime = int(float(analysis_end))
    analysisendtime = str(datetime.timedelta(seconds=analysisendtime))
    print('시간 ', analysisstarttime, analysisendtime)


    # 임의로 확률값 결정
    rate_list = [random.random() for i in range(int(analysis_time))]
    d_data = [random.random() for i in range(int(analysis_time))]
    k_data = [random.random() for i in range(int(analysis_time))]
    a_data = [random.random() for i in range(int(analysis_time))]
    time.sleep(3)


    #preprocessing 
    # ddf = preprocessing.main(analysisstarttime, analysisendtime, filename)
    # result = modelpredict.modelpre( ddf, filename)
    # print(result)

    # rate_list = result['probability'].tolist()
    # rate_list = [0]*20 + rate_list
    # k_data = ddf['k'].tolist()
    # d_data = ddf['d'].tolist()
    # a_data = ddf['a'].tolist()

    print(len(rate_list),len(a_data), len(k_data), len(d_data))

    # context = {'analysis_time': analysis_time,
    context = {'analysis_time': len(rate_list),
                'highlight_rate': rate_list,
                'k_data': k_data,
                'a_data': a_data,
                'd_data': d_data}
    return JsonResponse(context)


class videoeditView(View):
    def get(self, request):
        return render(request, 'highlighteditor/5.index_design.html')

    def post(self, request):
        global filename
        # print('request', request)
        
        upload_form = UploadFileForm(request.POST)
        print('upload_form', upload_form)

        try: 
            file = request.FILES.get('filename', '')
            filename = file._name
            print('filename',filename)
            
            if file == '':
                return HttpResponse('file을 다시 upload해주세요')
            else:

                # 폴더 만들기
                make_dir = filename.replace('.mp4', '')
                
                video_root =f"./static/highlighteditor/{make_dir}/video/" 
               
                try:
                    os.makedirs(f'./static/highlighteditor/{make_dir}')
                except Exception as err:
                    print(err)
                try:
                    os.makedirs(video_root)
                except Exception as err:
                    print(err)
               

                fp = open(settings.BASE_DIR + f'/static/highlighteditor/{make_dir}/video/{filename}' , 'wb')
                for chunk in file.chunks():
                    fp.write(chunk)
                fp.close()

                fp = open(settings.BASE_DIR + f'/static/highlighteditor/save/{filename}' , 'wb')
                for chunk in file.chunks():
                    fp.write(chunk)
                fp.close()

        except:
            filename = request.POST['filename']
        # context= {'filename': filename, 'dirname': make_dir}
        context= {'data': filename}
        time.sleep(3)
        
        return redirect('', context)
     
@csrf_exempt
def savevideo(request):
    global filename
    print('key',request.POST.keys())


    save_start = request.POST.get('save_start', '')
    save_end =request.POST.get('save_end', '')
    
    print('start', save_start)
    print('end', save_end)

    # crop 처리
    crop_filename = filename.replace('.mp4', '_2.mp4')

    old_path = settings.BASE_DIR + f'/static/highlighteditor/save/{filename}'
    new_path = settings.BASE_DIR + f'/static/highlighteditor/save/{crop_filename}'
    # shutil.copy(old_path, new_path)

    # clip_list = []
    # for start, end in zip(startarray, endarray):
    #     start= round(float(start), 2)
    #     end = round(float(end), 2)
    #     print(start, end)
    #     clip_list.append(VideoFileClip(old_path).subclip(start, end))
    # clip1 = VideoFileClip(file_path).subclip(5,7)
    clip = VideoFileClip(old_path).subclip(float(save_start), float(save_end))
    # final_clip = concatenate_videoclips(float(save_start), float(save_end))
    clip.write_videofile(new_path)

    context = {'data': crop_filename,
                'new_path': new_path}
    return  JsonResponse(context)


@csrf_exempt
def startSearch(request):
    global filename
    print('key',request.POST.keys())

    search_start = request.POST.get('search_start', '')
    search_end =request.POST.get('search_end', '')
    
    print('start', search_start)
    print('end',search_end)

    
    search_list = []
    for i in range(int(float(search_end))):
        if i < len(search_end)/2:
            search_list.append(0)
        else:
            search_list.append(1)
    print('len', len(search_list))
    context = {'alltime': int(float(search_end)),
                'search_list': search_list}
    time.sleep(5)            
    return  JsonResponse(context)



