import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useProgress } from '../../hooks/useProgress';

/**
 * BackupRestoreModal - Trung tâm Sao Lưu & Khôi Phục Dữ Liệu Học Tập (100% Local JSON)
 */
export const BackupRestoreModal = ({ isOpen, onClose }) => {
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }
  const [confirmReset, setConfirmReset] = useState(false);

  // Khóa cuộn trang nền khi mở Modal
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const {
    learnedItems,
    kanjiLearned,
    mistakeVault,
    bonsaiState,
    dailyStreak,
    currentLesson,
    importAllData,
    resetAllProgress,
  } = useProgress();

  if (!isOpen) return null;

  // 1. Tải về bản sao lưu JSON
  const handleExportData = () => {
    try {
      const backupPayload = {
        version: 1,
        appName: 'Nihongo Master',
        exportedAt: new Date().toISOString(),
        current_lesson: currentLesson,
        daily_streak: dailyStreak,
        bonsai_state: bonsaiState,
        learned_items: learnedItems,
        kanji_learned: kanjiLearned,
        mistake_vault: mistakeVault,
      };

      const jsonStr = JSON.stringify(backupPayload, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const dateStr = new Date().toISOString().split('T')[0];
      const link = document.createElement('a');
      link.href = url;
      link.download = `nihongo_master_backup_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({
        type: 'success',
        text: '✅ Đã tải file sao lưu JSON về máy thành công!',
      });
    } catch {
      setMessage({
        type: 'error',
        text: '❌ Có lỗi khi tạo file sao lưu.',
      });
    }
  };

  // 2. Nhập dữ liệu từ file JSON
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        const parsed = JSON.parse(content);

        // Kiểm tra hợp lệ sơ bộ
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Định dạng file không hợp lệ.');
        }

        const success = importAllData(parsed);
        if (success) {
          const vocabCount = Object.keys(parsed.learned_items || {}).length;
          const kanjiCount = Object.keys(parsed.kanji_learned || {}).length;

          setMessage({
            type: 'success',
            text: `🎉 Khôi phục thành công! Đã nạp ${vocabCount} từ vựng và ${kanjiCount} chữ Hán.`,
          });
        } else {
          setMessage({
            type: 'error',
            text: '❌ Không thể nạp dữ liệu từ file này.',
          });
        }
      } catch {
        setMessage({
          type: 'error',
          text: '❌ File JSON không đúng định dạng sao lưu của Nihongo Master.',
        });
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.readAsText(file);
  };

  // 3. Đặt lại toàn bộ tiến độ
  const handleResetData = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }

    resetAllProgress();
    setConfirmReset(false);
    setMessage({
      type: 'success',
      text: 'Đã xóa toàn bộ tiến độ và đặt lại về trạng thái ban đầu.',
    });
  };

  const vocabLearnedCount = Object.keys(learnedItems || {}).length;
  const kanjiLearnedCount = Object.keys(kanjiLearned || {}).length;
  const mistakeCount = Object.keys(mistakeVault || {}).length;

  return createPortal(
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>💾</span>
            <h2 style={styles.title}>Sao Lưu & Khôi Phục Dữ Liệu</h2>
          </div>
          <button type="button" style={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Thông báo trạng thái */}
        {message && (
          <div
            style={{
              ...styles.alertBanner,
              backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fff1f2',
              color: message.type === 'success' ? '#065f46' : '#9f1239',
              borderColor: message.type === 'success' ? '#a7f3d0' : '#fecdd3',
            }}
          >
            {message.text}
          </div>
        )}

        {/* Thống kê dữ liệu hiện tại trên máy */}
        <div style={styles.currentStatsCard}>
          <div style={styles.statsCardTitle}>📊 Dữ liệu hiện có trên trình duyệt của bạn:</div>
          <div style={styles.statsRow}>
            <div style={styles.statItem}>
              <div style={styles.statNum}>{vocabLearnedCount}</div>
              <div style={styles.statLabel}>Từ vựng đã học</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNum}>{kanjiLearnedCount}</div>
              <div style={styles.statLabel}>Chữ Hán đã nhớ</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNum}>{mistakeCount}</div>
              <div style={styles.statLabel}>Mục Hộp cứu hộ</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNum}>{dailyStreak?.count || 1} 🔥</div>
              <div style={styles.statLabel}>Chuỗi ngày học</div>
            </div>
          </div>
        </div>

        {/* KHỐI 1: XUẤT SAO LƯU (EXPORT) */}
        <div style={styles.sectionBox}>
          <div style={styles.sectionHeader}>
            <span style={{ fontSize: '1.2rem' }}>📤</span>
            <div>
              <div style={styles.sectionTitle}>Xuất bản sao lưu (Export JSON)</div>
              <div style={styles.sectionDesc}>
                Lưu toàn bộ tiến độ ra file <code>.json</code> về máy tính hoặc điện thoại để lưu trữ an toàn.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleExportData}
            style={styles.primaryExportBtn}
          >
            💾 Tải bản sao lưu JSON về máy
          </button>
        </div>

        {/* KHỐI 2: NHẬP KHÔI PHỤC (IMPORT) */}
        <div style={styles.sectionBox}>
          <div style={styles.sectionHeader}>
            <span style={{ fontSize: '1.2rem' }}>📥</span>
            <div>
              <div style={styles.sectionTitle}>Khôi phục từ file (Import JSON)</div>
              <div style={styles.sectionDesc}>
                Nạp lại file <code>.json</code> đã lưu trước đó để tiếp tục học trên thiết bị mới mà không mất dữ liệu.
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            style={styles.secondaryImportBtn}
          >
            📂 Chọn file sao lưu (.json)
          </button>
        </div>

        {/* KHỐI 3: ĐẶT LẠI DỮ LIỆU (RESET) */}
        <div style={styles.dangerZone}>
          <div style={{ flex: 1 }}>
            <div style={styles.dangerTitle}>Đặt lại tiến độ (Factory Reset)</div>
            <div style={styles.dangerDesc}>
              Xóa sạch toàn bộ từ đã học và lịch sử để bắt đầu học lại từ đầu.
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetData}
            style={{
              ...styles.resetBtn,
              backgroundColor: confirmReset ? '#dc2626' : '#ffffff',
              color: confirmReset ? '#ffffff' : '#dc2626',
            }}
          >
            {confirmReset ? '⚠️ Chắc chắn xóa?' : 'Xóa tiến độ'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
    padding: '16px',
    boxSizing: 'border-box',
    animation: 'sakuraFadeOnly 0.2s ease',
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    maxWidth: '560px',
    width: '100%',
    maxHeight: '92vh',
    overflowY: 'auto',
    padding: '24px',
    border: '1.5px solid #fce7f3',
    boxShadow: '0 20px 45px rgba(233, 30, 140, 0.16)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '14px',
    borderBottom: '1px solid #fce7f3',
  },
  title: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#0f172a',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    color: '#94a3b8',
    cursor: 'pointer',
  },
  alertBanner: {
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid',
    fontSize: '0.88rem',
    fontWeight: '600',
  },
  currentStatsCard: {
    backgroundColor: '#fff9fb',
    borderRadius: '16px',
    padding: '14px 16px',
    border: '1px solid #fce7f3',
  },
  statsCardTitle: {
    fontSize: '0.82rem',
    color: '#64748b',
    fontWeight: '600',
    marginBottom: '10px',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    textAlign: 'center',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statNum: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#e91e8c',
  },
  statLabel: {
    fontSize: '0.72rem',
    color: '#64748b',
    marginTop: '2px',
  },
  sectionBox: {
    backgroundColor: '#f8fafc',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionHeader: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#0f172a',
  },
  sectionDesc: {
    fontSize: '0.8rem',
    color: '#64748b',
    marginTop: '2px',
    lineHeight: 1.4,
  },
  primaryExportBtn: {
    width: '100%',
    padding: '11px 16px',
    backgroundColor: '#e91e8c',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(233, 30, 140, 0.25)',
    transition: 'all 0.2s ease',
  },
  secondaryImportBtn: {
    width: '100%',
    padding: '11px 16px',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    border: '1.5px solid #cbd5e0',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  dangerZone: {
    borderTop: '1px dashed #fecdd3',
    paddingTop: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  dangerTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#dc2626',
  },
  dangerDesc: {
    fontSize: '0.75rem',
    color: '#64748b',
    marginTop: '2px',
  },
  resetBtn: {
    padding: '8px 14px',
    borderRadius: '10px',
    border: '1.5px solid #dc2626',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  },
};
