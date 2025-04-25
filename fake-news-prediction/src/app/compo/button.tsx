'use client'

import React, { useState, useEffect } from 'react';
import styles from './predict.module.css';
import { AlertCircle, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';

const Predict = () => {
  const [text, setText] = useState('');
  const [prediction, setPrediction] = useState<string | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showStamp, setShowStamp] = useState(false);

  useEffect(() => {
    if (prediction === 'Fake News') {
      setShowStamp(true);
      const timer = setTimeout(() => {
        setShowStamp(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [prediction]);

  const handlePredict = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPrediction(data.result);
        setAccuracy(data.accuracy);
      } else {
        setError(data.error || 'An error occurred during prediction');
      }
    } catch (error) {
      console.error('Error during prediction:', error);
      setError('Failed to connect to the prediction service');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.newsTexture}></div>
      {showStamp && <div className={styles.stamp}>FAKE</div>}
      
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>FAKE NEWS PREDICTION</h1>
          <p className={styles.subtitle}>Enter a news article to check if it might be fake or real</p>
        </div>
        
        <div className={styles.content}>
          <div className={styles.inputGroup}>
            <label htmlFor="news-text" className={styles.label}>
              <span className={styles.labelTag}>Article Text</span>
              Enter the news article:
            </label>
            <textarea 
              id="news-text"
              className={styles.textarea}
              placeholder="Enter title and text of the news report..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>
          
          <button 
            className={styles.button} 
            onClick={handlePredict}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className={styles.spinner}></div>
                Analyzing...
              </>
            ) : 'Predict'}
          </button>
          
          {prediction && (
            <div className={`${styles.result} ${prediction === 'Fake News' ? styles.resultFake : styles.resultReal}`}>
              {prediction === 'Fake News' && <div className={styles.fakeStamp}>FAKE</div>}
              
              <h2 className={`${styles.resultTitle} ${prediction === 'Fake News' ? styles.resultTitleFake : styles.resultTitleReal}`}>
                {prediction === 'Fake News' ? (
                  <>
                    <AlertTriangle size={20} />
                    Prediction: {prediction}
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Prediction: {prediction}
                  </>
                )}
              </h2>
              
              {accuracy !== null && (
                <>
                  <div className={styles.progressContainer}>
                    <div 
                      className={`${styles.progressBar} ${prediction === 'Fake News' ? styles.progressBarFake : styles.progressBarReal}`}
                      style={{ width: `${accuracy}%` }}
                    ></div>
                  </div>
                  <p className={styles.accuracy}>
                    Confidence: {accuracy.toFixed(2)}%
                  </p>
                </>
              )}
              
              <p className={styles.note}>
                Note: This prediction is based on machine learning analysis and should be verified with additional sources.
              </p>
            </div>
          )}
          
          {error && (
            <div className={styles.error}>
              <h2 className={styles.errorTitle}>
                <AlertCircle size={20} />
                Error
              </h2>
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
      
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Your Portfolio. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Predict;