# Run

Python versions >=3.7,<3.11

```bash
replace the .env.copy to .env and replace the values with your own
```

```bash
pip install -r requirements.txt
```

```bash
uvicorn app.main:app --reload
```

the local endpoint for text2text is http://127.0.0.1:8000/api/analyze_text

```bash
input example:
{
  "text": "I am a software engineer"
}
``` 


<!-- brew install mecab -->
<!-- brew install portaudio  -->
