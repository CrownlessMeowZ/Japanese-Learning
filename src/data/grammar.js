export const grammarData = {
  4: [
    {
      title: '～は ～の ～です',
      titleVi: 'A ở vị trí C của B',
      explanation: 'Dùng để chỉ vị trí của một sự vật so với một sự vật khác.',
      structure: 'N1 は N2 の [Vị trí] です',
      examples: [
        { japanese: '郵便局は銀行の隣です。', vietnamese: 'Bưu điện ở bên cạnh ngân hàng.' },
        { japanese: '犬は机の下です。', vietnamese: 'Con chó ở dưới cái bàn.' },
        { japanese: '本はかばんの中です。', vietnamese: 'Sách ở trong cặp.' }
      ]
    },
    {
      title: '～から ～まで どのくらいですか',
      titleVi: 'Từ ~ đến ~ mất bao lâu?',
      explanation: 'Dùng để hỏi khoảng thời gian cần thiết để di chuyển từ điểm này đến điểm khác.',
      structure: 'N1 から N2 まで どのくらいですか',
      examples: [
        { japanese: '東京から大阪までどのくらいですか。', vietnamese: 'Từ Tokyo đến Osaka mất bao lâu?' },
        { japanese: '家から学校まで歩いて10分です。', vietnamese: 'Từ nhà đến trường đi bộ mất 10 phút.' }
      ]
    },
    {
      title: '～は どんな ところですか',
      titleVi: '～ là nơi như thế nào?',
      explanation: 'Dùng để hỏi về đặc điểm, tính chất của một địa điểm.',
      structure: 'N は どんな ところですか',
      examples: [
        { japanese: 'ハノイはどんなところですか。', vietnamese: 'Hà Nội là nơi như thế nào?' },
        { japanese: 'きれいでにぎやかなところです。', vietnamese: 'Là nơi đẹp và náo nhiệt.' }
      ]
    },
    {
      title: 'い-adjective です / じゃないです',
      titleVi: 'Tính từ đuôi い (Khẳng định / Phủ định)',
      explanation: 'Cách chia tính từ đuôi い ở hiện tại.',
      structure: 'A-い です / A-く ありません (hoặc A-く ないです)',
      examples: [
        { japanese: 'このラーメンはおいしいです。', vietnamese: 'Món ramen này ngon.' },
        { japanese: '日本の物価は安くないです。', vietnamese: 'Vật giá ở Nhật Bản không rẻ.' },
        { japanese: '今日は暑くないです。', vietnamese: 'Hôm nay không nóng.' }
      ]
    },
    {
      title: 'な-adjective です / じゃありません',
      titleVi: 'Tính từ đuôi な (Khẳng định / Phủ định)',
      explanation: 'Cách chia tính từ đuôi な ở hiện tại.',
      structure: 'A-な です / A じゃありません (hoặc A じゃないです)',
      examples: [
        { japanese: '彼女はきれいです。', vietnamese: 'Cô ấy đẹp.' },
        { japanese: 'この町は静かじゃありません。', vietnamese: 'Thị trấn này không yên tĩnh.' },
        { japanese: '私は有名じゃありません。', vietnamese: 'Tôi không nổi tiếng.' }
      ]
    },
    {
      title: '～は ～が あります',
      titleVi: '～ có ～',
      explanation: 'Dùng để nói về việc ai đó sở hữu cái gì, hoặc ở đâu có cái gì (đối với đồ vật vô tri vô giác).',
      structure: 'N1(người/địa điểm) は N2 が あります',
      examples: [
        { japanese: '私は車があります。', vietnamese: 'Tôi có ô tô.' },
        { japanese: 'この町は温泉があります。', vietnamese: 'Thị trấn này có suối nước nóng.' }
      ]
    }
  ],
  5: [
    {
      title: 'Past tense: ～ました / ～ませんでした',
      titleVi: 'Thì quá khứ của động từ',
      explanation: 'Dùng để nói về những hành động đã xảy ra hoặc không xảy ra trong quá khứ.',
      structure: 'V-ました (Khẳng định) / V-ませんでした (Phủ định)',
      examples: [
        { japanese: '昨日、日本語を勉強しました。', vietnamese: 'Hôm qua tôi đã học tiếng Nhật.' },
        { japanese: '先週、どこも行きませんでした。', vietnamese: 'Tuần trước tôi đã không đi đâu cả.' },
        { japanese: '今朝、朝ごはんを食べませんでした。', vietnamese: 'Sáng nay tôi đã không ăn sáng.' }
      ]
    },
    {
      title: '～に 行きます',
      titleVi: 'Đi đến ~',
      explanation: 'Dùng để diễn tả sự di chuyển đến một địa điểm.',
      structure: 'N(địa điểm) に 行きます',
      examples: [
        { japanese: '明日、デパートに行きます。', vietnamese: 'Ngày mai tôi sẽ đi trung tâm thương mại.' },
        { japanese: '週末に海に行きました。', vietnamese: 'Cuối tuần tôi đã đi biển.' }
      ]
    },
    {
      title: '～を ～ます',
      titleVi: 'Làm hành động ~ với đối tượng ~',
      explanation: 'Trợ từ を chỉ đối tượng tác động của hành động.',
      structure: 'N を V-ます',
      examples: [
        { japanese: '毎日、コーヒーを飲みます。', vietnamese: 'Mỗi ngày tôi uống cà phê.' },
        { japanese: '昨日、写真を撮りました。', vietnamese: 'Hôm qua tôi đã chụp ảnh.' }
      ]
    },
    {
      title: '～が ほしいです',
      titleVi: 'Muốn có ~',
      explanation: 'Dùng để diễn tả mong muốn sở hữu một danh từ nào đó.',
      structure: 'N が ほしいです',
      examples: [
        { japanese: '私は新しいパソコンがほしいです。', vietnamese: 'Tôi muốn có một cái máy tính mới.' },
        { japanese: '今、お金がほしいです。', vietnamese: 'Bây giờ tôi muốn có tiền.' }
      ]
    },
    {
      title: '～が 好きです / 嫌いです',
      titleVi: 'Thích / Ghét ~',
      explanation: 'Dùng để diễn tả sở thích hoặc sự ghét bỏ đối với cái gì đó.',
      structure: 'N が 好きです / 嫌いです',
      examples: [
        { japanese: '私はスポーツが好きです。', vietnamese: 'Tôi thích thể thao.' },
        { japanese: '野菜が嫌いです。', vietnamese: 'Tôi ghét rau.' }
      ]
    }
  ],
  6: [
    {
      title: '～ませんか',
      titleVi: 'Lời mời: ~ không?',
      explanation: 'Dùng để mời hoặc rủ rê ai đó làm gì cùng mình một cách lịch sự.',
      structure: 'V-ませんか',
      examples: [
        { japanese: '一緒に映画を見ませんか。', vietnamese: 'Cùng xem phim không?' },
        { japanese: '明日、カラオケに行きませんか。', vietnamese: 'Ngày mai đi hát karaoke không?' }
      ]
    },
    {
      title: '～ましょう',
      titleVi: 'Cùng ~ nào',
      explanation: 'Dùng để rủ rê một cách chủ động hoặc đồng ý với lời mời.',
      structure: 'V-ましょう',
      examples: [
        { japanese: 'はい、行きましょう。', vietnamese: 'Vâng, cùng đi nào.' },
        { japanese: 'ちょっと休みましょう。', vietnamese: 'Cùng nghỉ một chút nào.' }
      ]
    },
    {
      title: '～と ～と どちらが ～ですか',
      titleVi: 'So sánh: ~ và ~ cái nào ~ hơn?',
      explanation: 'Dùng để so sánh và hỏi về sự lựa chọn giữa 2 danh từ.',
      structure: 'N1 と N2 と どちらが A-ですか',
      examples: [
        { japanese: 'サッカーと野球とどちらが好きですか。', vietnamese: 'Bóng đá và bóng chày bạn thích cái nào hơn?' },
        { japanese: '肉と魚とどちらがおいしいですか。', vietnamese: 'Thịt và cá cái nào ngon hơn?' }
      ]
    },
    {
      title: '～の中で ～が いちばん ～です',
      titleVi: 'Trong ~ thì ~ nhất',
      explanation: 'Dùng để so sánh nhất trong một phạm vi hoặc nhóm đối tượng.',
      structure: 'N1 の中で N2 が いちばん A-です',
      examples: [
        { japanese: '果物の中でりんごがいちばん好きです。', vietnamese: 'Trong các loại trái cây tôi thích táo nhất.' },
        { japanese: '日本の中で東京がいちばんにぎやかです。', vietnamese: 'Ở Nhật Bản Tokyo là náo nhiệt nhất.' }
      ]
    }
  ],
  7: [
    {
      title: '～に ～が あります/います',
      titleVi: 'Ở ~ có ~',
      explanation: 'Dùng để chỉ sự tồn tại của sự vật/sự việc tại một địa điểm (あります cho đồ vật, cây cối / います cho người, động vật).',
      structure: 'N(địa điểm) に N(vật/người) が あります/います',
      examples: [
        { japanese: '部屋に机があります。', vietnamese: 'Trong phòng có cái bàn.' },
        { japanese: '公園に犬がいます。', vietnamese: 'Trong công viên có con chó.' }
      ]
    },
    {
      title: '～は ～に あります/います',
      titleVi: '～ ở ~',
      explanation: 'Dùng để nói về việc một người/vật cụ thể đang ở đâu.',
      structure: 'N(vật/người) は N(địa điểm) に あります/います',
      examples: [
        { japanese: 'トイレはあそこにあります。', vietnamese: 'Nhà vệ sinh ở đằng kia.' },
        { japanese: '田中さんは会議室にいます。', vietnamese: 'Anh Tanaka đang ở phòng họp.' }
      ]
    },
    {
      title: '～を ～てください',
      titleVi: 'Hãy ~',
      explanation: 'Dùng để yêu cầu, nhờ vả ai đó làm gì một cách lịch sự.',
      structure: 'V-て ください',
      examples: [
        { japanese: '窓を開けてください。', vietnamese: 'Hãy mở cửa sổ ra.' },
        { japanese: '名前を書いてください。', vietnamese: 'Hãy viết tên vào.' }
      ]
    },
    {
      title: '～ないでください',
      titleVi: 'Đừng ~',
      explanation: 'Dùng để yêu cầu ai đó không làm việc gì.',
      structure: 'V-ないで ください',
      examples: [
        { japanese: 'ここで写真を撮らないでください。', vietnamese: 'Xin đừng chụp ảnh ở đây.' },
        { japanese: '忘れないでください。', vietnamese: 'Xin đừng quên.' }
      ]
    }
  ]
};
