import React, { useEffect, useMemo, useState, useCallback, useRef, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSyncAlt,
  faSlidersH,
  faShoppingCart,
  faMoneyBillWave,
  faExclamationTriangle,
  faUserPlus,
  faChartLine,
  faWarehouse,
  faStar,
  faUsers,
  faPaperPlane,
  faPaperclip,
  faTrashAlt,
  faHistory,
  faPlus,
  faTimes,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import analyticsApi from '../../services/analyticsApi';
import { sendGroqMessage } from '../../services/groqApi';
import './AnalyticsDashboard.css';
import { useTranslation } from 'react-i18next';

const cardIconMap = {
  orders: faShoppingCart,
  revenue: faMoneyBillWave,
  inventory: faExclamationTriangle,
  newUsers: faUserPlus
};

const pieColors = ['#6366F1', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6'];

// Component ChatMessage riêng để tối ưu re-render
const ChatMessage = memo(({ message, formatAIMessage, locale }) => {
  // Cache formatted content - chỉ tính lại nếu message.text thay đổi
  const formattedContent = useMemo(() => {
    if (message.role === 'assistant' && message.text) {
      return formatAIMessage(message.text);
    }
    return null;
  }, [message.text, message.role, formatAIMessage]);

  const formattedTimestamp = useMemo(() => {
    return new Date(message.timestamp).toLocaleTimeString(locale, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }, [message.timestamp, locale]);

  return (
    <div className={`admin-chat-message admin-chat-message-${message.role}`}>
      <div className="admin-chat-message-content">
        {message.file && (
          <div className="admin-chat-file-attachment">
            <FontAwesomeIcon icon={faPaperclip} />
            <span>{message.file.name}</span>
            <span className="admin-chat-file-size">
              ({(message.file.size / 1024).toFixed(1)} KB)
            </span>
          </div>
        )}
        {message.role === 'assistant' && formattedContent ? (
          <div className="admin-chat-formatted-content">
            {formattedContent.map((section, sectionIndex) => (
              <div key={sectionIndex} className={`admin-chat-section admin-chat-section-${section.type}`}>
                {section.type === 'title' && (
                  <h3 className="admin-chat-section-title">{section.content[0]}</h3>
                )}
                {section.type === 'table' && section.rows.length > 0 && (
                  <div className="admin-chat-table-wrapper">
                    <table className="admin-chat-table">
                      {section.rows.length > 1 ? (
                        <>
                          <thead>
                            <tr>
                              {section.rows[0].map((cell, cellIndex) => (
                                <th key={cellIndex}>{cell.replace(/\*\*/g, '')}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {section.rows.slice(1).map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                  <td key={cellIndex}>{cell.replace(/\*\*/g, '')}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </>
                      ) : (
                        <tbody>
                          {section.rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex}>{cell.replace(/\*\*/g, '')}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      )}
                    </table>
                  </div>
                )}
                {section.type === 'paragraph' && section.content.map((item, itemIndex) => {
                  if (typeof item === 'string') {
                    return (
                      <p key={itemIndex} className="admin-chat-section-text">
                        {item}
                      </p>
                    );
                  } else if (item.type === 'bullet') {
                    return (
                      <ul key={itemIndex} className="admin-chat-section-list admin-chat-section-bullet">
                        {item.items.map((listItem, listIndex) => (
                          <li key={listIndex}>{listItem}</li>
                        ))}
                      </ul>
                    );
                  } else if (item.type === 'numbered') {
                    return (
                      <ol key={itemIndex} className="admin-chat-section-list admin-chat-section-numbered">
                        {item.items.map((listItem, listIndex) => (
                          <li key={listIndex}>{listItem}</li>
                        ))}
                      </ol>
                    );
                  }
                  return null;
                })}
              </div>
            ))}
          </div>
        ) : (
          <p>{message.text}</p>
        )}
        <span className="admin-chat-timestamp">
          {formattedTimestamp}
        </span>
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

const AnalyticsDashboard = () => {
  const [range, setRange] = useState('month');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
  
  // Chat state
  const [chatMessages, setChatMessages] = useState(() => {
    // Load chat messages từ localStorage khi component mount
    try {
      const saved = localStorage.getItem('admin_chat_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Chuyển đổi timestamp từ string về Date object
        return parsed.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (e) {
      console.error('Lỗi khi tải tin nhắn:', e);
    }
    return [];
  });
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Chat history state - quản lý danh sách các cuộc trò chuyện
  const [chatHistory, setChatHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_chat_history_list');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Lỗi khi tải lịch sử chat:', e);
    }
    return [];
  });
  const [currentConversationId, setCurrentConversationId] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_chat_current_conversation_id');
      return saved || null;
    } catch (e) {
      return null;
    }
  });
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);
  
  // Load conversation history từ localStorage (cho Groq API)
  const loadConversationHistory = () => {
    try {
      const saved = localStorage.getItem('admin_chat_conversations');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Lỗi khi tải lịch sử hội thoại:', e);
    }
    return [];
  };
  const conversationsRef = useRef(loadConversationHistory());
  
  // Rate limiting state
  const cooldownUntilRef = useRef(0);
  const lastRequestTimeRef = useRef(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
      }),
    [locale]
  );

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(locale),
    [locale]
  );

  const formatCurrency = useCallback(
    (value) => currencyFormatter.format(Number(value) || 0),
    [currencyFormatter]
  );

  const formatNumber = useCallback(
    (value) => numberFormatter.format(Number(value) || 0),
    [numberFormatter]
  );

  const formatPercent = useCallback((value, options = { showSign: true, fractionDigits: 1 }) => {
    const number = Number(value) || 0;
    const formatted = `${Math.abs(number).toFixed(options.fractionDigits)}%`;
    if (!options.showSign) {
      return formatted;
    }
    if (number > 0) {
      return `+${formatted}`;
    }
    if (number < 0) {
      return `-${formatted}`;
    }
    return '0%';
  }, []);

  const loadData = async (selectedRange = range, { silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
    }
    setError('');
    const result = await analyticsApi.getDashboard(selectedRange);
    if (result.success) {
      setData(result.data);
    } else {
      const rawMessage = result.message || '';
      const normalized = rawMessage.toLowerCase();
      if (normalized.includes('token') || normalized.includes('unauthorized')) {
        setError(t('reports.errors.sessionExpired'));
      } else {
        setError(rawMessage || t('reports.errors.generic'));
      }
      setData(null);
    }
    if (!silent) {
      setLoading(false);
    }
  };

  // Lưu chat messages vào localStorage mỗi khi có thay đổi
  useEffect(() => {
    if (chatMessages.length > 0) {
      try {
        // Chuyển đổi Date objects thành strings để lưu
        const messagesToSave = chatMessages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp
        }));
        localStorage.setItem('admin_chat_messages', JSON.stringify(messagesToSave));
      } catch (e) {
        console.error('Lỗi khi lưu tin nhắn:', e);
      }
    } else {
      // Xóa nếu không còn messages
      localStorage.removeItem('admin_chat_messages');
    }
  }, [chatMessages]);

  // Lưu conversation history vào localStorage
  useEffect(() => {
    if (conversationsRef.current.length > 0) {
      try {
        localStorage.setItem('admin_chat_conversations', JSON.stringify(conversationsRef.current));
      } catch (e) {
        console.error('Lỗi khi lưu lịch sử hội thoại:', e);
      }
    } else {
      localStorage.removeItem('admin_chat_conversations');
    }
  }, [chatMessages]); // Update khi chatMessages thay đổi (vì conversation history cũng thay đổi)

  // Lưu chat messages vào localStorage mỗi khi có thay đổi
  useEffect(() => {
    if (chatMessages.length > 0) {
      try {
        // Chuyển đổi Date objects thành strings để lưu
        const messagesToSave = chatMessages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp
        }));
        localStorage.setItem('admin_chat_messages', JSON.stringify(messagesToSave));
      } catch (e) {
        console.error('Lỗi khi lưu tin nhắn:', e);
      }
    } else {
      // Xóa nếu không còn messages
      localStorage.removeItem('admin_chat_messages');
    }
  }, [chatMessages]);

  // Lưu conversation history vào localStorage khi có thay đổi
  useEffect(() => {
    if (conversationsRef.current.length > 0) {
      try {
        localStorage.setItem('admin_chat_conversations', JSON.stringify(conversationsRef.current));
      } catch (e) {
        console.error('Lỗi khi lưu lịch sử hội thoại:', e);
      }
    } else {
      localStorage.removeItem('admin_chat_conversations');
    }
  }, [chatMessages]); // Update khi chatMessages thay đổi (vì conversation history cũng thay đổi)

  useEffect(() => {
    loadData(range);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadData(range, { silent: true });
    }, 60000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const lastUpdatedText = useMemo(() => {
    if (!data?.lastUpdated) {
      return t('reports.header.loading');
    }
    try {
      return new Date(data.lastUpdated).toLocaleString(locale, {
        hour12: false
      });
    } catch (err) {
      return data.lastUpdated;
    }
  }, [data, locale, t]);

  const summaryCards = useMemo(() => {
    if (!data?.summaryCards) return [];
    return Object.entries(data.summaryCards).map(([key, value]) => ({ key, ...value }));
  }, [data]);

  const inventoryCharts = useMemo(() => {
    if (!data) return { lowStock: [], overstock: [] };
    const toChartData = (items = []) => items.map((item) => ({
      name: item.title,
      quantity: item.quantity
    }));
    return {
      lowStock: toChartData(data.inventory?.lowStock || []),
      overstock: toChartData(data.inventory?.overstock || [])
    };
  }, [data]);

  const heatmapHours = useMemo(() => {
    if (!data?.customerBehavior?.heatmap?.length) return [];
    const set = new Set();
    data.customerBehavior.heatmap.forEach((row) => {
      row.slots.forEach((slot) => set.add(slot.hour));
    });
    return Array.from(set).sort((a, b) => {
      const hourA = parseInt(a, 10);
      const hourB = parseInt(b, 10);
      return hourA - hourB;
    });
  }, [data]);

  const behaviorInsights = useMemo(() => {
    if (!data?.customerBehavior) {
      return null;
    }

    const sources = data.customerBehavior.trafficSources || [];
    const topSource = sources.reduce((best, current) => {
      if (!best || (current.percent || 0) > (best.percent || 0)) {
        return current;
      }
      return best;
    }, null);

    const secondSource = sources
      .filter((item) => topSource && item.source !== topSource.source)
      .sort((a, b) => (b.percent || 0) - (a.percent || 0))[0];

    const heatmap = data.customerBehavior.heatmap || [];
    let peakSlot = null;
    heatmap.forEach((row) => {
      row.slots.forEach((slot) => {
        if (!peakSlot || slot.sessions > peakSlot.sessions) {
          peakSlot = { ...slot, day: row.day };
        }
      });
    });

    const conversionRate = data.customerBehavior.conversion?.rate || 0;
    const conversionComment = data.customerBehavior.conversion?.comment || '';
    const conversionRateText = conversionRate
      ? t('reports.sections.behavior.details.conversionRate', {
          rate: formatPercent(conversionRate * 100, { showSign: false, fractionDigits: 1 })
        })
      : '';

    return {
      topSourceText: topSource
        ? t('reports.sections.behavior.details.topSource', { source: topSource.source, percent: topSource.percent })
        : t('reports.sections.behavior.details.topSourceEmpty'),
      compareSourceText: topSource && secondSource
        ? t('reports.sections.behavior.details.compareSource', {
            topSource: topSource.source,
            ratio: ((topSource.percent || 0) / Math.max(secondSource.percent || 1, 1)).toFixed(1),
            secondSource: secondSource.source
          })
        : null,
      peakSlotText: peakSlot && peakSlot.sessions > 0
        ? t('reports.sections.behavior.details.peakSlot', {
            day: peakSlot.day,
            hour: peakSlot.hour,
            sessions: formatNumber(peakSlot.sessions)
          })
        : t('reports.sections.behavior.details.peakSlotEmpty'),
      conversionText: conversionRateText
        ? `${conversionRateText} ${conversionComment}`.trim()
        : (conversionComment || t('reports.sections.behavior.conversion.empty'))
    };
  }, [data, formatNumber, formatPercent, t]);

  const reviewDetail = useMemo(() => {
    const insights = data?.reviews?.insights || [];
    const actions = data?.reviews?.actions || [];
    if (!insights.length && !actions.length) {
      return null;
    }
    return { insights, actions };
  }, [data]);

  const handleRefresh = () => {
    loadData(range);
  };

  const handleRangeChange = (event) => {
    setRange(event.target.value);
  };

  // ============================================
  // CẤU HÌNH GROQ API
  // ============================================
  // Sử dụng Groq API với model openai/gpt-oss-20b
  // API được import từ service: groqApi.js

  // Tạo system instruction với dữ liệu analytics và sách
  const createSystemInstruction = useCallback(() => {
    let analyticsInfo = '';
    if (data) {
      analyticsInfo = `
DỮ LIỆU ANALYTICS HIỆN TẠI:
- Doanh thu: ${formatCurrency(data.summaryCards?.revenue?.value || 0)}
- Đơn hàng: ${formatNumber(data.summaryCards?.orders?.value || 0)}
- Tồn kho thấp: ${data.inventory?.lowStock?.length || 0} sản phẩm
- Tồn kho cao: ${data.inventory?.overstock?.length || 0} sản phẩm
- Đánh giá: ${formatNumber(data.reviews?.distribution?.reduce((sum, r) => sum + (r.count || 0), 0) || 0)} lượt
- Tỷ lệ chuyển đổi: ${formatPercent((data.customerBehavior?.conversion?.rate || 0) * 100, { showSign: false, fractionDigits: 1 })}
`;
    }

    return `Bạn là trợ lý AI của Smart Book Store Admin Dashboard. Hãy trả lời các câu hỏi của admin về dữ liệu analytics và quản lý cửa hàng.

${analyticsInfo}

HƯỚNG DẪN TRẢ LỜI:
- Trả lời một cách chuyên nghiệp, chính xác và hữu ích bằng tiếng Việt
- Phân tích dữ liệu analytics và đưa ra insights
- Đề xuất các hành động cải thiện dựa trên dữ liệu
- Trả lời về doanh thu, đơn hàng, tồn kho, đánh giá, hành vi khách hàng
- Khi tổng hợp dữ liệu hoặc so sánh, HÃY SỬ DỤNG BẢNG MARKDOWN để dễ đọc:
  * Format: | Cột 1 | Cột 2 | Cột 3 |
           |-------|-------|-------|
           | Dữ liệu 1 | Dữ liệu 2 | Dữ liệu 3 |
- Luôn giữ thái độ chuyên nghiệp và hỗ trợ admin ra quyết định`;
  }, [data, formatCurrency, formatNumber, formatPercent]);

  // Escape HTML để tránh XSS
  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  // ============================================
  // HÀM PARSE BẢNG MARKDOWN
  // ============================================
  const parseMarkdownTable = useCallback((lines, startIndex) => {
    const table = { type: 'table', rows: [] };
    let i = startIndex;
    
    // Parse header row (dòng đầu tiên)
    if (i < lines.length) {
      const headerLine = lines[i].trim();
      if (headerLine.startsWith('|') && headerLine.endsWith('|')) {
        const cells = headerLine.split('|')
          .map(cell => cell.trim())
          .filter(cell => cell.length > 0);
        if (cells.length > 0) {
          table.rows.push(cells);
        }
        i++;
      }
    }
    
    // Bỏ qua dòng separator (|-------|-------|)
    if (i < lines.length && lines[i].trim().match(/^\|[\s\-:]+\|/)) {
      i++;
    }
    
    // Parse các dòng data
    while (i < lines.length) {
      const line = lines[i].trim();
      
      // Dừng nếu gặp dòng không phải bảng
      if (!line.startsWith('|') || !line.endsWith('|')) {
        break;
      }
      
      // Bỏ qua separator line
      if (line.match(/^\|[\s\-:]+\|$/)) {
        i++;
        continue;
      }
      
      // Parse row
      const cells = line.split('|')
        .map(cell => cell.trim())
        .filter(cell => cell.length > 0);
      
      if (cells.length > 0) {
        table.rows.push(cells);
      }
      
      i++;
    }
    
    return { table, nextIndex: i };
  }, []);

  // ============================================
  // HÀM FORMAT TIN NHẮN AI THÀNH CÁC SECTIONS
  // ============================================
  // Hàm này phân tích text từ AI và chia thành các phần có phân cách rõ ràng
  const formatAIMessage = useCallback((text) => {
    if (!text) return [];

    // Chia text thành các phần dựa trên các pattern
    const sections = [];
    const lines = text.split('\n');
    let currentSection = { type: 'paragraph', content: [] };
    let currentList = null;
    let emptyLineCount = 0;
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Kiểm tra bảng markdown (dòng có | và chứa dữ liệu)
      if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|') && trimmedLine.split('|').length > 2) {
        // Lưu section hiện tại nếu có
        if (currentSection.content.length > 0 || currentList) {
          if (currentList) {
            currentSection.content.push(currentList);
            currentList = null;
          }
          if (currentSection.content.length > 0) {
            sections.push(currentSection);
          }
        }
        
        // Parse bảng
        const { table, nextIndex } = parseMarkdownTable(lines, i);
        if (table.rows.length > 0) {
          sections.push(table);
        }
        
        i = nextIndex;
        currentSection = { type: 'paragraph', content: [] };
        emptyLineCount = 0;
        continue;
      }
      
      // Kiểm tra tiêu đề (bắt đầu bằng ** hoặc chứa dấu ** ở đầu/cuối, hoặc dòng kết thúc bằng :)
      const isTitle = trimmedLine.match(/^\*\*.*\*\*$/) || 
                     (trimmedLine.match(/^[A-ZÀ-ỸẠ-Ỹ][^:]*:$/) && trimmedLine.length < 100) ||
                     (trimmedLine.match(/^[A-ZÀ-ỸẠ-Ỹ]/) && trimmedLine.length < 80 && !trimmedLine.includes('.') && !trimmedLine.includes(','));

      if (isTitle) {
        // Lưu section hiện tại nếu có
        if (currentSection.content.length > 0 || currentList) {
          if (currentList) {
            currentSection.content.push(currentList);
            currentList = null;
          }
          sections.push(currentSection);
        }
        
        // Tạo section mới cho tiêu đề
        const titleText = trimmedLine.replace(/\*\*/g, '').replace(/:$/, '').trim();
        sections.push({
          type: 'title',
          content: [titleText]
        });
        currentSection = { type: 'paragraph', content: [] };
        emptyLineCount = 0;
      }
      // Kiểm tra danh sách có số (1., 2., etc.)
      else if (trimmedLine.match(/^\d+\.\s+/)) {
        if (currentList && currentList.type !== 'numbered') {
          currentSection.content.push(currentList);
          currentList = null;
        }
        if (!currentList) {
          currentList = { type: 'numbered', items: [] };
        }
        const itemText = trimmedLine.replace(/^\d+\.\s+/, '').trim();
        currentList.items.push(itemText);
        emptyLineCount = 0;
      }
      // Kiểm tra danh sách bullet (-, •, *)
      else if (trimmedLine.match(/^[-•*]\s+/)) {
        if (currentList && currentList.type !== 'bullet') {
          currentSection.content.push(currentList);
          currentList = null;
        }
        if (!currentList) {
          currentList = { type: 'bullet', items: [] };
        }
        const itemText = trimmedLine.replace(/^[-•*]\s+/, '').trim();
        currentList.items.push(itemText);
        emptyLineCount = 0;
      }
      // Dòng trống - tăng counter
      else if (trimmedLine === '') {
        emptyLineCount++;
        // Nếu có 2 dòng trống liên tiếp, kết thúc section
        if (emptyLineCount >= 2) {
          if (currentList) {
            currentSection.content.push(currentList);
            currentList = null;
          }
          if (currentSection.content.length > 0) {
            sections.push(currentSection);
            currentSection = { type: 'paragraph', content: [] };
          }
          emptyLineCount = 0;
        }
      }
      // Nội dung thường
      else {
        emptyLineCount = 0;
        if (currentList) {
          currentSection.content.push(currentList);
          currentList = null;
        }
        if (trimmedLine.length > 0) {
          currentSection.content.push(trimmedLine);
        }
      }
      
      i++;
    }

    // Thêm section cuối cùng
    if (currentList) {
      currentSection.content.push(currentList);
    }
    if (currentSection.content.length > 0) {
      sections.push(currentSection);
    }

    // Nếu không có section nào, trả về toàn bộ text như một paragraph
    if (sections.length === 0) {
      return [{ type: 'paragraph', content: [text.trim()] }];
    }

    return sections;
  }, [parseMarkdownTable]);

  // Hàm delay để đợi
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Gửi tin nhắn - Memo hóa để tránh re-render
  const handleSendMessage = useCallback(async () => {
    if (!chatInput.trim() && !attachedFile) return;

    // Kiểm tra cooldown
    const now = Date.now();
    if (now < cooldownUntilRef.current) {
      const remainingSeconds = Math.ceil((cooldownUntilRef.current - now) / 1000);
      setCooldownRemaining(remainingSeconds);
      const errorMessage = {
        id: Date.now(),
        role: 'assistant',
        text: `API đang bị giới hạn tốc độ. Vui lòng đợi ${remainingSeconds} giây trước khi gửi tin nhắn tiếp theo.`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
      return;
    }

    // Kiểm tra khoảng cách giữa các request (tối thiểu 1 giây)
    const timeSinceLastRequest = now - lastRequestTimeRef.current;
    if (timeSinceLastRequest < 1000) {
      const waitTime = 1000 - timeSinceLastRequest;
      await delay(waitTime);
    }

    const userMessage = chatInput.trim();
    const newMessage = {
      id: Date.now(),
      role: 'user',
      text: userMessage,
      file: attachedFile ? {
        name: attachedFile.name,
        type: attachedFile.type,
        size: attachedFile.size
      } : null,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');
    setAttachedFile(null);
    setChatLoading(true);
    lastRequestTimeRef.current = Date.now();

    // ============================================
    // CẬP NHẬT LỊCH SỬ HỘI THOẠI (Groq format)
    // ============================================
    // Thêm tin nhắn user vào lịch sử hội thoại (format Groq: role + content)
    const conversationEntry = {
      role: "user",
      content: userMessage
    };
    conversationsRef.current.push(conversationEntry);
    
    // Giới hạn conversation history để tránh request quá lớn (giữ 20 tin nhắn gần nhất)
    // Mỗi tin nhắn bao gồm cả user và assistant, nên 20 tin nhắn = 10 lượt hỏi-đáp
    if (conversationsRef.current.length > 20) {
      conversationsRef.current = conversationsRef.current.slice(-20);
    }

    try {
      // ============================================
      // GỬI REQUEST ĐẾN GROQ API
      // ============================================
      const systemInstruction = createSystemInstruction();
      
      // Gửi tin nhắn đến Groq API
      // sendGroqMessage sẽ tự động xử lý format messages array
      const response = await sendGroqMessage(
        userMessage,
        conversationsRef.current.slice(0, -1), // Gửi history trước tin nhắn hiện tại
        systemInstruction,
        {
          temperature: 1,
          maxTokens: 8192,
          topP: 1,
          reasoningEffort: "medium"
        }
      );

      // ============================================
      // XỬ LÝ PHẢN HỒI TỪ API
      // ============================================
      if (response.success && response.message) {
        const aiResponse = response.message;
        
        // Tạo object tin nhắn AI để hiển thị
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          text: aiResponse,
          timestamp: new Date()
        };

        // Thêm tin nhắn AI vào danh sách tin nhắn hiển thị
        setChatMessages(prev => [...prev, aiMessage]);
        
        // Thêm phản hồi AI vào lịch sử hội thoại (format Groq)
        conversationsRef.current.push({
          role: "assistant",
          content: aiResponse
        });
        
        // Reset cooldown khi thành công
        cooldownUntilRef.current = 0;
        setCooldownRemaining(0);
      } else {
        // Nếu không thành công, throw error với thông tin từ response
        const error = new Error(response.error || "No response from AI");
        if (response.status === 429) {
          error.status = 429;
          error.retryAfter = response.retryAfter || 10;
        }
        throw error;
      }
    } catch (error) {
      // ============================================
      // XỬ LÝ LỖI
      // ============================================
      console.error("Lỗi chat:", error);
      
      // Tạo thông báo lỗi chi tiết dựa trên loại lỗi
      let errorText = "Xin lỗi, tôi không thể trả lời ngay bây giờ. Vui lòng thử lại sau.";
      let retryAfter = null;
      
      if (error.message) {
        if (error.message.includes('Rate limit') || error.status === 429) {
          // Lỗi rate limit: API đang bị giới hạn số lượng request
          retryAfter = error.retryAfter || 10;
          errorText = `API đang bị giới hạn tốc độ. Vui lòng đợi ${retryAfter} giây trước khi thử lại.`;
          
          // Cập nhật cooldown
          cooldownUntilRef.current = Date.now() + (retryAfter * 1000);
          setCooldownRemaining(retryAfter);
        } else if (error.message.includes('401') || error.message.includes('403') || error.message.includes('API key')) {
          // HTTP 401/403 hoặc lỗi API key: Lỗi xác thực (API key không hợp lệ hoặc không có quyền)
          if (error.message.includes('chưa được cấu hình') || error.message.includes('MISSING_API_KEY')) {
            errorText = "API key chưa được cấu hình. Vui lòng tạo file frontend/.env với VITE_GROQ_API_KEY=your_key";
          } else {
            errorText = "Lỗi xác thực API. Vui lòng kiểm tra cấu hình API key trong file frontend/.env";
          }
        } else if (error.message.includes('500')) {
          // HTTP 500: Lỗi server
          errorText = "Lỗi server. Vui lòng thử lại sau.";
        } else {
          // Các lỗi khác
          errorText = error.message || errorText;
        }
      }
      
      // Hiển thị thông báo lỗi cho user
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        text: errorText,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
    }
  }, [chatInput, attachedFile, createSystemInstruction]);

  // Xử lý file đính kèm
  const handleFileAttach = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB.');
        return;
      }
      setAttachedFile(file);
    }
  };

  // Xóa file đính kèm
  const handleRemoveFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Cuộn xuống tin nhắn mới nhất - Chỉ scroll khi có tin nhắn mới
  useEffect(() => {
    if (chatMessages.length === 0) return;
    
    const lastMessage = chatMessages[chatMessages.length - 1];
    // Chỉ scroll nếu có tin nhắn mới (không phải re-render do state khác)
    if (lastMessage && lastMessage.id !== lastMessageIdRef.current) {
      lastMessageIdRef.current = lastMessage.id;
      
      if (chatContainerRef.current) {
        // Sử dụng double RAF để đảm bảo DOM đã render xong
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (chatContainerRef.current) {
              chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
          });
        });
      }
    }
  }, [chatMessages]);

  // Update cooldown countdown - Tối ưu chỉ update khi cần
  useEffect(() => {
    if (cooldownUntilRef.current === 0) {
      if (cooldownRemaining > 0) {
        setCooldownRemaining(0);
      }
      return;
    }

    // Chỉ update mỗi giây, không cần check liên tục
    const interval = setInterval(() => {
      const now = Date.now();
      if (now >= cooldownUntilRef.current) {
        setCooldownRemaining(0);
        cooldownUntilRef.current = 0;
        clearInterval(interval);
      } else {
        const remaining = Math.ceil((cooldownUntilRef.current - now) / 1000);
        // Chỉ update state nếu giá trị thay đổi để tránh re-render không cần thiết
        if (remaining !== cooldownRemaining && remaining > 0) {
          setCooldownRemaining(remaining);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldownRemaining]);

  // Xử lý input change - Tối ưu với useCallback
  const handleInputChange = useCallback((e) => {
    setChatInput(e.target.value);
  }, []);

  // Xử lý Enter để gửi - Memo hóa để tránh re-render
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Lưu cuộc trò chuyện hiện tại vào danh sách lịch sử
  const saveCurrentConversation = useCallback(() => {
    if (chatMessages.length === 0) return;
    
    const firstUserMessage = chatMessages.find(msg => msg.role === 'user');
    const title = firstUserMessage 
      ? (firstUserMessage.text.length > 50 ? firstUserMessage.text.substring(0, 50) + '...' : firstUserMessage.text)
      : `Cuộc trò chuyện ${new Date().toLocaleString('vi-VN')}`;
    
    const conversation = {
      id: currentConversationId || `conv_${Date.now()}`,
      title,
      messages: chatMessages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp
      })),
      conversations: conversationsRef.current,
      createdAt: currentConversationId && chatHistory.find(c => c.id === currentConversationId)?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setChatHistory(prev => {
      const filtered = prev.filter(c => c.id !== conversation.id);
      const updated = [conversation, ...filtered].slice(0, 50); // Giữ tối đa 50 cuộc trò chuyện
      localStorage.setItem('admin_chat_history_list', JSON.stringify(updated));
      return updated;
    });
    
    if (!currentConversationId) {
      setCurrentConversationId(conversation.id);
      localStorage.setItem('admin_chat_current_conversation_id', conversation.id);
    }
  }, [chatMessages, currentConversationId, chatHistory]);

  // Load một cuộc trò chuyện cũ
  const loadConversation = useCallback((conversationId) => {
    const conversation = chatHistory.find(c => c.id === conversationId);
    if (!conversation) return;
    
    // Lưu cuộc trò chuyện hiện tại trước khi chuyển
    if (chatMessages.length > 0) {
      saveCurrentConversation();
    }
    
    // Load cuộc trò chuyện được chọn
    const loadedMessages = conversation.messages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
    
    setChatMessages(loadedMessages);
    setCurrentConversationId(conversationId);
    conversationsRef.current = conversation.conversations || [];
    
    localStorage.setItem('admin_chat_messages', JSON.stringify(conversation.messages));
    localStorage.setItem('admin_chat_conversations', JSON.stringify(conversation.conversations || []));
    localStorage.setItem('admin_chat_current_conversation_id', conversationId);
    
    // Scroll về cuối
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
    
    setShowHistorySidebar(false);
  }, [chatHistory, chatMessages, saveCurrentConversation]);

  // Tạo cuộc trò chuyện mới
  const createNewConversation = useCallback(() => {
    // Lưu cuộc trò chuyện hiện tại trước khi tạo mới
    if (chatMessages.length > 0) {
      saveCurrentConversation();
    }
    
    setChatMessages([]);
    setChatInput('');
    setAttachedFile(null);
    setCurrentConversationId(null);
    conversationsRef.current = [];
    
    localStorage.removeItem('admin_chat_messages');
    localStorage.removeItem('admin_chat_conversations');
    localStorage.removeItem('admin_chat_current_conversation_id');
    
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
    
    setShowHistorySidebar(false);
  }, [chatMessages, saveCurrentConversation]);

  // Xóa một cuộc trò chuyện
  const deleteConversation = useCallback((conversationId, e) => {
    e.stopPropagation();
    if (!window.confirm('Bạn có chắc chắn muốn xóa cuộc trò chuyện này?')) return;
    
    setChatHistory(prev => {
      const updated = prev.filter(c => c.id !== conversationId);
      localStorage.setItem('admin_chat_history_list', JSON.stringify(updated));
      
      // Nếu đang xóa cuộc trò chuyện hiện tại, tạo mới
      if (conversationId === currentConversationId) {
        createNewConversation();
      }
      
      return updated;
    });
  }, [currentConversationId, createNewConversation]);

  // Tự động lưu khi có tin nhắn mới
  useEffect(() => {
    if (chatMessages.length > 0) {
      const timer = setTimeout(() => {
        saveCurrentConversation();
      }, 1000); // Debounce 1 giây
      return () => clearTimeout(timer);
    }
  }, [chatMessages, saveCurrentConversation]);

  // Xử lý reset chat - Xóa toàn bộ lịch sử chat
  const handleResetChat = useCallback(() => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử chat? Hành động này không thể hoàn tác.')) {
      // Xóa state
      setChatMessages([]);
      setChatInput('');
      setAttachedFile(null);
      setCurrentConversationId(null);
      
      // Xóa localStorage
      localStorage.removeItem('admin_chat_messages');
      localStorage.removeItem('admin_chat_conversations');
      localStorage.removeItem('admin_chat_current_conversation_id');
      
      // Reset conversation history
      conversationsRef.current = [];
      
      // Reset cooldown
      cooldownUntilRef.current = 0;
      lastRequestTimeRef.current = 0;
      setCooldownRemaining(0);
      
      // Scroll về đầu
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = 0;
      }
      
      console.log('[AnalyticsDashboard] Chat đã được reset');
    }
  }, []);

  // Track tin nhắn cuối cùng để chỉ scroll khi có tin nhắn mới
  const lastMessageIdRef = useRef(null);

  return (
    <div className="ai-analytics-wrapper">
      <header className="ai-analytics-header">
        <div className="ai-analytics-title">
          <h1>{t('reports.header.title')}</h1>
          <p>{t('reports.header.lastUpdated', { time: lastUpdatedText })}</p>
        </div>
        <div className="ai-analytics-actions">
          <select value={range} onChange={handleRangeChange} className="ai-analytics-range" aria-label={t('reports.filters.range.label')}>
            <option value="month">{t('reports.filters.range.month')}</option>
            <option value="quarter">{t('reports.filters.range.quarter')}</option>
            <option value="year">{t('reports.filters.range.year')}</option>
          </select>
          <button type="button" className="ai-analytics-button" onClick={handleRefresh} disabled={loading}>
            <FontAwesomeIcon icon={faSyncAlt} />
            <span>{t('reports.actions.refresh')}</span>
          </button>
          <button type="button" className="ai-analytics-button ai-analytics-secondary" disabled>
            <FontAwesomeIcon icon={faSlidersH} />
            <span>{t('reports.actions.customizeSoon')}</span>
          </button>
        </div>
      </header>

      {error && (
        <div className="ai-analytics-error">
          <p>{error}</p>
        </div>
      )}

      <section className="ai-analytics-cards">
        {summaryCards.map((card) => (
          <div key={card.key} className="ai-analytics-card">
            <div className="ai-analytics-card-icon">
              <FontAwesomeIcon icon={cardIconMap[card.key] || faChartLine} />
            </div>
            <div className="ai-analytics-card-body">
              <h3>{card.label}</h3>
              <div className="ai-analytics-card-metric">
                <span className="ai-analytics-card-value">
                  {card.key === 'revenue' ? formatCurrency(card.value) : formatNumber(card.value)}
                </span>
                {'changePercent' in card && (
                  <span className={`ai-analytics-card-trend ${card.changePercent >= 0 ? 'up' : 'down'}`}>
                    {formatPercent(card.changePercent)}
                  </span>
                )}
              </div>
              {card.highlight && <p className="ai-analytics-card-highlight">{card.highlight}</p>}
              {card.insight && <p className="ai-analytics-card-insight">{card.insight}</p>}
              {card.highlightItems && card.highlightItems.length > 0 && (
                <ul className="ai-analytics-card-list">
                  {card.highlightItems.map((item) => (
                    <li key={item.book_id}>{t('reports.cards.lowStockItem', { title: item.title, quantity: formatNumber(item.quantity) })}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="ai-analytics-section">
        <header>
          <div>
            <h2><FontAwesomeIcon icon={faChartLine} /> {t('reports.sections.sales.title')}</h2>
            <p>{t('reports.sections.sales.subtitle')}</p>
          </div>
        </header>
        <div className="ai-analytics-chart">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data?.sales?.trend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="label" stroke="#64748B" />
              <YAxis yAxisId="left" stroke="#6366F1" tickFormatter={(v) => `${Math.round(v / 1_000_000)} ${t('reports.charts.sales.millionSuffix')}`} />
              <YAxis yAxisId="right" orientation="right" stroke="#14B8A6" />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'revenue') return [formatCurrency(value), t('reports.charts.sales.tooltip.revenue')];
                  return [formatNumber(value), t('reports.charts.sales.tooltip.orders')];
                }}
              />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={3} dot={false} name={t('reports.charts.sales.series.revenue')} />
              <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#14B8A6" strokeWidth={2} name={t('reports.charts.sales.series.orders')} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <footer className="ai-analytics-section-summary">
          <p>{data?.sales?.summary || t('reports.sections.sales.empty')}</p>
        </footer>
      </section>

      <section className="ai-analytics-section">
        <header>
          <div>
            <h2><FontAwesomeIcon icon={faWarehouse} /> {t('reports.sections.inventory.title')}</h2>
            <p>{t('reports.sections.inventory.subtitle')}</p>
          </div>
        </header>
        <div className="ai-analytics-grid ai-analytics-grid-2">
          <div className="ai-analytics-panel">
            <h3>{t('reports.sections.inventory.lowStock.title')}</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={inventoryCharts.lowStock}
                margin={{ top: 12, right: 12, left: 0, bottom: 32 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 11, fill: '#475569' }}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#475569' }} />
                <Tooltip formatter={(value) => `${formatNumber(value)} ${t('reports.sections.inventory.tooltip.unit')}`} />
                <Bar dataKey="quantity" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            {!inventoryCharts.lowStock.length && <p className="ai-analytics-empty">{t('reports.sections.inventory.lowStock.empty')}</p>}
          </div>
          <div className="ai-analytics-panel">
            <h3>{t('reports.sections.inventory.overstock.title')}</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={inventoryCharts.overstock}
                margin={{ top: 12, right: 12, left: 0, bottom: 32 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 11, fill: '#475569' }}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#475569' }} />
                <Tooltip formatter={(value) => `${formatNumber(value)} ${t('reports.sections.inventory.tooltip.unit')}`} />
                <Bar dataKey="quantity" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            {!inventoryCharts.overstock.length && <p className="ai-analytics-empty">{t('reports.sections.inventory.overstock.empty')}</p>}
          </div>
        </div>
        <footer className="ai-analytics-section-summary">
          <p>{data?.inventory?.summary || t('reports.sections.inventory.empty')}</p>
        </footer>
      </section>

      <section className="ai-analytics-section">
        <header>
          <div>
            <h2><FontAwesomeIcon icon={faStar} /> {t('reports.sections.reviews.title')}</h2>
            <p>{t('reports.sections.reviews.subtitle')}</p>
          </div>
        </header>
        <div className="ai-analytics-grid ai-analytics-grid-2">
          <div className="ai-analytics-panel">
            <h3>{t('reports.sections.reviews.distribution.title')}</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data?.reviews?.distribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip formatter={(value, name) => {
                  if (name === 'percent') return [`${value}%`, t('reports.sections.reviews.distribution.tooltip.percent')];
                  return [formatNumber(value), t('reports.sections.reviews.distribution.tooltip.count')];
                }} />
                <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="ai-analytics-panel">
            <h3>{t('reports.sections.reviews.highlights.title')}</h3>
            {data?.reviews?.negativeHighlights?.length ? (
              <ul className="ai-analytics-list">
                {data.reviews.negativeHighlights.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}</strong>
                    <span>{item.avgRating}★ · {(item.review_count ?? item.reviewCount ?? 0)} {t('reports.sections.reviews.highlights.countLabel')}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="ai-analytics-empty">{t('reports.sections.reviews.highlights.empty')}</p>
            )}
          </div>
        </div>
        {reviewDetail && (
          <div className="ai-analytics-detail">
            {reviewDetail.insights.length > 0 && (
              <div className="ai-analytics-detail-block">
                <h3>{t('reports.sections.reviews.details.insightsTitle')}</h3>
                <ul>
                  {reviewDetail.insights.map((line, index) => (
                    <li key={`review-insight-${index}`}>{line}</li>
                  ))}
                </ul>
              </div>
            )}
            {reviewDetail.actions.length > 0 && (
              <div className="ai-analytics-detail-block">
                <h3>{t('reports.sections.reviews.details.actionsTitle')}</h3>
                <ol>
                  {reviewDetail.actions.map((line, index) => (
                    <li key={`review-action-${index}`}>{line}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
        <footer className="ai-analytics-section-summary">
          <p>{data?.reviews?.summary || t('reports.sections.reviews.empty')}</p>
        </footer>
      </section>

      <section className="ai-analytics-section">
        <header>
          <div>
            <h2><FontAwesomeIcon icon={faUsers} /> {t('reports.sections.behavior.title')}</h2>
            <p>{t('reports.sections.behavior.subtitle')}</p>
          </div>
        </header>
        <div className="ai-analytics-grid ai-analytics-grid-3">
          <div className="ai-analytics-panel">
            <h3>{t('reports.sections.behavior.sources.title')}</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  dataKey="percent"
                  data={data?.customerBehavior?.trafficSources || []}
                  nameKey="source"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  label={({ percent }) => `${percent}%`}
                >
                  {(data?.customerBehavior?.trafficSources || []).map((entry, index) => (
                    <Cell key={`cell-${entry.source}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="ai-analytics-list inline">
              {(data?.customerBehavior?.trafficSources || []).map((item, index) => (
                <li key={item.source}>
                  <span className="legend" style={{ backgroundColor: pieColors[index % pieColors.length] }}></span>
                  {item.source}: {item.percent}%
                </li>
              ))}
            </ul>
          </div>
          <div className="ai-analytics-panel">
            <h3>{t('reports.sections.behavior.heatmap.title')}</h3>
            <div className="ai-analytics-heatmap">
              <div className="ai-analytics-heatmap-header">
                <span></span>
                {heatmapHours.map((hour) => (
                  <span key={hour}>{hour}</span>
                ))}
              </div>
              {(data?.customerBehavior?.heatmap || []).map((row) => (
                <div className="ai-analytics-heatmap-row" key={row.day}>
                  <span className="label">{row.day}</span>
                  {heatmapHours.map((hour) => {
                    const session = row.slots.find((slot) => slot.hour === hour);
                    const value = session ? session.sessions : 0;
                    const intensity = Math.min(1, value / 50);
                    return (
                      <span
                        key={`${row.day}-${hour}`}
                        className="cell"
                        style={{ backgroundColor: `rgba(99, 102, 241, ${0.15 + intensity * 0.65})` }}
                        title={t('reports.sections.behavior.heatmap.tooltip', { day: row.day, hour, sessions: formatNumber(value) })}
                      >
                        {value}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="ai-analytics-panel">
            <h3>{t('reports.sections.behavior.conversion.title')}</h3>
            <div className="ai-analytics-conversion">
              <div className="ai-analytics-conversion-value">
                <span>{formatPercent((data?.customerBehavior?.conversion?.rate || 0) * 100, { showSign: false, fractionDigits: 1 })}</span>
                <small>{t('reports.sections.behavior.conversion.label')}</small>
              </div>
              <p>{data?.customerBehavior?.conversion?.comment || t('reports.sections.behavior.conversion.empty')}</p>
            </div>
          </div>
        </div>
        {behaviorInsights && (
          <div className="ai-analytics-behavior-detail">
            <h3>{t('reports.sections.behavior.details.title')}</h3>
            <ul>
              <li>{behaviorInsights.topSourceText}</li>
              {behaviorInsights.compareSourceText && <li>{behaviorInsights.compareSourceText}</li>}
              <li>{behaviorInsights.peakSlotText}</li>
              <li>{behaviorInsights.conversionText}</li>
            </ul>
          </div>
        )}
      </section>

      {/* Chat Section */}
      <section className="ai-analytics-section ai-analytics-chat-section">
        <header>
          <div>
            <h2><FontAwesomeIcon icon={faUsers} /> AI Assistant</h2>
            <p>Hỏi về dữ liệu analytics, doanh thu, tồn kho, đánh giá và hành vi khách hàng</p>
          </div>
          <div className="admin-chat-header-actions">
            <button
              type="button"
              className="admin-chat-history-btn"
              onClick={() => setShowHistorySidebar(!showHistorySidebar)}
              title="Xem lịch sử chat"
              aria-label="Toggle chat history"
            >
              <FontAwesomeIcon icon={faHistory} />
              <span>Lịch sử</span>
            </button>
            {chatMessages.length > 0 && (
              <button
                type="button"
                className="admin-chat-reset-btn"
                onClick={handleResetChat}
                title="Xóa toàn bộ lịch sử chat"
                aria-label="Reset chat"
              >
                <FontAwesomeIcon icon={faTrashAlt} />
                <span>Reset Chat</span>
              </button>
            )}
          </div>
        </header>
        <div className={`admin-chat-wrapper ${showHistorySidebar ? 'with-sidebar' : ''}`}>
          {/* History Sidebar */}
          {showHistorySidebar && (
            <div className="admin-chat-history-sidebar">
              <div className="admin-chat-history-header">
                <h3>
                  <FontAwesomeIcon icon={faHistory} />
                  Lịch sử chat
                </h3>
                <button
                  type="button"
                  className="admin-chat-history-close"
                  onClick={() => setShowHistorySidebar(false)}
                  aria-label="Đóng sidebar"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <button
                type="button"
                className="admin-chat-new-conversation-btn"
                onClick={createNewConversation}
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>Cuộc trò chuyện mới</span>
              </button>
              <div className="admin-chat-history-list">
                {chatHistory.length === 0 ? (
                  <div className="admin-chat-history-empty">
                    <p>Chưa có lịch sử chat</p>
                    <p className="admin-chat-history-empty-hint">Bắt đầu cuộc trò chuyện để lưu vào lịch sử</p>
                  </div>
                ) : (
                  chatHistory.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`admin-chat-history-item ${currentConversationId === conversation.id ? 'active' : ''}`}
                      onClick={() => loadConversation(conversation.id)}
                    >
                      <div className="admin-chat-history-item-content">
                        <h4>{conversation.title}</h4>
                        <p className="admin-chat-history-item-time">
                          {new Date(conversation.updatedAt).toLocaleString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="admin-chat-history-item-count">
                          {conversation.messages.length} tin nhắn
                        </p>
                      </div>
                      <button
                        type="button"
                        className="admin-chat-history-item-delete"
                        onClick={(e) => deleteConversation(conversation.id, e)}
                        title="Xóa cuộc trò chuyện"
                        aria-label="Delete conversation"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          <div className="admin-chat-container">
            <div className="admin-chat-messages" ref={chatContainerRef}>
            {chatMessages.length === 0 ? (
              <div className="admin-chat-welcome">
                <p>Xin chào! Tôi có thể giúp bạn phân tích dữ liệu analytics và trả lời các câu hỏi về cửa hàng.</p>
                <p>Hãy thử hỏi:</p>
                <ul>
                  <li>"Doanh thu tháng này như thế nào?"</li>
                  <li>"Sản phẩm nào đang tồn kho thấp?"</li>
                  <li>"Tỷ lệ chuyển đổi hiện tại là bao nhiêu?"</li>
                  <li>"Khách hàng đến từ nguồn nào nhiều nhất?"</li>
                </ul>
              </div>
            ) : (
              chatMessages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                  formatAIMessage={formatAIMessage}
                  locale={locale}
                />
              ))
            )}
            {chatLoading && (
              <div className="admin-chat-message admin-chat-message-assistant">
                <div className="admin-chat-message-content">
                  <div className="admin-chat-loading">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="admin-chat-input-area">
            {attachedFile && (
              <div className="admin-chat-file-preview">
                <FontAwesomeIcon icon={faPaperclip} />
                <span>{attachedFile.name}</span>
                <button 
                  type="button" 
                  className="admin-chat-file-remove"
                  onClick={handleRemoveFile}
                  aria-label="Xóa file"
                >
                  ×
                </button>
              </div>
            )}
            <div className="admin-chat-input-wrapper">
              <input
                ref={fileInputRef}
                type="file"
                id="admin-chat-file-input"
                accept="image/*,.pdf,.doc,.docx"
                style={{ display: 'none' }}
                onChange={handleFileAttach}
              />
              <label htmlFor="admin-chat-file-input" className="admin-chat-attach-btn" title="Đính kèm file">
                <FontAwesomeIcon icon={faPaperclip} />
              </label>
              <input
                type="text"
                className="admin-chat-text-input"
                placeholder={
                  cooldownRemaining > 0
                    ? `Đợi ${cooldownRemaining}s trước khi gửi...`
                    : "Nhập câu hỏi về doanh thu, kho, khách hàng..."
                }
                value={chatInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={chatLoading || cooldownRemaining > 0}
              />
              <button
                type="button"
                className="admin-chat-send-btn"
                onClick={handleSendMessage}
                disabled={chatLoading || (!chatInput.trim() && !attachedFile) || cooldownRemaining > 0}
                title={
                  cooldownRemaining > 0
                    ? `Vui lòng đợi ${cooldownRemaining} giây`
                    : "Gửi tin nhắn"
                }
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AnalyticsDashboard;

