import sys
import json
import fitz

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r'C:\Users\Anh Huy\Downloads\List từ vựng quyển hồng.pdf'
json_path = r'D:\VS Code\Japanese Learning\src\data\vocabulary.json'

doc = fitz.open(pdf_path)
with open(json_path, 'r', encoding='utf-8') as f:
    json_vocab = json.load(f)

l1_words = json_vocab['1']
l1_kanji_set = set(w['kanji'] for w in l1_words)
l1_hira_set = set(w['hiragana'] for w in l1_words)

print(f"Lesson 1 JSON has {len(l1_words)} words.")

# Inspect all blocks on Page 2 and 3
for p_num in [1, 2]:
    page = doc[p_num]
    blocks = page.get_text('blocks')
    blocks.sort(key=lambda b: (b[1], b[0]))
    print(f"\n--- Page {p_num + 1} (total blocks: {len(blocks)}) ---")
    for b in blocks:
        text = b[4].strip()
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        line_repr = " // ".join(lines)
        # Check if matched in JSON
        matched = any(l in l1_kanji_set or l in l1_hira_set for l in lines)
        status = "MATCH" if matched else "NON-MATCH"
        print(f"[{status}] (y={b[1]:.1f}) {line_repr}")
