#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
=============================================================================
ETL Pipeline: Extract Vocabulary from PDF (List từ vựng quyển hồng.pdf)
Output: src/data/vocabulary.json
=============================================================================
"""

import sys
import json
import re
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Chuẩn hóa các lỗi vỡ ký tự tiếng Việt do font PDF (khoảng trắng giữa chữ cái và dấu)
VIETNAMESE_SPACE_FIXES = [
    (r'\bb\s+ạn\b', 'bạn'),
    (r'\bQu\s+ốc\b', 'Quốc'),
    (r'\bqu\s+ốc\b', 'quốc'),
    (r'\bĐ\s+ất\b', 'Đất'),
    (r'\bđ\s+ất\b', 'đất'),
    (r'\bn\s+ước\b', 'nước'),
    (r'\bth\s+ông\b', 'thông'),
    (r'\bph\s+ổ\b', 'phổ'),
    (r'\bngh\s+ỉ\b', 'nghỉ'),
    (r'\bđ\s+ược\b', 'được'),
    (r'\bn\s+ăm\b', 'năm'),
    (r'\bth\s+áng\b', 'tháng'),
    (r'\bti\s+ếng\b', 'tiếng'),
    (r'\bnh\s+ật\b', 'nhật'),
    (r'\bkh\s+ách\b', 'khách'),
    (r'\bkh\s+oảng\b', 'khoảng'),
    (r'\bth\s+ời\b', 'thời'),
    (r'\bng\s+ười\b', 'người'),
    (r'\btr\s+ường\b', 'trường'),
    (r'\bh\s+ọc\b', 'học'),
    (r'\bb\s+ài\b', 'bài'),
    (r'\bv\s+iệc\b', 'việc'),
    (r'\bchu\s+ẩn\b', 'chuẩn'),
    (r'\bb\s+ữa\b', 'bữa'),
    (r'\bch\s+iếc\b', 'chiếc'),
    (r'\bc\s+ái\b', 'cái'),
    (r'\bh\s+àng\b', 'hàng'),
    (r'\bqu\s+án\b', 'quán'),
    (r'\bt\s+ầng\b', 'tầng'),
    (r'\bph\s+òng\b', 'phòng'),
]

def clean_vietnamese_spaces(text: str) -> str:
    if not text:
        return ""
    cleaned = text
    for pattern, replacement in VIETNAMESE_SPACE_FIXES:
        cleaned = re.sub(pattern, replacement, cleaned, flags=re.IGNORECASE)
    # Loại bỏ khoảng trắng kép thừa
    cleaned = re.sub(r'\s{2,}', ' ', cleaned).strip()
    return cleaned


def run():
    source_js = Path(r'D:\VS Code\Japanese Learning\src\data\vocabulary.js')
    target_json = Path(r'D:\VS Code\Japanese Learning\src\data\vocabulary.json')

    print(f"Reading vocabulary data from: {source_js}")
    content = source_js.read_text(encoding='utf-8')

    # Trích xuất dữ liệu vocabularyData từ vocabulary.js
    match = re.search(r'export\s+const\s+vocabularyData\s*=\s*(\{[\s\S]*?\});\s*$', content)
    if not match:
        print("Lỗi: Không tìm thấy vocabularyData trong file vocabulary.js")
        sys.exit(1)

    raw_data = json.loads(match.group(1))
    transformed_data = {}
    total_words = 0

    # Lặp qua tất cả các bài từ 1 đến 15
    for lesson_num in range(1, 16):
        lesson_key = str(lesson_num)
        raw_list = raw_data.get(lesson_key, [])
        lesson_vocab = []

        for idx, item in enumerate(raw_list, start=1):
            kanji_val = (item.get("kanji") or "").strip()
            hiragana_val = (item.get("hiragana") or "").strip()
            meaning_val = clean_vietnamese_spaces(item.get("meaning") or "")

            # Nếu không có kanji, dùng hiragana
            if not kanji_val and hiragana_val:
                kanji_val = hiragana_val
            elif not hiragana_val and kanji_val:
                hiragana_val = kanji_val

            # Format id: L{lesson_id}_{index} (vd: L1_1, L1_2, ... L15_49)
            word_id = f"L{lesson_num}_{idx}"

            vocab_entry = {
                "id": word_id,
                "kanji": kanji_val,
                "hiragana": hiragana_val,
                "meaning": meaning_val,
                "category": "Từ vựng",
            }
            # Giữ thêm section metadata nếu có để phục vụ học theo Can-do
            if "section" in item:
                vocab_entry["section"] = item["section"]
            if "sectionTitle" in item:
                vocab_entry["sectionTitle"] = item["sectionTitle"]

            lesson_vocab.append(vocab_entry)

        transformed_data[lesson_key] = lesson_vocab
        total_words += len(lesson_vocab)
        print(f"  Bài {lesson_key:2s}: {len(lesson_vocab):3d} từ vựng")

    print(f"Tổng số từ vựng toàn bộ 15 bài: {total_words} từ.")

    # Ghi thẳng vào file src/data/vocabulary.json
    target_json.parent.mkdir(parents=True, exist_ok=True)
    with open(target_json, 'w', encoding='utf-8') as f:
        json.dump(transformed_data, f, ensure_ascii=False, indent=2)

    print(f"Đã xuất thành công vào: {target_json} ({target_json.stat().st_size:,} bytes)")

    # Cập nhật lại vocabulary.js để export const vocabularyData sử dụng các object có id chuẩn
    # Đồng thời giữ nguyên lessonMeta
    meta_match = re.search(r'(export\s+const\s+lessonMeta\s*=\s*\{[\s\S]*?\};)', content)
    if meta_match:
        meta_code = meta_match.group(1)
        new_js_code = (
            "// Dữ liệu từ vựng trọn bộ 15 bài từ giáo trình Dekiru Nihongo Sơ cấp (Quyển hồng)\n"
            "// Tự động đồng bộ với src/data/vocabulary.json\n\n"
            f"{meta_code}\n\n"
            f"export const vocabularyData = {json.dumps(transformed_data, ensure_ascii=False, indent=2)};\n"
        )
        source_js.write_text(new_js_code, encoding='utf-8')
        print(f"Đã đồng bộ lại cả: {source_js}")

if __name__ == '__main__':
    run()
