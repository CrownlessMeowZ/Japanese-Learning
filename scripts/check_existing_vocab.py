import re
import json

with open(r'D:\VS Code\Japanese Learning\src\data\vocabulary.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Match export const vocabularyData = { ... };
match = re.search(r'export\s+const\s+vocabularyData\s*=\s*(\{[\s\S]*?\});\s*$', content)
if match:
    # Need to convert JS object to JSON (handling potential JS keys or formatting)
    js_str = match.group(1)
    try:
        data = json.loads(js_str)
        print("Existing vocabularyData count by lesson:")
        total = 0
        for k in sorted(data.keys(), key=lambda x: int(x)):
            count = len(data[k])
            total += count
            print(f"  Lesson {k}: {count} words")
        print(f"Total existing words: {total}")
    except Exception as e:
        print("JSON parse error:", e)
else:
    print("Could not match vocabularyData regex")
