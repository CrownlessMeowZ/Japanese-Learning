import sys
import json
import re
import fitz

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r'C:\Users\Anh Huy\Downloads\List từ vựng quyển hồng.pdf'
doc = fitz.open(pdf_path)

# Let's map page ranges to lessons:
# Page 2-3: Lesson 1
# Page 4-7: Lesson 2
# Page 8-11: Lesson 3
# Page 12-14: Lesson 4
# Page 15-17: Lesson 5
# Page 18-20: Lesson 6
# Page 21-24: Lesson 7
# Page 25-28: Lesson 8
# Page 29-31: Lesson 9
# Page 32-34: Lesson 10
# Page 35-36: Lesson 11
# Page 37-39: Lesson 12
# Page 40-41: Lesson 13
# Page 42-44: Lesson 14
# Page 45-46: Lesson 15

# Let's verify markers on each page
lesson_starts = {
    2: 1,
    4: 2,
    8: 3,
    12: 4,
    15: 5,
    18: 6,
    21: 7,
    25: 8,
    29: 9,
    32: 10,
    35: 11,
    37: 12,
    40: 13,
    42: 14,
    45: 15
}

current_lesson = 1
for page_idx in range(1, len(doc)):
    page_num = page_idx + 1
    if page_num in lesson_starts:
        current_lesson = lesson_starts[page_num]
    print(f"Page {page_num} -> Lesson {current_lesson}")
