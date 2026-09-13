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

ranges = {
    1: (2, 3), 2: (4, 7), 3: (8, 11), 4: (12, 14), 5: (15, 17),
    6: (18, 20), 7: (21, 24), 8: (25, 28), 9: (29, 31), 10: (32, 34),
    11: (35, 36), 12: (37, 39), 13: (40, 41), 14: (42, 44), 15: (45, 46)
}

def normalize_vn(text):
    text = text.lower()
    text = re.sub(r'[\(\)\[\]/.,:!?～~-]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

actually_missing = []

for l_id, (p_start, p_end) in ranges.items():
    json_meanings = [normalize_vn(w['meaning']) for w in vocab[str(l_id)]]
    json_kanjis = [re.sub(r'[［］\d\s]', '', w['kanji']) for w in vocab[str(l_id)]]
    json_hiras = [re.sub(r'[［］\d\s]', '', w['hiragana']) for w in vocab[str(l_id)]]
    
    for p_num in range(p_start - 1, p_end):
        page = doc[p_num]
        words = page.get_text('words')
        
        # Group by y
        lines_dict = {}
        for w in words:
            x0, y0, x1, y1, text, b_no, l_no, w_no = w
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
            
            if re.match(r'^\d{1,2}$', full_line): continue
            if '第' in full_line and '課' in full_line: continue
            if full_line in ['新出語', 'NEW WORD', 'LIST']: continue
            
            vn_words = [w[4] for w in line_words if w[0] >= 320]
            jp_words = [w[4] for w in line_words if w[0] < 320]
            
            if vn_words and jp_words:
                raw_vn = " ".join(vn_words)
                norm_vn = normalize_vn(raw_vn)
                raw_jp = "".join(jp_words)
                clean_jp = re.sub(r'[［］\d\s]', '', raw_jp)
                
                # Check if matched by meaning or by kanji/hiragana
                matched = False
                for j_m in json_meanings:
                    if norm_vn in j_m or j_m in norm_vn:
                        matched = True
                        break
                if not matched:
                    for j_k in json_kanjis:
                        if j_k and (j_k in clean_jp or clean_jp in j_k):
                            matched = True
                            break
                if not matched:
                    for j_h in json_hiras:
                        if j_h and (j_h in clean_jp or clean_jp in j_h):
                            matched = True
                            break
                            
                if not matched:
                    actually_missing.append((l_id, p_num + 1, raw_jp, raw_vn))

print(f"Total truly missing items: {len(actually_missing)}")
for m in actually_missing:
    print(f"Lesson {m[0]} (page {m[1]}): JP='{m[2]}' | VN='{m[3]}'")
