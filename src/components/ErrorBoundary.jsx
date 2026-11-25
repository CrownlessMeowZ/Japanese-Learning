import React from 'react';

const isChunkLoadError = (error) => {
  const msg = String(error?.message || error?.name || '');
  return (
    error?.name === 'ChunkLoadError' ||
    /Unable to preload CSS/i.test(msg) ||
    /Failed to fetch dynamically imported module/i.test(msg) ||
    /Importing a module script failed/i.test(msg) ||
    /error loading dynamically imported module/i.test(msg) ||
    /Loading chunk [\w-]+ failed/i.test(msg)
  );
};

/**
 * ErrorBoundary - Chốt chặn bảo vệ giao diện khỏi màn hình trắng khi có lỗi Runtime hoặc lỗi tải module Offline
 * Hỗ trợ 2 cấp độ:
 * - 'root': Bọc toàn bộ ứng dụng tại main.jsx
 * - 'route': Bọc vùng nội dung Lazy Loading trong App.jsx để Header và các tab khác vẫn hoạt động bình thường
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`[ErrorBoundary:${this.props.level || 'route'}]`, error, errorInfo);
  }

  handleRetry = () => {
    const chunkErr = isChunkLoadError(this.state.error);
    // React 19 giữ trạng thái rejected cho React.lazy() nên phải reload để nạp lại chunk mới
    if (chunkErr) {
      window.location.reload();
      return;
    }
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    if (typeof this.props.onResetRoute === 'function') {
      this.props.onResetRoute();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const isRoot = this.props.level === 'root';
    const chunkError = isChunkLoadError(this.state.error);
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

    return (
      <div style={isRoot ? styles.rootWrapper : styles.routeWrapper}>
        <div style={styles.card}>
          <div style={styles.iconBadge}>
            {chunkError && isOffline ? '📴' : '🌸'}
          </div>

          <h2 style={styles.title}>
            {chunkError
              ? 'Không thể tải màn hình này'
              : 'Ôi! Có sự cố hiển thị vừa xảy ra'}
          </h2>

          <p style={styles.description}>
            {chunkError && isOffline
              ? 'Bạn đang ngoại tuyến và phần giao diện này chưa được lưu sẵn trong bộ nhớ đệm PWA. Hãy kết nối mạng một lần hoặc chuyển sang tính năng khác.'
              : 'Hệ thống đã tự động khoanh vùng sự cố để bảo vệ toàn bộ dữ liệu học tập trong trình duyệt của bạn.'}
          </p>

          <div style={styles.actionsRow}>
            <button
              type="button"
              onClick={this.handleRetry}
              style={styles.primaryBtn}
            >
              🔄 Thử tải lại
            </button>

            <button
              type="button"
              onClick={this.handleGoHome}
              style={styles.secondaryBtn}
            >
              {isRoot ? '↻ Tải lại ứng dụng' : (this.props.resetLabel || '🌸 Về Trang Chủ')}
            </button>
          </div>

          {this.state.error?.message && (
            <details style={styles.details}>
              <summary style={styles.summary}>Chi tiết kỹ thuật</summary>
              <code style={styles.codeBlock}>{this.state.error.message}</code>
            </details>
          )}
        </div>
      </div>
    );
  }
}

const styles = {
  rootWrapper: {
    minHeight: '100vh',
    backgroundColor: '#fff8fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    boxSizing: 'border-box',
  },
  routeWrapper: {
    maxWidth: '640px',
    margin: '32px auto',
    padding: '0 16px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    border: '1.5px solid #fce7f3',
    boxShadow: '0 14px 36px rgba(233, 30, 140, 0.1)',
    padding: '32px 24px',
    textAlign: 'center',
    maxWidth: '520px',
    width: '100%',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  iconBadge: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#fff0f6',
    border: '1.5px solid #fbcfe8',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.9rem',
    marginBottom: '14px',
  },
  title: {
    margin: '0 0 10px',
    fontSize: '1.35rem',
    fontWeight: '800',
    color: '#1e293b',
  },
  description: {
    margin: '0 0 22px',
    fontSize: '0.94rem',
    lineHeight: 1.6,
    color: '#475569',
  },
  actionsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    padding: '10px 22px',
    background: 'linear-gradient(135deg, #e91e8c 0%, #f43f5e 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '14px',
    fontSize: '0.92rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(233, 30, 140, 0.25)',
  },
  secondaryBtn: {
    padding: '10px 20px',
    backgroundColor: '#ffffff',
    color: '#334155',
    border: '1.5px solid #cbd5e1',
    borderRadius: '14px',
    fontSize: '0.92rem',
    fontWeight: '700',
    cursor: 'pointer',
  },
  details: {
    marginTop: '18px',
    textAlign: 'left',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '10px 12px',
    border: '1px solid #e2e8f0',
  },
  summary: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#64748b',
    cursor: 'pointer',
  },
  codeBlock: {
    display: 'block',
    marginTop: '8px',
    fontSize: '0.78rem',
    color: '#9f1239',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
  },
};
