import React, { useMemo, useState } from 'react';
import translationApi from '../../../services/translationApi';
import './BookTranslation.css';
import { useLanguage } from '../../../contexts/LanguageContext';

const BookTranslation = () => {
  const [text, setText] = useState('');
  const [direction, setDirection] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const { dictionary } = useLanguage();
  const messages = dictionary.translationPage;

  const directionOptions = useMemo(
    () => [
      { value: 'auto', label: messages.directions.auto },
      { value: 'en_vi', label: messages.directions.en_vi },
      { value: 'vi_en', label: messages.directions.vi_en },
    ],
    [messages.directions],
  );

  const handleSwapDirection = () => {
    setDirection((prev) => {
      if (prev === 'en_vi') return 'vi_en';
      if (prev === 'vi_en') return 'en_vi';
      return 'en_vi';
    });
    setResult(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!text.trim()) {
      setError(messages.errors.empty);
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      console.log('[BookTranslation] Sending translation request:', {
        textLength: text.trim().length,
        direction,
      });

      const response = await translationApi.translate({
        text: text.trim(),
        direction,
      });

      console.log('[BookTranslation] Translation response:', response);

      if (!response?.success) {
        const errorMsg = response?.message || messages.errors.generic;
        console.error('[BookTranslation] Translation failed:', errorMsg);
        throw new Error(errorMsg);
      }

      if (!response?.data?.translation) {
        console.error('[BookTranslation] No translation in response:', response);
        throw new Error('Không nhận được kết quả dịch từ server.');
      }

      setResult(response.data);
      console.log('[BookTranslation]  Translation successful');
    } catch (err) {
      console.error('[BookTranslation] translate error:', err);
      const errorMessage = err.message || messages.errors.generic;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="translation-page container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="translation-card shadow-lg">
            <div className="translation-card__header">
              <h1 className="translation-title">{messages.title}</h1>
              <p className="translation-subtitle">
                {messages.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="translation-form">
              <div className="translation-form__group">
                <label className="form-label">{messages.directionLabel}</label>
                <div className="direction-selector">
                  <select
                    value={direction}
                    onChange={(event) => {
                      setDirection(event.target.value);
                      setResult(null);
                    }}
                    className="form-select"
                  >
                    {directionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-outline-secondary swap-button"
                    onClick={handleSwapDirection}
                  >
                    <i className="fas fa-exchange-alt me-2" />
                    {messages.swap}
                  </button>
                </div>
              </div>

              <div className="translation-form__group">
                <label className="form-label">{messages.sourceLabel}</label>
                <textarea
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  className="form-control source-text"
                  rows={6}
                  placeholder={messages.placeholder}
                  disabled={loading}
                />
                <div className="form-text">
                  {messages.example}
                </div>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="translation-actions">
                <button type="submit" className="btn btn-primary btn-translate" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      {messages.translating}
                    </>
                  ) : (
                    <>
                      <i className="fas fa-language me-2" />
                      {messages.action}
                    </>
                  )}
                </button>
              </div>
            </form>

            {result && (
              <div className="translation-result mt-4">
                <h2 className="translation-result__title">{messages.resultTitle}</h2>
                <div className="translation-output">{result.translation}</div>

                {Array.isArray(result.metadata?.input_hints) && result.metadata.input_hints.length > 0 && (
                  <div className="translation-metadata">
                    <h3>{messages.glossaryTitle}</h3>
                    <ul>
                      {result.metadata.input_hints.map((hint, index) => (
                        <li key={index}>{hint}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.metadata?.example && (
                  <div className="translation-example mt-3">
                    <h3>{messages.exampleTitle}</h3>
                    <p className="example-source">
                      <strong>{messages.exampleSource}:</strong> {result.metadata.example.en || result.metadata.example.vi}
                    </p>
                    <p className="example-target">
                      <strong>{messages.exampleTarget}:</strong> {result.metadata.example.vi || result.metadata.example.en}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTranslation;


