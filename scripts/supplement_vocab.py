import sys
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Items to supplement:
supplement_items = [
    {
        "lesson": "1",
        "kanji": "（どうぞ）よろしくお願いします",
        "hiragana": "（どうぞ）よろしくおねがいします",
        "meaning": "Rất mong nhận được sự giúp đỡ của bạn",
        "category": "Từ vựng",
        "section": "1.1",
        "sectionTitle": "1.1 私の名前・国・仕事 (Tên, đất nước, công việc của tôi)"
    },
    {
        "lesson": "1",
        "kanji": "映画",
        "hiragana": "えいが",
        "meaning": "Phim ảnh",
        "category": "Từ vựng",
        "section": "1.3",
        "sectionTitle": "1.3 私の趣味 (Sở thích của tôi)"
    },
    {
        "lesson": "2",
        "kanji": "レストラン",
        "hiragana": "レストラン",
        "meaning": "Nhà hàng, quán ăn",
        "category": "Từ vựng",
        "section": "2.1",
        "sectionTitle": "2.1 どこですか (Ở đâu vậy? / Vị trí các quầy & tầng)"
    },
    {
        "lesson": "2",
        "kanji": "卵",
        "hiragana": "たまご",
        "meaning": "Trứng",
        "category": "Từ vựng",
        "section": "2.3",
        "sectionTitle": "2.3 レストラン (Nhà hàng / Món ăn & Gọi món)"
    },
    {
        "lesson": "3",
        "kanji": "働きます",
        "hiragana": "はたらきます",
        "meaning": "Làm việc, lao động",
        "category": "Từ vựng",
        "section": "3.2",
        "sectionTitle": "3.2 私のスケジュール (Lịch trình & Kế hoạch của tôi)"
    },
    {
        "lesson": "4",
        "kanji": "神社",
        "hiragana": "じんじゃ",
        "meaning": "Đền thần đạo",
        "category": "Từ vựng",
        "section": "4.1",
        "sectionTitle": "4.1 どこ？ (Ở đâu? / Vị trí địa lý)"
    },
    {
        "lesson": "5",
        "kanji": "週末",
        "hiragana": "しゅうまつ",
        "meaning": "Cuối tuần",
        "category": "Từ vựng",
        "section": "5.1",
        "sectionTitle": "5.1 週末 (Cuối tuần / Hoạt động ngày nghỉ)"
    },
    {
        "lesson": "5",
        "kanji": "買い物します",
        "hiragana": "かいものします",
        "meaning": "Mua sắm",
        "category": "Từ vựng",
        "section": "5.1",
        "sectionTitle": "5.1 週末 (Cuối tuần / Hoạt động ngày nghỉ)"
    },
    {
        "lesson": "5",
        "kanji": "食事します",
        "hiragana": "しょくじします",
        "meaning": "Dùng bữa, ăn uống",
        "category": "Từ vựng",
        "section": "5.1",
        "sectionTitle": "5.1 週末 (Cuối tuần / Hoạt động ngày nghỉ)"
    },
    {
        "lesson": "7",
        "kanji": "貸します",
        "hiragana": "かします",
        "meaning": "Cho mượn",
        "category": "Từ vựng",
        "section": "7.3",
        "sectionTitle": "7.3 パーティーの準備 (Chuẩn bị bữa tiệc / Nhờ vả & Chỉ thị)"
    },
    {
        "lesson": "8",
        "kanji": "～人",
        "hiragana": "～にん",
        "meaning": "～ người (đơn vị đếm người)",
        "category": "Từ vựng",
        "section": "8.1",
        "sectionTitle": "8.1 家族・友達 (Gia đình & Bạn bè)"
    },
    {
        "lesson": "9",
        "kanji": "いつも",
        "hiragana": "いつも",
        "meaning": "Luôn, thường xuyên, luôn luôn",
        "category": "Từ vựng",
        "section": "9.1",
        "sectionTitle": "9.1 いろいろな趣味 (Nhiều sở thích khác nhau)"
    },
    {
        "lesson": "9",
        "kanji": "申し込みます",
        "hiragana": "もうしこみます",
        "meaning": "Xin, thỉnh cầu, đăng ký",
        "category": "Từ vựng",
        "section": "9.2",
        "sectionTitle": "9.2 申し込み (Đăng ký & Thủ tục)"
    },
    {
        "lesson": "9",
        "kanji": "払います",
        "hiragana": "はらいます",
        "meaning": "Trả tiền, thanh toán",
        "category": "Từ vựng",
        "section": "9.3",
        "sectionTitle": "9.3 支払い (Thanh toán & Hướng dẫn)"
    },
    {
        "lesson": "10",
        "kanji": "見えます",
        "hiragana": "みえます",
        "meaning": "Nhìn thấy, trông thấy",
        "category": "Từ vựng",
        "section": "10.1",
        "sectionTitle": "10.1 私の部屋 (Phòng của tôi / Tầm nhìn & Âm thanh)"
    },
    {
        "lesson": "11",
        "kanji": "ええ",
        "hiragana": "ええ",
        "meaning": "Ừ, vâng (đồng ý thân mật)",
        "category": "Từ vựng",
        "section": "11.1",
        "sectionTitle": "11.1 今の生活 (Cuộc sống hiện tại)"
    },
    {
        "lesson": "11",
        "kanji": "卒業します",
        "hiragana": "そつぎょうします",
        "meaning": "Tốt nghiệp",
        "category": "Từ vựng",
        "section": "11.3",
        "sectionTitle": "11.3 私の日記 (Nhật ký của tôi)"
    },
    {
        "lesson": "13",
        "kanji": "かけます",
        "hiragana": "かけます",
        "meaning": "Đeo (kính), treo",
        "category": "Từ vựng",
        "section": "13.2",
        "sectionTitle": "13.2 おすすめ (Giới thiệu & Gợi ý)"
    },
    {
        "lesson": "15",
        "kanji": "花火大会",
        "hiragana": "はなびたいかい",
        "meaning": "Lễ hội pháo hoa",
        "category": "Từ vựng",
        "section": "15.2",
        "sectionTitle": "15.2 イベント・祭り (Sự kiện & Lễ hội)"
    },
    {
        "lesson": "15",
        "kanji": "入院します",
        "hiragana": "にゅういんします",
        "meaning": "Nhập viện",
        "category": "Từ vựng",
        "section": "15.3",
        "sectionTitle": "15.3 病院・健康 (Bệnh viện & Sức khỏe)"
    }
]

# Load current vocabulary.json
json_path = r'D:\VS Code\Japanese Learning\src\data\vocabulary.json'
with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

added_count = 0
for item in supplement_items:
    l_key = item["lesson"]
    existing = data.get(l_key, [])
    # Check if already in list
    already = any(
        (x.get("kanji") == item["kanji"] and x.get("meaning") == item["meaning"]) or
        (x.get("hiragana") == item["hiragana"] and x.get("meaning") == item["meaning"])
        for x in existing
    )
    if not already:
        existing.append(item)
        added_count += 1
        print(f"Added to Lesson {l_key}: {item['kanji']} ({item['hiragana']}) - {item['meaning']}")

# Re-index all IDs strictly sequentially: L{lesson}_{idx}
total = 0
for l_num in range(1, 16):
    l_key = str(l_num)
    words = data[l_key]
    for idx, w in enumerate(words, start=1):
        w["id"] = f"L{l_num}_{idx}"
        w["category"] = "Từ vựng"
    total += len(words)
    print(f"Lesson {l_num:2d}: {len(words):3d} words")

print(f"Total vocabulary after audit supplement: {total} words (added {added_count} missing words)")

# Write to vocabulary.json
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# Also sync to vocabulary.js
js_path = r'D:\VS Code\Japanese Learning\src\data\vocabulary.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

import re
meta_match = re.search(r'(export\s+const\s+lessonMeta\s*=\s*\{[\s\S]*?\};)', js_content)
if meta_match:
    meta_code = meta_match.group(1)
    new_js_code = (
        "// Dữ liệu từ vựng trọn bộ 15 bài từ giáo trình Dekiru Nihongo Sơ cấp (Quyển hồng)\n"
        "// Đã được kiểm toán 100% đối chiếu trực tiếp file PDF gốc\n\n"
        f"{meta_code}\n\n"
        f"export const vocabularyData = {json.dumps(data, ensure_ascii=False, indent=2)};\n"
    )
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(new_js_code)
    print(f"Updated vocabulary.js successfully.")
