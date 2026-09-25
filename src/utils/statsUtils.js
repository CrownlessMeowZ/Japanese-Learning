import { vocabularyData } from '../data/vocabulary.js';
import { grammarData } from '../data/grammar.js';

const TOTAL_VOCABULARY = 965;
const TOTAL_KANJI = 80;
const TOTAL_GRAMMAR = 68;

/**
 * Tính toán điểm số năng lực 5 chiều (Radar Competency)
 * @param {Object} learnedItems Các mục đã học từ progressStore
 * @param {Object} kanjiLearned Chữ Hán đã nhớ
 * @param {Object} kaiwaScores Điểm luyện nói Kaiwa
 * @param {Object} kanaPractice Luyện tập bảng chữ cái
 * @returns {Object} Dữ liệu 5 kỹ năng, điểm trung bình, danh hiệu và lời khuyên
 */
export function calculateCompetencyRadar(
  learnedItems = {},
  kanjiLearned = {},
  kaiwaScores = {},
  kanaPractice = {}
) {
  // 1. Kỹ năng Từ vựng (Vocabulary)
  let vocabLearnedCount = 0;
  let vocabMasteredCount = 0; // Đã chuyển vào trí nhớ dài hạn (interval >= 14 hoặc repetition >= 3)

  for (const item of Object.values(learnedItems)) {
    if (!item) continue;
    if (item.type === 'vocab' || !item.type) {
      vocabLearnedCount++;
      if ((item.interval && item.interval >= 14) || (item.repetition && item.repetition >= 3)) {
        vocabMasteredCount++;
      }
    }
  }

  // Tỉ lệ từ đã học (tối đa 80 điểm) + Tỉ lệ từ thành thạo (tối đa 20 điểm)
  const vocabCoverage = (vocabLearnedCount / TOTAL_VOCABULARY) * 80;
  const vocabMasteryBonus = vocabLearnedCount > 0
    ? (vocabMasteredCount / vocabLearnedCount) * 20
    : 0;
  const vocabScore = Math.min(100, Math.round(vocabCoverage + vocabMasteryBonus));

  // 2. Kỹ năng Hán tự (Kanji)
  const kanjiCount = Object.keys(kanjiLearned || {}).length;
  const kanjiScore = Math.min(100, Math.round((kanjiCount / TOTAL_KANJI) * 100));

  // 3. Kỹ năng Bảng chữ cái (Kana)
  // Nếu học viên đã học nhiều từ vựng thì chắc chắn đã thuộc Kana; kết hợp với số lượt luyện Kana
  const totalKanaPracticed = kanaPractice?.totalPracticed || 0;
  const correctKana = kanaPractice?.correctAnswers || 0;
  let kanaScore = 0;

  if (vocabLearnedCount >= 30) {
    kanaScore = 65; // Đã đọc được 30 từ tiếng Nhật -> thuộc bảng chữ cái cơ bản
    kanaScore += Math.min(35, Math.round((vocabLearnedCount / 150) * 25 + (totalKanaPracticed * 2)));
  } else {
    kanaScore = Math.min(60, vocabLearnedCount * 2);
    if (totalKanaPracticed > 0) {
      const accuracy = correctKana / Math.max(1, totalKanaPracticed);
      kanaScore += Math.min(40, Math.round(accuracy * 40));
    }
  }
  kanaScore = Math.min(100, Math.max(0, Math.round(kanaScore)));

  // 4. Kỹ năng Ngữ pháp (Grammar)
  let grammarLearnedCount = 0;
  for (const item of Object.values(learnedItems)) {
    if (item && item.type === 'grammar') {
      grammarLearnedCount++;
    }
  }
  const grammarScore = Math.min(100, Math.round((grammarLearnedCount / TOTAL_GRAMMAR) * 100));

  // 5. Kỹ năng Nghe & Nói (Listening & Speaking / Kaiwa Shadowing)
  const kaiwaEntries = Object.entries(kaiwaScores || {});
  let speakingScore = 0;

  if (kaiwaEntries.length > 0) {
    const totalPercentage = kaiwaEntries.reduce((acc, [, val]) => acc + (typeof val === 'number' ? val : 0), 0);
    const avgScore = totalPercentage / kaiwaEntries.length;
    // Điểm số dựa trên số bài đã luyện và điểm trung bình
    const coverageScore = Math.min(50, (kaiwaEntries.length / 20) * 50);
    const qualityScore = (avgScore / 100) * 50;
    speakingScore = Math.min(100, Math.round(coverageScore + qualityScore));
  } else {
    // Nếu chưa luyện nói thì tính nhẹ theo điểm tiếp xúc âm thanh (tối đa 15 điểm nếu học từ vựng)
    speakingScore = Math.min(15, Math.round((vocabLearnedCount / 100) * 15));
  }

  // Điểm tổng năng lực trung bình (Overall Competency Score)
  const overallScore = Math.round(
    (vocabScore + kanjiScore + kanaScore + grammarScore + speakingScore) / 5
  );

  // Xếp hạng cấp bậc (Rank Title)
  let rankTitle = '🌸 Tân Binh Nhập Môn';
  let rankLevel = 'Novice';
  let rankColor = '#64748b';
  let rankDesc = 'Bắt đầu hành trình chinh phục tiếng Nhật sơ cấp Dekiru Nihongo.';

  if (overallScore >= 90) {
    rankTitle = '👑 Nihongo Master';
    rankLevel = 'Grandmaster';
    rankColor = '#be185d';
    rankDesc = 'Xuất sắc! Bạn đã làm chủ toàn diện từ vựng, ngữ pháp, chữ Hán và giao tiếp.';
  } else if (overallScore >= 70) {
    rankTitle = '🏯 Cao Thủ N5';
    rankLevel = 'Expert';
    rankColor = '#e91e8c';
    rankDesc = 'Trình độ N5 rất vững vàng. Sẵn sàng cho các kỳ thi JLPT và giao tiếp tự tin!';
  } else if (overallScore >= 45) {
    rankTitle = '⚔️ Chiến Binh Tiếng Nhật';
    rankLevel = 'Adept';
    rankColor = '#d97706';
    rankDesc = 'Tiến bộ vượt bậc. Các phản xạ từ vựng và câu cú đang dần hoàn thiện.';
  } else if (overallScore >= 20) {
    rankTitle = '🌿 Người Học Chăm Chỉ';
    rankLevel = 'Apprentice';
    rankColor = '#059669';
    rankDesc = 'Đang duy trì thói quen học tập rất tốt, hãy bứt phá các bài học tiếp theo.';
  }

  // Tìm kỹ năng có điểm số thấp nhất để đưa ra lời khuyên AI cá nhân hóa
  const skillsList = [
    { key: 'vocab', label: 'Từ Vựng', score: vocabScore, advice: 'Hãy ôn luyện Flashcard 3D và thử sức các vòng đấu Sakura Match để tích lũy thêm vốn từ nhé!' },
    { key: 'kanji', label: 'Hán Tự N5', score: kanjiScore, advice: 'Chữ Hán là chìa khóa đọc hiểu tiếng Nhật. Hãy ghé phòng Luyện Viết Canvas để tập viết theo từng nét vẽ!' },
    { key: 'kana', label: 'Bảng Chữ Cái', score: kanaScore, advice: 'Hãy dành 5 phút vào Bảng Chữ Cái làm Quiz tốc độ để phản xạ mặt chữ trở nên nhanh như chớp!' },
    { key: 'grammar', label: 'Ngữ Pháp', score: grammarScore, advice: 'Các mẫu câu ngữ pháp giúp bạn nói câu dài trôi chảy. Hãy xem và đánh dấu mẫu câu trong 15 bài học nhé!' },
    { key: 'speaking', label: 'Nghe & Nói', score: speakingScore, advice: 'Đừng ngại bật Micro trong phòng Luyện Nói Kaiwa để AI lắng nghe và chấm điểm phát âm cho bạn nhé!' },
  ];

  // Sắp xếp tăng dần theo điểm
  const sortedByScore = [...skillsList].sort((a, b) => a.score - b.score);
  const weakest = sortedByScore[0];

  return {
    skills: {
      vocab: { label: 'Từ Vựng', score: vocabScore, count: vocabLearnedCount, total: TOTAL_VOCABULARY, mastered: vocabMasteredCount },
      kanji: { label: 'Hán Tự', score: kanjiScore, count: kanjiCount, total: TOTAL_KANJI },
      kana: { label: 'Chữ Cái', score: kanaScore, count: Math.min(92, Math.round(kanaScore * 0.92)), total: 92 },
      grammar: { label: 'Ngữ Pháp', score: grammarScore, count: grammarLearnedCount, total: TOTAL_GRAMMAR },
      speaking: { label: 'Nghe & Nói', score: speakingScore, count: kaiwaEntries.length, total: 60 },
    },
    overallScore,
    rankTitle,
    rankLevel,
    rankColor,
    rankDesc,
    weakestSkill: weakest,
  };
}

/**
 * Tổng hợp dữ liệu biểu đồ nhiệt 365 ngày (Activity Heatmap)
 * @param {Object} activityHistory Lịch sử hoạt động theo ngày
 * @param {Object} learnedItems Các mục đã học
 * @param {Object} kanjiLearned Chữ Hán đã nhớ
 * @param {Object} mistakeVault Sổ tay điểm yếu
 * @param {Object} bonsaiState Trạng thái cây Bonsai
 * @returns {Object} Ma trận tuần, nhãn tháng và các chỉ số hoạt động
 */
export function generate365DaysHeatmap(
  activityHistory = {},
  learnedItems = {},
  kanjiLearned = {},
  mistakeVault = {},
  bonsaiState = {}
) {
  // Gom toàn bộ mốc hoạt động vào 1 Map ngày -> số lượng
  const countByDate = new Map();

  // 1. Dữ liệu từ activity_history
  if (activityHistory && typeof activityHistory === 'object') {
    for (const [dateStr, count] of Object.entries(activityHistory)) {
      if (dateStr && typeof count === 'number') {
        countByDate.set(dateStr, (countByDate.get(dateStr) || 0) + count);
      }
    }
  }

  // 2. Tự động truy hồi các timestamp có sẵn trong learned_items
  if (learnedItems && typeof learnedItems === 'object') {
    for (const item of Object.values(learnedItems)) {
      if (!item) continue;
      if (item.learnedAt) {
        const d = String(item.learnedAt).split('T')[0];
        if (d && !activityHistory[d]) {
          countByDate.set(d, (countByDate.get(d) || 0) + 1);
        }
      }
      if (item.lastReviewedAt) {
        const d = String(item.lastReviewedAt).split('T')[0];
        if (d && !activityHistory[d]) {
          countByDate.set(d, (countByDate.get(d) || 0) + 1);
        }
      }
    }
  }

  // 3. Truy hồi Kanji timestamps
  if (kanjiLearned && typeof kanjiLearned === 'object') {
    for (const item of Object.values(kanjiLearned)) {
      if (item?.learnedAt) {
        const d = String(item.learnedAt).split('T')[0];
        if (d && !activityHistory[d]) {
          countByDate.set(d, (countByDate.get(d) || 0) + 1);
        }
      }
    }
  }

  // 4. Truy hồi Bonsai water date
  if (bonsaiState?.lastWateredDate) {
    const d = bonsaiState.lastWateredDate;
    if (d && !countByDate.has(d)) {
      countByDate.set(d, 1);
    }
  }

  // Tạo khung 53 tuần kết thúc vào tuần hiện tại
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0: Chủ Nhật, 6: Thứ Bảy

  // Xác định ngày cuối cùng là thứ Bảy của tuần này (để ma trận luôn đầy đủ 7 hàng)
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + (6 - currentDayOfWeek));

  // Ngày bắt đầu là 53 tuần trước (53 * 7 = 371 ngày trước endDate)
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - (53 * 7 - 1));

  const weeks = [];
  const monthLabels = [];
  let currentMonth = -1;

  let iterDate = new Date(startDate);
  let totalActiveDays = 0;
  let totalActivities = 0;

  for (let w = 0; w < 53; w++) {
    const daysInWeek = [];

    for (let d = 0; d < 7; d++) {
      const year = iterDate.getFullYear();
      const month = String(iterDate.getMonth() + 1).padStart(2, '0');
      const day = String(iterDate.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      const isFuture = iterDate > today;

      const count = isFuture ? 0 : (countByDate.get(dateKey) || 0);

      // Thang cấp độ màu (0: trống, 1: 1-2, 2: 3-5, 3: 6-9, 4: >=10)
      let level = 0;
      if (!isFuture && count > 0) {
        totalActiveDays++;
        totalActivities += count;
        if (count >= 10) level = 4;
        else if (count >= 6) level = 3;
        else if (count >= 3) level = 2;
        else level = 1;
      }

      // Đánh dấu nhãn tháng khi chuyển sang tháng mới
      const m = iterDate.getMonth();
      if (d === 0 && m !== currentMonth) {
        currentMonth = m;
        monthLabels.push({
          weekIndex: w,
          label: `T${m + 1}`,
        });
      }

      daysInWeek.push({
        date: dateKey,
        formattedDate: `${day}/${month}/${year}`,
        count,
        level,
        isToday: dateKey === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
        isFuture,
      });

      iterDate.setDate(iterDate.getDate() + 1);
    }

    weeks.push(daysInWeek);
  }

  return {
    weeks,
    monthLabels,
    totalActiveDays,
    totalActivities,
  };
}

/**
 * Tính toán tiến độ chi tiết của 15 bài học Dekiru Nihongo
 * @param {Object} learnedItems Danh sách từ vựng & ngữ pháp đã học
 * @returns {Array<Object>} Thông tin chi tiết từng bài từ 1 đến 15
 */
export function get15LessonsBreakdown(learnedItems = {}) {
  const result = [];

  for (let lsId = 1; lsId <= 15; lsId++) {
    const vocabList = vocabularyData[String(lsId)] || [];
    const grammarList = grammarData[lsId] || grammarData[String(lsId)] || [];

    let vocabLearned = 0;
    for (const w of vocabList) {
      const key = w.id || w.kanji || w.hiragana;
      if (learnedItems[key]) {
        vocabLearned++;
      }
    }

    let grammarLearned = 0;
    for (const g of grammarList) {
      const gId = g.id || `grammar_L${lsId}_${g.title}`;
      if (learnedItems[gId] || learnedItems[g.title]) {
        grammarLearned++;
      }
    }

    const totalItems = vocabList.length + grammarList.length;
    const learnedTotal = vocabLearned + grammarLearned;
    const percent = totalItems > 0 ? Math.round((learnedTotal / totalItems) * 100) : 0;

    result.push({
      lessonId: lsId,
      vocabCount: vocabList.length,
      vocabLearned,
      grammarCount: grammarList.length,
      grammarLearned,
      percent,
    });
  }

  return result;
}
