import sys
import fitz

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r'C:\Users\Anh Huy\Downloads\List từ vựng quyển hồng.pdf'
doc = fitz.open(pdf_path)

for p_num in [1, 4, 9, 14, 19, 24, 29, 34, 39, 44]:
    page = doc[p_num]
    words = page.get_text('words')
    # get distinct x0 ranges
    x0s = [w[0] for w in words]
    min_x = min(x0s) if x0s else 0
    max_x = max(x0s) if x0s else 0
    print(f"Page {p_num+1}: words={len(words)}, min_x={min_x:.1f}, max_x={max_x:.1f}")
    # Let's see some samples around 500+ x
    high_x = [w for w in words if w[0] > 400]
    print(f"   Words with x > 400: {len(high_x)} (e.g. {[w[4] for w in high_x[:5]]})")
