#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
=============================================================================
ETL Pipeline: Export Grammar Data (raw_grammar.xlsx -> src/data/grammar.js)
=============================================================================
Role: Senior Data Engineer
Description:
    Script xử lý và chuyển đổi dữ liệu Ngữ pháp (Grammar) từ bảng tính Excel
    thành cấu trúc JavaScript ES6 module phục vụ ứng dụng học tiếng Nhật.
    
Tính năng:
    - Loại bỏ triệt để các dòng rỗng (Lesson, Title).
    - Chuẩn hóa khoảng trắng (strip/trim) toàn bộ chuỗi ký tự.
    - Nhóm theo Bài học (Lesson) với key là chuỗi ("1", "2", ...).
    - Lọc và trích xuất tối đa 3 câu ví dụ (Ex1, Ex2, Ex3), tự động bỏ qua nếu
      cột Ex{i}_JP rỗng để ngăn chặn object rác.
    - Sinh grammar_id tự động chuẩn format: L{lesson:02d}_G{index:02d}.
    - Ghi file đầu ra theo chuẩn UTF-8 bảo toàn tiếng Nhật và tiếng Việt.
=============================================================================
"""

import sys
import json
import logging
from pathlib import Path
import pandas as pd

# Thiết lập hệ thống logging trực quan
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("GrammarETL")


def clean_string(val) -> str:
    """Loại bỏ khoảng trắng thừa và chuẩn hóa NaN về chuỗi rỗng."""
    if pd.isna(val):
        return ""
    return str(val).strip()


def parse_lesson_identifier(val) -> tuple[str, int]:
    """
    Chuẩn hóa định danh Lesson:
    - Trả về tuple (lesson_key_str, lesson_numeric)
    - Xử lý các case: 1, 1.0, " 1 ", "Lesson 1"
    """
    try:
        val_float = float(val)
        val_int = int(val_float)
        return str(val_int), val_int
    except (ValueError, TypeError):
        s = clean_string(val)
        digits = "".join(c for c in s if c.isdigit())
        num = int(digits) if digits else 0
        return s or "0", num


def extract_examples(row: pd.Series) -> list[dict]:
    """
    Trích xuất danh sách câu ví dụ (tối đa 3 ví dụ: Ex1, Ex2, Ex3).
    Nếu Ex{i}_JP bị rỗng hoặc NaN, toàn bộ ví dụ i sẽ bị bỏ qua.
    """
    examples = []
    for i in range(1, 4):
        jp_col = f"Ex{i}_JP"
        furi_col = f"Ex{i}_Furi"
        romaji_col = f"Ex{i}_Romaji"
        vn_col = f"Ex{i}_VN"

        if jp_col not in row:
            continue

        jp_text = clean_string(row[jp_col])
        # Bỏ qua nếu không có câu tiếng Nhật
        if not jp_text:
            continue

        ex_item = {
            "japanese": jp_text,
            "furigana": clean_string(row.get(furi_col, "")),
            "romaji": clean_string(row.get(romaji_col, "")),
            "vietnamese": clean_string(row.get(vn_col, "")),
        }
        examples.append(ex_item)

    return examples


def run_pipeline(
    input_file: str | Path = "raw_grammar.xlsx",
    output_file: str | Path = "src/data/grammar.js",
) -> None:
    """
    Thực thi luồng ETL Pipeline:
    1. Extract: Đọc dữ liệu từ file Excel.
    2. Transform: Cleanse, Validate, Grouping, ID Generation, Example Extraction.
    3. Load: Xuất ra ES6 Module Javascript (src/data/grammar.js).
    """
    input_path = Path(input_file).resolve()
    output_path = Path(output_file).resolve()

    logger.info(f"Khởi động Grammar ETL Pipeline...")
    logger.info(f"Source Input: {input_path}")
    logger.info(f"Target Output: {output_path}")

    # =========================================================================
    # 1. EXTRACT
    # =========================================================================
    try:
        if not input_path.exists():
            raise FileNotFoundError(f"Không tìm thấy file đầu vào: '{input_path}'")

        # Đọc dữ liệu Excel
        df = pd.read_excel(input_path)
        logger.info(f"Đã đọc thành công {len(df)} dòng dữ liệu từ {input_path.name}.")
    except FileNotFoundError as fnf_err:
        logger.error(f"LỖI I/O: {fnf_err}")
        sys.exit(1)
    except Exception as err:
        logger.error(f"LỖI ĐỌC DỮ LIỆU EXCEL: {err}", exc_info=True)
        sys.exit(1)

    # =========================================================================
    # 2. TRANSFORM
    # =========================================================================
    try:
        # Kiểm tra sự hiện diện của các cột cốt lõi
        required_core_cols = ["Lesson", "Title"]
        missing_cols = [c for c in required_core_cols if c not in df.columns]
        if missing_cols:
            raise ValueError(f"Thiếu các cột bắt buộc trong file Excel: {missing_cols}")

        # Loại bỏ các dòng rỗng ở các cột điều kiện tiên quyết
        initial_count = len(df)
        df = df.dropna(subset=required_core_cols).copy()

        # Trim/strip khoảng trắng trên toàn bộ các cột object/string
        for col in df.select_dtypes(include=["object", "string"]).columns:
            df[col] = df[col].apply(clean_string)

        # Lọc bỏ các dòng mà Title sau khi trim trở thành rỗng
        df = df[df["Title"] != ""]
        dropped_count = initial_count - len(df)
        if dropped_count > 0:
            logger.warning(f"Đã loại bỏ {dropped_count} dòng không hợp lệ (thiếu Lesson hoặc Title).")

        logger.info(f"Số lượng bản ghi hợp lệ để xử lý: {len(df)}")

        # Phân nhóm dữ liệu theo Lesson
        grammar_data = {}
        total_examples = 0

        # Thêm cột tạm để sắp xếp thứ tự bài học chuẩn xác
        df["_lesson_key"], df["_lesson_num"] = zip(*df["Lesson"].apply(parse_lesson_identifier))
        df = df.sort_values(by=["_lesson_num", "_lesson_key"])

        grouped = df.groupby("_lesson_key", sort=False)

        for lesson_key, group in grouped:
            grammar_list = []
            lesson_num = group["_lesson_num"].iloc[0]

            for idx, (_, row) in enumerate(group.iterrows(), start=1):
                # Format ID: L{lesson_number:02d}_G{index:02d} (vd: L01_G01)
                grammar_id = (
                    f"L{lesson_num:02d}_G{idx:02d}"
                    if lesson_num > 0
                    else f"L{lesson_key}_G{idx:02d}"
                )

                examples = extract_examples(row)
                total_examples += len(examples)

                meaning_val = clean_string(row.get("Meaning", ""))
                item = {
                    "grammar_id": grammar_id,
                    "title": clean_string(row.get("Title", "")),
                    "meaning": meaning_val,
                    "titleVi": meaning_val,  # Tương thích ngược với UI Component
                    "structure": clean_string(row.get("Structure", "")),
                    "explanation": clean_string(row.get("Explanation", "")),
                    "examples": examples,
                }
                grammar_list.append(item)

            grammar_data[str(lesson_key)] = grammar_list

        logger.info(
            f"Tổng kết biến đổi: {len(grammar_data)} bài học, "
            f"{len(df)} cấu trúc ngữ pháp, {total_examples} câu ví dụ được trích xuất."
        )

    except Exception as err:
        logger.error(f"LỖI QUÁ TRÌNH BIẾN ĐỔI (TRANSFORM): {err}", exc_info=True)
        sys.exit(1)

    # =========================================================================
    # 3. LOAD (SERIALIZE & EXPORT)
    # =========================================================================
    try:
        # Chuyển đổi sang chuỗi JSON có format đẹp và giữ nguyên tiếng Nhật/Việt
        json_payload = json.dumps(grammar_data, ensure_ascii=False, indent=2)

        # Định dạng module ES6 chính xác theo yêu cầu
        es6_content = f"export const grammarData = {json_payload};\n"

        # Đảm bảo thư mục cha tồn tại
        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Ghi file với encoding UTF-8
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(es6_content)

        logger.info(f"✅ EXPORT THÀNH CÔNG -> {output_path}")
        logger.info(f"Dung lượng file xuất: {output_path.stat().st_size:,} bytes.")

    except Exception as err:
        logger.error(f"LỖI GHI FILE ĐÍCH: {err}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    # Hỗ trợ truyền đường dẫn tùy biến qua Command Line Arguments nếu cần
    src_file = sys.argv[1] if len(sys.argv) > 1 else "raw_grammar.xlsx"
    dest_file = sys.argv[2] if len(sys.argv) > 2 else "src/data/grammar.js"

    run_pipeline(input_file=src_file, output_file=dest_file)
