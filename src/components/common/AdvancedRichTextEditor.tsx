"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  List, 
  ListOrdered, 
  Link, 
  Image, 
  Code, 
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Eye,
  Edit3,
  Undo,
  Redo,
  Save,
  RotateCcw,
  FileCode2,
  Palette,
  Highlighter,
  Subscript,
  Superscript,
  Minus,
  Indent,
  Outdent,
  Table,
  Copy,
  Scissors,
  ClipboardPaste,
  Search,
  Replace,
  ChevronDown
} from 'lucide-react';

interface AdvancedRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  maxHeight?: string;
  showPreview?: boolean;
}

const AdvancedRichTextEditor: React.FC<AdvancedRichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your content...",
  className = "",
  minHeight = "400px",
  maxHeight = "600px",
  showPreview = true,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLInputElement>(null);
  const highlightColorPickerRef = useRef<HTMLInputElement>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [showFontFamilyDropdown, setShowFontFamilyDropdown] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState('16px');
  const [currentFontFamily, setCurrentFontFamily] = useState('Arial');

  // Font sizes and families
  const fontSizes = [
    '8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', 
    '24px', '28px', '32px', '36px', '48px', '60px', '72px'
  ];

  const fontFamilies = [
    'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Georgia', 
    'Helvetica', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 
    'Trebuchet MS', 'Verdana', 'system-ui', 'serif', 'sans-serif', 'monospace'
  ];

  const quickColors = [
    '#000000', '#444444', '#666666', '#999999', '#cccccc', '#eeeeee', '#f3f3f3', '#ffffff',
    '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#9900ff', '#ff00ff',
    '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#cfe2f3', '#d9d2e9', '#ead1dc',
    '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#9fc5e8', '#b4a7d6', '#d5a6bd',
    '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6fa8dc', '#8e7cc3', '#c27ba0',
    '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3d85c6', '#674ea7', '#a64d79',
    '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#0b5394', '#351c75', '#741b47',
    '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#073763', '#20124d', '#4c1130'
  ];

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      if (!value || value.trim() === '') {
        editorRef.current.innerHTML = '';
      } else {
        const htmlValue = value.includes('<') ? value : `<p>${value}</p>`;
        editorRef.current.innerHTML = htmlValue;
      }
      setIsInitialized(true);
      updateCounts(value);
    }
  }, [value, isInitialized]);

  useEffect(() => {
    if (editorRef.current && isInitialized && editorRef.current.innerHTML !== value) {
      const htmlValue = value.includes('<') && value.trim() !== '' ? value : (value.trim() !== '' ? `<p>${value}</p>` : '');
      editorRef.current.innerHTML = htmlValue;
      updateCounts(value);
    }
  }, [value, isInitialized]);

  const updateCounts = useCallback((content: string) => {
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    setCharCount(content.length);
    setWordCount(textContent ? textContent.split(/\s+/).length : 0);
  }, []);

  const saveToHistory = useCallback((content: string) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(content);
      return newHistory.slice(-50);
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      let htmlContent = editorRef.current.innerHTML;
      
      htmlContent = htmlContent
        .replace(/<p><br><\/p>/g, '<p></p>')
        .replace(/<p>\s*<\/p>/g, '')
        .replace(/^<br>/, '')
        .replace(/<div>/g, '<p>')
        .replace(/<\/div>/g, '</p>')
        .trim();

      if (htmlContent && !htmlContent.includes('<') && htmlContent.trim() !== '') {
        htmlContent = `<p>${htmlContent}</p>`;
        editorRef.current.innerHTML = htmlContent;
      }

      updateCounts(htmlContent);
      onChange(htmlContent);
    }
  }, [onChange, updateCounts]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || (e.ctrlKey && e.key === 's')) {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveToHistory(editorRef.current?.innerHTML || '');
      }
    }

    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
          break;
        case 'y':
          e.preventDefault();
          redo();
          break;
        case 'c':
          if (!e.shiftKey) {
            handleCopy();
          }
          break;
        case 'x':
          if (!e.shiftKey) {
            handleCut();
          }
          break;
        case 'v':
          if (!e.shiftKey) {
            handlePaste();
          }
          break;
      }
    }
  }, [saveToHistory]);

  const execCommand = useCallback((command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      
      if (editorRef.current.innerHTML === '' || editorRef.current.innerHTML === '<br>') {
        editorRef.current.innerHTML = '<p><br></p>';
      }
      
      document.execCommand(command, false, value);
      setTimeout(() => handleInput(), 10);
    }
  }, [handleInput]);

  const insertHTML = useCallback((html: string) => {
    if (isHtmlMode) {
      const currentValue = value;
      const newValue = currentValue + html;
      onChange(newValue);
    } else if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHTML', false, html);
      setTimeout(() => handleInput(), 10);
    }
  }, [handleInput, isHtmlMode, value, onChange]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevContent = history[historyIndex - 1];
      if (editorRef.current && prevContent !== undefined) {
        editorRef.current.innerHTML = prevContent;
        setHistoryIndex(prev => prev - 1);
        onChange(prevContent);
        updateCounts(prevContent);
      }
    }
  }, [history, historyIndex, onChange, updateCounts]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextContent = history[historyIndex + 1];
      if (editorRef.current && nextContent !== undefined) {
        editorRef.current.innerHTML = nextContent;
        setHistoryIndex(prev => prev + 1);
        onChange(nextContent);
        updateCounts(nextContent);
      }
    }
  }, [history, historyIndex, onChange, updateCounts]);

  const handleColorPick = useCallback((color: string) => {
    execCommand('foreColor', color);
  }, [execCommand]);

  const handleHighlightColorPick = useCallback((color: string) => {
    execCommand('hiliteColor', color);
  }, [execCommand]);

  const handleFontSizeChange = useCallback((size: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        const span = document.createElement('span');
        span.style.fontSize = size;
        try {
          range.surroundContents(span);
          setCurrentFontSize(size);
          setTimeout(() => handleInput(), 10);
        } catch (e) {
          execCommand('fontSize', '7');
          const fontElements = editorRef.current?.querySelectorAll('font[size="7"]');
          fontElements?.forEach(el => {
            el.removeAttribute('size');
            (el as HTMLElement).style.fontSize = size;
          });
        }
      }
    }
    setShowFontSizeDropdown(false);
  }, [execCommand, handleInput]);

  const handleFontFamilyChange = useCallback((family: string) => {
    execCommand('fontName', family);
    setCurrentFontFamily(family);
    setShowFontFamilyDropdown(false);
  }, [execCommand]);

  const handleLinkInsert = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      const text = prompt('Enter link text:') || url;
      insertHTML(`<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`);
    }
  }, [insertHTML]);

  const handleImageInsert = useCallback(() => {
    const url = prompt('Enter image URL:');
    if (url) {
      const alt = prompt('Enter image description:') || 'Image';
      insertHTML(`<img src="${url}" alt="${alt}" style="max-width: 100%; height: auto;" />`);
    }
  }, [insertHTML]);

  const handleTableInsert = useCallback(() => {
    const rows = parseInt(prompt('Number of rows:') || '2');
    const cols = parseInt(prompt('Number of columns:') || '2');
    if (rows && cols) {
      let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%;">';
      for (let i = 0; i < rows; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < cols; j++) {
          tableHTML += '<td style="padding: 8px; border: 1px solid #ccc;">&nbsp;</td>';
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</table>';
      insertHTML(tableHTML);
    }
  }, [insertHTML]);

  const handleCopy = useCallback(() => {
    document.execCommand('copy');
  }, []);

  const handleCut = useCallback(() => {
    document.execCommand('cut');
    setTimeout(() => handleInput(), 10);
  }, [handleInput]);

  const handlePaste = useCallback(() => {
    document.execCommand('paste');
    setTimeout(() => handleInput(), 10);
  }, [handleInput]);

  const handleFindReplace = useCallback(() => {
    const searchText = prompt('Find text:');
    if (searchText) {
      const replaceText = prompt('Replace with:');
      if (replaceText !== null) {
        const content = editorRef.current?.innerHTML || '';
        const newContent = content.replace(new RegExp(searchText, 'gi'), replaceText);
        if (editorRef.current) {
          editorRef.current.innerHTML = newContent;
          handleInput();
        }
      }
    }
  }, [handleInput]);

  const formatBlock = useCallback((tag: string) => {
    execCommand('formatBlock', tag);
  }, [execCommand]);

  const toolbarButtons = [
    // Font controls
    { 
      custom: true, 
      element: (
        <div key="font-family" className="relative">
          <button
            type="button"
            onClick={() => setShowFontFamilyDropdown(!showFontFamilyDropdown)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
            title="Font Family"
          >
            <span className="font-medium" style={{ fontFamily: currentFontFamily }}>
              {currentFontFamily}
            </span>
            <ChevronDown size={14} />
          </button>
          {showFontFamilyDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-10 min-w-[160px] max-h-48 overflow-y-auto">
              {fontFamilies.map((family) => (
                <button
                  key={family}
                  onClick={() => handleFontFamilyChange(family)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  style={{ fontFamily: family }}
                >
                  {family}
                </button>
              ))}
            </div>
          )}
        </div>
      )
    },
    { 
      custom: true, 
      element: (
        <div key="font-size" className="relative">
          <button
            type="button"
            onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
            title="Font Size"
          >
            {currentFontSize}
            <ChevronDown size={14} />
          </button>
          {showFontSizeDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
              {fontSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleFontSizeChange(size)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  style={{ fontSize: size }}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>
      )
    },
    { divider: true },
    
    // Text formatting
    { icon: Bold, action: () => execCommand('bold'), title: 'Bold (Ctrl+B)' },
    { icon: Italic, action: () => execCommand('italic'), title: 'Italic (Ctrl+I)' },
    { icon: Underline, action: () => execCommand('underline'), title: 'Underline (Ctrl+U)' },
    { icon: Strikethrough, action: () => execCommand('strikeThrough'), title: 'Strikethrough' },
    { icon: Subscript, action: () => execCommand('subscript'), title: 'Subscript' },
    { icon: Superscript, action: () => execCommand('superscript'), title: 'Superscript' },
    { divider: true },
    
    // Colors
    { 
      custom: true, 
      element: (
        <div key="text-color" className="relative">
          <button
            type="button"
            onClick={() => colorPickerRef.current?.click()}
            className="p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
            title="Text Color"
          >
            <Palette size={16} />
            <div className="w-4 h-1 bg-red-500 ml-1 rounded"></div>
          </button>
          <input
            ref={colorPickerRef}
            type="color"
            onChange={(e) => handleColorPick(e.target.value)}
            className="sr-only"
          />
          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg p-2 z-10 grid grid-cols-8 gap-1 w-64" 
               style={{ display: 'none' }}
               onMouseEnter={(e) => e.currentTarget.style.display = 'grid'}
               onMouseLeave={(e) => e.currentTarget.style.display = 'none'}>
            {quickColors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorPick(color)}
                className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )
    },
    { 
      custom: true, 
      element: (
        <div key="highlight-color" className="relative">
          <button
            type="button"
            onClick={() => highlightColorPickerRef.current?.click()}
            className="p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Highlight Color"
          >
            <Highlighter size={16} />
          </button>
          <input
            ref={highlightColorPickerRef}
            type="color"
            onChange={(e) => handleHighlightColorPick(e.target.value)}
            className="sr-only"
          />
        </div>
      )
    },
    { divider: true },

    // Headers and blocks
    { icon: Heading1, action: () => formatBlock('H1'), title: 'Heading 1' },
    { icon: Heading2, action: () => formatBlock('H2'), title: 'Heading 2' },
    { icon: Heading3, action: () => formatBlock('H3'), title: 'Heading 3' },
    { icon: Type, action: () => formatBlock('P'), title: 'Paragraph' },
    { divider: true },
    
    // Alignment
    { icon: AlignLeft, action: () => execCommand('justifyLeft'), title: 'Align Left' },
    { icon: AlignCenter, action: () => execCommand('justifyCenter'), title: 'Align Center' },
    { icon: AlignRight, action: () => execCommand('justifyRight'), title: 'Align Right' },
    { icon: AlignJustify, action: () => execCommand('justifyFull'), title: 'Justify' },
    { divider: true },
    
    // Lists and indentation
    { icon: List, action: () => execCommand('insertUnorderedList'), title: 'Bullet List' },
    { icon: ListOrdered, action: () => execCommand('insertOrderedList'), title: 'Numbered List' },
    { icon: Indent, action: () => execCommand('indent'), title: 'Increase Indent' },
    { icon: Outdent, action: () => execCommand('outdent'), title: 'Decrease Indent' },
    { icon: Quote, action: () => formatBlock('BLOCKQUOTE'), title: 'Quote' },
    { divider: true },
    
    // Insert elements
    { icon: Link, action: handleLinkInsert, title: 'Insert Link' },
    { icon: Image, action: handleImageInsert, title: 'Insert Image' },
    { icon: Table, action: handleTableInsert, title: 'Insert Table' },
    { icon: Code, action: () => execCommand('formatBlock', 'PRE'), title: 'Code Block' },
    { icon: Minus, action: () => insertHTML('<hr>'), title: 'Horizontal Rule' },
    { divider: true },
    
    // Edit operations
    { icon: Copy, action: handleCopy, title: 'Copy (Ctrl+C)' },
    { icon: Scissors, action: handleCut, title: 'Cut (Ctrl+X)' },
    { icon: ClipboardPaste, action: handlePaste, title: 'Paste (Ctrl+V)' },
    { icon: Search, action: handleFindReplace, title: 'Find & Replace' },
    { divider: true },
    
    // History
    { icon: Undo, action: undo, title: 'Undo (Ctrl+Z)', disabled: historyIndex <= 0 },
    { icon: Redo, action: redo, title: 'Redo (Ctrl+Y)', disabled: historyIndex >= history.length - 1 },
  ];

  return (
    <div className={`border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800 ${className}`}>
      {/* Enhanced Toolbar */}
      <div className="border-b border-gray-300 dark:border-gray-600 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 flex-wrap">
            {toolbarButtons.map((button, index) => {
              if (button.divider) {
                return (
                  <div key={index} className="h-8 w-px bg-gray-300 dark:bg-gray-600 mx-1" />
                );
              }
              
              if (button.custom && button.element) {
                return button.element;
              }
              
              const Icon = button.icon!;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={button.action}
                  disabled={button.disabled}
                  className={`
                    p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md 
                    hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                  `}
                  title={button.title}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
          
          <div className="flex items-center gap-2">
            {showPreview && (
              <button
                type="button"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`
                  px-3 py-1 text-sm rounded-md border transition-colors flex items-center gap-1
                  ${isPreviewMode 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }
                `}
              >
                {isPreviewMode ? <Edit3 size={14} /> : <Eye size={14} />}
                {isPreviewMode ? 'Edit' : 'Preview'}
              </button>
            )}
            
            <button
              type="button"
              onClick={() => {
                setIsHtmlMode(!isHtmlMode);
                setIsPreviewMode(false);
              }}
              className={`
                px-3 py-1 text-sm rounded-md border transition-colors flex items-center gap-1
                ${isHtmlMode 
                  ? 'bg-green-600 text-white border-green-600' 
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }
              `}
            >
              <FileCode2 size={14} />
              {isHtmlMode ? 'Visual' : 'HTML'}
            </button>
          </div>
        </div>
        
        {/* Stats and Controls */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span>Words: {wordCount}</span>
            <span>Characters: {charCount}</span>
            {isHtmlMode && (
              <span className="text-green-600 dark:text-green-400">HTML Source Mode</span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <span>Ctrl+S to save • Ctrl+Z/Y for undo/redo</span>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="relative">
        {isPreviewMode ? (
          <div 
            className="p-4 prose dark:prose-invert max-w-none overflow-auto"
            style={{ minHeight, maxHeight }}
          >
            <div 
              dangerouslySetInnerHTML={{ 
                __html: value || '<p class="text-gray-400 italic">No content to preview</p>' 
              }}
            />
          </div>
        ) : isHtmlMode ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => saveToHistory(value)}
            className="w-full p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-0 outline-none resize-none"
            style={{ minHeight, maxHeight }}
            placeholder="Enter HTML code directly..."
            spellCheck={false}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (editorRef.current && editorRef.current.innerHTML === '') {
                editorRef.current.innerHTML = '<p><br></p>';
                const range = document.createRange();
                const sel = window.getSelection();
                range.setStart(editorRef.current.firstChild?.firstChild || editorRef.current, 0);
                range.collapse(true);
                sel?.removeAllRanges();
                sel?.addRange(range);
              }
            }}
            onBlur={() => {
              if (editorRef.current) {
                saveToHistory(editorRef.current.innerHTML);
              }
            }}
            className="p-4 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white overflow-auto"
            style={{ 
              minHeight, 
              maxHeight,
              lineHeight: '1.6',
              fontSize: '15px'
            }}
            suppressContentEditableWarning={true}
            data-placeholder={placeholder}
          />
        )}
        
        <style jsx>{`
          [contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            pointer-events: none;
            font-style: italic;
          }
        `}</style>
      </div>
    </div>
  );
};

export default AdvancedRichTextEditor;