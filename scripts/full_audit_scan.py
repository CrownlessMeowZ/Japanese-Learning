import sys
import json
import fitz
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r'C:\Users\Anh Huy\Downloads\List từ vựng quyển hồng.pdf'
json_path = r'D:\VS Code\Japanese Learning\src\data\vocabulary.json'

doc = fitz.open(pdf_path)
with open(json_path, 'r', encoding='utf-8') as f:
    vocab = json.load(f)

# Page ranges for 15 lessons
ranges = {
    1: (2, 3), 2: (4, 7), 3: (8, 11), 4: (12, 14), 5: (15, 17),
    6: (18, 20), 7: (21, 24), 8: (25, 28), 9: (29, 31), 10: (32, 34),
    11: (35, 36), 12: (37, 39), 13: (40, 41), 14: (42, 44), 15: (45, 46)
}

# Collect existing words per lesson
existing_by_lesson = {}
for l_id, items in vocab.items():
    existing_by_lesson[int(l_id)] = set()
    for w in items:
        if w.get('kanji'): existing_by_lesson[int(l_id)].add(w['kanji'].strip())
        if w.get('hiragana'): existing_by_lesson[int(l_id)].add(w['hiragana'].strip())

missing_candidates = []

for l_id, (p_start, p_end) in ranges.items():
    for p_num in range(p_start - 1, p_end):
        page = doc[p_num]
        words = page.get_text('words')
        
        # Group words by line based on y0 with a tolerance of 3 points
        lines_dict = {}
        for w in words:
            x0, y0, x1, y1, text, b_no, l_no, w_no = w
            # Find an existing line with close y0
            found_y = None
            for y in lines_dict:
                if abs(y - y0) <= 4:
                    found_y = y
                    break
            if found_y is None:
                found_y = y0
                lines_dict[found_y] = []
            lines_dict[found_y].append(w)
            
        for y, line_words in sorted(lines_dict.items()):
            line_words.sort(key=lambda x: x[0])
            full_line = " ".join(w[4] for w in line_words)
            
            # Filter out page headers, page numbers, lesson headers
            if re.match(r'^\d{1,2}$', full_line): continue
            if '第' in full_line and '課' in full_line: continue
            if full_line in ['新出語', 'NEW WORD', 'LIST']: continue
            
            # Check if this line has Vietnamese words (usually x > 320)
            vn_words = [w[4] for w in line_words if w[0] >= 320]
            jp_words = [w[4] for w in line_words if w[0] < 320]
            
            if vn_words and jp_words:
                jp_str = "".join(jp_words)
                vn_str = " ".join(vn_words)
                # Check if any part of jp_words is in existing vocabulary for this lesson
                matched = any(w in existing_by_lesson[l_id] for w in jp_words)
                if not matched and not any(jp_str == w['kanji'] or jp_str == w['hiragana'] for w in vocab[str(l_id)]):
                    # Also check against all words in lesson
                    missing_candidates.append((l_id, p_num + 1, jp_words, vn_str))

print(f"Total potential missing lines detected: {len(missing_candidates)}")
for m in missing_candidates:
    print(f"Lesson {m[0]} (p.{m[1]}): JP={m[2]} --> VN='{m[3]}'")
