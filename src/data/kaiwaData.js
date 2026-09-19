/**
 * Dữ liệu Hội Thoại Thực Tế (Kaiwa AI) - Dekiru Nihongo Sơ Cấp (15 Bài học)
 * Tích hợp câu đàm thoại chuẩn ngữ cảnh đời sống, phiên âm Furigana/Romaji,
 * giải thích hoàn cảnh sử dụng và kết nối Web Speech API chấm điểm giọng nói.
 */

export const kaiwaData = {
  // ==========================================
  // BÀI 1: CHÀO HỎI & GIỚI THIỆU BẢN THÂN
  // ==========================================
  1: [
    {
      id: 'k1-1',
      japanese_text: '初めまして。アンと申します。どうぞよろしくお願いいたします。',
      hiragana: 'はじめまして。あんと もうします。どうぞ よろしく おねがいいたします。',
      romaji: 'Hajimemashite. An to moushimasu. Douzo yoroshiku onegaiitashimasu.',
      vietnamese_meaning: 'Rất vui được gặp bạn. Tôi tên là An. Rất mong nhận được sự giúp đỡ của bạn.',
      context_usage: 'Chào hỏi lần đầu tiên gặp mặt trong môi trường công sở hoặc giao tiếp trang trọng.',
      category: 'Chào hỏi'
    },
    {
      id: 'k1-2',
      japanese_text: 'こちらは山田さんです。私と同じ会社の同僚です。',
      hiragana: 'こちらは やまださんです。わたしと おなじ かいしゃの どうりょうです。',
      romaji: 'Kochira wa Yamada-san desu. Watashi to onaji kaisha no douryou desu.',
      vietnamese_meaning: 'Đây là anh Yamada. Là đồng nghiệp cùng công ty với tôi.',
      context_usage: 'Giới thiệu người thứ ba với đối tác hoặc bạn bè một cách lịch sự.',
      category: 'Giới thiệu'
    },
    {
      id: 'k1-3',
      japanese_text: 'すみません、お名前をもう一度教えていただけますか。',
      hiragana: 'すみません、おなまえを もういちど おしえて いただけますか。',
      romaji: 'Sumimasen, onamae o mou ichido oshiete itadakemasu ka.',
      vietnamese_meaning: 'Xin lỗi, bạn có thể vui lòng nhắc lại tên một lần nữa được không ạ?',
      context_usage: 'Dùng khi nghe chưa rõ tên của người đối thoại và muốn hỏi lại nhã nhặn.',
      category: 'Hỏi lại'
    },
    {
      id: 'k1-4',
      japanese_text: 'お仕事は何をなさっていますか。',
      hiragana: 'おしごとは なにを なさっていますか。',
      romaji: 'Oshigoto wa nani o nasatte imasu ka.',
      vietnamese_meaning: 'Hiện tại bạn đang làm công việc gì thế ạ?',
      context_usage: 'Hỏi thăm nghề nghiệp của đối phương trong giao tiếp xã giao.',
      category: 'Hỏi thăm'
    }
  ],

  // ==========================================
  // BÀI 2: MUA SẮM & HỎI GIÁ TIỀN
  // ==========================================
  2: [
    {
      id: 'k2-1',
      japanese_text: 'いらっしゃいませ。何をお探しでしょうか。',
      hiragana: 'いらっしゃいませ。なにを おさがしでしょうか。',
      romaji: 'Irasshaimase. Nani o osagashi deshou ka.',
      vietnamese_meaning: 'Kính chào quý khách. Quý khách đang tìm kiếm món đồ nào ạ?',
      context_usage: 'Lời chào chuẩn mực của nhân viên bán hàng khi khách bước vào cửa hàng.',
      category: 'Mua sắm'
    },
    {
      id: 'k2-2',
      japanese_text: 'すみません、この傘はいくらですか。',
      hiragana: 'すみません、この かさは いくらですか。',
      romaji: 'Sumimasen, kono kasa wa ikura desu ka.',
      vietnamese_meaning: 'Xin lỗi, chiếc ô này có giá bao nhiêu tiền vậy ạ?',
      context_usage: 'Hỏi giá tiền một món đồ cụ thể tại cửa hàng.',
      category: 'Hỏi giá'
    },
    {
      id: 'k2-3',
      japanese_text: 'じゃ、このリンゴを二つとパンを一つください。',
      hiragana: 'じゃ、この りんごを ふたつと ぱんを ひとつ ください。',
      romaji: 'Ja, kono ringo o futatsu to pan o hitotsu kudasai.',
      vietnamese_meaning: 'Vậy thì cho tôi lấy 2 quả táo này và 1 chiếc bánh mì nhé.',
      context_usage: 'Chốt đơn hàng và yêu cầu người bán gói đồ cho mình.',
      category: 'Chọn mua'
    },
    {
      id: 'k2-4',
      japanese_text: 'お支払いはカードですか、それとも現金ですか。',
      hiragana: 'おしはらいは かーどですか、それとも げんきんですか。',
      romaji: 'Oshiharai wa kaado desu ka, soretomo genkin desu ka.',
      vietnamese_meaning: 'Quý khách thanh toán bằng thẻ hay tiền mặt ạ?',
      context_usage: 'Thủ tục tính tiền tại quầy thu ngân ở Nhật Bản.',
      category: 'Thanh toán'
    }
  ],

  // ==========================================
  // BÀI 3: THỜI GIAN & LỊCH TRÌNH SINH HOẠT
  // ==========================================
  3: [
    {
      id: 'k3-1',
      japanese_text: 'すみません、今何時ですか。 ➔ 9時半です。',
      hiragana: 'すみません、いまなにじですか。 ➔ くじはんです。',
      romaji: 'Sumimasen, ima nanji desu ka. ➔ Kuji han desu.',
      vietnamese_meaning: 'Xin lỗi, bây giờ là mấy giờ rồi ạ? ➔ Bây giờ là 9 giờ rưỡi.',
      context_usage: 'Hỏi và trả lời giờ giấc khi đang ở nơi công cộng.',
      category: 'Hỏi giờ'
    },
    {
      id: 'k3-2',
      japanese_text: '毎朝何時に起きますか。 ➔ いつも6時に起きます。',
      hiragana: 'まいあさ なにじに おきますか。 ➔ いつも ろくじに おきます。',
      romaji: 'Maiasa nanji ni okimasu ka. ➔ Itsumo rokuji ni okimasu.',
      vietnamese_meaning: 'Mỗi sáng bạn thức dậy lúc mấy giờ? ➔ Tôi luôn thức dậy lúc 6 giờ.',
      context_usage: 'Trò chuyện về thói quen sinh hoạt và thời gian biểu trong ngày.',
      category: 'Thói quen'
    },
    {
      id: 'k3-3',
      japanese_text: '銀行は何時から何時まで開いていますか。',
      hiragana: 'ぎんこうは なにじから なにじまで あいていますか。',
      romaji: 'Ginkou wa nanji kara nanji made aite imasu ka.',
      vietnamese_meaning: 'Ngân hàng mở cửa từ mấy giờ đến mấy giờ vậy?',
      context_usage: 'Hỏi khung giờ hoạt động của các cơ quan công quyền, tiện ích.',
      category: 'Giờ mở cửa'
    },
    {
      id: 'k3-4',
      japanese_text: '今晩一緒に晩ご飯を食べませんか。',
      hiragana: 'こんばん いっしょに ばんごはんを たべませんか。',
      romaji: 'Konban isshoni bangohan o tabemasen ka.',
      vietnamese_meaning: 'Tối nay bạn có muốn cùng đi ăn tối với tôi không?',
      context_usage: 'Mời bạn bè, đồng nghiệp dùng bữa tối sau giờ làm việc.',
      category: 'Rủ rê'
    }
  ],

  // ==========================================
  // BÀI 4: HỎI ĐƯỜNG & PHƯƠNG TIỆN DI CHUYỂN
  // ==========================================
  4: [
    {
      id: 'k4-1',
      japanese_text: 'すみません、駅へ行きたいんですが、道を教えてくれませんか。',
      hiragana: 'すみません、えきへ いきたいんですが、みちを おしえて くれませんか。',
      romaji: 'Sumimasen, eki e ikitai n desu ga, michi o oshiete kuremasen ka.',
      vietnamese_meaning: 'Xin lỗi, tôi muốn đi ra ga tàu, bạn có thể chỉ đường giúp tôi được không?',
      context_usage: 'Hỏi đường người dân địa phương khi bị lạc hoặc mới đến.',
      category: 'Hỏi đường'
    },
    {
      id: 'k4-2',
      japanese_text: 'この道をまっすぐ行って、二つ目の信号を右に曲がってください。',
      hiragana: 'このみちを まっすぐ いって、ふたつめの しんごうを みぎに まがってください。',
      romaji: 'Kono michi o massugu itte, futatsume no shingou o migi ni magatte kudasai.',
      vietnamese_meaning: 'Hãy đi thẳng con đường này, rồi rẽ phải ở cột đèn giao thông thứ hai nhé.',
      context_usage: 'Hướng dẫn đường đi chi tiết bằng các mốc giao thông.',
      category: 'Chỉ đường'
    },
    {
      id: 'k4-3',
      japanese_text: 'ここから空港までバスでどのくらいかかりますか。',
      hiragana: 'ここから くうこうまで ばすで どのくらい かかりますか。',
      romaji: 'Koko kara kuukou made basu de dono kurai kakarimasu ka.',
      vietnamese_meaning: 'Từ đây đến sân bay đi xe buýt mất khoảng bao lâu?',
      context_usage: 'Hỏi thời gian ước tính khi sử dụng phương tiện công cộng.',
      category: 'Di chuyển'
    },
    {
      id: 'k4-4',
      japanese_text: '郵便局はコンビニの向かい側にありますよ。',
      hiragana: 'ゆうびんきょくは こんびにの むかいがわに ありますよ。',
      romaji: 'Yuubinkyoku wa konbini no mukaigawa ni arimasu yo.',
      vietnamese_meaning: 'Bưu điện nằm ở ngay phía đối diện cửa hàng tiện lợi đấy.',
      context_usage: 'Chỉ dẫn vị trí tương đối giữa hai địa điểm.',
      category: 'Vị trí'
    }
  ],

  // ==========================================
  // BÀI 5: GIA ĐÌNH, SỞ THÍCH & KỲ NGHỈ
  // ==========================================
  5: [
    {
      id: 'k5-1',
      japanese_text: 'ご家族は何人ですか。 ➔ 両親と兄と私の4人です。',
      hiragana: 'ごかぞくは なんにんですか。 ➔ りょうしんと あにと わたしの よにんです。',
      romaji: 'Gokazoku wa nannin desu ka. ➔ Ryoushin to ani to watashi no yonin desu.',
      vietnamese_meaning: 'Gia đình bạn có mấy người? ➔ Có 4 người gồm bố mẹ, anh trai và tôi.',
      context_usage: 'Giới thiệu về số lượng thành viên trong gia đình.',
      category: 'Gia đình'
    },
    {
      id: 'k5-2',
      japanese_text: '休みの日はいつも何をしていますか。',
      hiragana: 'やすみのひは いつも なにを していますか。',
      romaji: 'Yasumi no hi wa itsumo nani o shite imasu ka.',
      vietnamese_meaning: 'Vào ngày nghỉ bạn thường làm những gì thế?',
      context_usage: 'Chủ đề quen thuộc để bắt đầu câu chuyện khi giao tiếp.',
      category: 'Hỏi thăm'
    },
    {
      id: 'k5-3',
      japanese_text: '私の趣味は音楽を聞くことや料理を作ることです。',
      hiragana: 'わたしの しゅみは おんがくを きくことや りょうりを つくることです。',
      romaji: 'Watashi no shumi wa ongaku o kiku koto ya ryouri o tsukuru koto desu.',
      vietnamese_meaning: 'Sở thích của tôi là nghe nhạc và nấu các món ăn ngon.',
      context_usage: 'Chia sẻ sở thích cá nhân khi giao lưu bạn bè.',
      category: 'Sở thích'
    },
    {
      id: 'k5-4',
      japanese_text: '先週の週末はどこかへ行きましたか。',
      hiragana: 'せんしゅうの しゅうまつは どこかへ いきましたか。',
      romaji: 'Senshuu no shuumatsu wa dokoka e ikimashita ka.',
      vietnamese_meaning: 'Cuối tuần trước bạn có đi đâu chơi không?',
      context_usage: 'Hỏi han hoạt động của bạn bè trong kỳ nghỉ vừa qua.',
      category: 'Cuối tuần'
    }
  ],

  // ==========================================
  // BÀI 6: ẨM THỰC & RỦ RÊ DÙNG BỮA
  // ==========================================
  6: [
    {
      id: 'k6-1',
      japanese_text: 'お腹が空きましたね。何か食べに行きませんか。',
      hiragana: 'おなかが すきましたね。なにか たべに いきませんか。',
      romaji: 'Onaka ga sukimashita ne. Nanika tabe ni ikimasen ka.',
      vietnamese_meaning: 'Bụng đói rồi nhỉ. Cùng đi ăn cái gì đó không?',
      context_usage: 'Rủ đồng nghiệp hoặc bạn bè đi ăn trưa/tối.',
      category: 'Rủ rê'
    },
    {
      id: 'k6-2',
      japanese_text: 'いいですね。何が食べたいですか。 ➔ ラーメンはどうですか。',
      hiragana: 'いいですね。なにが たべたいですか。 ➔ らーめんは どうですか。',
      romaji: 'Ii desu ne. Nani ga tabetai desu ka. ➔ Raamen wa dou desu ka.',
      vietnamese_meaning: 'Hay quá. Bạn muốn ăn món gì? ➔ Món mì Ramen thì sao?',
      context_usage: 'Thảo luận và gợi ý món ăn yêu thích.',
      category: 'Gợi ý'
    },
    {
      id: 'k6-3',
      japanese_text: '日本料理の中で寿司がいちばん好きです。',
      hiragana: 'にほんりょうりの なかで すしが いちばん すきです。',
      romaji: 'Nihonryouri no naka de sushi ga ichiban suki desu.',
      vietnamese_meaning: 'Trong các món ăn Nhật Bản thì tôi thích món sushi nhất.',
      context_usage: 'Bày tỏ sở thích ẩm thực cá nhân.',
      category: 'Sở thích'
    },
    {
      id: 'k6-4',
      japanese_text: 'ご注文はお決まりですか。 ➔ これをお願いします。',
      hiragana: 'ごちゅうもんは おきまりですか。 ➔ これを おねがいします。',
      romaji: 'Gochuumon wa okimari desu ka. ➔ Kore o onegaishimasu.',
      vietnamese_meaning: 'Quý khách đã quyết định món chưa ạ? ➔ Cho tôi gọi món này nhé.',
      context_usage: 'Gọi món ăn tại nhà hàng hoặc quán ăn.',
      category: 'Gọi món'
    }
  ],

  // ==========================================
  // BÀI 7: NHỜ VẢ, MƯỢN ĐỒ & QUY ĐỊNH
  // ==========================================
  7: [
    {
      id: 'k7-1',
      japanese_text: 'すみません、ペンを忘れてしまったんですが、貸していただけませんか。',
      hiragana: 'すみません、ぺんを わすれてしまったんですが、かして いただけませんか。',
      romaji: 'Sumimasen, pen o wasurete shimatta n desu ga, kashite itadakemasen ka.',
      vietnamese_meaning: 'Xin lỗi, tôi lỡ quên bút rồi, bạn có thể vui lòng cho tôi mượn được không?',
      context_usage: 'Nhờ mượn đồ dùng học tập hoặc công sở một cách lịch sự.',
      category: 'Nhờ vả'
    },
    {
      id: 'k7-2',
      japanese_text: 'はい、どうぞ。自由に使ってください。',
      hiragana: 'はい、どうぞ。じゆうに つかって ください。',
      romaji: 'Hai, douzo. Jiyuu ni tsukatte kudasai.',
      vietnamese_meaning: 'Vâng, xin mời bạn. Bạn cứ tự nhiên dùng đi.',
      context_usage: 'Đồng ý cho mượn đồ với thái độ thân thiện, cởi mở.',
      category: 'Cho mượn'
    },
    {
      id: 'k7-3',
      japanese_text: 'ここでタバコを吸わないでください。禁煙ですから。',
      hiragana: 'ここで たばこを すわないで ください。きんえんですから。',
      romaji: 'Koko de tabako o suwanaide kudasai. Kin\'en desu kara.',
      vietnamese_meaning: 'Xin đừng hút thuốc ở đây nhé. Vì khu vực này cấm hút thuốc.',
      context_usage: 'Nhắc nhở người khác tuân thủ nội quy nơi công cộng.',
      category: 'Nhắc nhở'
    },
    {
      id: 'k7-4',
      japanese_text: 'エアコンをつけてもいいですか。 ➔ ええ、いいですよ。',
      hiragana: 'えあこんを つけても いいですか。 ➔ ええ、いいですよ。',
      romaji: 'Eakon o tsukete mo ii desu ka. ➔ Ee, ii desu yo.',
      vietnamese_meaning: 'Tôi bật điều hòa lên có được không? ➔ Vâng, được chứ bạn.',
      context_usage: 'Xin phép thực hiện hành động trong phòng chung.',
      category: 'Xin phép'
    }
  ],

  // ==========================================
  // BÀI 8: DU LỊCH & TRẢI NGHIỆM VĂN HÓA
  // ==========================================
  8: [
    {
      id: 'k8-1',
      japanese_text: '京都へ行きたいんですが、新幹線と飛行機とどちらが便利ですか。',
      hiragana: 'きょうとへ いきたいんですが、しんかんせんと ひこうきと どちらが べんりですか。',
      romaji: 'Kyouto e ikitai n desu ga, shinkansen to hikouki to dochira ga benri desu ka.',
      vietnamese_meaning: 'Tôi muốn đi Kyoto, đi Shinkansen hay máy bay thì tiện hơn ạ?',
      context_usage: 'Hỏi kinh nghiệm chọn phương tiện khi đi du lịch nội địa Nhật.',
      category: 'Du lịch'
    },
    {
      id: 'k8-2',
      japanese_text: '新幹線のほうが早くて便利ですよ。',
      hiragana: 'しんかんせんの ほうが はやくて べんりですよ。',
      romaji: 'Shinkansen no hou ga hayakute benri desu yo.',
      vietnamese_meaning: 'Đi tàu Shinkansen thì nhanh và tiện lợi hơn đấy.',
      context_usage: 'Đưa ra lời khuyên so sánh giữa hai lựa chọn.',
      category: 'Tư vấn'
    },
    {
      id: 'k8-3',
      japanese_text: '駅に着いてから、まずホテルに荷物を預けに行きます。',
      hiragana: 'えきに ついてから、まず ほてるに にもつを あずけに いきます。',
      romaji: 'Eki ni tsuite kara, mazu hoteru ni nimotsu o azuke ni ikimasu.',
      vietnamese_meaning: 'Sau khi đến nhà ga, trước tiên tôi sẽ đến khách sạn gửi hành lý.',
      context_usage: 'Nói về thứ tự các bước trong lịch trình du lịch.',
      category: 'Lịch trình'
    },
    {
      id: 'k8-4',
      japanese_text: '週末は天気が良くて、景色がとても綺麗でした。',
      hiragana: 'しゅうまつは てんきが よくて、けしきが とても きれいでした。',
      romaji: 'Shuumatsu wa tenki ga yokute, keshiki ga totemo kirei deshita.',
      vietnamese_meaning: 'Cuối tuần thời tiết đẹp và phong cảnh rất tuyệt vời.',
      context_usage: 'Kể lại cảm nhận sau chuyến đi dã ngoại.',
      category: 'Cảm nhận'
    }
  ],

  // ==========================================
  // BÀI 9: SỨC KHỎE, KHÁM BỆNH & NGHỈ PHÉP
  // ==========================================
  9: [
    {
      id: 'k9-1',
      japanese_text: 'どうしましたか。顔色が悪いですね。 ➔ 少し熱があるんです。',
      hiragana: 'どうしましたか。かおいろが わるいですね。 ➔ すこし ねつが あるんです。',
      romaji: 'Dou shimashita ka. Kaoiro ga warui desu ne. ➔ Sukoshi netsu ga aru n desu.',
      vietnamese_meaning: 'Bạn bị làm sao thế? Sắc mặt kém quá nhỉ. ➔ Tôi bị sốt một chút.',
      context_usage: 'Hỏi thăm sức khỏe của đồng nghiệp khi thấy họ mệt mỏi.',
      category: 'Sức khỏe'
    },
    {
      id: 'k9-2',
      japanese_text: '無理をしないで、今日は早く帰って休んでください。',
      hiragana: 'むりを しないで、きょうは はやく かえって やすんで ください。',
      romaji: 'Muri o shinaide, kyou wa hayaku kaette yasunde kudasai.',
      vietnamese_meaning: 'Đừng làm việc quá sức, hôm nay bạn hãy về sớm nghỉ ngơi nhé.',
      context_usage: 'Lời khuyên ấm áp, chu đáo dành cho người đang ốm.',
      category: 'Động viên'
    },
    {
      id: 'k9-3',
      japanese_text: 'すみません、風邪を引いたので、明日休ませていただけませんか。',
      hiragana: 'すみません、かぜを ひいたので、あした やすませて いただけませんか。',
      romaji: 'Sumimasen, kaze o hiita node, ashita yasumasete itadakemasen ka.',
      vietnamese_meaning: 'Xin lỗi, vì tôi bị cảm nên ngày mai có thể cho tôi xin phép nghỉ được không ạ?',
      context_usage: 'Gọi điện hoặc gửi tin nhắn xin phép cấp trên nghỉ ốm lịch sự.',
      category: 'Xin nghỉ'
    },
    {
      id: 'k9-4',
      japanese_text: 'お大事にしてください。早く良くなるといいですね。',
      hiragana: 'おだいじに して ください。はやく よくなると いいですね。',
      romaji: 'Odaiji ni shite kudasai. Hayaku yoku naru to ii desu ne.',
      vietnamese_meaning: 'Bạn giữ gìn sức khỏe nhé. Chúc bạn mau sớm khỏe lại!',
      context_usage: 'Câu nói chúc người ốm kinh điển trong văn hóa Nhật Bản.',
      category: 'Chúc lành'
    }
  ],

  // ==========================================
  // BÀI 10: KỸ NĂNG, BẰNG LÁI & KINH NGHIỆM
  // ==========================================
  10: [
    {
      id: 'k10-1',
      japanese_text: '車の運転ができますか。 ➔ はい、国際免許を持っています。',
      hiragana: 'くるまの うんてんが できますか。 ➔ はい、こくさいめんきょを もっています。',
      romaji: 'Kuruma no unten ga dekimasu ka. ➔ Hai, kokusaimenkyo o motte imasu.',
      vietnamese_meaning: 'Bạn có biết lái xe ô tô không? ➔ Có, tôi có bằng lái quốc tế.',
      context_usage: 'Hỏi về kỹ năng thực tế trong công việc hoặc đời sống.',
      category: 'Kỹ năng'
    },
    {
      id: 'k10-2',
      japanese_text: '日本の温泉に入ったことがありますか。',
      hiragana: 'にほんの おんせんに はいった ことが ありますか。',
      romaji: 'Nihon no onsen ni haitta koto ga arimasu ka.',
      vietnamese_meaning: 'Bạn đã từng tắm suối nước nóng Onsen ở Nhật bao giờ chưa?',
      context_usage: 'Hỏi trải nghiệm văn hóa truyền thống của người nước ngoài.',
      category: 'Kinh nghiệm'
    },
    {
      id: 'k10-3',
      japanese_text: '一度だけ入ったことがあります。とても気持ちよかったです。',
      hiragana: 'いちどだけ はいった ことが あります。とても きもちよかったです。',
      romaji: 'Ichido dake haitta koto ga arimasu. Totemo kimochiyokatta desu.',
      vietnamese_meaning: 'Tôi đã từng tắm thử một lần rồi. Cảm giác rất sảng khoái và dễ chịu.',
      context_usage: 'Chia sẻ trải nghiệm tích cực trong quá khứ.',
      category: 'Cảm xúc'
    },
    {
      id: 'k10-4',
      japanese_text: '休日は掃除したり、洗濯したりして過ごします。',
      hiragana: 'きゅうじつは そうじしたり、せんたくしたり して すごします。',
      romaji: 'Kyuujitsu wa soujishitari, sentakushitari shite sugoshimasu.',
      vietnamese_meaning: 'Ngày nghỉ tôi thường dọn dẹp phòng ốc, giặt giũ quần áo.',
      context_usage: 'Liệt kê các hoạt động tiêu biểu không theo thứ tự.',
      category: 'Sinh hoạt'
    }
  ],

  // ==========================================
  // BÀI 11: NÊU Ý KIẾN, QUAN ĐIỂM & BÌNH LUẬN
  // ==========================================
  11: [
    {
      id: 'k11-1',
      japanese_text: '昨日のサッカーの試合を見ましたか。 ➔ はい、とても面白かったと思います。',
      hiragana: 'きのうの さっかーの しあいを みましたか。 ➔ はい、とても おもしろかったと おもいます。',
      romaji: 'Kinou no sakkaa no shiai o mimashita ka. ➔ Hai, totemo omoshirokatta to omoimasu.',
      vietnamese_meaning: 'Hôm qua bạn có xem trận bóng đá không? ➔ Có, tôi thấy trận đấu rất hay.',
      context_usage: 'Bình luận về một sự kiện thể thao hoặc chương trình giải trí.',
      category: 'Quan điểm'
    },
    {
      id: 'k11-2',
      japanese_text: '日本の物価についてどう思いますか。 ➔ 少し高いと思います。',
      hiragana: 'にほんの ぶっかに ついて どう おもいますか。 ➔ すこし たかいと おもいます。',
      romaji: 'Nihon no bukka ni tsuite dou omoimasu ka. ➔ Sukoshi takai to omoimasu.',
      vietnamese_meaning: 'Bạn nghĩ thế nào về vật giá ở Nhật Bản? ➔ Tôi nghĩ là hơi đắt đỏ một chút.',
      context_usage: 'Bày tỏ góc nhìn về kinh tế xã hội khi sinh sống tại Nhật.',
      category: 'Ý kiến'
    },
    {
      id: 'k11-3',
      japanese_text: 'ニュースで明日は強い台風が来ると言っていましたよ。',
      hiragana: 'にゅーすで あしたは つよい たいふうが くると いっていましたよ。',
      romaji: 'Nyuusu de ashita wa tsuyoi taifuu ga kuru to itte imashita yo.',
      vietnamese_meaning: 'Trên bản tin thời sự người ta nói rằng ngày mai sẽ có bão lớn đấy.',
      context_usage: 'Truyền đạt lại thông tin thời tiết quan trọng cho người khác.',
      category: 'Thời sự'
    },
    {
      id: 'k11-4',
      japanese_text: '明日の会議は午後2時からでしょう？ ➔ はい、そうです。',
      hiragana: 'あしたの かいぎは ごごにじから でしょう？ ➔ はい、そうです。',
      romaji: 'Ashita no kaigi wa gogo niji kara deshou? ➔ Hai, sou desu.',
      vietnamese_meaning: 'Cuộc họp ngày mai bắt đầu lúc 2 giờ chiều đúng không? ➔ Vâng, đúng rồi.',
      context_usage: 'Xác nhận lại thời gian hẹn với đồng nghiệp trong công việc.',
      category: 'Xác nhận'
    }
  ],

  // ==========================================
  // BÀI 12: NHỜ GIÚP ĐỠ & GIẢI QUYẾT RẮC RỐI
  // ==========================================
  12: [
    {
      id: 'k12-1',
      japanese_text: 'パスポートを落としてしまったんですが、どうしたらいいですか。',
      hiragana: 'ぱすぽーとを おとしてしまったんですが、どうしたら いいですか。',
      romaji: 'Pasupooto o otoshite shimatta n desu ga, dou shitara ii desu ka.',
      vietnamese_meaning: 'Tôi lỡ đánh rơi mất hộ chiếu rồi, giờ tôi nên làm sao đây ạ?',
      context_usage: 'Xin lời khuyên khi gặp sự cố khẩn cấp ở nước ngoài.',
      category: 'Sự cố'
    },
    {
      id: 'k12-2',
      japanese_text: '交番へ行って、すぐに遺失物届を出したほうがいいですよ。',
      hiragana: 'こうばんへ いって、すぐに いしつぶつとどけを だした ほうが いいですよ。',
      romaji: 'Kouban e itte, sugu ni ishitsubutsutodoke o dashita hou ga ii desu yo.',
      vietnamese_meaning: 'Bạn nên đến đồn cảnh sát Koban để làm giấy báo mất đồ ngay nhé.',
      context_usage: 'Hướng dẫn giải quyết thủ tục khi người khác bị mất đồ.',
      category: 'Lời khuyên'
    },
    {
      id: 'k12-3',
      japanese_text: '日本語のレポートを書いたんですが、少し見ていただけませんか。',
      hiragana: 'にほんごの れぽーとを かいたんですが、すこし みて いただけませんか。',
      romaji: 'Nihongo no repooto o kaita n desu ga, sukoshi mite itadakemasen ka.',
      vietnamese_meaning: 'Tôi vừa viết bài báo cáo tiếng Nhật, bạn có thể xem giúp tôi một chút được không?',
      context_usage: 'Nhờ thầy cô hoặc bạn người Nhật sửa lỗi ngữ pháp giúp.',
      category: 'Nhờ vả'
    },
    {
      id: 'k12-4',
      japanese_text: '市役所へ行きたいんですが、行き方を教えていただけませんか。',
      hiragana: 'しやくしょへ いきたいんですが、いきかたを おしえて いただけませんか。',
      romaji: 'Shiyakusho e ikitai n desu ga, ikikata o oshiete itadakemasen ka.',
      vietnamese_meaning: 'Tôi muốn đến ủy ban quận/thành phố, bạn có thể chỉ cách đi giúp tôi được không?',
      context_usage: 'Hỏi đường đến cơ quan hành chính nhà nước.',
      category: 'Chỉ đường'
    }
  ],

  // ==========================================
  // BÀI 13: LỜI KHUYÊN & CHĂM SÓC BẢN THÂN
  // ==========================================
  13: [
    {
      id: 'k13-1',
      japanese_text: '最近とても疲れているんです。 ➔ 早く寝たほうがいいですよ。',
      hiragana: 'さいきん とても つかれているんです。 ➔ はやく ねた ほうが いいですよ。',
      romaji: 'Saikin totemo tsukarete iru n desu. ➔ Hayaku neta hou ga ii desu yo.',
      vietnamese_meaning: 'Dạo này tôi thấy kiệt sức quá. ➔ Bạn nên đi ngủ sớm đi nhé.',
      context_usage: 'Khuyên nhủ đồng nghiệp chăm sóc sức khỏe khi làm việc căng thẳng.',
      category: 'Lời khuyên'
    },
    {
      id: 'k13-2',
      japanese_text: '明日は午後から雨が降るかもしれません。傘を持って行きましょう。',
      hiragana: 'あしたは ごごから あめが ふるかもしれません。かさを もって いきましょう。',
      romaji: 'Ashita wa gogo kara ame ga furu kamoshiremasen. Kasa o motte ikimashou.',
      vietnamese_meaning: 'Chiều mai có thể trời sẽ mưa đấy. Chúng ta hãy mang theo ô nhé.',
      context_usage: 'Dự đoán thời tiết và nhắc nhở chuẩn bị đồ dùng.',
      category: 'Dự đoán'
    },
    {
      id: 'k13-3',
      japanese_text: '昨日お酒を飲みすぎて、頭が痛いです。',
      hiragana: 'きのう おさけを のみすぎて、あたまが いたいです。',
      romaji: 'Kinou osake o nomisugite, atama ga itai desu.',
      vietnamese_meaning: 'Hôm qua tôi uống quá chén nên giờ đầu đau nhức quá.',
      context_usage: 'Trần tình về việc bản thân đã quá chén trong buổi liên hoan.',
      category: 'Tâm sự'
    },
    {
      id: 'k13-4',
      japanese_text: '今度の週末、秋葉原へパソコンを見に行きませんか。',
      hiragana: 'こんどの しゅうまつ、あきはばらへ ぱそこんを みに いきませんか。',
      romaji: 'Kondo no shuumatsu, Akihabara e pasokon o mi ni ikimasen ka.',
      vietnamese_meaning: 'Cuối tuần này, cùng đi Akihabara xem máy tính với tôi không?',
      context_usage: 'Rủ bạn cùng đi đến một địa điểm để thực hiện mục đích mua sắm.',
      category: 'Rủ rê'
    }
  ],

  // ==========================================
  // BÀI 14: ĐIỀU KIỆN, CHUYỂN NHÀ & BIẾN ĐỔI
  // ==========================================
  14: [
    {
      id: 'k14-1',
      japanese_text: '来月新しいアパートへ引っ越すことになりました。',
      hiragana: 'らいげつ あたらしい あぱーとへ ひっこす ことに なりました。',
      romaji: 'Raigetsu atarashii apaato e hikkosu koto ni narimashita.',
      vietnamese_meaning: 'Tôi vừa quyết định tháng sau sẽ chuyển sang căn hộ mới.',
      context_usage: 'Thông báo tin tức quan trọng về nơi ở cho bạn bè.',
      category: 'Chuyển nhà'
    },
    {
      id: 'k14-2',
      japanese_text: '時間が合ったら、引っ越しの手伝いに行きましょうか。',
      hiragana: 'じかんが あったら、ひっこしの てつだいに いきましょうか。',
      romaji: 'Jikan ga attara, hikkoshi no tetsudai ni ikimashou ka.',
      vietnamese_meaning: 'Nếu thời gian cho phép, để tôi đến phụ bạn dọn nhà một tay nhé?',
      context_usage: 'Đề nghị giúp đỡ người khác một cách nhiệt tình.',
      category: 'Giúp đỡ'
    },
    {
      id: 'k14-3',
      japanese_text: '春になって、暖かくなりましたね。桜が楽しみです。',
      hiragana: 'はるに なって、あたたかく なりましたね。さくらが たのしみです。',
      romaji: 'Haru ni natte, atatakaku narimashita ne. Sakura ga tanoshimi desu.',
      vietnamese_meaning: 'Mùa xuân đến, trời ấm dần lên rồi nhỉ. Tôi rất ngóng chờ hoa anh đào nở.',
      context_usage: 'Trò chuyện về sự thay đổi của bốn mùa tại Nhật Bản.',
      category: 'Bốn mùa'
    },
    {
      id: 'k14-4',
      japanese_text: 'このスマートフォンは画面が大きくて、とても使いやすいです。',
      hiragana: 'この すまーとふぉんは がめんが おおきくて、とても つかいやすいです。',
      romaji: 'Kono sumaatofon wa gamen ga ookikute, totemo tsukaiyasui desu.',
      vietnamese_meaning: 'Chiếc điện thoại thông minh này màn hình to nên rất dễ thao tác.',
      context_usage: 'Đánh giá tính tiện dụng của một sản phẩm công nghệ.',
      category: 'Đánh giá'
    }
  ],

  // ==========================================
  // BÀI 15: DỰ ĐỊNH TƯƠNG LAI & CHUẨN BỊ
  // ==========================================
  15: [
    {
      id: 'k15-1',
      japanese_text: '大学を卒業したら、どうするつもりですか。',
      hiragana: 'だいがくを そつぎょうしたら、どうする つもりですか。',
      romaji: 'Daigaku o sotsugyoushitara, dou suru tsumori desu ka.',
      vietnamese_meaning: 'Sau khi tốt nghiệp đại học xong, bạn dự định sẽ làm gì?',
      context_usage: 'Hỏi thăm định hướng tương lai của sinh viên, du học sinh.',
      category: 'Tương lai'
    },
    {
      id: 'k15-2',
      japanese_text: '日本でITの会社に就職しようと思っています。',
      hiragana: 'にほんで あいてぃーの かいしゃに しゅうしょくしようと おもっています。',
      romaji: 'Nihon de AITII no kaisha ni shuushokushiyou to omotte imasu.',
      vietnamese_meaning: 'Tôi đang có ý định sẽ xin vào làm tại một công ty IT ở Nhật.',
      context_usage: 'Bộc bạch nguyện vọng và mục tiêu nghề nghiệp.',
      category: 'Ước mơ'
    },
    {
      id: 'k15-3',
      japanese_text: '来週面接があるので、スーツをクリーニングしておきました。',
      hiragana: 'らいしゅう めんせつが あるので、すーつを くりーにんぐ しておきました。',
      romaji: 'Raishuu mensetsu ga aru node, suutsu o kuriiningu shite okimashita.',
      vietnamese_meaning: 'Tuần sau có phỏng vấn nên tôi đã mang bộ vest đi giặt là sẵn sàng rồi.',
      context_usage: 'Chia sẻ sự chu đáo trong khâu chuẩn bị cho sự kiện quan trọng.',
      category: 'Chuẩn bị'
    },
    {
      id: 'k15-4',
      japanese_text: '旅の準備はもう終わりましたか。 ➔ いいえ、まだ終わっていません。',
      hiragana: 'たびの じゅんびは もう おわりましたか。 ➔ いいえ、まだ おわっていません。',
      romaji: 'Tabi no junbi wa mou owarimashita ka. ➔ Iie, mada owatte imasen.',
      vietnamese_meaning: 'Bạn đã chuẩn bị hành lý cho chuyến đi xong chưa? ➔ Chưa, tôi vẫn chưa xong.',
      context_usage: 'Hỏi han tiến độ chuẩn bị trước ngày khởi hành.',
      category: 'Khởi hành'
    }
  ]
};
