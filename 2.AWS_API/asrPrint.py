#
# asrPrint.py
# Copyright Chris Hare, 2019
#
import json
import sys
import os
from optparse import OptionParser

def get_transcript(**kwargs):
    """
    get_transcript(parsed=JSON string)
    parameters: JSON string
    returns: string containing the transcript
    """
    result = ""
    #
    # Run through the json document looking for the results item
    #
    parsed = kwargs['parsed']
    for k,v in parsed.items():
        #print(f"k = {k}")
        if k == "results":
            #
            # process each of the items in the result key.  Each 
            # item is a piece of transcribed audio text
            #
            for x,y in parsed[k].items():
                if x == "transcripts":
                    for l in range(len(parsed[k]['transcripts'])):
                        asr = parsed[k]['transcripts'][l]['transcript']
                        result = result + asr + "\n"
    return(result)


def get_timestamped(**kwargs):
    """
    get_timestamped(parsed=JSON string)
    parameters: parsed = JSON string
    returns: string with all words, time stamps and confidence levels
    """
    result = ""
    #
    # Run through the json document looking for the results item
    #
    parsed = kwargs['parsed']
    for k,v in parsed.items():
        if k == "results":
            #
            # process each of the items in the result key.  Each 
            # item is a piece of transcribed audio text
            #
            for l in range(len(parsed[k]['items'])):
                word = dict(parsed[k]['items'][l])
                try:
                    # get the start time
                    s_t = str(word['start_time'])
                except KeyError as e:
                    # set to zero if not detected
                    s_t = "0"
                try:
                    # get the end-time
                    e_t = str(word['end_time'])
                except KeyError as e:
                    # set to zero if not detected
                    e_t = "0"
                alt = word['alternatives'][0]['content']
                conf = word['alternatives'][0]['confidence']
                result = result + s_t + " " + e_t + " " + conf + " " + alt + "\n"
    return(result)


def main():
    #
    # Set up and parse command line options
    #
    usage = "usage: %prog [options] asrOutput1 [asrOutput2 ...]"
    parser = OptionParser()
    parser.add_option("-t", "--transcript",
                  action="store_true", dest="transcript", default=False,
                  help="return the transcript text")
    parser.add_option("-x", "--timestamped",
                  action="store_true", dest="timestamped", default=False,
                  help="return the timestamp per word")
    parser.add_option("-s", "--save",
                  action="store_true", dest="save", default=False,
                  help="Save the results to a file.")
    parser.add_option("-q", "--quiet",
                  action="store_true", dest="quiet", default=False,
                  help="Be quiet")

    (options, args) = parser.parse_args()
    
    if options.transcript is False and options.timestamped is False:
        parser.error("You must provide either -t, -x or both.")
        sys.exit(1)
    #
    # Validate if we have any arguments
    #
    if len(args) < 1:
        #
        # No template on comand line, quit
        #
        parser.error("At least one asrOutput file must be provided.")
        sys.exit(1)
    
    for x in range(len(args)):
        if options.quiet is False:
            print(f"printing {args[x]}")
        
        #
        # read each of the JSON documents from the command line
        #
        with open(args[x], 'r') as handle:
            parsed = json.load(handle)
            if options.timestamped is True:
                results = get_timestamped(parsed=parsed)
                if options.save is True:
                    print("saving timestamped words to file timestamped.txt")
                    with open(args[x] + "_timestamped.txt", "w") as handle:
                        handle.write(results)
                    handle.close()
                else:
                    print(results)
            if options.transcript is True:
                results = get_transcript(parsed=parsed)
                if options.save is True:
                    print("saving transcript to file transcript.txt")
                    with open(args[x] + "_transcript.txt", "w") as handle:
                        handle.write(results)
                    handle.close()
                else:
                    print(results)


if __name__ == "__main__":
    main()
    
