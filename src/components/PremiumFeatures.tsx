import React, { useState } from 'react';
import './PremiumFeatures.css';

interface PremiumFeaturesProps {
  filePath: string | null;
}

const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({ filePath }) => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const features = [
    {
      id: 'ocr',
      name: 'OCR',
      icon: '📝',
      description: 'Extract text from images using OCR',
      color: '#FF6B6B'
    },
    {
      id: 'editor',
      name: 'Editor',
      icon: '✏️',
      description: 'Edit PDF - add/remove pages, merge, crop',
      color: '#4ECDC4'
    },
    {
      id: 'forms',
      name: 'Forms',
      icon: '📋',
      description: 'Fill and manage interactive forms',
      color: '#45B7D1'
    },
    {
      id: 'redaction',
      name: 'Redaction',
      icon: '🔐',
      description: 'Hide sensitive information securely',
      color: '#F7B731'
    },
    {
      id: 'cloud',
      name: 'Cloud Sync',
      icon: '☁️',
      description: 'Google Drive, OneDrive, AWS S3 integration',
      color: '#5F27CD'
    },
    {
      id: 'compare',
      name: 'Compare',
      icon: '🔀',
      description: 'Compare two PDFs and track changes',
      color: '#00D2D3'
    },
    {
      id: 'presentation',
      name: 'Present',
      icon: '🎥',
      description: 'Presentation mode with recording',
      color: '#FF9FF3'
    },
    {
      id: 'convert',
      name: 'Convert',
      icon: '🔄',
      description: 'Convert to DOCX, XLSX, PPTX, HTML, etc.',
      color: '#54A0FF'
    },
    {
      id: 'analysis',
      name: 'Analysis',
      icon: '📊',
      description: 'Document analysis and insights',
      color: '#48DBFB'
    },
    {
      id: 'ai',
      name: 'AI Assistant',
      icon: '🤖',
      description: 'Ask questions, summarize with AI',
      color: '#FF6348'
    }
  ];

  const handleFeatureClick = async (featureId: string) => {
    if (!filePath) {
      alert('Please open a PDF first');
      return;
    }

    setSelectedFeature(featureId);
    setIsProcessing(true);

    try {
      // Simulate feature processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Call corresponding handler based on feature
      switch (featureId) {
        case 'ocr':
          console.log('OCR processing...');
          alert('OCR extraction completed!');
          break;
        case 'editor':
          console.log('Editor mode activated');
          alert('Editor mode activated');
          break;
        case 'forms':
          console.log('Forms detection...');
          alert('Forms detected and ready for filling');
          break;
        case 'redaction':
          console.log('Redaction mode');
          alert('Redaction mode activated');
          break;
        case 'cloud':
          console.log('Cloud sync...');
          alert('Cloud sync initialized');
          break;
        case 'compare':
          console.log('Comparison started');
          alert('Document comparison started');
          break;
        case 'presentation':
          console.log('Starting presentation');
          alert('Presentation mode started');
          break;
        case 'convert':
          console.log('Conversion started');
          alert('Select format to convert to');
          break;
        case 'analysis':
          console.log('Analyzing document');
          alert('Document analysis completed');
          break;
        case 'ai':
          console.log('AI Assistant ready');
          alert('AI Assistant ready - Ask a question');
          break;
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="premium-features">
      <div className="premium-header">
        <h2>✨ Premium Features</h2>
        <p>Unlock powerful tools for professional PDF management</p>
      </div>

      <div className="features-grid">
        {features.map(feature => (
          <button
            key={feature.id}
            className={`feature-card ${selectedFeature === feature.id ? 'active' : ''} ${!filePath ? 'disabled' : ''}`}
            onClick={() => handleFeatureClick(feature.id)}
            disabled={!filePath || isProcessing}
            style={{
              borderColor: feature.color,
              backgroundColor: `${feature.color}15`
            }}
          >
            <div className="feature-icon" style={{ color: feature.color }}>
              {feature.icon}
            </div>
            <h3>{feature.name}</h3>
            <p>{feature.description}</p>
            {selectedFeature === feature.id && isProcessing && (
              <div className="processing">
                <div className="spinner"></div>
                <span>Processing...</span>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="feature-details">
        {selectedFeature && (
          <div className="details-panel">
            <h3>
              {features.find(f => f.id === selectedFeature)?.name} Details
            </h3>
            <p>{features.find(f => f.id === selectedFeature)?.description}</p>
            <div className="feature-info">
              <p>✓ Professional-grade functionality</p>
              <p>✓ Secure processing</p>
              <p>✓ Fast performance</p>
              <p>✓ Full integration with main editor</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumFeatures;
