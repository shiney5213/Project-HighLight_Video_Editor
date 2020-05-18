from django.shortcuts import render, HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, JsonResponse
from django.conf import settings
from django.views import View

# Create your views here.


# def index(request):
#     # return HttpResponse('만들기 성공')
#     return render(request, 'highlight/play.html')


class videoView(View):
    def get(self, request):
        return render(request, 'highlight/play.html')

    def post(self, request):
        return HttpResponse('잘 받앗음!')

        # return render(request, 'highlight/play.html')

