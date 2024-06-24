import asyncio

from hume import HumeVoiceClient, MicrophoneInterface

async def main() -> None:
    client = HumeVoiceClient("X900uPaZZhCNCcL3nurLKNlnrAREyHG7GQTkChtcxvo9mets")

    async with client.connect() as socket:
        await MicrophoneInterface.start(socket)

asyncio.run(main())
