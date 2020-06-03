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
import os

global filename

CSRF_COOKIE_SECURE = True




@csrf_exempt
def analysis(request):
    global filename
    print(request.POST.keys())
    analysis_start_list = request.POST.get('analysis_start_array[]', '')
    analysis_end_list =request.POST.get('analysis_end_array[]', '')
 
    analysis_start_list = analysis_start_list.split(',')
    analysis_end_list=analysis_end_list.split(',')
    analysis_time = int(float(analysis_end_list[0])-float(analysis_start_list[0]))
    print('time',analysis_time, type(analysis_time))

    analysisstarttime = int(float(analysis_start_list[0]))
    analysisstarttime = str(datetime.timedelta(seconds=analysisstarttime))
    analysisendtime = int(float(analysis_end_list[0]))
    analysisendtime = str(datetime.timedelta(seconds=analysisendtime))
    print('시간 ', analysisstarttime, analysisendtime)


    # 임의로 확률값 결정
    # rate_list = [random.random() for i in range(int(analysis_time))]
    # print(len(rate_list), rate_list[0])

    #preprocessing 

    ddf = preprocessing.main(analysisstarttime, analysisendtime, filename)
    result = modelpredict.modelpre( ddf, filename)
    print(result)

    rate_list = result['probability'].tolist()
    rate_list = [0]*20 + rate_list


    # context = {'analysis_time': analysis_time,
    context = {'analysis_time': len(rate_list),
                'rate_list': rate_list}
    return JsonResponse(context)


class downloadView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(downloadView, self).dispatch(*args, **kwargs)

    def get(self, request):
        print('reauest', request)
        # return render(request, 'highlight/3.video_jquery_model.html')
        return render(request, 'highlight/4.video_jquery_ui.html')

    def post(self, request):
        global filename, file
        # print(request.POST.keys())
        starttimearray = request.POST.get('startarray', '')
        endtimearray =request.POST.get('endarray', '')
       
        startarray = starttimearray.split(',')
        endarray = endtimearray.split(',')

        print('startarray', startarray)
        print('endarray', endarray)

        # crop 처리
        crop_filename = filename.replace('.mp4', '_2.mp4')

        old_path = settings.BASE_DIR + f'/static/highlight/save/{filename}'
        new_path = settings.BASE_DIR + f'/static/highlight/save/{crop_filename}'
        # shutil.copy(old_path, new_path)

        clip_list = []
        for start, end in zip(startarray, endarray):
            start= round(float(start), 2)
            end = round(float(end), 2)
            print(start, end)
            clip_list.append(VideoFileClip(old_path).subclip(start, end))
        # clip1 = VideoFileClip(file_path).subclip(5,7)
        # clip2 = VideoFileClip(file_path).subclip(10,12)
        final_clip = concatenate_videoclips(clip_list)
        final_clip.write_videofile(new_path)

        context = {'data': crop_filename}
        return render(request, 'highlight/download.html', context)


# 파일 upload + file 저장 + file 이름 보내기
class uploadView(View):
    def get(self, request):
        return render(request, 'highlight/1.upload_design.html')
        # return render(request, 'highlight/upload.html')

    def post(self, request):
        global filename
        # print('request', request)

        try: 
            file = request.FILES.get('filename', '')

            filename = file._name
            print('filename',filename)
            
            if file == '':
                return HttpResponse('file을 다시 upload해주세요')
            else:

                # 폴더 만들기
                make_dir = filename.replace('.mp4', '')
                
                video_root =f"./static/highlight/{make_dir}/video/" 
               
                try:
                    os.makedirs(f'./static/highlight/{make_dir}')
                except Exception as err:
                    print(err)
                try:
                    os.makedirs(video_root)
                except Exception as err:
                    print(err)
               

                fp = open(settings.BASE_DIR + f'/static/highlight/{make_dir}/video/{filename}' , 'wb')
                for chunk in file.chunks():
                    fp.write(chunk)
                fp.close()

                fp = open(settings.BASE_DIR + f'/static/highlight/save/{filename}' , 'wb')
                for chunk in file.chunks():
                    fp.write(chunk)
                fp.close()

        except:
            filename = request.POST['filename']
        # context= {'filename': filename, 'dirname': make_dir}
        context= {'data': filename}

        return render(request, 'highlight/4.video_jquery_ui.html', context)
        # return render(request, 'highlight/3.video_jquery_model.html', context)




# def index(request):
#     # return HttpResponse('만들기 성공')

# # View class 이용
# class videoView(View):
#     def get(self, request):
#         return render(request, 'highlight/play.html')

#     def post(self, request):
#         data = request.GET['time']
#         print('post', data)
#         data = {time : data}
#         return JsonResponse(data)


# @csrf_exempt
# def download(request):
#     global filename
#     print(request.POST.keys())
#     starttimearray = request.POST.get('startarray', '')
#     endtimearray =request.POST.get('endarray', '')
#     print('start', starttimearray)
#     print('end', endtimearray) 
#     print('filename', filename)

#     # crop 처리
#     # 비디오 읽기

#     old_path = settings.BASE_DIR + f'/static/highlight/save/{filename}'
#     crop_filename = filename.replace('.mp4', '_2.mp4')
#     new_path = settings.BASE_DIR + f'/static/highlight/save/{crop_filename}'

#     shutil.copy(old_path, new_path)

#     context = {'data': crop_filename}
#     return render(request, 'highlight/download.html', context)


