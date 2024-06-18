import os
import azure.cognitiveservices.speech as speechsdk


import os
import azure.cognitiveservices.speech as speechsdk


speech_config = speechsdk.SpeechConfig(
    subscription="d9e1868008cf477eb9cad5ddca6e4994", region="eastus"
)
audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)

# The neural multilingual voice can speak different languages based on the input text.
speech_config.speech_synthesis_voice_name = "en-US-AvaMultilingualNeural"

speech_synthesizer = speechsdk.SpeechSynthesizer(
    speech_config=speech_config, audio_config=audio_config
)

# Get text from the console and synthesize to the default speaker.
print("Enter some text that you want to speak >")
text = input()


# for line in text.split("."):
#     speech_synthesizer.speak_text_async(line).get()

speech_synthesis_result = speech_synthesizer.speak_text_async(text).get()

print("+++++", speech_synthesis_result)

# if speech_synthesis_result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
#     print("Speech synthesized for text [{}]".format(text))
# elif speech_synthesis_result.reason == speechsdk.ResultReason.Canceled:
#     cancellation_details = speech_synthesis_result.cancellation_details
#     print("Speech synthesis canceled: {}".format(cancellation_details.reason))
#     if cancellation_details.reason == speechsdk.CancellationReason.Error:
#         if cancellation_details.error_details:
#             print("Error details: {}".format(cancellation_details.error_details))
#             print("Did you set the speech resource key and region values?")


from RealtimeTTS import TextToAudioStream, SystemEngine, AzureEngine, ElevenlabsEngine

engine = AzureEngine(
    speech_key="d9e1868008cf477eb9cad5ddca6e4994",
    service_region="eastus",
    voice="en-US-AvaMultilingualNeural",
)  # replace with your TTS engine
stream = TextToAudioStream(engine)
stream.feed(
    "OpenAI's API supports streaming responses. You can use this feature to receive text in chunks."
)
stream.play_async()
print("+++++", stream.play_async())
