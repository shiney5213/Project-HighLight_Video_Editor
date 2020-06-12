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
from .dataAnalysis import isgame_test
from .dataAnalysis import usingdata

import datetime
import os, time

global filename , data_path, pluscount,  dirname
# filename = 'test30m.mp4'
# pluscount  = 18000
filename = 'test.mp4'
pluscount = 1000
# filename = 'test10m.mp4'
# pluscount = 10000
dirname = filename.replace('.mp4', '')
data_path = f"./static/highlighteditor/{dirname}/data"
try: 
    os.makedirs(data_path)
except Exception as err:
    print(err)

CSRF_COOKIE_SECURE = True

@csrf_exempt
def analysis(request):
    global filename

    # filename = 'test.mp4'
    print('key',request.POST.keys())
    analysis_start = request.POST.get('analysis_start', '0')
    analysis_end =request.POST.get('analysis_end', '1')
 

    print('시간 확인',analysis_start, analysis_end)
    analysis_time = int(float(analysis_end)-float(analysis_start))

    analysisstarttime = int(float(analysis_start))
    analysisstarttime = str(datetime.timedelta(seconds=analysisstarttime))
    analysisendtime = int(float(analysis_end))
    analysisendtime = str(datetime.timedelta(seconds=analysisendtime))
    print('시간 ', analysisstarttime, analysisendtime)


    # 임의로 확률값 결정
    # rate_list = [random.random() for i in range(int(analysis_time))]
    # d_data = [random.random() for i in range(int(analysis_time))]
    # k_data = [random.random() for i in range(int(analysis_time))]
    # a_data = [random.random() for i in range(int(analysis_time))]
    # time.sleep(3)


    #preprocessing 
    ddf = preprocessing.main(analysisstarttime, analysisendtime, filename)
    result = modelpredict.modelpre( ddf, filename, data_path)
    # print(result)

    # rate_list = result['probability'].tolist()
    # rate_list = [0]*(20+int(float(analysis_start))) + rate_list


    all, k_data, d_data, a_data = usingdata.delta(ddf, data_path)
    # k_data = k_data.tolist()
    # d_data = d_data.tolist()
    # a_data = a_data.tolist()
    highlight_path = f'/static/highlighteditor/{dirname}/data/' + 'highlight.png'
    k_path = f'/static/highlighteditor/{dirname}/data/' + 'dk.png'
    d_path = f'/static/highlighteditor/{dirname}/data/' + 'dk.png'
    a_path = f'/static/highlighteditor/{dirname}/data/' + 'dk.png'

    context = {
                'highlight_path': highlight_path,
                'k_data': k_path,
                'a_data': a_path,
                'd_data': d_path}
    return JsonResponse(context)


class videoeditView(View):
    def get(self, request):
        return render(request, 'highlighteditor/6.index_plt.html')
        # return render(request, 'highlighteditor/4.index_loading.html')

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

  
    clip = VideoFileClip(old_path).subclip(float(save_start), float(save_end))
    clip.write_videofile(new_path)

    context = {'data': crop_filename,
                'new_path': new_path}
    return  JsonResponse(context)


@csrf_exempt
def startSearch(request):
    global filename, data_path, pluscount
    print('key',request.POST.keys())

    search_start = request.POST.get('search_start', '')
    search_end =request.POST.get('search_end', '')
    
    print('start', search_start)
    print('end',search_end)

    
    filepath = settings.BASE_DIR + f'/static/highlighteditor/save/{filename}'
    df = isgame_test.startgame(filepath,data_path, pluscount)
    print('len', len(df))
    search_list = df[0].tolist()

    # time_list = [i for i in range(len(df))]

# random
    # search_list = []
    # for i in range(100000):
    #     if i < 100:
    #         search_list.append(1)
    #     elif i <200:
    #         search_list.append(0)
    #     else:
    #         search_list.append(0)
    # print('len', len(search_list))
    # time.sleep(5)       

    # dataset = []
    # for i, j in zip(time_list, search_list):
    #     data = {'x': i, 'y': j}
    #     dataset.append(data)     
    
    searchImg_path = f'/static/highlighteditor/{dirname}/data/' + 'isgame.png'

    context = {'alltime': int(float(search_end)),
                'searchImg_path': searchImg_path,
                }

    return  JsonResponse(context)



