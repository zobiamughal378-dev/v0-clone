"use client";

import { useState } from 'react';

// Types define karo
interface Layout {
  id: number;
  title: string;
  description: string;
  bgColor: string;
  fontFamily: string;
  buttonStyle: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFont, setSelectedFont] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedLayout, setSelectedLayout] = useState<number | null>(null);  // Learn More ke liye

  // Initial layouts state
  const [layouts, setLayouts] = useState<Layout[]>([
    { 
      id: 1, 
      title: 'Modern SaaS', 
      description: 'Cloud-based solution for modern teams',
      bgColor: 'bg-blue-50',
      fontFamily: 'font-sans',
      buttonStyle: 'bg-blue-600 hover:bg-blue-700'
    },
    { 
      id: 2, 
      title: 'E-commerce Store', 
      description: 'Shop the latest collection',
      bgColor: 'bg-green-50',
      fontFamily: 'font-sans',
      buttonStyle: 'bg-green-600 hover:bg-green-700'
    },
    { 
      id: 3, 
      title: 'Creative Portfolio', 
      description: 'Showcase your best work',
      bgColor: 'bg-purple-50',
      fontFamily: 'font-sans',
      buttonStyle: 'bg-purple-600 hover:bg-purple-700'
    }
  ]);

  // GENERATE BUTTON - 3 layouts banega
  const generateLayouts = () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt first!');
      return;
    }

    setLoading(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const newLayouts = [
        {
          id: 1,
          title: `${prompt.substring(0, 10)} - Style 1`,
          description: 'Minimal & Clean design with focus on content',
          bgColor: 'bg-indigo-50',
          fontFamily: 'font-sans',
          buttonStyle: 'bg-indigo-600 hover:bg-indigo-700'
        },
        {
          id: 2,
          title: `${prompt.substring(0, 10)} - Style 2`,
          description: 'Bold & Modern with gradient accents',
          bgColor: 'bg-pink-50',
          fontFamily: 'font-serif',
          buttonStyle: 'bg-pink-600 hover:bg-pink-700'
        },
        {
          id: 3,
          title: `${prompt.substring(0, 10)} - Style 3`,
          description: 'Professional & Corporate layout',
          bgColor: 'bg-amber-50',
          fontFamily: 'font-mono',
          buttonStyle: 'bg-amber-600 hover:bg-amber-700'
        }
      ];
      
      setLayouts(newLayouts);
      setLoading(false);
      alert('✅ 3 layouts generated successfully!');
    }, 1500);
  };

  // EDIT FONT FUNCTION
  const editFont = (layoutId: number) => {
    setLayouts(layouts.map(layout => {
      if (layout.id === layoutId) {
        // Toggle between fonts
        let newFont = '';
        if (layout.fontFamily === 'font-sans') newFont = 'font-serif';
        else if (layout.fontFamily === 'font-serif') newFont = 'font-mono';
        else newFont = 'font-sans';
        
        return { ...layout, fontFamily: newFont };
      }
      return layout;
    }));
    
    setSelectedFont(`Font changed for layout ${layoutId}`);
    setTimeout(() => setSelectedFont(''), 2000);
  };

  // CHANGE STYLE FUNCTION
  const changeStyle = (layoutId: number) => {
    setLayouts(layouts.map(layout => {
      if (layout.id === layoutId) {
        // Cycle through different styles
        const colors = [
          { bg: 'bg-red-50', btn: 'bg-red-600 hover:bg-red-700' },
          { bg: 'bg-yellow-50', btn: 'bg-yellow-600 hover:bg-yellow-700' },
          { bg: 'bg-teal-50', btn: 'bg-teal-600 hover:bg-teal-700' },
          { bg: 'bg-blue-50', btn: 'bg-blue-600 hover:bg-blue-700' },
          { bg: 'bg-purple-50', btn: 'bg-purple-600 hover:bg-purple-700' }
        ];
        
        const currentColor = layout.bgColor;
        const currentIndex = colors.findIndex(c => c.bg === currentColor);
        const nextColor = colors[(currentIndex + 1) % colors.length];
        
        return { 
          ...layout, 
          bgColor: nextColor.bg,
          buttonStyle: nextColor.btn
        };
      }
      return layout;
    }));
    
    setSelectedStyle(`Style updated for layout ${layoutId}`);
    setTimeout(() => setSelectedStyle(''), 2000);
  };

  // LEARN MORE FUNCTION
  const showDetails = (layoutId: number, title: string, description: string) => {
    setSelectedLayout(layoutId);
    
    // Alert mein details dikhao
    alert(`📋 ${title}\n\n${description}\n\n✨ Features:\n• Fully responsive design\n• Customizable colors\n• Modern UI components\n• SEO optimized\n\nContact us for more details!`);
    
    // 2 second baad highlight hata do
    setTimeout(() => setSelectedLayout(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🚀 V0 Vercel Clone
          </h1>
          <p className="text-gray-400 text-lg">
            Generate 3 unique landing pages from one prompt
          </p>
        </div>
        
        {/* Prompt Input Section */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 mb-12 border border-gray-700">
          <label className="block text-gray-300 text-sm font-bold mb-2">
            Enter your prompt:
          </label>
          <textarea
            className="w-full p-6 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            rows={4}
            placeholder="e.g., Create 3 different landing pages for a AI startup..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          
          <div className="flex justify-between items-center mt-6">
            <p className="text-gray-400 text-sm">
              {prompt.length} characters
            </p>
            <button
              onClick={generateLayouts}
              disabled={loading}
              className={`px-8 py-4 rounded-xl font-bold text-white transition-all transform hover:scale-105 ${
                loading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </span>
              ) : (
                '🎨 Generate 3 Layouts'
              )}
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {(selectedFont || selectedStyle) && (
          <div className="mb-6 bg-green-600 text-white p-4 rounded-xl animate-pulse text-center">
            ✅ {selectedFont} {selectedStyle}
          </div>
        )}

        {/* 3 Layouts Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {layouts.map((layout) => (
            <div 
              key={layout.id} 
              className={`${layout.bgColor} rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 border border-gray-700 ${
                selectedLayout === layout.id ? 'ring-4 ring-yellow-400 scale-105' : 'hover:scale-105'
              }`}
            >
              {/* Header */}
              <div className="bg-gray-800 text-white p-5 border-b border-gray-700">
                <h3 className="font-bold text-xl">{layout.title}</h3>
              </div>
              
              {/* Content */}
              <div className="p-6">
                {/* Preview Box */}
                <div className={`${layout.fontFamily} ${layout.bgColor} p-6 rounded-xl min-h-[200px] border-2 border-dashed border-gray-600 flex flex-col items-center justify-center text-center`}>
                  <div className={`w-16 h-16 rounded-full ${layout.buttonStyle.split(' ')[0]} mb-4 flex items-center justify-center text-white text-2xl`}>
                    {layout.id}
                  </div>
                  <p className="text-gray-800 font-medium mb-2">
                    {layout.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    Font: {layout.fontFamily.replace('font-', '')}
                  </p>
                  
                  {/* Learn More Button - AB KAAM KAREGA */}
                  <button 
                    onClick={() => showDetails(layout.id, layout.title, layout.description)}
                    className={`mt-4 ${layout.buttonStyle} text-white px-6 py-2 rounded-lg text-sm transition-colors font-medium`}
                  >
                    Learn More →
                  </button>
                </div>
                
                {/* Control Buttons */}
                <div className="mt-6 flex gap-3 justify-center">
                  <button
                    onClick={() => editFont(layout.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    ✏️ Edit Font
                  </button>
                  <button
                    onClick={() => changeStyle(layout.id)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    🎨 Change Style
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h4 className="text-white font-bold mb-2">📝 How to use:</h4>
          <ul className="text-gray-400 space-y-1 text-sm">
            <li>1. Enter any prompt in the text area</li>
            <li>2. Click &quot;Generate 3 Layouts&quot; - 3 unique layouts banege</li>
            <li>3. Click &quot;Edit Font&quot; to change font style</li>
            <li>4. Click &quot;Change Style&quot; to change colors</li>
            <li>5. Click &quot;Learn More&quot; to see layout details ✨</li>
          </ul>
        </div>
      </div>
    </div>
  );
}