# 🌸 Nihongo Master (日本語マスター)

> **Hệ thống học tiếng Nhật thông minh tích hợp AI chấm điểm phát âm tức thì và thuật toán lặp lại ngắt quãng Spaced Repetition (SM-2).**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Zustand](https://img.shields.io/badge/State-Zustand_Persist-orange?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
[![Python ETL](https://img.shields.io/badge/ETL_Pipeline-Pandas-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://pandas.pydata.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 📖 Giới Thiệu (Overview)

**Nihongo Master** là ứng dụng Web học tiếng Nhật hiện đại (*Client-side Native / Frontend-Only*), được thiết kế tối ưu hoá cho giáo trình **Dekiru Nihongo Sơ cấp (15 Bài)**. 

Dự án không chỉ đơn thuần là ứng dụng hiển thị dữ liệu (CRUD), mà được xây dựng dựa trên nền tảng **Computer Science & Cognitive Science** vững chắc:
- **Tối ưu hóa khả năng ghi nhớ dài hạn** thông qua thuật toán Spaced Repetition (SuperMemo-2).
- **Phản xạ hội thoại & Chấm điểm phát âm** bằng thuật toán Quy hoạch động (Dynamic Programming - Levenshtein Distance) kết hợp Web Speech API.
- **Xử lý âm thanh đa luồng** mượt mà với mô hình Singleton Pattern.
- **Quy trình trích xuất và biến đổi dữ liệu (ETL Pipeline)** tự động hóa bằng Python.

---

## 🏛️ Kiến Trúc & Công Nghệ (Tech Stack & Architecture)

Ứng dụng tuân thủ triết lý **High Performance - Zero Latency - 100% Client-side**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER (REACT 19)                   │
│   Dashboard (2x2 Grid) │ QuizScreen │ GrammarScreen │ KaiwaScreen      │
└───────────────────▲───────────────────────────────▲────────────────────┘
                    │                               │
┌───────────────────┴───────────────────────────────┴────────────────────┐
│                         APPLICATION LOGIC & HOOKS                      │
│   useQuizEngine (Fisher-Yates)       │ useAudioPlayer (Singleton)      │
│   useSpeechRecognition (ja-JP)       │ useProgress (Facade SM-2)       │
└───────────────────▲───────────────────────────────▲────────────────────┘
                    │                               │
┌───────────────────┴───────────────────────────────┴────────────────────┐
│                      DATA & STATE MANAGEMENT LAYER                     │
│   Zustand Store (Persist LocalStorage) │ srsAlgo (SM-2 Core Engine)    │
│   stringUtils (DP Levenshtein)         │ Fast CSS Furigana Engine      │
└────────────────────────────────────────────────────────────────────────┘
```

| Thành phần | Công nghệ / Thư viện | Vai trò kỹ thuật |
| :--- | :--- | :--- |
| **Core Framework** | **React 19 + Vite 6** | Render UI siêu tốc, module bundling hiện đại, HMR tức thì |
| **State Management** | **Zustand + Persist** | Lưu trữ toàn bộ tiến độ, streak và chu kỳ SRS vào `LocalStorage` mà không gây re-render diện rộng |
| **Speech Recognition** | **Web Speech API (`ja-JP`)** | Nhận diện giọng nói tiếng Nhật native trên trình duyệt không cần third-party API tốn phí |
| **Audio Playback** | **HTML5 Audio + SpeechSynthesis** | Tự động chuyển đổi giữa file âm thanh tĩnh và Web Speech TTS |
| **Styling & Furigana** | **Modular CSS + Data-attributes** | Cơ chế chuyển đổi Furigana 0ms re-render bằng bộ chọn CSS `[data-furigana="hidden"]` |
| **Data Engineering** | **Python (Pandas, OpenPyXL)** | Xây dựng pipeline trích xuất dữ liệu từ file Excel sang ES6 modules |

---

## 🧠 Tính Năng & Thuật Toán Nổi Bật (Core Algorithms)

### 1. Thuật Toán Lặp Lại Ngắt Quãng Spaced Repetition (SuperMemo-2 / SM-2)
Hệ thống sử dụng thuật toán SM-2 toán học để tính toán chu kỳ lặp lại lý tưởng cho từng từ vựng và điểm ngữ pháp, đảm bảo người học ôn tập ngay trước thời điểm não bộ chuẩn bị quên (*Forgetting Curve*).

* **Công thức cập nhật Hệ số Dễ (Easiness Factor - $EF$):**
  $$EF' = \max\left(1.3,\; EF + \left(0.1 - (5 - q) \times \left(0.08 + (5 - q) \times 0.02\right)\right)\right)$$
  *(Trong đó $q \in [0, 5]$ là điểm đánh giá chất lượng phản hồi).*

* **Quy tắc bước nhảy chu kỳ ($I$ - Interval theo ngày):**
  $$I(n) = \begin{cases} 
  1 & \text{khi } n = 1 \\
  6 & \text{khi } n = 2 \\
  \text{round}(I(n-1) \times EF') & \text{khi } n > 2 
  \end{cases}$$

* **Khi trả lời sai ($q < 3$):** Chuỗi lặp $n$ bị reset về `0`, khoảng cách $I = 1$ ngày để người học ôn lại ngay vào ngày tiếp theo.
* **Tối ưu ngày tháng:** Toàn bộ tính toán dựa trên ngày lịch địa phương (`YYYY-MM-DD`), giải quyết triệt để lỗi lệch múi giờ của `toISOString()`.

---

### 2. Thuật Toán Xáo Trộn Ngẫu Nhiên Fisher-Yates $O(N)$ trong Quiz Engine
Thay vì sử dụng cách sắp xếp ngẫu nhiên dễ thiên vị như `array.sort(() => Math.random() - 0.5)` (vốn có độ phức tạp $O(N \log N)$ và phân phối không chuẩn), Quiz Engine cài đặt thuật toán **Fisher-Yates (Knuth) Shuffle**:

* **Độ phức tạp:** Thời gian $O(N)$, Không gian $O(N)$.
* **Thuật toán sinh phương án nhiễu (Distractor Generation):**
  1. Trích xuất câu hỏi mục tiêu từ tập câu hỏi đến hạn (`dueQuestions`).
  2. Lọc bỏ các từ đồng nghĩa hoặc đáp án trùng lặp khỏi ngân hàng câu hỏi.
  3. Xáo trộn tập ứng viên và lấy đúng 3 phần tử làm phương án sai, kết hợp với đáp án đúng và xáo trộn lần cuối để tạo 4 lựa chọn đồng đều.

---

### 3. Quy Hoạch Động (DP) - Khoảng Cách Levenshtein $O(\min(M, N))$ Chấm Điểm Giọng Nói
Tính năng hội thoại **KaiwaCard** tích hợp bộ chấm điểm phát âm theo thời gian thực:

1. **Chuẩn hóa chuỗi (Text Sanitization):** Loại bỏ toàn bộ dấu câu tiếng Nhật (`。`, `、`, `！`, `？`) và khoảng trắng thừa trước khi so sánh.
2. **Quy hoạch động tối ưu bộ nhớ:** Thay vì duy trì ma trận $O(M \times N)$ gây tốn RAM, thuật toán chỉ lưu 2 hàng luân phiên (`previousRow` và `currentRow`), giảm không gian bộ nhớ xuống $O(\min(M, N))$.
3. **Công thức phần trăm độ khớp (Match Percentage):**
   $$\text{Match} = \max\left(0,\; \frac{\max(M, N) - \text{Levenshtein}(S_1, S_2)}{\max(M, N)}\right) \times 100\%$$
4. **Phản hồi tức thì:** Tỷ lệ $\ge 80\%$ được phân loại là **Đạt chuẩn (Passed)**, kích hoạt phản hồi màu xanh lá cùng huy hiệu tương ứng.

---

### 4. Quản Lý Âm Thanh Chuẩn Singleton Pattern (Zero-Collision Audio Engine)
Một trong những lỗi phổ biến ở các ứng dụng học ngoại ngữ là âm thanh bị đè lên nhau khi người dùng bấm liên tục vào nhiều thẻ:

* Quản lý instance âm thanh duy nhất thông qua **Singleton Pattern Module**.
* Khi kích hoạt phát âm thanh mới, hệ thống tự động:
  - Tạm dừng và reset thẻ `HTML5 Audio` đang chạy.
  - Huỷ ngay hàng đợi giọng đọc `window.speechSynthesis.cancel()`.
  - Gỡ bỏ và dọn dẹp các event listener chống rò rỉ bộ nhớ (Memory Leaks).
* Tự động unmount audio khi rời màn hình thông qua `useEffect` cleanup.

---

### 5. Data Pipeline Tự Động Hóa Bằng Python (Mini-ETL)
Dữ liệu ngữ pháp và từ vựng được tự động hóa từ các bảng tính Excel thô (`raw_grammar.xlsx`) sang JavaScript ES6 modules:

```
[raw_grammar.xlsx] ──► [Python ETL Script] ──► [Validate & Cleanse] ──► [src/data/grammar.js]
```

* **Extract:** Đọc dữ liệu với `pandas`, phát hiện và thông báo lỗi I/O trực quan.
* **Transform:**
  - Loại bỏ các dòng rỗng (`dropna(subset=['Lesson', 'Title'])`).
  - Xóa khoảng trắng thừa (trim/strip) trên toàn bộ chuỗi ký tự.
  - Tự động sinh ID duy nhất chuẩn format: `L{lesson:02d}_G{index:02d}` (ví dụ: `L01_G01`).
  - Trích xuất linh hoạt tối đa 3 ví dụ (`Ex1`, `Ex2`, `Ex3`), tự động bỏ qua nếu cell câu tiếng Nhật rỗng.
* **Load:** Serialize JSON chuẩn `UTF-8` (bảo toàn 100% chữ Kanji, Kana và tiếng Việt có dấu) và bọc trực tiếp trong cú pháp `export const grammarData = { ... };`.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy (Setup & Run)

### 1. Yêu Cầu Môi Trường
* **Node.js**: Phiên bản `18.0.0` trở lên.
* **Python**: Phiên bản `3.9` trở lên (nếu muốn chạy ETL Pipeline).
* **Trình duyệt**: Khuyến nghị Google Chrome, Microsoft Edge hoặc Brave (hỗ trợ Web Speech API đầy đủ nhất).

---

### 2. Cài Đặt Gói Phụ Thuộc (Frontend)
```bash
# Clone repository
git clone https://github.com/your-username/japanese-learning.git
cd japanese-learning

# Cài đặt node modules
npm install
```

---

### 3. Khởi Chạy Máy Chủ Phát Triển (Development Server)
```bash
npm run dev
```
Sau khi chạy lệnh, truy cập vào đường dẫn: **`http://localhost:5173`**.

Hoặc trên Windows, bạn có thể click đúp chuột trực tiếp vào file **`start.bat`** để khởi chạy chỉ với 1 cú click!

---

### 4. Build Bản Production
```bash
npm run build
```
Mã nguồn tối ưu sẽ được biên dịch vào thư mục `dist/` sẵn sàng triển khai lên Vercel, Netlify hoặc GitHub Pages.

---

### 5. Chạy Pipeline Dữ Liệu Python (ETL)
Khi bạn cập nhật danh sách cấu trúc ngữ pháp mới trong file `raw_grammar.xlsx`:

```bash
# Cài đặt thư viện xử lý dữ liệu (nếu chưa có)
pip install pandas openpyxl

# Chạy ETL Pipeline để tự động build file src/data/grammar.js
python scripts/export_grammar.py
```

---

## 📂 Cấu Trúc Thư Mục Dự Án (Project Structure)

```text
Japanese Learning/
├── public/                 # Static assets
├── scripts/                # Python ETL Pipelines
│   └── export_grammar.py   # Script trích xuất và biến đổi ngữ pháp
├── src/
│   ├── assets/             # Hình ảnh, icons
│   ├── components/         # React UI Components
│   │   ├── Grammar/        # GrammarCard, GrammarScreen
│   │   ├── Kaiwa/          # KaiwaCard (Speech AI), KaiwaScreen
│   │   ├── Quiz/           # QuizScreen (State Machine)
│   │   ├── Dashboard.jsx   # Dashboard 15 bài học dạng lưới 2x2
│   │   ├── FuriganaSwitch  # Công tắc bật/tắt Furigana toàn app
│   │   └── FuriganaText    # Component hiển thị Ruby tag
│   ├── data/               # Cơ sở dữ liệu ứng dụng (vocabulary, grammar)
│   ├── hooks/              # Custom Hooks tách biệt logic & UI
│   │   ├── useAudioPlayer.js       # Singleton Audio Engine
│   │   ├── useProgress.js          # Facade hook quản lý tiến độ & SM-2
│   │   ├── useQuizEngine.js        # Fisher-Yates state machine
│   │   └── useSpeechRecognition.js # Web Speech API wrapper
│   ├── store/              # State stores (Zustand + LocalStorage Persist)
│   │   ├── progressStore.js        # Lưu streak, item SRS, tiến độ học
│   │   └── settingsStore.js        # Cài đặt người dùng (Furigana toggle)
│   ├── styles/             # Stylesheet toàn cục
│   │   └── furigana.css    # Quy tắc ẩn hiện Furigana 0ms re-render
│   ├── utils/              # Thuật toán cốt lõi
│   │   ├── srsAlgo.js      # Thuật toán SuperMemo-2 (SM-2)
│   │   └── stringUtils.js  # Dynamic Programming Levenshtein Distance
│   ├── App.jsx             # Root layout & State-based router
│   └── main.jsx            # React DOM bootstrap
├── index.html              # Entry HTML
├── package.json            # Cấu hình dự án & scripts
├── start.bat               # File khởi động nhanh 1-click trên Windows
└── vite.config.js          # Cấu hình Vite bundler
```

---

## 🎯 Đóng Góp & Phát Triển (Contributing)
Mọi ý kiến đóng góp, báo cáo lỗi (Issue) hoặc đề xuất tính năng (Pull Request) đều được hoan nghênh!

1. Fork dự án
2. Tạo nhánh tính năng (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push nhánh lên remote (`git push origin feature/AmazingFeature`)
5. Tạo một Pull Request mới

---

## 📜 Giấy Phép (License)
Dự án được phân phối dưới giấy phép mã nguồn mở **MIT License**.

🌸 *Chúc bạn học tốt tiếng Nhật và nhanh chóng làm chủ ngôn ngữ xứ sở hoa anh đào!*
