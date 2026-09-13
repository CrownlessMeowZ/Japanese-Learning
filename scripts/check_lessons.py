import sys
import fitz

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r'C:\Users\Anh Huy\Downloads\List từ vựng quyển hồng.pdf'
doc = fitz.open(pdf_path)

print("TOC (Table of Contents):")
toc = doc.get_toc()
print(toc)

print("\n--- Inspecting first 5 lines and any '第' or '課' or 'Bài' on each page ---")
for i, page in enumerate(doc):
    text = page.get_text('text')
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    header_lines = lines[:5] if lines else []
    # Search for Lesson / 第...課 / Bài
    matching = [l for l in lines if '課' in l or '第' in l or 'Bài' in l or 'ばい' in l]
    print(f"Page {i+1}: header={header_lines} | markers={matching[:3]}")
