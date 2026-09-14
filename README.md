# 🌸 Nihongo Master (日本語マスター)

> **Hệ sinh thái học tiếng Nhật chuẩn Takumi (匠) – Tinh tế theo triết lý Wabi-sabi (侘寂), bền bỉ cùng tinh thần Kaizen (改善), tích hợp Khoa học Nhận thức (SuperMemo-2), Trí tuệ Âm thanh (Web Speech API) và Tối ưu hóa Phần mềm Đỉnh cao.**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Zustand](https://img.shields.io/badge/State-Zustand_5-orange?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
[![Oxlint](https://img.shields.io/badge/Linter-Oxlint_1.8-00D8FF?style=for-the-badge)](https://oxc.rs/)
[![PWA](https://img.shields.io/badge/PWA-Offline_First-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Python ETL](https://img.shields.io/badge/ETL_Pipeline-Pandas-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://pandas.pydata.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

> 🌸 *「千里の道も一歩から」— Hành trình vạn dặm khởi đầu từ một bước chân.*  
> 🍃 *「継続は力なり」— Kiên trì chính là cội nguồn của sức mạnh bền bỉ.*  
> 🍵 *「一期一会」— Trân quý từng khoảnh khắc chạm vào vẻ đẹp của tri thức Phù Tang.*

---

## 📖 Giới Thiệu (Overview)

**Nihongo Master (日本語マスター)** là một ứng dụng Web học tiếng Nhật thế hệ mới theo mô hình **Client-side Native / Offline-First Progressive Web App (PWA)**, được thiết kế chuyên sâu dành cho giáo trình **Dekiru Nihongo Sơ cấp (15 Bài học)** cùng toàn bộ hệ thống bảng chữ cái **Hiragana & Katakana**.

Vượt lên trên những ứng dụng hiển thị thông thường, **Nihongo Master** được thai nghén từ sự kết hợp hài hòa giữa **Khoa học Máy tính (Computer Science)**, **Khoa học Nhận thức (Cognitive Science)** và **Nghệ thuật Thẩm mỹ Nhật Bản**:

* 🧠 **Khoa học Trí nhớ Dài hạn:** Áp dụng thuật toán Spaced Repetition (**SuperMemo-2 / SM-2**) nhằm bẻ gãy đường cong lãng quên (Ebbinghaus Forgetting Curve), đưa từ vựng vào sâu trong trí nhớ dài hạn.
* 🎙️ **Trí tuệ Nhân tạo Âm thanh:** Luyện phản xạ hội thoại và chấm điểm phát âm tiếng Nhật thời gian thực (`ja-JP`) bằng thuật toán **Quy hoạch động (Dynamic Programming - Levenshtein Distance)** kết hợp Web Speech API gốc trên trình duyệt.
* ⚡ **Phản Xạ Gõ Phím Thần Tốc (Speed Typing):** Rèn luyện khả năng chuyển dịch tâm trí từ Romaji sang Kana với phản hồi xúc giác và thị giác tức thời.
* 📖 **Từ Điển Lai (Hybrid Dual-Engine):** Tích hợp từ điển nội bộ tra cứu tức thì $0\text{ms}$ không cần Internet, song hành cùng bộ dịch thuật Google Translate API với cơ chế tự động sửa lỗi gõ (Did you mean) và phiên âm Romaji.
* 🎨 **Thẩm Mỹ Đậm Phong Vị Nhật Bản:** Trải nghiệm thị giác nhẹ nhàng, thanh thoát với hiệu ứng cánh hoa anh đào rơi bồng bềnh (**GPU Sakura Compositor**), không gây xao nhãng và tôn trọng trạng thái tập trung sâu (*Zen Flow State*).

---

## 🌸 Triết Lý Thiết Kế & Nghệ Thuật Phù Tang (Design Philosophy)

Mỗi dòng mã và thành phần giao diện của **Nihongo Master** đều thấm nhuần 3 trụ cột văn hóa cốt lõi của xứ sở Mặt trời mọc:

```
                  ┌─────────────────────────────────────┐
                  │      NIHOHGO MASTER PHILOSOPHY      │
                  └──────────────────┬──────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
  【 改善 - KAIZEN 】          【 侘寂 - WABI-SABI 】       【 匠 - TAKUMI 】
Tối ưu hóa liên tục,        Giao diện tối giản,         Tỉ mỉ đến từng chi tiết,
không độ trễ (Zero-lag),    thanh tịnh, tập trung       âm thanh không đè lấn,
giảm kích thước bundle      tuyệt đối vào việc học      hiệu ứng 60fps mượt mà
```

1. **Kaizen (改善 - Không ngừng cải tiến):**  
   Dự án đã trải qua quá trình tái cấu trúc toàn diện: loại bỏ hoàn toàn chi phí overhead của routing truyền thống (`react-router-dom`), áp dụng **State-Based Navigation** kết hợp **Dynamic Code Splitting (`React.lazy`)**, đưa kích thước bundle nén ban đầu xuống chỉ còn ~480 kB và thời gian tải trang đạt mức tức thời ($0\text{ms}$ giật lag).
2. **Wabi-sabi (侘寂 - Vẻ đẹp của sự giản dị và thuần khiết):**  
   Giao diện người dùng được thiết kế dựa trên bảng màu truyền thống Nhật Bản: sắc hồng dịu của hoa anh đào (*Sakura-iro* 🌸), sắc xanh trầm ấm (*Aoi* 🍵), cùng nền tối dịu mắt (*Sumi* 🌑). Không quảng cáo, không banner gây rối, mang lại không gian tĩnh lặng cho tâm trí.
3. **Takumi (匠 - Tay nghề nghệ nhân tỉ mỉ):**  
   * **GPU Sakura Animation:** Cánh hoa anh đào rơi tự nhiên trong không gian đa chiều, được tính toán và xử lý hoàn toàn bằng GPU Compositing Layer (`translate3d`, `will-change: transform`), tiêu tốn xấp xỉ 0% CPU và bảo toàn 60fps mượt mà.
   * **Zero-Collision Audio Engine:** Thiết kế theo Singleton Pattern, ngăn chặn hoàn toàn hiện tượng âm thanh bị phát đè lên nhau khi học viên bấm nghe nhiều từ vựng liên tiếp.
   * **Instant Furigana Switch:** Kỹ thuật CSS Data-attribute Selector `[data-furigana="hidden"]` cho phép bật/tắt toàn bộ phiên âm Kana trên chữ Hán mà **không gây re-render bất kỳ component React nào**.

---

## 🏛️ Kiến Trúc & Công Nghệ (Tech Stack & Architecture)

Ứng dụng tuân thủ nghiêm ngặt mô hình kiến trúc **Client-Side High Performance & Modular Layering**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER (REACT 19)                   │
│   Dashboard (15 Lessons)   │ KanaScreen (Speed Typing / Quiz Matrix)  │
│   VocabScreen (3D Cards)   │ KaiwaScreen (Voice AI Recognition)       │
│   GrammarScreen (Formulas) │ QuizScreen (Fisher-Yates Challenges)     │
│   Translator (Hybrid Dict) │ FuriganaSwitch (CSS Data-Attribute)      │
└───────────────────▲───────────────────────────────▲────────────────────┘
                    │                               │
┌───────────────────┴───────────────────────────────┴────────────────────┐
│                         APPLICATION LOGIC & HOOKS                      │
│   useQuizEngine (State Machine)      │ useAudioPlayer (Singleton Audio)│
│   useSpeechRecognition (ja-JP Native)│ useProgress (Facade SRS SM-2)   │
└───────────────────▲───────────────────────────────▲────────────────────┘
                    │                               │
┌───────────────────┴───────────────────────────────┴────────────────────┐
│                      DATA & STATE PERSISTENCE LAYER                    │
│   Zustand Store (Persist LocalStorage) │ srsAlgo.js (SM-2 Core Engine) │
│   stringUtils.js (DP Levenshtein)      │ GPU Sakura Particle Canvas    │
│   vocabulary.js (Offline Lexicon)      │ grammar.js (15 Dekiru Lessons)│
└────────────────────────────────────────────────────────────────────────┘
```

### Bảng Phân Bổ Công Nghệ

| Phân hệ | Công nghệ / Tiêu chuẩn | Vai trò kỹ thuật & Giá trị mang lại |
| :--- | :--- | :--- |
| **Core Framework** | **React 19.2 + Vite 8.3** | Render UI siêu tốc, kiến trúc component hiện đại, HMR tức thì |
| **State Management** | **Zustand 5.0 + Persist** | Quản lý trạng thái tập trung, lưu trữ tiến trình & streak vào `LocalStorage` với chi phí bộ nhớ tối thiểu |
| **Code Splitting** | **`React.lazy()` + `<Suspense>`** | Tách nhỏ 6 màn hình chức năng thành các chunk độc lập, giảm dung lượng tải trang ban đầu xuống ~480 kB |
| **Code Quality** | **Oxlint 1.81 (Rust-based)** | Công cụ kiểm tra mã nguồn siêu nhanh bằng Rust, đạt chuẩn 0 lỗi và 0 cảnh báo kỹ thuật |
| **Voice Processing** | **Web Speech API (`ja-JP`)** | Nhận dạng giọng nói tự nhiên từ trình duyệt, bảo mật thông tin và hoàn toàn miễn phí |
| **Audio Engine** | **HTML5 Audio + Web Speech TTS** | Quản lý phát âm thanh chuẩn bản ngữ qua cơ chế Singleton chống xung đột đa luồng |
| **Styling & Furigana** | **Modular CSS + GPU Compositing** | Hiệu ứng cánh hoa anh đào rơi 60fps và cơ chế ẩn/hiện Furigana 0ms re-render |
| **Data Engineering** | **Python (Pandas, OpenPyXL)** | Pipeline tự động hóa trích xuất và chuẩn hóa dữ liệu từ Excel sang ES6 JavaScript |

---

## 🧠 Thuật Toán Cốt Lõi & Khoa Học Máy Tính (Core Algorithms)

### 1. Thuật Toán Lặp Lại Ngắt Quãng SuperMemo-2 (SM-2)
Hệ thống tính toán thời điểm học viên chuẩn bị quên một mục kiến thức để đưa ra bài tập ôn tập, giúp tối đa hóa hiệu suất ghi nhớ dài hạn theo lý thuyết **Spaced Repetition**.

* **Công thức cập nhật Hệ số Dễ (Easiness Factor - $EF$):**
  $$EF' = \max\left(1.3,\; EF + \left(0.1 - (5 - q) \times \left(0.08 + (5 - q) \times 0.02\right)\right)\right)$$
  *(Trong đó: $q \in [0, 5]$ là điểm đánh giá chất lượng phản hồi từ học viên).*

* **Quy tắc bước nhảy chu kỳ ($I$ - Khoảng cách ngày ôn tập):**
  $$I(n) = \begin{cases} 
  1 & \text{khi } n = 1 \\
  6 & \text{khi } n = 2 \\
  \text{round}(I(n-1) \times EF') & \text{khi } n > 2 
  \end{cases}$$

* **Cơ chế phục hồi khi trả lời sai ($q < 3$):**  
  Chuỗi lặp $n$ ngay lập tức được đưa về `0` và khoảng cách $I = 1$ ngày, yêu cầu người học củng cố lại kiến thức vào ngày kế tiếp.
* **Đồng bộ thời gian thực:** Thuật toán tính toán dựa trên ngày lịch địa phương (`YYYY-MM-DD`), loại bỏ hoàn toàn lỗi lệch múi giờ của `toISOString()`.

---

### 2. Quy Hoạch Động (DP) - Khoảng Cách Levenshtein $O(\min(M, N))$ Chấm Điểm Giọng Nói
Màn hình luyện hội thoại **Kaiwa** phân tích phát âm trực tiếp của người học so với câu mẫu:

1. **Chuẩn hóa chuỗi (Sanitization):** Tự động bóc tách khoảng trắng thừa và dấu câu tiếng Nhật (`。`, `、`, `！`, `？`, `～`).
2. **Quy hoạch động tiết kiệm bộ nhớ:** Thay vì dựng bảng ma trận $O(M \times N)$ gây lãng phí RAM, giải thuật chỉ duy trì 2 hàng luân phiên (`previousRow` và `currentRow`), đưa độ phức tạp không gian về $O(\min(M, N))$.
3. **Công thức phần trăm độ khớp (Accuracy Match):**
   $$\text{Match} = \max\left(0,\; \frac{\max(M, N) - \text{Levenshtein}(S_1, S_2)}{\max(M, N)}\right) \times 100\%$$
4. **Phản hồi thời gian thực:** Kết quả $\ge 80\%$ được công nhận là **Hoàn thành xuất sắc (Passed)**, kích hoạt huy hiệu âm thanh và đổi màu giao diện trực quan.

---

### 3. Thuật Toán Xáo Trộn Ngẫu Nhiên Fisher-Yates $O(N)$
Quiz Engine và Kana Multiple-Choice Quiz cài đặt thuật toán **Fisher-Yates (Knuth) Shuffle**:

* **Độ phức tạp:** Thời gian $O(N)$, Không gian $O(N)$.
* **Cơ chế tạo phương án gây nhiễu (Distractor Generation):**
  1. Trích xuất câu hỏi mục tiêu từ danh sách đến hạn ôn tập (`dueQuestions`).
  2. Lọc bỏ các từ đồng nghĩa hoặc đáp án trùng lặp khỏi ngân hàng câu hỏi tổng thể.
  3. Xáo trộn ngẫu nhiên tập ứng viên, chọn đúng 3 đáp án sai kết hợp cùng 1 đáp án đúng và xáo trộn lần cuối để đảm bảo vị trí đáp án phân phối hoàn toàn đồng đều, không thiên vị.

---

### 4. Quản Lý Âm Thanh Chuẩn Singleton (Zero-Collision Audio Engine)
Để giải quyết triệt để lỗi âm thanh bị chồng đè khi học viên thao tác liên tục trên các thẻ từ vựng:

* Quản trị instance âm thanh duy nhất thông qua **Singleton Pattern**.
* Mỗi khi kích hoạt phát âm thanh mới:
  - Tự động ngắt và reset đối tượng `HTML5 Audio` đang phát dở.
  - Hủy ngay lập tức hàng đợi giọng đọc `window.speechSynthesis.cancel()`.
  - Tự động giải phóng event listener khi component unmount thông qua hook `useAudioPlayer`.

---

### 5. Pipeline Trích Xuất Dữ Liệu Tự Động (Python Mini-ETL)
Dữ liệu ngữ pháp được trích xuất tự động từ file bảng tính Excel gốc (`raw_grammar.xlsx`) sang JavaScript ES6 modules:

```
[raw_grammar.xlsx] ──► [Python ETL Script] ──► [Validate & Cleanse] ──► [src/data/grammar.js]
```

* **Extract:** Đọc dữ liệu với `pandas`, kiểm tra toàn vẹn cấu trúc file.
* **Transform:** Xóa dòng trống, chuẩn hóa ký tự, tự động sinh mã định danh duy nhất `L{lesson:02d}_G{index:02d}`, gom cụm ví dụ song ngữ.
* **Load:** Xuất định dạng chuẩn UTF-8 (bảo toàn trọn vẹn chữ Hán Kanji, Kana và dấu tiếng Việt) thành ES6 module JavaScript.

---

## 🚀 Các Tính Năng Cốt Lõi (Core Features)

| Biểu tượng | Tính năng | Mô tả chi tiết |
| :---: | :--- | :--- |
| 🎴 | **Thẻ Ghi Nhớ Flashcard 3D** | Lật thẻ không gian 3D mượt mà, tích hợp phát âm bản ngữ, phiên âm Furigana và chấm điểm chu kỳ Spaced Repetition (SM-2). |
| ⛩️ | **Bảng Chữ Cái Kana Master** | Hiển thị toàn diện Hiragana & Katakana (Seion, Dakuon, Yoon); chế độ **Speed Typing** gõ phím phản xạ Romaji thần tốc và trắc nghiệm 4 lựa chọn. |
| 🎙️ | **Hội Thoại Kaiwa AI** | Luyện phát âm trực tiếp qua Micro, chấm điểm theo thời gian thực bằng thuật toán Levenshtein với thang màu trực quan. |
| 📖 | **Từ Điển & Dịch Thuật AI** | Tra cứu từ điển nội bộ Dekiru 15 bài không cần mạng; dịch thuật Google Translate API tự động với gợi ý sửa lỗi gõ và Romaji. |
| 📝 | **Đấu Trường Trắc Nghiệm (Quiz)** | Thử thách phản xạ kiến thức theo từng bài học, cơ chế tính điểm theo chuỗi đúng liên tiếp (Streak) và vinh danh kết quả. |
| 📊 | **Bảng Điều Khiển (Dashboard)** | Theo dõi tiến trình học tập của 15 bài Dekiru Nihongo, thống kê số lượng thẻ cần ôn tập và quản lý chuỗi ngày học tập liên tục. |
| 🌿 | **Vườn Bonsai Tăng Trưởng (Sakura Garden)** | Cây Bonsai hoa anh đào tương tác đồ họa SVG tiến hóa qua 5 cấp độ theo chuỗi Streak, kèm tính năng tưới cây và danh ngôn Zen Nhật Bản. |
| ⚠️ | **Sổ Tay Điểm Yếu & Hộp Cứu Hộ (Mistake Vault)** | Tự động âm thầm gom các từ hay làm sai trong Quiz & Flashcard, cung cấp chế độ cứu hộ cấp tốc với cơ chế tốt nghiệp sau 2 lần sửa đúng. |
| 🌸 | **GPU Sakura Falling Effect** | Hiệu ứng cánh hoa anh đào rơi bồng bềnh mô phỏng vật lý 3D, chạy 100% trên GPU compositor layer, êm dịu và tiết kiệm pin. |

---

## 📂 Cấu Trúc Thư Mục Dự Án (Project Structure)

```text
Japanese Learning/
├── _archive/                   # Lưu trữ mã nguồn cũ (ExercisePage, legacy router)
├── public/                     # Static assets (Favicons, Service Worker PWA)
│   ├── favicon.svg             # Biểu tượng hoa anh đào Sakura
│   ├── manifest.json           # Khai báo cấu hình Web App PWA
│   └── sw.js                   # Service Worker hỗ trợ Offline Caching
├── scripts/                    # Công cụ tự động hóa & ETL
│   └── export_grammar.py       # Pipeline trích xuất ngữ pháp từ Excel
├── src/
│   ├── assets/                 # Hình ảnh minh họa & icon ứng dụng
│   ├── components/             # Các khối giao diện React (UI Components)
│   │   ├── Dictionary/         # Translator.jsx & Dumb Components (Dịch thuật & Từ điển)
│   │   ├── Garden/             # SakuraGarden.jsx (Vườn Bonsai tương tác 5 cấp độ)
│   │   ├── Grammar/            # GrammarCard.jsx, GrammarScreen.jsx
│   │   ├── Kaiwa/              # KaiwaCard.jsx, KaiwaScreen.jsx (Voice AI)
│   │   ├── Kana/               # KanaScreen.jsx & Dumb Components (Speed Typing & Matrix)
│   │   ├── Quiz/               # QuizScreen.jsx (State-machine Quiz Engine)
│   │   ├── Rescue/             # MistakeVaultModal.jsx (Hộp Cứu Hộ Điểm Yếu & Ôn Tập)
│   │   ├── Vocab/              # Flashcard.jsx (3D flip), VocabScreen.jsx
│   │   ├── Welcome/            # WelcomeScreen.jsx (Onboarding Carousel)
│   │   ├── Dashboard.jsx       # Bảng tiến độ 15 bài học dạng lưới 2x2
│   │   ├── FuriganaSwitch.jsx  # Công tắc bật/tắt Furigana toàn app
│   │   └── FuriganaText.jsx    # Component hiển thị thẻ <ruby> tối ưu
│   ├── data/                   # Cơ sở tri thức ứng dụng
│   │   ├── grammar.js          # Dữ liệu ngữ pháp 15 bài Dekiru
│   │   ├── kanaData.js         # Dữ liệu bảng chữ cái Hiragana & Katakana
│   │   └── vocabulary.js       # Dữ liệu từ vựng đồ sộ theo từng bài học
│   ├── hooks/                  # Custom Hooks tách bạch logic nghiệp vụ
│   │   ├── useAudioPlayer.js   # Singleton Audio Manager
│   │   ├── useProgress.js      # Facade hook quản lý tiến độ & SM-2
│   │   ├── useQuizEngine.js    # Logic bài tập & Fisher-Yates shuffle
│   │   └── useSpeechRecognition.js # Web Speech API recognition wrapper
│   ├── store/                  # Quản lý trạng thái tập trung (Zustand)
│   │   ├── progressStore.js    # Lưu trữ streak, thẻ SRS và lịch sử học tập
│   │   └── settingsStore.js    # Cài đặt người dùng (Furigana display toggle)
│   ├── styles/                 # Stylesheet hệ thống
│   │   ├── furigana.css        # Quy tắc ẩn hiện Furigana không re-render
│   │   └── sakura.css          # Thư viện màu sắc và GPU Sakura Animation
│   ├── utils/                  # Thư viện thuật toán cốt lõi
│   │   ├── romajiConverter.js  # Bộ chuyển dịch ngữ âm Romaji <-> Kana
│   │   ├── srsAlgo.js          # Thuật toán SuperMemo-2 (SM-2)
│   │   └── stringUtils.js      # Giải thuật Quy hoạch động Levenshtein
│   ├── App.jsx                 # Root layout & State-based tab routing
│   └── main.jsx                # Điểm khởi chạy React DOM
├── index.html                  # File HTML gốc (PWA enabled)
├── package.json                # Danh mục phụ thuộc & kịch bản npm
├── start.bat                   # Kịch bản khởi chạy 1-click trên Windows
└── vite.config.js              # Cấu hình tối ưu Vite Bundler
```

---

## 🛠️ Hướng Dẫn Cài Đặt & Khởi Chạy (Getting Started)

### 1. Yêu Cầu Môi Trường
* **Node.js**: Phiên bản `18.0.0` trở lên (khuyến nghị phiên bản LTS).
* **Python**: Phiên bản `3.9+` (chỉ cần khi muốn chạy script Mini-ETL từ Excel).
* **Trình duyệt khuyến nghị**: Google Chrome, Microsoft Edge, hoặc Brave (để hỗ trợ tốt nhất tính năng nhận diện giọng nói Web Speech API).

---

### 2. Cài Đặt Ứng Dụng
```bash
# 1. Clone mã nguồn về máy tính
git clone https://github.com/your-username/japanese-learning.git
cd japanese-learning

# 2. Cài đặt các gói phụ thuộc (dependencies)
npm install
```

---

### 3. Chạy Ở Chế Độ Phát Triển (Development)
```bash
npm run dev
```
Mở trình duyệt và truy cập: **`http://localhost:5173`**.

> 💡 **Mẹo dành cho Windows:** Bạn chỉ cần click đúp chuột vào file **`start.bat`** tại thư mục gốc để hệ thống tự động khởi chạy và mở ứng dụng trên trình duyệt!

---

### 4. Kiểm Tra Chuẩn Mã Nguồn (Linter)
Dự án sử dụng **Oxlint** – công cụ kiểm tra tĩnh siêu tốc viết bằng Rust:
```bash
npm run lint
```
*Kết quả mong đợi: `Finished in ...ms with 0 errors and 0 warnings`.*

---

### 5. Biên Dịch Đóng Gói Bản Sản Phẩm (Production Build)
```bash
npm run build
```
Mã nguồn tối ưu sẽ được biên dịch vào thư mục `dist/`, sẵn sàng triển khai lên các nền tảng máy chủ tĩnh như Vercel, Netlify, Cloudflare Pages hoặc GitHub Pages.

---

### 6. Cập Nhật Dữ Liệu Ngữ Pháp (ETL Pipeline)
Khi bổ sung hoặc chỉnh sửa các điểm ngữ pháp trong file `raw_grammar.xlsx`:
```bash
# Cài đặt thư viện xử lý dữ liệu Python (nếu chưa có)
pip install pandas openpyxl

# Chạy pipeline để tự động cập nhật src/data/grammar.js
python scripts/export_grammar.py
```

---

## 🤝 Đóng Góp & Phát Triển (Contributing)

Mọi ý tưởng cải tiến, báo cáo lỗi (Issue) hoặc yêu cầu kéo (Pull Request) nhằm nâng tầm dự án đều được chào đón nồng nhiệt theo tinh thần cộng đồng mã nguồn mở:

1. **Fork** repository này về tài khoản GitHub của bạn.
2. Tạo một nhánh tính năng mới (`git checkout -b feature/Shin-Kinou`).
3. Cam kết các thay đổi (`git commit -m 'feat: them tinh nang luyen viet Kanji'`).
4. Đẩy nhánh lên GitHub (`git push origin feature/Shin-Kinou`).
5. Mở một **Pull Request** mới và mô tả chi tiết các cải tiến.

---

## 📜 Giấy Phép (License)

Dự án được phân phối dưới giấy phép mã nguồn mở **MIT License**. Bạn hoàn toàn có quyền sử dụng, sửa đổi và phân phối phục vụ mục đích học tập và nghiên cứu.

---

<div align="center">

🌸 **日本語の勉強を楽しんでください！** 🌸  
*(Chúc bạn có những giờ phút học tiếng Nhật tràn đầy niềm vui và sớm chinh phục được đỉnh cao ngôn ngữ!)*

</div>
