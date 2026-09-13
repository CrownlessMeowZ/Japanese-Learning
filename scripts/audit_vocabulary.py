import sys
import json
import fitz
import re
from collections import defaultdict

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r'C:\Users\Anh Huy\Downloads\List từ vựng quyển hồng.pdf'
json_path = r'D:\VS Code\Japanese Learning\src\data\vocabulary.json'

doc = fitz.open(pdf_path)
with open(json_path, 'r', encoding='utf-8') as f:
    json_vocab = json.load(f)

# Lesson page map:
# 1: 2-3
# 2: 4-7
# 3: 8-11
# 4: 12-14
# 5: 15-17
# 6: 18-20
# 7: 21-24
# 8: 25-28
# 9: 29-31
# 10: 32-34
# 11: 35-36
# 12: 37-39
# 13: 40-41
# 14: 42-44
# 15: 45-46

lesson_page_ranges = {
    1: (2, 3),
    2: (4, 7),
    3: (8, 11),
    4: (12, 14),
    5: (15, 17),
    6: (18, 20),
    7: (21, 24),
    8: (25, 28),
    9: (29, 31),
    10: (32, 34),
    11: (35, 36),
    12: (37, 39),
    13: (40, 41),
    14: (42, 44),
    15: (45, 46)
}

print("=== AUDIT: EXTRACTING DIRECTLY FROM PDF ===")

total_pdf_words = 0
pdf_words_by_lesson = {}

for lesson, (start_p, end_p) in lesson_page_ranges.items():
    lesson_items = []
    for p_num in range(start_p - 1, end_p):
        page = doc[p_num]
        blocks = page.get_text('blocks')
        
        # Sort blocks vertically by y0
        blocks.sort(key=lambda b: (b[1], b[0]))
        
        for b in blocks:
            x0, y0, x1, y1, text, b_no, b_type = b
            text = text.strip()
            if not text:
                continue
            
            # Skip page numbers (single small number at page top)
            if re.match(r'^\d{1,2}$', text):
                continue
            
            # Skip Lesson header banners e.g. "第１課", "第２課", "第１０課 ことば"
            if re.search(r'第\s*\d+\s*課', text):
                continue
                
            # Skip section banners that are not vocab rows, e.g. "私の名前・国・仕事"
            # In Dekiru Nihongo, section titles usually don't have Vietnamese translation or separate reading column in the same block
            lines = [l.strip() for l in text.split('\n') if l.strip()]
            
            # Check if this block looks like a vocabulary entry:
            # Usually has at least 2 lines (Word + Meaning or Word + Kana + Meaning)
            # Or contains tabs / multiple spaces
            # Let's see what blocks we get
            lesson_items.append((p_num + 1, b, lines))
            
    print(f"Lesson {lesson}: Raw blocks detected: {len(lesson_items)} | JSON words: {len(json_vocab.get(str(lesson), []))}")
