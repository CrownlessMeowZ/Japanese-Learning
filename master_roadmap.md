# 🌸 Kế Hoạch Kỹ Thuật Tổng Thể & Lộ Trình Tiến Hóa Tương Lai (Nihongo Master Roadmap)

> [!NOTE]
> **Định hướng kiến trúc:** Dự án vận hành theo mô hình **Client-Side Native / Offline-First PWA** (Không độ trễ, lưu trữ bảo mật qua Zustand Atomic Selectors + LocalStorage, tương thích ngoại tuyến).

---

## 🗺️ Bức Tranh Tổng Thể Kiến Trúc Dự Án

```mermaid
flowchart TD
    subgraph Milestone_Done["✅ NỀN TẢNG ĐÃ HOÀN THÀNH 100%"]
        P1["Giai đoạn 1: Số hóa 15 bài Dekiru Nihongo N5<br/>(965 từ vựng, 65 ngữ pháp, 60 hội thoại, 60 chữ Hán Canvas, Backup JSON)"]
        P2["Giai đoạn 2: Đấu trường & Bộ gõ WanaKana IME<br/>(Trắc nghiệm, Tự luận rớt âm, Phòng thu Dictation 7 sóng âm, Sakura Match 60s)"]
        P3["Giai đoạn 3: Giám sát năng lực & AI Voice Shadowing<br/>(Smart 3-Tier Mic chống ngắt sớm, Radar 5D SVG, Heatmap 365 ngày)"]
        P4["Giai đoạn 4: Tái cấu trúc kiến trúc & Dọn dẹp Clean Code<br/>(Zustand Atomic Selectors, Quiz Orchestrator Pattern, Chuẩn hóa WanaKana, Vite manualChunks)"]
    end

    subgraph Milestone_Next["🚀 LỘ TRÌNH TIẾN HÓA THEO ĐỘ ƯU TIÊN (P0.1 ➔ P3.2)"]
        P01["P0.1 (Critical - Đang hoàn thiện): Hotfix Nghiệp vụ, Dữ liệu gốc & Hiển thị chữ Nhật<br/>• Chuẩn hóa Từ vựng/Kaiwa/Kanji (strokeCount, なんじ, L7_28), chặn ăn điểm 1-2 ký tự<br/>• Sửa chuẩn Ruby Furigana nằm trên Kanji, Enter lần 2, chống lộ đáp án, font Noto Sans JP"]
        P02["P0.2 (High): Ổn định Store, Mạng, ErrorBoundary & PWA Offline<br/>• Sửa Mistake Vault collision, bỏ || {} selector React 19, Streak qua ngày, Heatmap UTC<br/>• Gộp SakuraMatch + settings vào Backup/Restore, AbortController, ErrorBoundary, Pre-cache<br/>• Mốc chốt: Hoàn thành P0.2 ➔ Merge project-update-temp về main"]
        P11["P1.1 (High - Tiền đề Backend): Routing, Services Async & Sync Queue<br/>• Gắn react-router-dom, tách 22 chỗ import cứng src/data/*.js sang src/services/ async/await<br/>• Chuẩn hóa Canonical IDs khớp SQL & hàng đợi Offline Sync Queue"]
        P12["P1.2 (Medium-High): Cỗ máy Trí nhớ Não bộ FSRS (src/utils/fsrsAlgo.js)<br/>• Thay thế SM-2 bằng giải thuật Anki hiện đại (Stability, Difficulty, Retrievability)<br/>• Giảm 25% số lần ôn tập thừa, bảo toàn 100% dữ liệu cũ"]
        P21["P2.1 (High): Backend Fullstack Java Core & Spring Boot 3<br/>• Java Core Engine, Spring Security 6 JWT, PostgreSQL/MySQL, Caching Redis<br/>• API /api/v1/progress/sync & Cronjob 00:00"]
        P22["P2.2 (Medium): Đấu Trường Trí Tuệ Kotoba Wordle (言葉ワードル)<br/>• Đoán từ 2-6 ô theo ngày, Bàn phím lai IME + Popover biến âm, AI Hint bảo mật<br/>• Kết nối Backend + Cronjob 00:00 + Redis Sorted Sets từ P2.1"]
        P23["P2.3 (Medium): Mở rộng Giáo trình JLPT N4 (Bài 16–30)<br/>• Bổ sung 15 bài học tiếp theo (~1.000 từ vựng N4, 60 ngữ pháp phức hợp)"]
        P31["P3.1 (Normal): Phòng Hội Thoại Nhập Vai Tình Huống Gemini AI<br/>• Nhập vai quán ăn, ga tàu, konbini, ryokan; nhận xét tự nhiên & phát âm Tokyo"]
        P32["P3.2 (Low / R&D): Trực Quan Hóa Cao Độ Ngữ Điệu (Pitch Accent F0 Visualizer)<br/>• Trích xuất tần số cơ bản F0 qua Web Audio API AnalyserNode"]
    end

    Milestone_Done --> P01
    P01 --> P02
    P02 --> P11
    P11 --> P12
    P12 --> P21
    P21 --> P22
    P22 --> P23
    P23 --> P31
    P31 --> P32
```

---

## 📌 CHI TIẾT 9 GIAI ĐOẠN LỘ TRÌNH TIẾN HÓA (P0.1 ➔ P3.2)

### 🔥 P0.1 (Critical - Đang hoàn thiện): Hotfix Nghiệp Vụ, Dữ Liệu Gốc & Hiển Thị Chữ Nhật
* **Mục tiêu:** Vá triệt để các lỗi sai dữ liệu gốc, sai chuẩn hiển thị tiếng Nhật, bất tiện thao tác và lỗ hổng logic chấm điểm trên bản client hiện tại.
* **Các hạng mục triển khai:**
  - **Chuẩn hóa dữ liệu gốc:**
    + Sửa nghĩa từ `L7_28` (`しょうゆ`) trong `src/data/vocabulary.js` từ `"Muối"` thành `"Nước tương, xì dầu"`.
    + Sửa 4 chỗ phiên âm sai `なにじ` ➔ `なんじ` ở `k3-1`, `k3-2`, `k3-3` trong `src/data/kaiwaData.js` (giữ nguyên tổng 60 câu Kaiwa); lọc bỏ ký tự mũi tên `➔` khi chuẩn hóa chấm điểm giọng nói trong `src/utils/stringUtils.js`.
    + Bỏ key `chizu: 'チーズ'` trong `src/utils/romajiConverter.js` (chỉ giữ `chiizu: 'チーズ'` để gõ `chizu` ra đúng `ちず`).
    + Cập nhật `strokeCount` khớp đúng `strokes.length` thực tế cho 10 chữ Hán bị lệch (`k_31 時`, `k_39 校`, `k_44 帰`, `k_46 食`, `k_47 飲`, `k_54 聞`, `k_55 読`, `k_56 書`, `k_57 話`, `k_58 買`).
  - **Logic học tập, chấm điểm & điều khiển:**
    + Siết chặt nhánh `to_vi` trong `src/utils/typingValidator.js` (chặn gõ 1–2 chữ cái ăn điểm do `.includes()`, chỉ khớp nguyên nghĩa hoặc cụm từ đủ dài theo ranh giới từ); thu gọn `generateHint` cấp 2 chỉ hiện Romaji của 2 ký tự đầu.
    + Chuẩn hóa lưu tiến độ Ngữ pháp theo `item.id` (`L01_G01`), đồng thời tương thích ngược mã cũ `L01_G1` tại `GrammarCard.jsx`, `useProgress.js` và `statsUtils.js`.
    + Hỗ trợ nhấn `Enter` lần 2 trên `window` khi `isAnswered === true` ở `QuizTypingInput.jsx`; chặn tự phát âm lộ đáp án ở đầu câu `vi_to_ja` (khi không phải `dictation`) tại `QuizScreen.jsx`.
    + Cho phép "Thử Thách Lại" `missedKanji` cả khi sai 1–3 chữ tại `KanjiQuiz.jsx`; sửa cleanup `KaiwaCard.jsx` chỉ dừng mic khi unmount (tránh ghi đúp `recordKaiwaScore`); khóa bấm đúp lúc chuyển câu ở `KanaScreen.jsx`; khử trùng nghĩa tiếng Việt trên bàn cờ `SakuraMatch`.
  - **Hiển thị chữ Nhật & Khả năng tiếp cận (A11y):**
    + Bỏ `inline-flex` / `column` trên `<ruby>` ở `FuriganaText.jsx` để `<rt>` nằm phía TRÊN chữ Hán chuẩn Nhật Bản, giữ `.ruby-wrapper` ẩn/hiện 0ms; căn dòng thoáng cho câu thoại 2 lượt ở `KaiwaCard.jsx`.
    + Nhúng font `Noto Sans JP` vào đầu font-stack (`index.html`, `src/index.css`, `src/App.css`), gắn `lang="ja"` cho các vùng chữ Nhật chính và mở lại zoom trên mobile (`viewport` bỏ `user-scalable=no, maximum-scale=1.0`).

---

### 🛡️ P0.2 (High): Ổn Định Store, Mạng, ErrorBoundary & PWA Offline
* **Mục tiêu:** Gia cố độ bền dữ liệu cục bộ, triệt tiêu rủi ro vòng lặp render React 19 và hoàn thiện trải nghiệm ngoại tuyến trước khi chốt nhánh.
* **Các hạng mục triển khai:**
  - **Ổn định Zustand Store & Tiến trình (`progressStore.js`, `useProgress.js`, `statsUtils.js`):**
    + Sửa lỗi `Mistake Vault` key collision (dòng 351–354 `src/store/progressStore.js`) khi tra cứu `vault[entry.id]` vs `vault[rawId]`.
    + Bỏ `|| {}` trực tiếp bên trong selector của `src/hooks/useProgress.js` để tham chiếu selector ổn định, tránh lặp vô hạn trên React 19 (`useSyncExternalStore`).
    + Tự động kiểm tra và reset chuỗi Streak khi người dùng mở lại app qua ngày mới.
    + Sửa lỗi lệch ngày theo múi giờ UTC trên biểu đồ nhiệt Heatmap ở `src/utils/statsUtils.js`.
    + Gộp kỷ lục `SakuraMatch` và cấu hình `settingsStore` vào gói Backup/Restore JSON kèm **Schema Guard** xác thực dữ liệu nhập.
  - **An toàn Mạng & PWA Offline:**
    + Bổ sung `AbortController` hủy yêu cầu dịch cũ khi gõ nhanh và sửa lỗi stale `lang` trong `Translator.jsx`.
    + Bọc `ErrorBoundary` bảo vệ ứng dụng khỏi màn hình trắng và hoàn thiện chiến lược **pre-cache PWA Offline** trong Service Worker.
  - **Cột mốc Git:** *Hoàn thành xong `P0.2` thì **Merge `project-update-temp` về `main`**.*

---

### 🔗 P1.1 (High - Tiền Đề Backend): Chuẩn Hóa Routing, Tầng Services Async & Sync Queue
* **Mục tiêu:** Tách rời tầng dữ liệu tĩnh khỏi UI, tạo lớp trừu tượng bất đồng bộ để sẵn sàng cắm vào Backend Java Spring Boot mà không phải đập đi xây lại giao diện.
* **Các hạng mục triển khai:**
  - Gắn **`react-router-dom`** thay thế state routing thủ công, hỗ trợ URL sạch, điều hướng Back/Forward trình duyệt và deep-link từng bài học.
  - Tách toàn bộ **22 chỗ import cứng `src/data/*.js`** ở các component/utils sang tầng **`src/services/`** giao tiếp chuẩn **`async/await`**.
  - Chuẩn hóa **Canonical IDs** xuyên suốt (Từ vựng, Ngữ pháp, Kanji, Kaiwa) khớp lược đồ SQL và thiết kế hàng đợi **Sync Queue** phục vụ đồng bộ offline-to-online.

---

### 🧠 P1.2 (Medium-High): Cỗ Máy Trí Nhớ Não Bộ FSRS (Free Spaced Repetition Scheduler)
* **Mục tiêu:** Nâng cấp thuật toán SuperMemo-2 (SM-2 cổ điển từ năm 1987) lên giải thuật khoa học nhận thức thần kinh **FSRS** (chuẩn mới nhất của Anki 2024–2026).
* **Bản chất khoa học:**
  - SM-2 chỉ theo dõi 1 hệ số nhân cố định (Easiness Factor).
  - FSRS theo dõi 3 biến số tâm lý học nhận thức:
    1. **$S$ (Stability - Độ ổn định):** Số ngày cần thiết để xác suất nhớ một từ giảm xuống còn 90%.
    2. **$D$ (Difficulty - Độ khó cố hữu):** Mức độ khó của từ đó trong não bộ (từ 1 đến 10).
    3. **$R$ (Retrievability - Khả năng truy hồi):** Tỷ lệ phần trăm học viên nhớ được từ đó tại thời điểm hiện tại: $R = (1 + F \cdot t / S)^{-w}$.
* **Lợi ích thực tế:**
  - Cắt giảm 20% – 30% khối lượng ôn tập thừa thãi mà vẫn đảm bảo tỷ lệ nhớ trên 90%.
  - Hoạt động 100% Client-side trong `src/utils/fsrsAlgo.js`, $0\text{ms}$ độ trễ, không cần máy chủ.
  - Tự động map và nâng cấp dữ liệu SM-2 cũ của người học mà không bị mất lịch sử.

---

### ☕ P2.1 (High): Chuyển Đổi Kiến Trúc Fullstack Với Backend Java Core & Spring Boot 3
* **Mục tiêu:** Chuyển đổi từ mô hình Standalone Frontend sang hệ thống **Fullstack Client-Server Doanh nghiệp (Enterprise Architecture)**, lấy Java làm nền tảng xử lý logic và cơ sở dữ liệu quan hệ lưu trữ đám mây.
* **Kiến trúc Phân tầng & Công nghệ:**
  - **Tầng Java Core Engine:**
    + Ứng dụng triệt để OOP, Design Patterns (Strategy Pattern cho AI Hints, State Pattern cho phiên chơi Wordle).
    + Sử dụng **Java Collections (`HashMap`, `ArrayList`, `HashSet`)** và Stream API để thuật toán xác thực từ điển và so khớp màu Wordle đạt độ phức tạp $O(1)$ siêu tốc.
  - **Tầng RESTful Controller & Spring Security:**
    + Xây dựng RESTful API chuẩn mực:
      - `POST /api/v1/progress/sync`: Đồng bộ cây Bonsai, chuỗi Streak, lịch sử SM-2/FSRS và Sync Queue từ P1.1 lên đám mây.
      - `POST /api/v1/wordle/guess`: Nhận từ đoán, kiểm tra từ điển và trả về mảng trạng thái màu.
      - `GET /api/v1/wordle/hint`: Gọi an toàn sang Gemini API lấy gợi ý bí mật.
      - `GET /api/v1/wordle/leaderboard`: Lấy bảng vàng thành tích theo thời gian.
    + Bảo mật xác thực người dùng bằng **Spring Security 6 + Stateless JWT Authentication**.
  - **Tầng Lập lịch Tự động (Cronjob Task Scheduler):**
    + Sử dụng `@Scheduled(cron = "0 0 0 * * ?")` để đúng 00:00 hằng ngày tự động bốc từ bí mật mới cho Wordle, xác thực qua Blacklist và đẩy vào CSDL.
  - **Tầng Cơ sở Dữ liệu & Caching (Persistence Layer):**
    + Chuyển đổi toàn bộ dữ liệu tĩnh (`src/data/*.js`) thành CSDL quan hệ **PostgreSQL / MySQL** qua **Spring Data JPA / Hibernate**.
    + Tích hợp **Redis Caching** để lưu trữ bảng xếp hạng thời gian thực (Redis Sorted Sets) và phiên đấu phòng bạn bè với độ trễ cực thấp.

---

### 🌸 P2.2 (Medium): Đấu Trường Trí Tuệ Kotoba Wordle (言葉ワードル - Kết Nối Backend P2.1)
* **Mục tiêu:** Tạo minigame giải đố từ vựng mỗi ngày gây nghiện cao, rèn luyện tư duy suy luận từ vựng và mặt chữ Kana/Kanji kết hợp bảo mật chống gian lận tuyệt đối dựa trên hạ tầng **Backend + Cronjob 00:00 + Redis từ P2.1**.
* **Độ dài Ký tự & Quy tắc Đoán (Chốt dải từ 2 đến 5–6 ký tự):**
  - **Bỏ hẳn từ 1 ký tự:** Triệt tiêu hoàn toàn vì không thể áp dụng luật màu Wordle (không có màu vàng suy luận vị trí).
  - **Từ 2 ký tự (`ねこ`, `いぬ`, `やま`...):** Chế độ Khởi động / Tân thủ (Warm-up Mode), giới hạn số lượt đoán xuống còn **3 – 4 lượt** để tăng độ kịch tính.
  - **Từ 3 – 5 ký tự (`さくら`, `せんせい`, `あさごはん`...):** Dải vàng chuẩn mực cho Thử thách Ngày (Daily Challenge), tối ưu hoàn hảo cho màn hình điện thoại, chuẩn **6 lượt đoán**, đổi đề vào 00:00 hằng ngày nhờ Cronjob P2.1.
  - **Từ 6 ký tự (Tối đa):** Dành cho từ mượn Katakana hoặc động từ chia thể lịch sự.
* **Huy Hiệu Nhận Diện Thể Loại Chữ & Tự Đồng Bộ Bàn Phím (Script Type Indicator):**
  - Trước khi chơi, hệ thống ghim huy hiệu rõ ràng trên đầu bảng: `🌸 Hiragana (Từ thuần Nhật)`, `🔷 Katakana (Từ mượn / Ngoại lai)`, hoặc `🈸 Kanji (Hán tự N5)`.
  - **Tự động chuyển đổi bàn phím ảo:** Khi đề bài là Katakana, bàn phím tự đổi toàn bộ mặt chữ sang Katakana để người chơi định hình ngay và không bị gõ nhầm bảng chữ cái.
* **Bàn phím Lai & Gợi ý Biến âm kiểu Nhắn tin (Hybrid IME Input):**
  - *Gõ phím vật lý:* Gõ Romaji tự chuyển Kana (WanaKana), kèm **Thanh gợi ý nổi (Candidate Bar)** ngay dưới ô nhập để chọn nhanh trường âm (`ああ`, `ー`), âm ngắt (`っ`), hoặc biến âm.
  - *Bàn phím ảo trên màn hình:* Các phím đổi màu theo kết quả (Xanh lá = Đúng chữ & đúng vị trí, Vàng = Đúng chữ nhưng sai vị trí, Xám = Không có trong từ). Chạm hoặc giữ vào phím (như `あ`) sẽ bung popover bong bóng chọn `[あ] [ああ] [ぁ]`, phím `か` bung `[か] [が]`, phím `は` bung `[は] [ば] [ぱ]`.
* **Hệ thống Lọc Nội dung (Content Moderation):**
  - *Tách biệt hoàn toàn:* Bộ từ điển tra cứu của web giữ nguyên 100% (cho phép tra cứu cả từ lóng, tiếng chửi thề để phục vụ học tập/phim ảnh).
  - *Blacklist độc quyền Wordle:* Bộ lọc chặn toàn bộ từ bậy/tục tĩu không bao giờ được chọn làm từ bí mật.
  - *Chống lặp:* Thuật toán đảm bảo từ của ngày không lặp lại trong vòng 30 – 60 ngày.
* **Trợ lý AI Gợi ý Thông minh (Secure AI Hint):**
  - Khi còn $\le 3$ lượt đoán, người chơi có thể kích hoạt gợi ý AI.
  - Backend P2.1 giấu kín từ bí mật, gọi Gemini API sinh gợi ý ngữ cảnh (Từ loại, Chủ đề, Ý nghĩa tóm tắt bằng tiếng Việt/Anh) mà **không lộ chữ cái**.
* **Cơ chế Chống Gian Lận & Đua Top (Anti-Cheat & Fair Play):**
  - *Bảo mật Server-Side:* Frontend không biết từ bí mật; Backend chịu trách nhiệm so màu và trả kết quả.
  - *Phạt chuyển tab (Page Visibility API):* Out tab quá 2s để tra từ điển sẽ tiếp tục tính giờ phạt với hệ số cao hoặc xử thua để bảo đảm tính công bằng.
  - *Chặn sao chép:* Khóa sự kiện `Ctrl + V` trên ô nhập.
  - *Bảng vàng & Phòng đấu bạn bè:* Lưu trên **Redis Sorted Sets (P2.1)**, tính điểm kết hợp lượt đoán và thời gian hoàn thành (giây), hỗ trợ tạo mã phòng cùng thi đấu real-time.
* **Giao diện & Đa ngôn ngữ:**
  - Hỗ trợ chế độ nền **Sáng / Tối (Dark/Light mode)** theo hệ thống hoặc thủ công.
  - Song ngữ giao diện **Việt – Anh (VI / EN)**.

---

### 📚 P2.3 (Medium): Mở Rộng Giáo Trình Lên Dekiru Nihongo Sơ Trung Cấp (JLPT N4)
* **Mục tiêu:** Đưa người học tiến thẳng từ N5 lên N4 sau khi hoàn thành 15 bài đầu.
* **Nội dung mở rộng:**
  - 15 bài học tiếp theo (**Bài 16 đến Bài 30**) của giáo trình Dekiru Nihongo Sơ Trung cấp.
  - Bổ sung thêm ~1.000 từ vựng N4, 60 mẫu ngữ pháp phức hợp (thể bị động, sai khiến, tôn kính ngữ, khiêm nhường ngữ).
  - Tận dụng 100% cấu trúc giao diện và các phân hệ hiện có (Dashboard, Canvas, Quiz Orchestrator, Sakura Match) thông qua tầng `src/services/` (từ P1.1) mà không phải viết lại code giao diện.

---

### 🎙️ P3.1 (Normal): Phòng Hội Thoại Nhập Vai Tình Huống Gemini AI (Roleplay Scenarios)
* **Mục tiêu:** Tạo môi trường giao tiếp mở không theo kịch bản có sẵn, giúp học viên rèn luyện phản xạ sinh tồn tại Nhật Bản.
* **Các bối cảnh nhập vai thực tế (Scenarios):**
  1. *Quán ăn Shinjuku:* Bác chủ quán ramen chào hỏi, hỏi đi mấy người, hỏi khẩu vị (đậm/nhạt), topping.
  2. *Ga tàu Tokyo:* Nhân viên nhà ga hướng dẫn cách mua vé Suica, đổi tuyến Yamanote line.
  3. *Cửa hàng tiện lợi (Konbini):* Nhân viên hỏi có cần hâm nóng cơm hộp, lấy túi nilong hay đũa không.
  4. *Khách sạn truyền thống Ryokan:* Lễ tân hướng dẫn giờ tắm onsen và giờ ăn tối Kaiseki.
* **Cơ chế kỹ thuật:**
  - Sử dụng Google Gemini API (`gemini-1.5-flash` hoặc `gemini-2.0-flash` trên Google AI Studio) phản hồi siêu tốc dưới 1 giây.
  - Người dùng dán Google AI Studio API Key cá nhân miễn phí vào mục cài đặt (lưu cục bộ trong trình duyệt, bảo mật 100%).
  - Hộp phản hồi thông minh:
    + Câu đối đáp tiếng Nhật của nhân vật ảo kèm nút loa 🔊 nghe phát âm chuẩn.
    + Nhận xét cách nói của học viên: phân tích ngữ pháp nhẹ nhàng và gợi ý cách dùng từ chuẩn người Tokyo.

---

### 🎵 P3.2 (Low / R&D): Trực Quan Hóa Cao Độ Ngữ Điệu Tiếng Nhật (Pitch Accent F0 Visualizer)
* **Mục tiêu:** Khắc phục triệt để điểm yếu "nói tiếng Nhật bằng phẳng như tiếng Việt", giúp học viên phát âm đúng cao độ trầm bổng chuẩn Tokyo (*Atamadaka, Nakadaka, Odaka, Heiban*).
* **Cơ chế kỹ thuật:**
  - Tích hợp Web Audio API `AudioContext` và `AnalyserNode` trực tiếp trên trình duyệt.
  - Trích xuất đường cong tần số cơ bản (**F0 Fundamental Pitch Contour**).
  - Vẽ biểu đồ đường lượn sóng so khớp trực tiếp giữa giọng học viên và giọng mẫu của người Nhật:
    + Màu xanh lá: Trầm bổng đúng nhịp điệu.
    + Màu cam: Nhấn lệch âm tiết (ví dụ: nhấn nhầm từ `Ame` mưa sang kẹo).

---

## 🛡️ Tiêu Chuẩn Kỹ Thuật Đã Đạt Được Đến Hiện Tại
- **Framework:** React 19.2 + Vite 8.3 (Rolldown Rust Bundler).
- **Linter:** Oxlint đạt **0 warnings, 0 errors** trên toàn bộ 71 files.
- **Build Time:** 349ms cho 97 modules (đã tách riêng `vendor.js` và `index.js`).
- **State Management:** Zustand 5.0 với Atomic Selectors + `useShallow`.
- **IME:** WanaKana 5.3 chuẩn hóa 100% quốc tế.
