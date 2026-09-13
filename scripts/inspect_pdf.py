import sys
import fitz
import json

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r'C:\Users\Anh Huy\Downloads\List từ vựng quyển hồng.pdf'
doc = fitz.open(pdf_path)
print(f"Total pages: {len(doc)}")

for page_num in range(min(5, len(doc))):
    page = doc[page_num]
    text = page.get_text('text')
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    print(f"\n================ PAGE {page_num + 1} (lines: {len(lines)}) ================")
    for line in lines[:30]:
        print(line)
