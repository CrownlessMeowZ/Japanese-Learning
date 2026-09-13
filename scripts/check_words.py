import sys
import fitz

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r'C:\Users\Anh Huy\Downloads\List từ vựng quyển hồng.pdf'
doc = fitz.open(pdf_path)
page = doc[1]

# Extract words: (x0, y0, x1, y1, "word", block_no, line_no, word_no)
words = page.get_text('words')
print(f"Total words on page 2: {len(words)}")

# Group words by line (using line_no and block_no, or y0 approximate)
from collections import defaultdict
lines = defaultdict(list)
for w in words:
    # key by block_no and line_no
    lines[(w[5], w[6])].append(w)

for k, line_words in list(lines.items())[:25]:
    line_words.sort(key=lambda x: x[0]) # sort by x0
    text_with_pos = " | ".join(f"{w[4]} (x={w[0]:.1f})" for w in line_words)
    print(f"B{k[0]} L{k[1]}: {text_with_pos}")
