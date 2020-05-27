from django.shortcuts import render, HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
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

global filename

CSRF_COOKIE_SECURE = True


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


class downloadView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(downloadView, self).dispatch(*args, **kwargs)

    def get(self, request):
        print('reauest', request)
        return render(request, 'highlight/video_jquery.html')

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
        return render(request, 'highlight/upload.html')

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
                fp = open(settings.BASE_DIR + f'/static/highlight/save/{filename}' , 'wb')
                for chunk in file.chunks():
                    fp.write(chunk)
                fp.close()

        except:
            filename = request.POST['filename']

        context= {'data': filename}

        return render(request, 'highlight/video_jquery.html', context)



# class downloadView(View):
#     def get(self, request):
#         return render(request, 'highlight/upload.html')

#     def post(self, request):
#         print('request', request)

#         try: 
#             file = request.FILES.get('filename', '')
#             filename = file._name
#             print('filename',filename)
            
#             if file == '':
#                 return HttpResponse('file을 다시 upload해주세요')
#             else:
#                 fp = open(settings.BASE_DIR + f'/static/highlight/save/{filename}' , 'wb')
#                 for chunk in file.chunks():
#                     fp.write(chunk)
#                 fp.close()

#         except:
#             filename = request.POST['filename']

#         context= {'data': filename}

#         return render(request, 'highlight/video_jquery.html', context)



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

       

# # 함수 따로 만들기
# def video_edit(request):
#     # return render(request, 'highlight/play_videotag.html')
#     return render(request, 'highlight/video_jquery.html')

# def output(request):
#     starttime = request.GET.get('starttime', '0')
#     endtime = request.GET.get('endtime', '0')

#     data = {'starttime' : starttime, 'endtime': endtime}
#     print(data)
#     # return render(request, 'heighlight/result.html', data)
#     return JsonResponse(data)

# def upload(request):

#     return render(request, 'highlight/upload.html')
