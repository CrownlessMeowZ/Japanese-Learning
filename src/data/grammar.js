/**
 * Dữ liệu Ngữ Pháp (Grammar) Dekiru Nihongo Sơ Cấp (15 Bài học)
 * Đầy đủ công thức, giải thích ý nghĩa ngữ cảnh và ví dụ song ngữ Nhật - Việt
 */

export const grammarData = {
  // =========================================================
  // BÀI 1: CHÀO HỎI, TÊN TUỔI, NGHỀ NGHIỆP, QUỐC TỊCH
  // =========================================================
  1: [
    {
      id: 'L01_G01',
      title: '～は ～です',
      titleVi: 'N1 là N2 (Câu khẳng định)',
      explanation: 'Dùng để giới thiệu danh tính, nghề nghiệp, quốc tịch. は là trợ từ chủ ngữ (đọc là "wa"), です biểu thị sự lịch sự cuối câu.',
      structure: 'N1 は N2 です',
      examples: [
        { japanese: '私はアンです。', vietnamese: 'Tôi là An.' },
        { japanese: '山田さんは日本人です。', vietnamese: 'Anh Yamada là người Nhật.' },
        { japanese: 'マイさんはエンジニアです。', vietnamese: 'Mai là kỹ sư.' }
      ]
    },
    {
      id: 'L01_G02',
      title: '～は ～じゃありません / ではありません',
      titleVi: 'N1 không phải là N2 (Câu phủ định)',
      explanation: 'Dạng phủ định của です. Trong văn nói hàng ngày thường dùng じゃありません, trong văn viết hoặc trang trọng dùng ではありません.',
      structure: 'N1 は N2 じゃありません (hoặc ではありません)',
      examples: [
        { japanese: '私は学生じゃありません。', vietnamese: 'Tôi không phải là học sinh.' },
        { japanese: 'サントスさんは医者ではありません。', vietnamese: 'Anh Santos không phải là bác sĩ.' },
        { japanese: 'あれは銀行じゃありません。', vietnamese: 'Kia không phải là ngân hàng.' }
      ]
    },
    {
      id: 'L01_G03',
      title: '～は ～ですか',
      titleVi: 'N1 có phải là N2 không? (Câu hỏi nghi vấn)',
      explanation: 'Thêm trợ từ か vào cuối câu để tạo thành câu hỏi Yes/No. Trả lời khẳng định dùng はい、そうです; phủ định dùng いいえ、違います hoặc いいえ、～じゃありません.',
      structure: 'N1 は N2 ですか ➔ はい、～です / いいえ、～じゃありません',
      examples: [
        { japanese: 'あなたはベトナム人ですか。', vietnamese: 'Bạn có phải là người Việt Nam không?' },
        { japanese: 'はい、ベトナム人です。', vietnamese: 'Vâng, tôi là người Việt Nam.' },
        { japanese: 'ミラーさんは会社員ですか。', vietnamese: 'Anh Miller có phải là nhân viên công ty không?' }
      ]
    },
    {
      id: 'L01_G04',
      title: '～も ～です',
      titleVi: 'N cũng là... (Trợ từ も - "Cũng")',
      explanation: 'Trợ từ も thay thế cho は khi thông tin về đối tượng này tương đồng với đối tượng đã nhắc trước đó.',
      structure: 'N1 は ... です。N2 も ... です。',
      examples: [
        { japanese: 'ナムさんは学生です。私も学生です。', vietnamese: 'Nam là học sinh. Tôi cũng là học sinh.' },
        { japanese: 'リンさんも先生ですか。', vietnamese: 'Linh cũng là giáo viên phải không?' }
      ]
    },
    {
      id: 'L01_G05',
      title: 'N1 の N2',
      titleVi: 'N2 của N1 / N2 thuộc N1 (Trợ từ の)',
      explanation: 'Trợ từ の dùng để nối hai danh từ, biểu thị quyền sở hữu, trực thuộc tổ chức, hoặc xuất xứ.',
      structure: 'N1 の N2',
      examples: [
        { japanese: 'これは私の本です。', vietnamese: 'Đây là cuốn sách của tôi.' },
        { japanese: '彼はFPT大学の学生です。', vietnamese: 'Anh ấy là sinh viên của trường Đại học FPT.' },
        { japanese: '日本の車は有名です。', vietnamese: 'Ô tô của Nhật Bản rất nổi tiếng.' }
      ]
    }
  ],

  // =========================================================
  // BÀI 2: ĐỒ VẬT, MUA SẮM, VỊ TRÍ XUNG QUANH
  // =========================================================
  2: [
    {
      id: 'L02_G01',
      title: 'これ / それ / あれ は ～です',
      titleVi: 'Cái này / Cái đó / Cái kia là... (Chỉ định từ đồ vật)',
      explanation: 'これ (gần người nói), それ (gần người nghe), あれ (xa cả hai). Dùng để chỉ định đồ vật cụ thể.',
      structure: 'これ / それ / あれ は N です',
      examples: [
        { japanese: 'これは日本の辞書です。', vietnamese: 'Đây là từ điển tiếng Nhật.' },
        { japanese: 'それは何ですか。', vietnamese: 'Đó là cái gì thế?' },
        { japanese: 'あれは私の傘です。', vietnamese: 'Kia là chiếc ô của tôi.' }
      ]
    },
    {
      id: 'L02_G02',
      title: 'この / その / あの N は ～です',
      titleVi: 'Cái N này / N đó / N kia là...',
      explanation: 'Khác với これ/それ/あれ đứng độc lập, この/その/あの bắt buộc phải đi kèm trực tiếp với một danh từ ngay sau nó.',
      structure: 'この / その / あの + N は ... です',
      examples: [
        { japanese: 'この本はとても面白いです。', vietnamese: 'Cuốn sách này rất thú vị.' },
        { japanese: 'そのペンは誰のですか。', vietnamese: 'Cây bút đó là của ai vậy?' },
        { japanese: 'あのかばんは私のです。', vietnamese: 'Chiếc cặp kia là của tôi.' }
      ]
    },
    {
      id: 'L02_G03',
      title: 'ここ / そこ / あそこ は ～です',
      titleVi: 'Chỗ này / Chỗ đó / Chỗ kia là... (Chỉ địa điểm)',
      explanation: 'Chỉ định vị trí địa lý: ここ (nơi người nói đang đứng), そこ (nơi người nghe đang đứng), あそこ (nơi xa cả hai). Lịch sự hơn là こちら / そちら / あちら.',
      structure: 'ここ / そこ / あそこ は N(địa điểm) です',
      examples: [
        { japanese: 'ここは教室です。', vietnamese: 'Đây là phòng học.' },
        { japanese: '受付はあちらです。', vietnamese: 'Quầy tiếp tân ở đằng kia ạ.' },
        { japanese: 'トイレはどこですか。', vietnamese: 'Nhà vệ sinh ở đâu vậy?' }
      ]
    },
    {
      id: 'L02_G04',
      title: '～は いくらですか / ～を ください',
      titleVi: 'Hỏi giá tiền & Chọn mua đồ',
      explanation: 'Dùng khi đi mua sắm tại cửa hàng, siêu thị. いくら hỏi giá tiền, を ください yêu cầu người bán hàng lấy món đồ đó.',
      structure: 'N は いくらですか / N を ください',
      examples: [
        { japanese: 'このリンゴはいくらですか。', vietnamese: 'Quả táo này bao nhiêu tiền vậy?' },
        { japanese: '一つ150円です。', vietnamese: 'Một quả giá 150 yên.' },
        { japanese: 'じゃ、これを二つください。', vietnamese: 'Vậy thì cho tôi lấy 2 quả này.' }
      ]
    }
  ],

  // =========================================================
  // BÀI 3: THỜI GIAN, SINH HOẠT HÀNG NGÀY, LỊCH TRÌNH
  // =========================================================
  3: [
    {
      id: 'L03_G01',
      title: '今 ～時 ～分 です',
      titleVi: 'Bây giờ là ~ giờ ~ phút',
      explanation: 'Dùng để hỏi và nói thời gian hiện tại. 何時 (mấy giờ), 何分 (mấy phút). Bán thời gian dùng 半 (rưỡi).',
      structure: '今 [Số đếm]時 [Số đếm]分 です',
      examples: [
        { japanese: '今、何時ですか。', vietnamese: 'Bây giờ là mấy giờ rồi?' },
        { japanese: '午前9時30分(9時半)です。', vietnamese: 'Bây giờ là 9 giờ 30 phút sáng (9 rưỡi).' },
        { japanese: '東京は今、午後2時です。', vietnamese: 'Ở Tokyo bây giờ là 2 giờ chiều.' }
      ]
    },
    {
      id: 'L03_G02',
      title: 'V-ます / V-ません / V-ました / V-ませんでした',
      titleVi: 'Hệ thống thời & thể của động từ',
      explanation: 'ます (hiện tại / tương lai), ません (phủ định), ました (quá khứ), ませんでした (phủ định quá khứ).',
      structure: 'Khẳng định: V-ます / Quá khứ: V-ました / Phủ định: V-ません / Phủ định quá khứ: V-ませんでした',
      examples: [
        { japanese: '毎朝、6時に起きます。', vietnamese: 'Mỗi sáng tôi thức dậy lúc 6 giờ.' },
        { japanese: '昨日は勉強しませんでした。', vietnamese: 'Hôm qua tôi đã không học bài.' },
        { japanese: '明日、図書館へ行きますか。', vietnamese: 'Ngày mai bạn có đến thư viện không?' }
      ]
    },
    {
      id: 'L03_G03',
      title: '～に V-ます',
      titleVi: 'Làm gì vào lúc... (Trợ từ thời gian に)',
      explanation: 'Trợ từ に đi kèm sau danh từ chỉ mốc thời gian cụ thể có con số (ngày, tháng, giờ giấc, thứ trong tuần).',
      structure: 'Thời gian cụ thể + に + V',
      examples: [
        { japanese: '毎晩、11時に寝ます。', vietnamese: 'Mỗi tối tôi đi ngủ lúc 11 giờ.' },
        { japanese: '日曜日に友達と遊びます。', vietnamese: 'Chủ nhật tôi đi chơi với bạn bè.' },
        { japanese: '何時に会社へ行きますか。', vietnamese: 'Bạn đi làm lúc mấy giờ?' }
      ]
    },
    {
      id: 'L03_G04',
      title: '～から ～まで',
      titleVi: 'Từ ~ đến ~ (Thời gian / Địa điểm)',
      explanation: 'から biểu thị điểm bắt đầu (từ), まで biểu thị điểm kết thúc (đến). Có thể dùng riêng lẻ hoặc đi chung cặp.',
      structure: 'A から B まで V-ます / です',
      examples: [
        { japanese: '銀行は9時から5時までです。', vietnamese: 'Ngân hàng mở cửa từ 9 giờ đến 5 giờ.' },
        { japanese: '昼休みは12時からです。', vietnamese: 'Giờ nghỉ trưa bắt đầu từ 12 giờ.' },
        { japanese: '家から駅まで歩きます。', vietnamese: 'Tôi đi bộ từ nhà đến ga.' }
      ]
    }
  ],

  // =========================================================
  // BÀI 4: VỊ TRÍ, DI CHUYỂN, TÍNH TỪ VÀ MÔ TẢ ĐỊA ĐIỂM
  // =========================================================
  4: [
    {
      id: 'L04_G01',
      title: '～は ～の ～です',
      titleVi: 'A ở vị trí C của B (Chỉ vị trí không gian)',
      explanation: 'Dùng để chỉ vị trí tương đối của một sự vật so với một sự vật mốc (trên, dưới, trong, ngoài, cạnh, đối diện...).',
      structure: 'N1 は N2 の [Vị trí: 上/下/中/隣/前/後ろ] です',
      examples: [
        { japanese: '郵便局は銀行の隣です。', vietnamese: 'Bưu điện ở bên cạnh ngân hàng.' },
        { japanese: '犬は机の下です。', vietnamese: 'Con chó ở dưới cái bàn.' },
        { japanese: '本はかばんの中です。', vietnamese: 'Sách ở trong cặp.' }
      ]
    },
    {
      id: 'L04_G02',
      title: '～から ～まで どのくらいですか',
      titleVi: 'Từ ~ đến ~ mất bao lâu?',
      explanation: 'Dùng để hỏi khoảng thời gian hoặc chi phí cần thiết để di chuyển giữa hai địa điểm.',
      structure: 'N1 から N2 まで どのくらいですか',
      examples: [
        { japanese: '東京から大阪までどのくらいですか。', vietnamese: 'Từ Tokyo đến Osaka mất bao lâu?' },
        { japanese: '家から学校まで歩いて10分です。', vietnamese: 'Từ nhà đến trường đi bộ mất 10 phút.' }
      ]
    },
    {
      id: 'L04_G03',
      title: '～は どんな ところですか',
      titleVi: '～ là nơi như thế nào? (Hỏi tính chất)',
      explanation: 'Dùng để hỏi về đặc điểm, tính chất của một địa điểm, danh lam thắng cảnh.',
      structure: 'N は どんな ところですか ➔ [Tính từ] ところです',
      examples: [
        { japanese: 'ハノイはどんなところですか。', vietnamese: 'Hà Nội là nơi như thế nào?' },
        { japanese: 'きれいでにぎやかなところです。', vietnamese: 'Là một nơi đẹp và náo nhiệt.' }
      ]
    },
    {
      id: 'L04_G04',
      title: 'い-adjective です / じゃないです',
      titleVi: 'Tính từ đuôi い (Khẳng định / Phủ định)',
      explanation: 'Cách chia tính từ đuôi い ở hiện tại: Giữ nguyên い + です; Phủ định bỏ い thêm くないです (hoặc くありません).',
      structure: 'A-い です / A-く ないです (A-く ありません)',
      examples: [
        { japanese: 'このラーメンはおいしいです。', vietnamese: 'Món ramen này ngon.' },
        { japanese: '日本の物価は安くないです。', vietnamese: 'Vật giá ở Nhật Bản không rẻ.' },
        { japanese: '今日は暑くないです。', vietnamese: 'Hôm nay không nóng.' }
      ]
    },
    {
      id: 'L04_G05',
      title: 'な-adjective です / じゃありません',
      titleVi: 'Tính từ đuôi な (Khẳng định / Phủ định)',
      explanation: 'Cách chia tính từ đuôi な ở hiện tại: Bỏ な + です; Phủ định bỏ な + じゃありません (hoặc じゃないです).',
      structure: 'A-な(bỏ な) です / A じゃありません (A じゃないです)',
      examples: [
        { japanese: '彼女はきれいです。', vietnamese: 'Cô ấy rất đẹp.' },
        { japanese: 'この町は静かじゃありません。', vietnamese: 'Thị trấn này không yên tĩnh.' },
        { japanese: '私は有名じゃありません。', vietnamese: 'Tôi không nổi tiếng.' }
      ]
    },
    {
      id: 'L04_G06',
      title: '～は ～が あります',
      titleVi: 'Có / Sở hữu sự vật (Đồ vật vô tri)',
      explanation: 'Dùng để nói về việc ai đó sở hữu cái gì, hoặc ở đâu có cái gì (đối với đồ vật vô tri vô giác).',
      structure: 'N1(người/địa điểm) は N2 が あります',
      examples: [
        { japanese: '私は車があります。', vietnamese: 'Tôi có ô tô.' },
        { japanese: 'この町は温泉があります。', vietnamese: 'Thị trấn này có suối nước nóng.' }
      ]
    }
  ],

  // =========================================================
  // BÀI 5: QUÁ KHỨ, TÂN NGỮ, MONG MUỐN VÀ SỞ THÍCH
  // =========================================================
  5: [
    {
      id: 'L05_G01',
      title: 'Past tense: ～ました / ～ませんでした',
      titleVi: 'Thì quá khứ của động từ',
      explanation: 'Dùng để diễn tả những hành động đã xảy ra hoặc không xảy ra trong quá khứ.',
      structure: 'V-ました (Khẳng định quá khứ) / V-ませんでした (Phủ định quá khứ)',
      examples: [
        { japanese: '昨日、日本語を勉強しました。', vietnamese: 'Hôm qua tôi đã học tiếng Nhật.' },
        { japanese: '先週、どこも行きませんでした。', vietnamese: 'Tuần trước tôi đã không đi đâu cả.' },
        { japanese: '今朝、朝ごはんを食べませんでした。', vietnamese: 'Sáng nay tôi đã không ăn sáng.' }
      ]
    },
    {
      id: 'L05_G02',
      title: '～に 行きます / 来ます / 帰ります',
      titleVi: 'Đi / Đến / Về đâu đó (Trợ từ に/へ)',
      explanation: 'Trợ từ に hoặc へ chỉ phương hướng, đích đến của hành vi di chuyển.',
      structure: 'N(địa điểm) に / へ 行きます / 来ます / 帰ります',
      examples: [
        { japanese: '明日、デパートに行きます。', vietnamese: 'Ngày mai tôi sẽ đi trung tâm thương mại.' },
        { japanese: '週末に海に行きました。', vietnamese: 'Cuối tuần tôi đã đi biển.' },
        { japanese: '何時にうちへ帰りますか。', vietnamese: 'Mấy giờ bạn về nhà?' }
      ]
    },
    {
      id: 'L05_G03',
      title: '～を ～ます',
      titleVi: 'Làm hành động gì với đối tượng gì (Trợ từ を)',
      explanation: 'Trợ từ を (đọc là "o") đứng sau danh từ để chỉ đối tượng trực tiếp chịu tác động của tha động từ.',
      structure: 'N(tân ngữ) を V-ます',
      examples: [
        { japanese: '毎日、コーヒーを飲みます。', vietnamese: 'Mỗi ngày tôi đều uống cà phê.' },
        { japanese: '昨日、綺麗な写真を撮りました。', vietnamese: 'Hôm qua tôi đã chụp bức ảnh đẹp.' },
        { japanese: '音楽を聞きます。', vietnamese: 'Tôi nghe âm nhạc.' }
      ]
    },
    {
      id: 'L05_G04',
      title: '～が ほしいです',
      titleVi: 'Muốn có cái gì đó (Mong muốn sở hữu)',
      explanation: 'Dùng để diễn tả mong muốn có được một danh từ/vật chất nào đó của bản thân người nói.',
      structure: 'N が ほしいです (Phủ định: ほしくないです)',
      examples: [
        { japanese: '私は新しいパソコンがほしいです。', vietnamese: 'Tôi muốn có một chiếc máy tính mới.' },
        { japanese: '今、時間とお金がほしいです。', vietnamese: 'Bây giờ tôi muốn có thời gian và tiền bạc.' }
      ]
    },
    {
      id: 'L05_G05',
      title: '～が 好きです / 嫌いです',
      titleVi: 'Thích / Ghét cái gì đó',
      explanation: '好き (thích), 嫌い (ghét), 上手 (giỏi), 下手 (kém) là các tính từ đuôi な, đối tượng hướng tới luôn đi với trợ từ が.',
      structure: 'N が 好きです / 嫌いです',
      examples: [
        { japanese: '私は日本料理が好きです。', vietnamese: 'Tôi rất thích các món ăn Nhật Bản.' },
        { japanese: '弟は野菜が嫌いです。', vietnamese: 'Em trai tôi rất ghét rau.' },
        { japanese: 'カラオケが大好きです。', vietnamese: 'Tôi cực kỳ thích hát karaoke.' }
      ]
    }
  ],

  // =========================================================
  // BÀI 6: LỜI MỜI, RỦ RÊ, SO SÁNH VÀ LỰA CHỌN
  // =========================================================
  6: [
    {
      id: 'L06_G01',
      title: '～ませんか',
      titleVi: 'Lời mời lịch sự: Bạn có muốn ~ cùng không?',
      explanation: 'Dùng để mời hoặc rủ rê đối phương cùng làm gì với mình một cách lịch sự, tôn trọng sự lựa chọn của đối phương.',
      structure: 'V-ませんか',
      examples: [
        { japanese: '一緒に映画を見ませんか。', vietnamese: 'Bạn cùng đi xem phim với tôi không?' },
        { japanese: '明日、お茶を飲みませんか。', vietnamese: 'Ngày mai đi uống trà cùng tôi nhé?' },
        { japanese: 'ちょっと休みませんか。', vietnamese: 'Chúng ta nghỉ một chút nhé?' }
      ]
    },
    {
      id: 'L06_G02',
      title: '～ましょう',
      titleVi: 'Cùng ~ nào / Để tôi làm cho nhé',
      explanation: 'Dùng khi người nói chủ động kêu gọi cùng làm, hoặc đồng ý hào hứng với lời rủ rê ～ませんか.',
      structure: 'V-ましょう',
      examples: [
        { japanese: 'はい、ぜひ行きましょう。', vietnamese: 'Vâng, nhất định cùng đi nhé!' },
        { japanese: '12時ですね。昼ごはんを食べましょう。', vietnamese: '12 giờ rồi nhỉ. Cùng ăn trưa nào!' },
        { japanese: '写真を撮りましょう。', vietnamese: 'Cùng chụp ảnh nào!' }
      ]
    },
    {
      id: 'L06_G03',
      title: '～と ～と どちらが ～ですか',
      titleVi: 'So sánh lựa chọn giữa 2 vật',
      explanation: 'Dùng để hỏi xem giữa 2 danh từ A và B, cái nào hơn theo một tiêu chí tính từ nào đó.',
      structure: 'N1 と N2 と どちらが A-ですか ➔ N1/N2 の ほうが A-です',
      examples: [
        { japanese: 'サッカーと野球とどちらが好きですか。', vietnamese: 'Bóng đá và bóng chày bạn thích môn nào hơn?' },
        { japanese: 'サッカーのほうが好きです。', vietnamese: 'Tôi thích bóng đá hơn.' },
        { japanese: '肉と魚とどちらがおいしいですか。', vietnamese: 'Thịt và cá món nào ngon hơn?' }
      ]
    },
    {
      id: 'L06_G04',
      title: '～の中で ～が いちばん ～です',
      titleVi: 'So sánh nhất trong một phạm vi/nhóm',
      explanation: 'Dùng để chỉ ra đối tượng nổi trội nhất về tính chất trong một tập hợp hoặc phạm vi.',
      structure: 'N(nhóm phạm vi) の中で N(đối tượng) が いちばん A-です',
      examples: [
        { japanese: '果物の中でりんごがいちばん好きです。', vietnamese: 'Trong các loại trái cây tôi thích táo nhất.' },
        { japanese: '日本の中で東京がいちばんにぎやかです。', vietnamese: 'Ở Nhật Bản thì Tokyo là náo nhiệt nhất.' },
        { japanese: '1年でいつがいちばん寒いですか。', vietnamese: 'Trong một năm thì khi nào lạnh nhất?' }
      ]
    }
  ],

  // =========================================================
  // BÀI 7: TỒN TẠI ĐỘNG THỰC VẬT, YÊU CẦU VÀ CẤM CHỈ
  // =========================================================
  7: [
    {
      id: 'L07_G01',
      title: '～に ～が あります / います',
      titleVi: 'Ở địa điểm có sự vật / sinh vật',
      explanation: 'あります dùng cho đồ vật vô tri, thực vật. います dùng cho sinh vật sống chuyển động được (người, động vật).',
      structure: 'N(địa điểm) に N(vật/người) が あります / います',
      examples: [
        { japanese: '部屋に机があります。', vietnamese: 'Trong phòng có cái bàn.' },
        { japanese: '公園に犬がいます。', vietnamese: 'Trong công viên có một con chó.' },
        { japanese: '教室に田中先生がいます。', vietnamese: 'Trong lớp học có thầy Tanaka.' }
      ]
    },
    {
      id: 'L07_G02',
      title: '～は ～に あります / います',
      titleVi: 'Đối tượng cụ thể đang ở địa điểm nào',
      explanation: 'Đảo danh từ lên làm chủ ngữ với は để nhấn mạnh vị trí hiện tại của đối tượng đó.',
      structure: 'N(vật/người) は N(địa điểm) に あります / います',
      examples: [
        { japanese: 'トイレはあそこにあります。', vietnamese: 'Nhà vệ sinh ở đằng kia.' },
        { japanese: '山田さんは会議室にいます。', vietnamese: 'Anh Yamada đang ở phòng họp.' },
        { japanese: '鍵はかばんの中にあります。', vietnamese: 'Chìa khóa ở trong túi xách.' }
      ]
    },
    {
      id: 'L07_G03',
      title: '～てください',
      titleVi: 'Hãy làm ~ (Yêu cầu, nhờ vả lịch sự)',
      explanation: 'Động từ chia thể て kết hợp ください dùng để đưa ra lời yêu cầu, hướng dẫn hoặc nhờ vả ai đó làm việc gì.',
      structure: 'V-て ください',
      examples: [
        { japanese: '窓を開けてください。', vietnamese: 'Xin hãy mở cửa sổ giúp tôi.' },
        { japanese: 'ここに名前を書いてください。', vietnamese: 'Xin vui lòng viết tên vào đây.' },
        { japanese: '日本語で話してください。', vietnamese: 'Hãy nói bằng tiếng Nhật nhé.' }
      ]
    },
    {
      id: 'L07_G04',
      title: '～ないでください',
      titleVi: 'Xin đừng làm ~ (Yêu cầu không làm gì)',
      explanation: 'Động từ chia thể ない kết hợp でください dùng để khuyên nhủ hoặc yêu cầu người khác không thực hiện hành động đó.',
      structure: 'V-ないで ください',
      examples: [
        { japanese: 'ここで写真を撮らないでください。', vietnamese: 'Xin đừng chụp ảnh ở đây.' },
        { japanese: 'パスポートを忘れないでください。', vietnamese: 'Xin đừng quên hộ chiếu nhé.' },
        { japanese: '無理をしないでください。', vietnamese: 'Đừng làm việc quá sức nhé.' }
      ]
    }
  ],

  // =========================================================
  // BÀI 8: PHƯƠNG TIỆN, TRÌNH TỰ VÀ HÀNH ĐỘNG TIẾP DIỄN
  // =========================================================
  8: [
    {
      id: 'L08_G01',
      title: 'N(phương tiện / công cụ) で V-ます',
      titleVi: 'Làm gì bằng phương tiện / công cụ gì (Trợ từ で)',
      explanation: 'Trợ từ で biểu thị phương tiện giao thông (tàu, xe) hoặc công cụ, dụng cụ, ngôn ngữ được sử dụng để thực hiện hành động.',
      structure: 'N(công cụ/phương tiện/ngôn ngữ) で V-ます',
      examples: [
        { japanese: '電車で会社へ行きます。', vietnamese: 'Tôi đi làm bằng tàu điện.' },
        { japanese: 'はしでご飯を食べます。', vietnamese: 'Tôi ăn cơm bằng đũa.' },
        { japanese: '日本語でレポートを書きました。', vietnamese: 'Tôi đã viết báo cáo bằng tiếng Nhật.' }
      ]
    },
    {
      id: 'L08_G02',
      title: 'V-ています (Hành động đang tiếp diễn)',
      titleVi: 'Đang làm gì (Thì hiện tại tiếp diễn)',
      explanation: 'Động từ thể て + います biểu thị một hành động đang diễn ra ngay tại thời điểm nói.',
      structure: 'V-て います (Phủ định: V-て いません)',
      examples: [
        { japanese: '今、日本語を勉強しています。', vietnamese: 'Bây giờ tôi đang học tiếng Nhật.' },
        { japanese: '外で雨が降っています。', vietnamese: 'Bên ngoài trời đang mưa.' },
        { japanese: '父はテレビを見ています。', vietnamese: 'Bố tôi đang xem tivi.' }
      ]
    },
    {
      id: 'L08_G03',
      title: 'V1-て、V2-て、V3-ます',
      titleVi: 'Nối các hành động theo trình tự thời gian',
      explanation: 'Dùng thể て để liên kết chuỗi hành động diễn ra nối tiếp nhau. Thời của cả câu được quyết định bởi động từ cuối cùng.',
      structure: 'V1-て、V2-て、... Vn-ます / ました',
      examples: [
        { japanese: '朝起きて、顔を洗って、朝ごはんを食べます。', vietnamese: 'Buổi sáng tôi thức dậy, rửa mặt rồi ăn sáng.' },
        { japanese: '駅へ行って、切符を買いました。', vietnamese: 'Tôi đã đến nhà ga rồi mua vé.' }
      ]
    },
    {
      id: 'L08_G04',
      title: 'V1-てから V2',
      titleVi: 'Sau khi làm V1 thì làm V2',
      explanation: 'Nhấn mạnh hành động V1 phải kết thúc hoàn toàn thì hành động V2 mới được bắt đầu thực hiện.',
      structure: 'V1-て から、V2-ます',
      examples: [
        { japanese: '手を洗ってから、ご飯を食べます。', vietnamese: 'Sau khi rửa tay sạch sẽ thì mới ăn cơm.' },
        { japanese: '仕事が終わってから、飲みに行きませんか。', vietnamese: 'Sau khi xong việc, đi uống chút gì đó không?' }
      ]
    }
  ],

  // =========================================================
  // BÀI 9: XIN PHÉP, CẤM CHỈ, TRẠNG THÁI & KẾT QUẢ
  // =========================================================
  9: [
    {
      id: 'L09_G01',
      title: 'V-てもいいですか',
      titleVi: 'Làm ~ có được không? (Xin phép lịch sự)',
      explanation: 'Dùng khi muốn xin phép đối phương cho mình thực hiện một hành vi nào đó.',
      structure: 'V-て もいいですか ➔ はい、いいですよ / すみません、ちょっと...',
      examples: [
        { japanese: 'ここに座ってもいいですか。', vietnamese: 'Tôi ngồi ở đây có được không?' },
        { japanese: '写真を撮ってもいいですか。', vietnamese: 'Tôi chụp ảnh có được phép không?' },
        { japanese: '窓を閉めてもいいですか。', vietnamese: 'Tôi đóng cửa sổ lại có được không?' }
      ]
    },
    {
      id: 'L09_G02',
      title: 'V-てはいけません',
      titleVi: 'Không được phép làm ~ (Cấm chỉ nghiêm ngặt)',
      explanation: 'Dùng để thông báo quy định, điều luật hoặc người bề trên nhắc nhở không được phép làm gì.',
      structure: 'V-て は いけません',
      examples: [
        { japanese: 'ここでタバコを吸ってはいけません。', vietnamese: 'Không được hút thuốc ở khu vực này.' },
        { japanese: '美術館で写真を撮ってはいけません。', vietnamese: 'Không được phép chụp ảnh trong bảo tàng mỹ thuật.' },
        { japanese: '試験中に話してはいけません。', vietnamese: 'Trong giờ thi không được nói chuyện.' }
      ]
    },
    {
      id: 'L09_G03',
      title: 'V-ています (Trạng thái kết quả kéo dài)',
      titleVi: 'Đang ở trạng thái... (Sống, Kết hôn, Biết, Sở hữu)',
      explanation: 'Một số động từ khi chia V-ています không mang nghĩa đang làm, mà biểu thị kết quả của một hành động vẫn đang duy trì tới hiện tại.',
      structure: 'V-て います',
      examples: [
        { japanese: '私はハノイに住んでいます。', vietnamese: 'Tôi đang sinh sống ở Hà Nội.' },
        { japanese: '田中さんを知っていますか。', vietnamese: 'Bạn có biết anh Tanaka không?' },
        { japanese: '兄は結婚しています。', vietnamese: 'Anh trai tôi đã kết hôn.' }
      ]
    },
    {
      id: 'L09_G04',
      title: 'Mệnh đề 1 が、Mệnh đề 2',
      titleVi: 'Tuy... nhưng... (Nối 2 vế tương phản)',
      explanation: 'Trợ từ が đặt giữa hai câu đơn để nối hai vế có ý nghĩa trái ngược hoặc nhượng bộ nhau.',
      structure: 'Câu 1 が、Câu 2',
      examples: [
        { japanese: '日本の料理はおいしいですが、高いです。', vietnamese: 'Món ăn Nhật ngon nhưng giá khá đắt.' },
        { japanese: '日本語は難しいですが、とても面白いです。', vietnamese: 'Tiếng Nhật khó nhưng rất thú vị.' }
      ]
    }
  ],

  // =========================================================
  // BÀI 10: NĂNG LỰC, SỞ THÍCH VÀ KINH NGHIỆM ĐÃ TỪNG
  // =========================================================
  10: [
    {
      id: 'L10_G01',
      title: 'N / V-ることが できます',
      titleVi: 'Có thể làm được việc gì (Năng lực / Khả năng)',
      explanation: 'Diễn tả năng lực của bản thân hoặc khả năng hoàn cảnh cho phép thực hiện hành động. Động từ đưa về thể từ điển (V-る) kết hợp こと để danh từ hóa.',
      structure: 'V-(thể từ điển) ことが できます / N が できます',
      examples: [
        { japanese: '私はピアノを弾くことができます。', vietnamese: 'Tôi có thể chơi đàn piano.' },
        { japanese: 'このホテルで両替ができますか。', vietnamese: 'Ở khách sạn này có thể đổi tiền được không?' },
        { japanese: '日本語でメールを書くことができます。', vietnamese: 'Tôi có thể viết email bằng tiếng Nhật.' }
      ]
    },
    {
      id: 'L10_G02',
      title: '私の趣味は V-ること / N です',
      titleVi: 'Sở thích của tôi là...',
      explanation: 'Dùng cấu trúc V-ること để danh từ hóa hành động khi giới thiệu sở thích cá nhân.',
      structure: '私の趣味は V-(thể từ điển) こと です',
      examples: [
        { japanese: '私の趣味は旅行することです。', vietnamese: 'Sở thích của tôi là đi du lịch.' },
        { japanese: '趣味は映画を見ることと料理です。', vietnamese: 'Sở thích của tôi là xem phim và nấu ăn.' }
      ]
    },
    {
      id: 'L10_G03',
      title: 'V-た ことが あります',
      titleVi: 'Đã từng làm gì đó trong quá khứ (Kinh nghiệm)',
      explanation: 'Động từ chia thể quá khứ ngắn (thể た) kết hợp ことがあります để nói về trải nghiệm từng có ít nhất một lần trong đời.',
      structure: 'V-た ことが あります (Phủ định: ことが ありません)',
      examples: [
        { japanese: '富士山に登ったことがあります。', vietnamese: 'Tôi đã từng leo núi Phú Sĩ.' },
        { japanese: '日本酒を飲んだことがありますか。', vietnamese: 'Bạn đã từng uống rượu Sake của Nhật bao giờ chưa?' },
        { japanese: '一度も刺身を食べたことがありません。', vietnamese: 'Tôi chưa từng ăn món Sashimi lần nào cả.' }
      ]
    },
    {
      id: 'L10_G04',
      title: 'V-たり、V-たり します',
      titleVi: 'Lúc thì làm cái này, lúc thì làm cái kia (Liệt kê)',
      explanation: 'Dùng để liệt kê vài hành động tiêu biểu đại diện trong số nhiều hành động, không bắt buộc theo thứ tự trước sau.',
      structure: 'V1-たり、V2-たり します / しました',
      examples: [
        { japanese: '休みの日は本を読んだり、散歩したりします。', vietnamese: 'Ngày nghỉ tôi lúc thì đọc sách, lúc thì đi dạo.' },
        { japanese: '昨日は買い物をしたり、友達と会ったりしました。', vietnamese: 'Hôm qua tôi đã đi mua sắm và gặp gỡ bạn bè.' }
      ]
    }
  ],

  // =========================================================
  // BÀI 11: THỂ THÔNG THƯỜNG, NÊU SUY NGHĨ VÀ TRÍCH DẪN
  // =========================================================
  11: [
    {
      id: 'L11_G01',
      title: 'Thể thông thường (普通形 - Plain Form)',
      titleVi: 'Cách dùng thể ngắn thân mật',
      explanation: 'Dùng khi nói chuyện với bạn bè, người thân hoặc khi ghép vào các cấu trúc ngữ pháp phức tạp. Thay thế ます/です bằng dạng từ điển, ない, た, かった, だ.',
      structure: 'V-る / V-ない / V-た / V-なかった / A-い / A-な・N + だ',
      examples: [
        { japanese: '今週、暇？ ➔ うん、暇だよ。', vietnamese: 'Tuần này rảnh không? ➔ Ừ, rảnh lắm.' },
        { japanese: '明日、どこへ行く？ ➔ どこも行かない。', vietnamese: 'Ngày mai đi đâu thế? ➔ Chẳng đi đâu cả.' }
      ]
    },
    {
      id: 'L11_G02',
      title: '[Thể thông thường] と 思います',
      titleVi: 'Tôi nghĩ rằng... (Bày tỏ quan điểm cá nhân)',
      explanation: 'Dùng để nêu lên suy nghĩ, phán đoán hoặc ý kiến chủ quan của người nói về một sự việc.',
      structure: 'Mệnh đề (Thể thông thường) + と 思います',
      examples: [
        { japanese: '明日は雨が降ると思います。', vietnamese: 'Tôi nghĩ là ngày mai trời sẽ mưa.' },
        { japanese: '日本は物価が高いと思います。', vietnamese: 'Tôi nghĩ rằng vật giá ở Nhật Bản rất đắt đỏ.' },
        { japanese: 'この映画はとても面白いと思います。', vietnamese: 'Tôi nghĩ bộ phim này sẽ rất hay.' }
      ]
    },
    {
      id: 'L11_G03',
      title: '「Câu trực tiếp」/ [Thể thông thường] と 言いました',
      titleVi: 'Nói rằng... (Trích dẫn lời nói)',
      explanation: 'Trích dẫn lại lời nói của một người khác. Trích dẫn trực tiếp để trong ngoặc vuông 「」, trích dẫn gián tiếp dùng thể thông thường.',
      structure: 'Người nói は ... と 言いました',
      examples: [
        { japanese: '田中さんは「明日休みます」と言いました。', vietnamese: 'Anh Tanaka đã nói rằng: "Ngày mai tôi xin nghỉ".' },
        { japanese: '先生は来週テストがあると言いました。', vietnamese: 'Thầy giáo nói rằng tuần sau sẽ có bài kiểm tra.' }
      ]
    },
    {
      id: 'L11_G04',
      title: '[Thể thông thường] でしょう？',
      titleVi: '...phải không? (Xác nhận sự đồng tình)',
      explanation: 'Lên giọng ở đuôi câu でしょう để tìm kiếm sự xác nhận hoặc đồng cảm từ phía người nghe.',
      structure: 'Mệnh đề (Thể thông thường, bỏ だ ở Danh từ/Tính từ な) + でしょう？',
      examples: [
        { japanese: '明日は日曜日でしょう？', vietnamese: 'Ngày mai là chủ nhật đúng không nhỉ?' },
        { japanese: 'あのレストラン、美味しかったでしょう？', vietnamese: 'Nhà hàng đó ăn ngon đúng không nào?' }
      ]
    }
  ],

  // =========================================================
  // BÀI 12: MỆNH ĐỀ ĐỊNH NGỮ BỔ NGHĨA & GIẢI THÍCH NGUYÊN DO
  // =========================================================
  12: [
    {
      id: 'L12_G01',
      title: 'Mệnh đề bổ nghĩa cho Danh từ (Định ngữ)',
      titleVi: 'Cụm danh từ mở rộng (Người làm gì / Vật như thế nào)',
      explanation: 'Trong tiếng Nhật, mệnh đề bổ nghĩa luôn luôn đứng TRƯỚC danh từ chính. Động từ trong mệnh đề bổ nghĩa bắt buộc chia về thể thông thường.',
      structure: '[Mệnh đề thể thông thường] + N',
      examples: [
        { japanese: 'あそこで本を読んでいる人は誰ですか。', vietnamese: 'Người đang đọc sách ở đằng kia là ai thế?' },
        { japanese: 'これは母が作ったケーキです。', vietnamese: 'Đây là chiếc bánh kem mà mẹ tôi đã tự tay làm.' },
        { japanese: '日本で買ったカメラを使っています。', vietnamese: 'Tôi đang dùng chiếc máy ảnh đã mua ở Nhật Bản.' }
      ]
    },
    {
      id: 'L12_G02',
      title: '[Thể thông thường] んです / のです',
      titleVi: 'Nhấn mạnh lý do, giải thích sự tình',
      explanation: 'Dùng trong văn nói khi muốn giải thích cặn kẽ nguyên nhân, bày tỏ sự ngạc nhiên, hoặc hỏi han người khác khi thấy điều bất thường.',
      structure: 'V/A-い (thể ngắn) + んです / A-な・N + なんです',
      examples: [
        { japanese: 'どうしたんですか。 ➔ 頭が痛いんです。', vietnamese: 'Bạn bị làm sao thế? ➔ Tôi bị đau đầu.' },
        { japanese: 'バスが来なかったんです。', vietnamese: 'Do xe buýt không tới nên tôi mới muộn đấy ạ.' },
        { japanese: 'とても綺麗ですね。どこで買ったんですか。', vietnamese: 'Đẹp quá nhỉ! Bạn đã mua ở đâu vậy?' }
      ]
    },
    {
      id: 'L12_G03',
      title: 'V-て いただけませんか',
      titleVi: 'Có thể làm giúp tôi ~ được không? (Nhờ vả rất trang trọng)',
      explanation: 'Mức độ lịch sự và nhã nhặn cao hơn hẳn ～てください và ～てくれますか. Thường dùng khi nhờ người lạ, cấp trên hoặc khách hàng.',
      structure: 'V-て いただけませんか',
      examples: [
        { japanese: 'もう一度説明していただけませんか。', vietnamese: 'Anh/chị có thể vui lòng giải thích lại một lần nữa được không ạ?' },
        { japanese: '日本語を教えていただけませんか。', vietnamese: 'Bạn có thể dạy tiếng Nhật giúp tôi được không ạ?' }
      ]
    },
    {
      id: 'L12_G04',
      title: 'V-たら いいですか',
      titleVi: 'Tôi nên làm gì thì tốt? (Xin lời khuyên)',
      explanation: 'Dùng khi người nói đang bối rối, phân vân không biết phải xử lý tình huống ra sao và muốn xin lời khuyên từ người nghe.',
      structure: 'Từ để hỏi (どう/どこ/何) + V-たら いいですか',
      examples: [
        { japanese: 'パスポートを落としたんですが、どうしたらいいですか。', vietnamese: 'Tôi bị rơi mất hộ chiếu rồi, giờ tôi nên làm sao đây ạ?' },
        { japanese: 'どこで切符を買ったらいいですか。', vietnamese: 'Tôi nên mua vé ở đâu thì tốt ạ?' }
      ]
    }
  ],

  // =========================================================
  // BÀI 13: MỤC ĐÍCH DI CHUYỂN, LỜI KHUYÊN & QUÁ MỨC
  // =========================================================
  13: [
    {
      id: 'L13_G01',
      title: 'V-(bỏ ます) / N に 行きます / 来ます',
      titleVi: 'Đi / Đến đâu để thực hiện mục đích gì',
      explanation: 'Động từ bỏ đuôi ます đi với に rồi đến động từ di chuyển (行きます, 来ます, 帰ります) để diễn tả mục đích của việc đi lại.',
      structure: 'Địa điểm + へ + V-(bỏ ます) / N + に + 行きます / 来ます',
      examples: [
        { japanese: 'デパートへ服を買いに行きます。', vietnamese: 'Tôi đến trung tâm thương mại để mua quần áo.' },
        { japanese: '日本へ経済を勉強しに来ました。', vietnamese: 'Tôi đến Nhật Bản để học về kinh tế.' },
        { japanese: '郵便局へ切手を買いに行きました。', vietnamese: 'Tôi đã ra bưu điện để mua tem.' }
      ]
    },
    {
      id: 'L13_G02',
      title: 'V-た / V-ない ほうがいいです',
      titleVi: 'Nên / Không nên làm gì (Đưa ra lời khuyên chân thành)',
      explanation: 'Dùng khi muốn đưa ra lời khuyên cụ thể cho người khác trong một tình huống xác định.',
      structure: 'Khuyên nên làm: V-た ほうがいいです / Khuyên đừng làm: V-ない ほうがいいです',
      examples: [
        { japanese: '風邪ですから、早く寝たほうがいいですよ。', vietnamese: 'Vì bị cảm rồi nên bạn nên đi ngủ sớm đi nhé.' },
        { japanese: 'あまりお酒を飲まないほうがいいです。', vietnamese: 'Bạn không nên uống nhiều rượu bia quá.' }
      ]
    },
    {
      id: 'L13_G03',
      title: '～かもしれません',
      titleVi: 'Có lẽ, có thể là... (Phỏng đoán xác suất 50%)',
      explanation: 'Diễn tả sự phỏng đoán không chắc chắn của người nói về một sự việc, khả năng xảy ra khoảng 50%.',
      structure: 'V/A-い/A-な/N (thể thông thường, bỏ だ) + かもしれません',
      examples: [
        { japanese: '明日は雨が降るかもしれません。', vietnamese: 'Ngày mai có thể trời sẽ mưa đấy.' },
        { japanese: '約束の時間に遅れるかもしれません。', vietnamese: 'Có lẽ tôi sẽ bị trễ giờ hẹn.' }
      ]
    },
    {
      id: 'L13_G04',
      title: 'V-(bỏ ます) / A すぎます',
      titleVi: 'Làm gì quá mức / Quá... (Mang nghĩa tiêu cực)',
      explanation: 'Biểu thị mức độ vượt quá giới hạn bình thường, mang lại kết quả không tốt.',
      structure: 'V-(bỏ ます) + すぎます / A-い (bỏ い) + すぎます / A-な (bỏ な) + すぎます',
      examples: [
        { japanese: '昨日、お酒を飲みすぎました。', vietnamese: 'Hôm qua tôi đã uống quá nhiều rượu.' },
        { japanese: 'この問題は難しすぎます。', vietnamese: 'Câu hỏi này quá khó đối với tôi.' },
        { japanese: '食べすぎて、お腹が痛いです。', vietnamese: 'Ăn nhiều quá nên tôi bị đau bụng rồi.' }
      ]
    }
  ],

  // =========================================================
  // BÀI 14: CÂU ĐIỀU KIỆN, SỰ BIẾN ĐỔI VÀ NGUYÊN NHÂN
  // =========================================================
  14: [
    {
      id: 'L14_G01',
      title: 'V-たら / A-かったら / N-だったら',
      titleVi: 'Nếu / Sau khi... thì... (Câu điều kiện giả định)',
      explanation: 'Chia động từ hoặc tính từ về thể quá khứ ngắn thêm ら. Dùng để nói về điều kiện giả định hoặc hành động xảy ra sau khi điều kiện hoàn thành.',
      structure: 'V-たら、... / A-かったら、... / N/A-な だったら、...',
      examples: [
        { japanese: '雨が降ったら、出かけません。', vietnamese: 'Nếu trời mưa thì tôi sẽ không ra ngoài.' },
        { japanese: '時間があったら、旅行したいです。', vietnamese: 'Nếu có thời gian thì tôi muốn đi du lịch.' },
        { japanese: '駅に着いたら、電話してください。', vietnamese: 'Sau khi đến ga thì hãy gọi điện thoại cho tôi nhé.' }
      ]
    },
    {
      id: 'L14_G02',
      title: 'A-く / A-に / N-に なります',
      titleVi: 'Trở nên, trở thành... (Chỉ sự biến đổi trạng thái)',
      explanation: 'Diễn tả sự biến chuyển từ trạng thái này sang trạng thái khác theo thời gian.',
      structure: 'A-い ➔ A-く なります / A-な & N ➔ A/N に なります',
      examples: [
        { japanese: '春になって、暖かくなりました。', vietnamese: 'Mùa xuân đến, trời đã trở nên ấm áp hơn.' },
        { japanese: '日本語が上手になりましたね。', vietnamese: 'Tiếng Nhật của bạn đã trở nên giỏi hơn rồi đấy!' },
        { japanese: '将来、医者になりたいです。', vietnamese: 'Tương lai tôi muốn trở thành bác sĩ.' }
      ]
    },
    {
      id: 'L14_G03',
      title: '～ので、～',
      titleVi: 'Bởi vì... nên... (Chỉ nguyên nhân khách quan, lịch sự)',
      explanation: 'Biểu thị nguyên nhân, lý do một cách nhẹ nhàng, tự nhiên và khách quan hơn から, thích hợp khi xin phép hoặc giải thích trang trọng.',
      structure: 'V/A-い (thể ngắn) + ので / A-な・N + なので',
      examples: [
        { japanese: '用事があるので、お先に失礼します。', vietnamese: 'Vì tôi có chút việc bận nên xin phép về trước ạ.' },
        { japanese: '気分が悪いので、少し休んでもいいですか。', vietnamese: 'Vì thấy người khó chịu nên tôi có thể nghỉ một chút được không ạ?' }
      ]
    },
    {
      id: 'L14_G04',
      title: 'V-(bỏ ます) やすい / にくい',
      titleVi: 'Dễ làm gì / Khó làm gì',
      explanation: 'Động từ bỏ đuôi ます kết hợp やすい (dễ) hoặc にくい (khó), đóng vai trò như một tính từ đuôi い.',
      structure: 'V-(bỏ ます) + やすいです / にくいです',
      examples: [
        { japanese: 'このペンはとても書きやすいです。', vietnamese: 'Cây bút này viết rất êm và dễ viết.' },
        { japanese: 'この薬は苦くて、飲みにくいです。', vietnamese: 'Thuốc này đắng nên rất khó uống.' }
      ]
    }
  ],

  // =========================================================
  // BÀI 15: THỂ Ý CHÍ, DỰ ĐỊNH VÀ CHUẨN BỊ TRƯỚC
  // =========================================================
  15: [
    {
      id: 'L15_G01',
      title: 'Thể Ý chí (意向形 - Volitional Form)',
      titleVi: 'Cùng làm... nào! (Dạng thân mật của ～ましょう)',
      explanation: 'Là thể thông thường của ～ましょう. Dùng để rủ rê bạn bè thân thiết, hoặc tự nhủ với bản thân quyết tâm làm điều gì.',
      structure: 'Nhóm 1: âm -u đổi sang -ou (行こう) / Nhóm 2: bỏ ru thêm yō (食べよう) / Nhóm 3: しよう, 来よう (こよう)',
      examples: [
        { japanese: 'ちょっと休憩しよう。', vietnamese: 'Nghỉ giải lao một chút nào!' },
        { japanese: '今週末、海へ行こうよ。', vietnamese: 'Cuối tuần này cùng đi biển chơi đi!' }
      ]
    },
    {
      id: 'L15_G02',
      title: 'V-(thể ý chí) と 思っています',
      titleVi: 'Tôi đang có ý định làm...',
      explanation: 'Biểu thị ý định đã được nhen nhóm và suy nghĩ từ trước đó một khoảng thời gian và hiện tại vẫn đang tiếp tục duy trì ý định đó.',
      structure: 'V-(thể ý chí) と 思っています',
      examples: [
        { japanese: '国へ帰ったら、会社を作ろうと思っています。', vietnamese: 'Sau khi về nước, tôi dự định sẽ mở công ty.' },
        { japanese: '来年、日本へ留学しようと思っています。', vietnamese: 'Tôi đang có ý định năm sau sẽ sang Nhật du học.' }
      ]
    },
    {
      id: 'L15_G03',
      title: 'V-る / V-ない つもりです',
      titleVi: 'Dự định / Quyết định chắc chắn sẽ (không) làm...',
      explanation: 'Biểu thị một ý chí hoặc quyết tâm chắc chắn của bản thân người nói về việc sẽ làm hoặc kiên quyết không làm điều gì đó.',
      structure: 'V-(thể từ điển) / V-(thể ない) + つもりです',
      examples: [
        { japanese: '来月、車を買うつもりです。', vietnamese: 'Tháng sau tôi dự định chắc chắn sẽ mua ô tô.' },
        { japanese: 'タバコはもう吸わないつもりです。', vietnamese: 'Tôi quyết định sẽ không hút thuốc lá nữa.' }
      ]
    },
    {
      id: 'L15_G04',
      title: 'V-て おきます',
      titleVi: 'Làm trước, chuẩn bị sẵn một việc',
      explanation: 'Diễn tả hành động được thực hiện trước để phục vụ cho một mục đích nào đó trong tương lai, hoặc giữ nguyên trạng thái.',
      structure: 'V-て おきます (Văn nói: V-ときます)',
      examples: [
        { japanese: '旅行の前に、切符を買っておきます。', vietnamese: 'Trước chuyến đi du lịch, tôi sẽ mua vé trước.' },
        { japanese: '授業の前に、単語を予習しておいてください。', vietnamese: 'Trước giờ học, xin hãy chuẩn bị sẵn từ vựng.' },
        { japanese: '窓を開けておいてください。', vietnamese: 'Xin hãy cứ để nguyên cửa sổ mở như vậy nhé.' }
      ]
    },
    {
      id: 'L15_G05',
      title: 'まだ V-て いません',
      titleVi: 'Vẫn chưa làm xong việc gì',
      explanation: 'Dùng khi được hỏi một việc đã hoàn thành chưa, nhưng thực tế hành động đó chưa diễn ra tính đến thời điểm hiện tại.',
      structure: 'まだ V-て いません',
      examples: [
        { japanese: 'もう昼ご飯を食べましたか。 ➔ いいえ、まだ食べていません。', vietnamese: 'Bạn đã ăn trưa chưa? ➔ Chưa, tôi vẫn chưa ăn.' },
        { japanese: '宿題はまだ終わっていません。', vietnamese: 'Bài tập về nhà tôi vẫn chưa làm xong.' }
      ]
    }
  ]
};
