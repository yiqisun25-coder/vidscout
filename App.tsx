import React, { useState } from 'react';
import { FORMATS, SYSTEM_PROMPTS } from './constants';
import { FormatId } from './types';
import { generateVideoScript } from './services/geminiService';

const App: React.FC = () => {
  const [active, setActive] = useState<FormatId>('cloud');
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const format = FORMATS.find((f) => f.id === active)!;
  const accentColor = format.color;

  const handleInput = (key: string, val: string) => {
    setInputs((prev) => ({ ...prev, [active + '_' + key]: val }));
  };

  const getVal = (key: string) => inputs[active + '_' + key] || '';

  const buildUserPrompt = () => {
    const vals = format.fields
      .map((f) => `${f.label}：${getVal(f.key) || '（未填写）'}`)
      .join('\n');
    return `请为以下本地商家生成一份完整可用的短视频脚本：\n\n${vals}`;
  };

  const generate = async () => {
    setLoading(true);
    setScript('');
    setError('');
    try {
      const result = await generateVideoScript(
        SYSTEM_PROMPTS[active],
        buildUserPrompt()
      );
      setScript(result);
    } catch (e: any) {
      setError(e.message || '请求出错，请重试');
    }
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0e0e10',
      color: '#e8e8e8',
      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        textarea, input { font-family: 'IBM Plex Mono', monospace !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.35s ease forwards; }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: '1px solid #1e1e22',
        padding: '18px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: '#0e0e10',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{
          width: 8, height: 8,
          borderRadius: '50%',
          background: accentColor,
          transition: 'background 0.3s',
          boxShadow: `0 0 8px ${accentColor}`,
        }} />
        <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.06em', color: '#999' }}>
          LOCAL_SCRIPT_GEN
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#444', letterSpacing: '0.1em' }}>
          v0.3 · 本地生活推广
        </span>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* Format Tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 32, flexWrap: 'wrap' }}>
          {FORMATS.map((f) => (
            <button
              key={f.id}
              onClick={() => { setActive(f.id); setScript(''); setError(''); }}
              style={{
                padding: '10px 18px',
                borderRadius: 6,
                border: active === f.id ? `1.5px solid ${f.color}` : '1.5px solid #222',
                background: active === f.id ? f.color + '18' : 'transparent',
                color: active === f.id ? f.color : '#666',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: "'IBM Plex Mono', monospace",
                transition: 'all 0.2s',
                letterSpacing: '0.02em',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Format Info */}
        <div className="fade-up" key={active} style={{
          borderLeft: `3px solid ${accentColor}`,
          paddingLeft: 16,
          marginBottom: 32,
        }}>
          <div style={{ fontSize: 11, color: accentColor, letterSpacing: '0.12em', marginBottom: 6 }}>
            {format.tag}
          </div>
          <div style={{ fontSize: 13, color: '#aaa', lineHeight: 1.7, fontFamily: "'IBM Plex Sans', sans-serif" }}>
            {format.desc}
          </div>
        </div>

        {/* Input Fields */}
        <div className="fade-up" key={active + '_fields'} style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
          {format.fields.map((field) => (
            <div key={field.key}>
              <label style={{
                display: 'block',
                fontSize: 11,
                color: '#666',
                letterSpacing: '0.1em',
                marginBottom: 8,
                textTransform: 'uppercase',
              }}>
                {field.label}
              </label>
              {field.multiline ? (
                <textarea
                  rows={3}
                  value={getVal(field.key)}
                  onChange={(e) => handleInput(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%',
                    background: '#141416',
                    border: '1px solid #222',
                    borderRadius: 6,
                    padding: '12px 14px',
                    color: '#e0e0e0',
                    fontSize: 13,
                    resize: 'vertical',
                    outline: 'none',
                    lineHeight: 1.6,
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = accentColor)}
                  onBlur={(e) => (e.target.style.borderColor = '#222')}
                />
              ) : (
                <input
                  type="text"
                  value={getVal(field.key)}
                  onChange={(e) => handleInput(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%',
                    background: '#141416',
                    border: '1px solid #222',
                    borderRadius: 6,
                    padding: '12px 14px',
                    color: '#e0e0e0',
                    fontSize: 13,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = accentColor)}
                  onBlur={(e) => (e.target.style.borderColor = '#222')}
                />
              )}
            </div>
          ))}
        </div>

        {/* Generate Button */}
        <button
          onClick={generate}
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            borderRadius: 8,
            border: 'none',
            background: loading ? '#1e1e22' : accentColor,
            color: loading ? '#555' : '#fff',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.1em',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: "'IBM Plex Mono', monospace",
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          {loading ? (
            <>
              <div style={{
                width: 14, height: 14,
                border: '2px solid #444',
                borderTopColor: accentColor,
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              GENERATING...
            </>
          ) : (
            '→ 生成脚本'
          )}
        </button>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: 16,
            padding: '12px 16px',
            background: '#1a0a0a',
            border: '1px solid #3a1010',
            borderRadius: 6,
            fontSize: 12,
            color: '#f87171',
            letterSpacing: '0.04em',
          }}>
            ✕ {error}
          </div>
        )}

        {/* Script Output */}
        {script && (
          <div className="fade-up" style={{ marginTop: 32 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
            }}>
              <span style={{ fontSize: 11, color: '#555', letterSpacing: '0.12em' }}>
                OUTPUT · {format.label}
              </span>
              <button
                onClick={copy}
                style={{
                  padding: '6px 14px',
                  borderRadius: 4,
                  border: '1px solid #2a2a2e',
                  background: 'transparent',
                  color: copied ? accentColor : '#666',
                  fontSize: 11,
                  cursor: 'pointer',
                  fontFamily: "'IBM Plex Mono', monospace",
                  letterSpacing: '0.08em',
                  transition: 'all 0.2s',
                }}
              >
                {copied ? '✓ COPIED' : 'COPY'}
              </button>
            </div>

            <div style={{
              background: '#111113',
              border: `1px solid ${accentColor}28`,
              borderRadius: 8,
              padding: '24px',
              fontSize: 13,
              lineHeight: 1.9,
              color: '#ccc',
              whiteSpace: 'pre-wrap',
              fontFamily: "'IBM Plex Mono', monospace",
              letterSpacing: '0.01em',
            }}>
              {script.split('\n').map((line, i) => {
                const isHeader = line.startsWith('【') || /^[一二三四五六七八九十\d]+[\.、]/.test(line);
                const isTime = line.includes('秒') && line.includes('|');
                return (
                  <div key={i} style={{
                    color: isHeader ? accentColor : isTime ? '#888' : '#ccc',
                    marginBottom: line === '' ? 10 : 0,
                    fontWeight: isHeader ? 500 : 400,
                  }}>
                    {line || ' '}
                  </div>
                );
              })}
            </div>

            <div style={{
              marginTop: 16,
              padding: '12px 16px',
              background: '#111113',
              borderRadius: 6,
              border: '1px solid #1e1e22',
              fontSize: 11,
              color: '#555',
              letterSpacing: '0.06em',
              lineHeight: 1.8,
            }}>
              TIP · 生成内容为结构模板，建议结合实际拍摄条件调整分镜时长 / 字幕措辞
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
