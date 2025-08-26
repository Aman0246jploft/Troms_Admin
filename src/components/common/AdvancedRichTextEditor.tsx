"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
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
  Palette
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
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      if (!value || value.trim() === '') {
        editorRef.current.innerHTML = '';
      } else {
        // Ensure proper HTML structure
        const htmlValue = value.includes('<') ? value : `<p>${value}</p>`;
        editorRef.current.innerHTML = htmlValue;
      }
      setIsInitialized(true);
      updateCounts(value);
    }
  }, [value, isInitialized]);

  // Update content when value changes externally
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
      return newHistory.slice(-50); // Keep last 50 states
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      let htmlContent = editorRef.current.innerHTML;
      
      // Clean up HTML
      htmlContent = htmlContent
        .replace(/<p><br><\/p>/g, '<p></p>')
        .replace(/<p>\s*<\/p>/g, '')
        .replace(/^<br>/, '')
        .replace(/<div>/g, '<p>')
        .replace(/<\/div>/g, '</p>')
        .trim();

      // Ensure content is wrapped properly
      if (htmlContent && !htmlContent.includes('<') && htmlContent.trim() !== '') {
        htmlContent = `<p>${htmlContent}</p>`;
        editorRef.current.innerHTML = htmlContent;
      }

      updateCounts(htmlContent);
      onChange(htmlContent);
    }
  }, [onChange, updateCounts]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Save to history on significant changes
    if (e.key === 'Enter' || (e.ctrlKey && e.key === 's')) {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveToHistory(editorRef.current?.innerHTML || '');
      }
    }

    // Handle shortcuts
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
      }
    }
  }, [saveToHistory]);

  const execCommand = useCallback((command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      
      // Ensure we have content structure
      if (editorRef.current.innerHTML === '' || editorRef.current.innerHTML === '<br>') {
        editorRef.current.innerHTML = '<p><br></p>';
      }
      
      document.execCommand(command, false, value);
      
      // Trigger input handler to update content
      setTimeout(() => handleInput(), 10);
    }
  }, [handleInput]);

  const insertHTML = useCallback((html: string) => {
    if (isHtmlMode) {
      // In HTML mode, insert at cursor position in textarea
      const currentValue = value;
      const newValue = currentValue + html;
      onChange(newValue);
    } else if (editorRef.current) {
      // In visual mode, use execCommand
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

  const handleColorPicker = useCallback(() => {
    const color = prompt('Enter color (hex, rgb, or color name):');
    if (color) {
      execCommand('foreColor', color);
    }
  }, [execCommand]);

  const handleCustomHtml = useCallback(() => {
    const html = prompt('Enter HTML code:');
    if (html) {
      insertHTML(html);
    }
  }, [insertHTML]);

  const formatBlock = useCallback((tag: string) => {
    execCommand('formatBlock', tag);
  }, [execCommand]);

  const toolbarButtons = [
    { icon: Bold, action: () => execCommand('bold'), title: 'Bold (Ctrl+B)', className: 'font-bold' },
    { icon: Italic, action: () => execCommand('italic'), title: 'Italic (Ctrl+I)', className: 'italic' },
    { icon: Underline, action: () => execCommand('underline'), title: 'Underline (Ctrl+U)', className: 'underline' },
    { divider: true },
    { icon: Heading1, action: () => formatBlock('H1'), title: 'Heading 1' },
    { icon: Heading2, action: () => formatBlock('H2'), title: 'Heading 2' },
    { icon: Heading3, action: () => formatBlock('H3'), title: 'Heading 3' },
    { icon: Type, action: () => formatBlock('P'), title: 'Paragraph' },
    { divider: true },
    { icon: AlignLeft, action: () => execCommand('justifyLeft'), title: 'Align Left' },
    { icon: AlignCenter, action: () => execCommand('justifyCenter'), title: 'Align Center' },
    { icon: AlignRight, action: () => execCommand('justifyRight'), title: 'Align Right' },
    { icon: AlignJustify, action: () => execCommand('justifyFull'), title: 'Justify' },
    { divider: true },
    { icon: List, action: () => execCommand('insertUnorderedList'), title: 'Bullet List' },
    { icon: ListOrdered, action: () => execCommand('insertOrderedList'), title: 'Numbered List' },
    { icon: Quote, action: () => formatBlock('BLOCKQUOTE'), title: 'Quote' },
    { divider: true },
    { icon: Link, action: handleLinkInsert, title: 'Insert Link' },
    { icon: Image, action: handleImageInsert, title: 'Insert Image' },
    { icon: Code, action: () => execCommand('formatBlock', 'PRE'), title: 'Code Block' },
    { icon: Palette, action: handleColorPicker, title: 'Text Color' },
    { icon: FileCode2, action: handleCustomHtml, title: 'Insert Custom HTML' },
    { divider: true },
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
                  <div key={index} className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" />
                );
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
                    ${button.className || ''}
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
        
        {/* Stats and HTML Templates */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span>Words: {wordCount}</span>
            <span>Characters: {charCount}</span>
            {isHtmlMode && (
              <span className="text-green-600 dark:text-green-400">HTML Source Mode</span>
            )}
          </div>
          
          {isHtmlMode && (
            <div className="flex items-center gap-2">
              <select 
                onChange={(e) => {
                  if (e.target.value) {
                    insertHTML(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="text-xs bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
              >
                <option value="">Quick HTML...</option>
                <option value="<p></p>">Paragraph</option>
                <option value="<h1></h1>">Heading 1</option>
                <option value="<h2></h2>">Heading 2</option>
                <option value="<h3></h3>">Heading 3</option>
                <option value="<ul><li></li></ul>">Bullet List</option>
                <option value="<ol><li></li></ol>">Numbered List</option>
                <option value='<a href="" target="_blank"></a>'>Link</option>
                <option value='<img src="" alt="" style="max-width: 100%;" />'>Image</option>
                <option value="<blockquote></blockquote>">Quote</option>
                <option value="<div class=''></div>">Div Container</option>
                <option value="<span style=''></span>">Inline Span</option>
                <option value="<br />">Line Break</option>
                <option value="<hr />">Horizontal Rule</option>
                <option value='<table><tr><td></td><td></td></tr></table>'>Table</option>
              </select>
            </div>
          )}
          
          {!isHtmlMode && (
            <div className="flex items-center gap-2">
              <span>Ctrl+S to save state</span>
              <span>•</span>
              <span>Ctrl+Z/Y for undo/redo</span>
            </div>
          )}
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="relative">
        {isPreviewMode ? (
          // Preview Mode
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
          // HTML Source Mode
          <div className="relative">
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={() => saveToHistory(value)}
              className="w-full p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-0 outline-none resize-none"
              style={{ minHeight, maxHeight }}
              placeholder="Enter HTML code directly..."
              spellCheck={false}
            />
            
            {/* HTML Syntax Help */}
            <div className="absolute top-2 right-2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-70 pointer-events-none">
              HTML Mode
            </div>
            
            {/* HTML Help Panel */}
            <div className="absolute bottom-2 left-2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-3 py-2 rounded max-w-xs opacity-90 pointer-events-none">
              <div className="font-medium mb-1">HTML Tips:</div>
              <div>• Use the dropdown above for quick snippets</div>
              <div>• All HTML tags are supported</div>
              <div>• Switch to Preview to see results</div>
            </div>
          </div>
        ) : (
          // Visual Editor Mode
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
            className="p-4 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white overflow-auto resize-none"
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
        
        {/* Placeholder styling */}
        <style jsx>{`
          [contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            pointer-events: none;
            font-style: italic;
          }
          
          [contenteditable] h1 {
            font-size: 2em;
            font-weight: bold;
            margin: 0.67em 0;
          }
          
          [contenteditable] h2 {
            font-size: 1.5em;
            font-weight: bold;
            margin: 0.75em 0;
          }
          
          [contenteditable] h3 {
            font-size: 1.17em;
            font-weight: bold;
            margin: 0.83em 0;
          }
          
          [contenteditable] p {
            margin: 0.5em 0;
          }
          
          [contenteditable] blockquote {
            margin: 1em 0;
            padding: 0.5em 1em;
            border-left: 4px solid #cbd5e0;
            background-color: #f7fafc;
            font-style: italic;
          }
          
          [contenteditable] pre {
            background-color: #2d3748;
            color: #e2e8f0;
            padding: 1em;
            border-radius: 4px;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
          }
          
          [contenteditable] ul, [contenteditable] ol {
            margin: 0.5em 0;
            padding-left: 2em;
          }
          
          [contenteditable] a {
            color: #3182ce;
            text-decoration: underline;
          }
          
          [contenteditable] img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            margin: 0.5em 0;
          }
        `}</style>
      </div>
    </div>
  );
};

export default AdvancedRichTextEditor;
