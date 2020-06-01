import boto3
import requests
import pickle
from pydub import AudioSegment
import json
import logging
from botocore.exceptions import ClientError
import matplotlib.pyplot as plt
import cv2
import numpy as np
import time
import pandas as pd
import moviepy.editor as mp
import os


# Sound --> Data(Please read the first paragragh above for running this operation)
AudioSegment.converter = "C:/Program Files/ffmpeg-20200515-b18fd2b-win64-static/bin/ffmpeg.exe"
AudioSegment.ffmpeg = "C:/Program Files/ffmpeg-20200515-b12b053-win64-static/bin/ffmpeg.exe"
AudioSegment.ffprobe = "C:/Program Files/ffmpeg-20200515-b12b053-win64-static/bin/ffprobe.exe"


# Transforming time
def doubleDigit(num):
    if num < 10:
        return '0' + str(num)
    else:
        return str(num)

def time_msec(time):
    time_split = time.split(':')
    if len(time_split) == 2:
        sec = int(time_split[0]) * 60 + int(time_split[1])
        return sec * 1000
    elif len(time_split) == 3:
        sec = (int(time_split[0]) * 60 + int(time_split[1])) * 60 + int(time_split[2])
        return sec * 1000

# 이건 밀리세컨드가 아니라 초로 바꾸는 함수!!(주의)
def time_sec(time):
    time_split = time.split(':')
    if len(time_split) == 2:
        sec = int(time_split[0]) * 60 + int(time_split[1])
        return sec
    elif len(time_split) == 3:
        sec = (int(time_split[0]) * 60 + int(time_split[1])) * 60 + int(time_split[2])
        return sec


def msec_time(msec):
    sec = msec / 1000
    m = sec // 60
    h = m // 60
    m = m % 60
    s = sec % 60
    return str(doubleDigit(int(h))) + ':' + str(doubleDigit(int(m))) + ':' + str(doubleDigit(int(s)))

def sec_time(sec):
    m = sec // 60
    h = m // 60
    m = m % 60
    s = sec % 60
    return str(doubleDigit(h)) + ':' + str(doubleDigit(m)) + ':' + str(doubleDigit(s))



def sound_info(file_name, starttime, endtime):
    raw_sound = file_name
    sound = AudioSegment.from_file(raw_sound)
    List = []
    for i in range(int(len(sound) / 1000)):
        List.append(sound[1 + 1000 * i:1000 * i + 1000].max)

    t1 = time_sec(starttime)
    t2 = time_sec(endtime)
    List = [List[i] for i in range(t1, t2 + 1)]
    print("가장 큰 db : ", max(List))
    print("영상 음성 길이 : ", len(sound))

def sound2data(file_name, starttime, endtime):  # file_name은 디렉토리까지 확실히 표현할 것!
    raw_sound = file_name
    sound = AudioSegment.from_file(raw_sound)
    List = []
    for i in range(int(len(sound) / 1000)):
        List.append(sound[1 + 1000 * i:1000 * i + 1000].max)

    voice = pd.DataFrame(List)
    voice.rename(columns={0: 'sound'}, inplace=True)
    voice['second'] = voice.index  # 초단위의 컬럼 만들기
    voice['time'] = voice['second'].apply(sec_time)  # time 컬럼 만들기

    t1 = time_sec(starttime)
    t2 = time_sec(endtime)

    voice = voice.iloc[t1:t2 + 1, :]  # starttime에서부터 endtime까지만 남기기
    voice.drop(['second'], axis='columns', inplace=True)  # second 컬럼 삭제hh
    return voice

def detect_text(photo, bucket):
    client = boto3.client('rekognition',
                          aws_access_key_id=AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                          region_name=AWS_DEFAULT_REGION
                          )

    height = 1
    left = 0
    top = 0
    width = 0.34

    response = client.detect_text(Image={'S3Object': {'Bucket': bucket_name, 'Name': photo}},
                                  Filters={'RegionsOfInterest': [
                                      {'BoundingBox': {'Height': height, 'Left': left, 'Top': top, 'Width': width}}]})

    textDetections = response['TextDetections']

    try:
        text = [textDetections[0]['DetectedText'], textDetections[1]['DetectedText'], textDetections[2]['DetectedText'],
                textDetections[3]['DetectedText']]

        text2 = [textDetections[0]['DetectedText'], 0, textDetections[1]['DetectedText'],
                 textDetections[2]['DetectedText']]

        if len(textDetections) == 6:
            return text2
        return text
    except:
        return [np.nan, np.nan, np.nan, np.nan]

# Analyzing the emotion from a face.
def detect_faces(photo, bucket):
    client = boto3.client('rekognition',
                          aws_access_key_id=AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                          region_name=AWS_DEFAULT_REGION
                          )

    response = client.detect_faces(Image={'S3Object': {'Bucket': bucket, 'Name': photo}}, Attributes=['ALL'])
    try:
        emotions = response['FaceDetails'][0]['Emotions']

        return emotions
    except Exception as ex:
        print('예외 발생', ex)
        return [0]


# Making static images from a dynamic image for the function 'detect_text'.
def makeimage(frame):
    ######################### 점수, 골드 #######################
    score1 = frame[:25, 1547:1547 + 33]
    score2 = frame[:25, 1595:1595 + 32]


    bg = np.zeros((50, 65, 3), np.uint8) + 0
    bg[:25, 20:53] = score1
    bg[25:, 20:52] = score2

    kda = frame[:25, 1665:1730]
    gold = frame[1047:1072, 1175:1240]
    imgst = np.vstack((bg, kda, gold))
    fx = fy = 4
    imgst = cv2.resize(imgst, dsize=(0, 0), fx=fx, fy=fy)

    ######################## 얼굴 #############################
    face = frame[880:, 1300:1630]
    fx = fy = 2
    face = cv2.resize(face, dsize=(0, 0), fx=fx, fy=fy)
    imgst = np.hstack((imgst, face))
    return imgst

# Processing a dynamic image.(Using detect_text, detect_faces)
# 영상 1초단위로 쪼개고 버켓에 업로드
def process(file, starttime, endtime):
    file =  file

    cap = cv2.VideoCapture(file)

    starttime = starttime
    endtime = endtime

    timemsec = time_msec(starttime)
    cap.set(cv2.CAP_PROP_POS_MSEC, timemsec)

    i = 0
    datalist = []
    while (cap.isOpened):
        i += 1
        print(i)
        ret, frame = cap.read()
        print('ret', ret, frame)
        if ret:
            print('yes')

            # 사진 자르고 합치기
            frame = makeimage(frame)

            # 사진 파일 로컬에 저장
            fn = file[-13:-4] + '_' + str(i) + '.jpg'
            cv2.imwrite('./image/' + fn, frame)

            # 사진 파일 bucket에 저장
            with open('./image/' + fn, 'rb') as f:
                s3.upload_fileobj(f, bucket_name, fn)

            # OCR face API 사용
            photo = fn

            text = detect_text(photo, bucket_name)
            face = detect_faces(photo, bucket_name)
            vid_time = [cap.get(cv2.CAP_PROP_POS_MSEC)]

            data = text + face + vid_time
            if i % 30 == 0:
                print(data, vid_time)
                print()
            datalist.append(data)

            timemsec += 1000
            cap.set(cv2.CAP_PROP_POS_MSEC, timemsec)

            if vid_time[0] > time_msec(endtime):
                break
        else:
            break
    return datalist

def main(starttime ='01:00:00' , endtime =  '01:01:00', filename = '20200506_Faker_612874923.mp4' ):
    
    AWS_ACCESS_KEY_ID = 'AKIAS3UCLIDDHDXHMWOZ'
    AWS_SECRET_ACCESS_KEY = 'RUsIGlGgRRguaXUaCnUVRR+UPKXcY1a0g7EsqpNI'
    AWS_DEFAULT_REGION = 'ap-northeast-2'
    bucket_name = 'eyshin'

    s3 = boto3.client('s3',
                    aws_access_key_id=AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                    region_name=AWS_DEFAULT_REGION
                    )
    

    video_root ="../../static/highlight/video/" 
    audio_root ="../../static/highlight/audio/" 
    # data_root ="../../static/highlight/data/" 
    data_root ="" 
    
    
    alltime_list = [[[str(starttime), str(endtime) ]]]

    file_name_mp4 = filename
    file_name_mp3 = file_name_mp4.replace('mp4', 'mp3')
    file_mp4 = video_root + file_name_mp4
    file_mp3 = audio_root + file_name_mp3

    starttime = alltime_list[0][0][0]
    endtime = alltime_list[0][0][1]

    datalist = process(file_mp4, starttime, endtime)
    print('datalist',len(datalist))
    with open(data_root + 'datalist.txt', 'wb') as f:
        pickle.dump(datalist, f)

    with open(data_root + 'datalist.txt', 'rb') as f:
        datalist = pickle.load(f)
    dlist = datalist.copy()

    for data in dlist:
        try:
            emo = [0]*8
            for i in data[4:12]:
        #         print(i)
                if i['Type'] == 'HAPPY':
                    emo[0]=i['Confidence']
                elif i['Type'] == 'SAD':
                    emo[1]=i['Confidence']
                elif i['Type'] == 'ANGRY':
                    emo[2]=i['Confidence']
                elif i['Type'] == 'CALM':
                    emo[3]=i['Confidence']
                elif i['Type'] == 'DISGUSTED':
                    emo[4]=i['Confidence']
                elif i['Type'] == 'FEAR':
                    emo[5]=i['Confidence']
                elif i['Type'] == 'SURPRISED':
                    emo[6]=i['Confidence']
                elif i['Type'] == 'CONFUSED':
                    emo[7]=i['Confidence']
            data[4:12]=emo[:]
        except:
            continue

    df = pd.DataFrame(dlist)

    # kda 나누기
    df['k']=df[2].str.split('/').str[0]
    df['d']=df[2].str.split('/').str[1]
    df['a']=df[2].str.split('/').str[2]

    # 숫자인지 확인. 아닐경우 Na
    df[0]=pd.to_numeric(df[0], errors='coerce')
    df[1]=pd.to_numeric(df[1], errors='coerce')
    df[3]=pd.to_numeric(df[3], errors='coerce')
    df['k']=pd.to_numeric(df['k'], errors='coerce')
    df['d']=pd.to_numeric(df['d'], errors='coerce')
    df['a']=pd.to_numeric(df['a'], errors='coerce')
    del df[0],df[1]

    df.dropna(inplace=True)

    # 변화량을 기반으로 df 생성
    dff = pd.DataFrame(columns=['time','k','d','a','gold','ha','sa','an','ca','dis','fe','sup','conf'])
    dff['time'] = df[12].map(msec_time)
    dff['k'] = df['k']
    dff['d'] = df['d']
    dff['a'] = df['a']
    dff['gold'] = df[3]
    dff['ha'] = df[4]
    dff['sa'] = df[5]
    dff['an'] = df[6]
    dff['ca'] = df[7]
    dff['dis'] = df[8]
    dff['fe'] = df[9]
    dff['sup'] = df[10]
    dff['conf'] = df[11]

    dff.to_excel(data_root + 'dff.xlsx')

    with open(data_root + 'dff.txt', 'wb') as f:
        pickle.dump(dff, f)

    with open(data_root + 'dff.txt', 'rb') as f:
        dff = pickle.load(f)

    dff.to_csv(data_root + 'result.csv')

    return 'sucess'

    
    





