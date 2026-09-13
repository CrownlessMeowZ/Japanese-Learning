import sys
import fitz
import pdfplumber

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r'C:\Users\Anh Huy\Downloads\List từ vựng quyển hồng.pdf'

print("=== Checking pdfplumber tables on page 2 ===")
with pdfplumber.open(pdf_path) as pdf:
    p2 = pdf.pages[1]
    tables = p2.extract_tables()
    print("Tables found on page 2:", len(tables))
    if tables:
        for r in tables[0][:10]:
            print(r)

print("\n=== Checking fitz blocks on page 2 ===")
doc = fitz.open(pdf_path)
p2_fitz = doc[1]
blocks = p2_fitz.get_text('blocks')
print(f"Total blocks on page 2: {len(blocks)}")
for b in blocks[:15]:
    # b is (x0, y0, x1, y1, text, block_no, block_type)
    text_clean = b[4].replace('\n', ' | ')
    print(f"[{b[0]:.1f}, {b[1]:.1f}, {b[2]:.1f}, {b[3]:.1f}] -> {text_clean}")
