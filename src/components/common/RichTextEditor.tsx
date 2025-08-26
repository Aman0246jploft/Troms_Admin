"use client";

import React, { useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter content...",
  className = "",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      // If value is empty or just whitespace, set empty content
      if (!value || value.trim() === '') {
        editorRef.current.innerHTML = '';
      } else {
        // If value doesn't contain HTML tags, wrap in paragraph
        const htmlValue = value.includes('<') ? value : `<p>${value}</p>`;
        editorRef.current.innerHTML = htmlValue;
      }
      console.log("Setting editor HTML:", value);
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      let htmlContent = editorRef.current.innerHTML;
      
      // Ensure content is wrapped in HTML tags
      if (htmlContent && !htmlContent.includes('<') && htmlContent.trim() !== '') {
        // If it's plain text, wrap it in a paragraph
        htmlContent = `<p>${htmlContent}</p>`;
        editorRef.current.innerHTML = htmlContent;
      }
      
      // Clean up empty paragraphs and normalize HTML
      htmlContent = htmlContent
        .replace(/<p><br><\/p>/g, '<p></p>')
        .replace(/<p>\s*<\/p>/g, '')
        .replace(/^<br>/, '')
        .trim();
      
      console.log("Rich editor content:", htmlContent);
      onChange(htmlContent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Enter key to ensure proper paragraph creation
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertHTML', false, '<br><br>');
      return;
    }
    
    // Handle common shortcuts
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
      }
    }
  };

  const execCommand = (command: string, value?: string) => {
    if (editorRef.current) {
      // Ensure we have content to work with
      if (editorRef.current.innerHTML === '' || editorRef.current.innerHTML === '<br>') {
        editorRef.current.innerHTML = '<p><br></p>';
      }
      
      editorRef.current.focus();
      document.execCommand(command, false, value);
      
      // Trigger input handler to update content
      setTimeout(() => handleInput(), 0);
    }
  };

  return (
    <div className={`border border-gray-300 dark:border-gray-600 rounded-md ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-300 dark:border-gray-600 p-2 flex gap-1 flex-wrap bg-gray-50 dark:bg-gray-800">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-700 font-bold"
          title="Bold (Ctrl+B)"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-700 italic"
          title="Italic (Ctrl+I)"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-700 underline"
          title="Underline (Ctrl+U)"
        >
          U
        </button>
        <div className="border-l border-gray-300 dark:border-gray-600 mx-1"></div>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', 'H1')}
          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', 'H2')}
          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', 'P')}
          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Paragraph"
        >
          P
        </button>
        <div className="border-l border-gray-300 dark:border-gray-600 mx-1"></div>
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Bullet List"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Numbered List"
        >
          1.
        </button>
        <div className="border-l border-gray-300 dark:border-gray-600 mx-1"></div>
        <button
          type="button"
          onClick={() => execCommand('justifyLeft')}
          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Align Left"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyCenter')}
          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Align Center"
        >
          ↕
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyRight')}
          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Align Right"
        >
          →
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          // Ensure we have a paragraph when focusing empty editor
          if (editorRef.current && editorRef.current.innerHTML === '') {
            editorRef.current.innerHTML = '<p><br></p>';
            // Place cursor at the beginning
            const range = document.createRange();
            const sel = window.getSelection();
            range.setStart(editorRef.current.firstChild?.firstChild || editorRef.current, 0);
            range.collapse(true);
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        }}
        className="min-h-[200px] p-3 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        style={{ minHeight: '300px' }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />

      {/* Placeholder styling */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
