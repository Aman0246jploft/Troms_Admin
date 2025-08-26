"use client";

import React, { useState } from 'react';
import AdvancedRichTextEditor from './AdvancedRichTextEditor';

const HtmlEditorDemo: React.FC = () => {
  const [content, setContent] = useState(`
<h1>Welcome to the Privacy Policy</h1>
<p>This is a sample privacy policy with <strong>rich formatting</strong> and <em>HTML support</em>.</p>

<h2>Data Collection</h2>
<p>We collect the following types of information:</p>
<ul>
  <li>Personal information you provide</li>
  <li>Usage data and analytics</li>
  <li>Device and browser information</li>
</ul>

<h2>How We Use Your Data</h2>
<ol>
  <li>To provide and improve our services</li>
  <li>To communicate with you</li>
  <li>To ensure security and prevent fraud</li>
</ol>

<blockquote>
  <p>"Your privacy is important to us. We are committed to protecting your personal information."</p>
</blockquote>

<h3>Contact Information</h3>
<p>If you have questions about this policy, contact us at:</p>
<p>
  <strong>Email:</strong> <a href="mailto:privacy@example.com">privacy@example.com</a><br/>
  <strong>Phone:</strong> (555) 123-4567
</p>

<div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 16px; margin: 16px 0;">
  <p><strong>Note:</strong> This policy is effective as of January 1, 2024.</p>
</div>
  `.trim());

  // Sample HTML templates for quick reference
  const htmlTemplates = [
    {
      name: "Basic Structure",
      code: `<h1>Title</h1>
<p>Your content here...</p>`
    },
    {
      name: "List with Links", 
      code: `<ul>
  <li><a href="#section1">Section 1</a></li>
  <li><a href="#section2">Section 2</a></li>
</ul>`
    },
    {
      name: "Styled Box",
      code: `<div style="background-color: #f8f9fa; border-left: 4px solid #007bff; padding: 15px; margin: 10px 0;">
  <h4>Important Notice</h4>
  <p>This is an important message.</p>
</div>`
    },
    {
      name: "Table",
      code: `<table style="width: 100%; border-collapse: collapse;">
  <tr>
    <th style="border: 1px solid #ddd; padding: 8px;">Header 1</th>
    <th style="border: 1px solid #ddd; padding: 8px;">Header 2</th>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">Data 1</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Data 2</td>
  </tr>
</table>`
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4">HTML Editor Capabilities</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Features:</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>✅ <strong>Visual Editor</strong> - WYSIWYG editing with toolbar</li>
              <li>✅ <strong>HTML Source Mode</strong> - Direct HTML code editing</li>
              <li>✅ <strong>Live Preview</strong> - See results instantly</li>
              <li>✅ <strong>Quick HTML Templates</strong> - Common elements dropdown</li>
              <li>✅ <strong>Custom HTML Insertion</strong> - Add any HTML code</li>
              <li>✅ <strong>Rich Formatting</strong> - Bold, italic, headings, lists</li>
              <li>✅ <strong>Links & Images</strong> - Easy insertion with prompts</li>
              <li>✅ <strong>Text Colors</strong> - Custom color picker</li>
              <li>✅ <strong>Undo/Redo</strong> - Full history management</li>
              <li>✅ <strong>Keyboard Shortcuts</strong> - Ctrl+B, I, U, Z, Y</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">HTML Templates:</h3>
            <div className="space-y-3">
              {htmlTemplates.map((template, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded p-3">
                  <h4 className="font-medium text-sm mb-2">{template.name}</h4>
                  <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto">
                    {template.code}
                  </pre>
                  <button
                    onClick={() => setContent(prev => prev + '\n\n' + template.code)}
                    className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    Insert
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">How to Use HTML Mode:</h4>
          <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>1. Click the "HTML" button in the toolbar to switch to HTML source mode</li>
            <li>2. Type or paste HTML code directly into the editor</li>
            <li>3. Use the "Quick HTML" dropdown for common elements</li>
            <li>4. Click "Preview" to see how your HTML renders</li>
            <li>5. Switch back to "Visual" mode for WYSIWYG editing</li>
          </ol>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Try the Editor:</h3>
        <AdvancedRichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Start creating your content..."
          minHeight="600px"
          maxHeight="800px"
          showPreview={true}
        />
      </div>
    </div>
  );
};

export default HtmlEditorDemo;
