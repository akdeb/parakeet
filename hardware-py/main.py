import asyncio

from hume import HumeVoiceClient, MicrophoneInterface

async def main() -> None:
    client = HumeVoiceClient()

    async with client.connect() as socket:
        await MicrophoneInterface.start(socket)

asyncio.run(main())
