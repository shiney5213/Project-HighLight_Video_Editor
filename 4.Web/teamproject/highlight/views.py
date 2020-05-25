from django.shortcuts import render, HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, JsonResponse
from django.conf import settings
from django.views import View
from . import apps

# Create your views here.

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

       

# 함수 따로 만들기
def input(request):
    # return render(request, 'highlight/play_videotag.html')
    return render(request, 'highlight/video_jquery.html')


def output(request):
    starttime = request.GET.get('starttime', '0')
    endtime = request.GET.get('endtime', '0')

    data = {'starttime' : starttime, 'endtime': endtime}
    print(data)
    # return render(request, 'heighlight/result.html', data)
    return JsonResponse(data)
