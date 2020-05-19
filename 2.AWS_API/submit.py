import time
import boto3
import sys
from optparse import OptionParser
from datetime import datetime


def submit(**kwargs):
    jobname = kwargs['jobname']
    job_url = kwargs['mediaurl']
    format = kwargs['format']
    language = kwargs['language']
    sample = int(kwargs['sample'])
    
    transcribe = boto3.client('transcribe')
    try:
        response = transcribe.start_transcription_job(
            TranscriptionJobName=jobname,
            Media={'MediaFileUri': job_url},
            MediaFormat=format,
            LanguageCode=language,
            MediaSampleRateHertz=sample)
    except Exception as e:
        print(e)
        sys.exit()
        
    print(f"Request submitted: {response['ResponseMetadata']['RequestId']}")
    return
    
def status(**kwargs):
    jobname = kwargs['jobname']
    start = datetime.now()
    transcribe = boto3.client('transcribe')
    while True:
        status = transcribe.get_transcription_job(TranscriptionJobName=jobname)
        if status['TranscriptionJob']['TranscriptionJobStatus'] in ['COMPLETED', 'FAILED']:
            end = datetime.now()
            break
        print("Not ready yet...")
        time.sleep(5)
    print(f"processing time is {end - start}")
    print(f"transcript URL is {status['TranscriptionJob']['Transcript']['TranscriptFileUri']}")
    return

def main():
    #
    # Set up and parse command line options.
    #
    usage = "usage: %prog [options] asrOutput1 [asrOutput2 ...]"
    parser = OptionParser()
    parser.add_option("-j", "--jobname",
                  action="store", dest="jobname", 
                  help="Provide a name for the transcription job")
    parser.add_option("-m", "--mediaurl",
                  action="store", dest="mediaurl", 
                  help="Provide the URL to the source media")
    parser.add_option("-f", "--format",
                  action="store", dest="format", 
                  help="Provide the format for the source media")
    parser.add_option("-l", "--language",
                  action="store", dest="language", 
                  help="Provide the language for the source media")
    parser.add_option("-s", "--sample",
                  action="store", dest="sample", 
                  help="Provide the sample rate for the source media.")
    parser.add_option("-q", "--quiet",
                  action="store_true", dest="quiet", default=False,
                  help="Be quiet")
    parser.add_option("-x", "--xray",
                  action="store_true", dest="xray", default=False,
                  help="Monitor the status of the transcription job")

    (options, args) = parser.parse_args()
    
    
    if options.jobname is None:
        parser.error("A job name is required using -j or --jobname")
        sys.exit(1)
    elif options.mediaurl is None:
        parser.error("A URL to the source media is required using -m or --mediaurl")
        sys.exit(1)
    elif options.format is None:
        parser.error("You must specify the format of the source media using -f or --format")
        sys.exit(1)
    elif options.language is None:
        parser.error("Please specify the language using -l or --language")
        sys.exit(1)
    elif options.sample is None:
        parser.error("the sample rate of the source media is required using -s or --sample")
        sys.exit(1)

    submit(jobname=options.jobname, mediaurl=options.mediaurl, format=options.format,
            sample=options.sample, language=options.language)

    if options.xray is True:
        status(jobname=options.jobname)

    return


if __name__ == "__main__":
    main()
