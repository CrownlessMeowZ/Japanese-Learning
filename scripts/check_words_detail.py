import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open(r'D:\VS Code\Japanese Learning\src\data\vocabulary.json', 'r', encoding='utf-8') as f:
    vocab = json.load(f)

for lesson_id, words in vocab.items():
    has_eiga = [w for w in words if 'えいが' in w.get('hiragana', '') or '映画' in w.get('kanji', '')]
    if has_eiga:
        print(f"Found eiga in Lesson {lesson_id}: {has_eiga}")

    has_yoroshiku = [w for w in words if 'よろしく' in w.get('hiragana', '') or 'よろしく' in w.get('kanji', '')]
    if has_yoroshiku:
        print(f"Found yoroshiku in Lesson {lesson_id}: {has_yoroshiku}")
