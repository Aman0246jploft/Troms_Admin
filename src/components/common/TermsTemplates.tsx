"use client";

import React from 'react';

export const termsAndConditionsTemplate = `
<h1>Terms and Conditions</h1>
<p><em>Last updated: ${new Date().toLocaleDateString()}</em></p>

<h2>1. Acceptance of Terms</h2>
<p>By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.</p>

<h2>2. Use License</h2>
<p>Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
<ul>
  <li>modify or copy the materials;</li>
  <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial);</li>
  <li>attempt to decompile or reverse engineer any software contained on our website;</li>
  <li>remove any copyright or other proprietary notations from the materials.</li>
</ul>

<h2>3. Disclaimer</h2>
<p>The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

<h2>4. Limitations</h2>
<p>In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website, even if we or our authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.</p>

<h2>5. User Accounts</h2>
<div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 16px; margin: 16px 0;">
  <h3>Account Registration</h3>
  <p>To access certain features of our service, you may be required to create an account. You agree to:</p>
  <ul>
    <li>Provide accurate, current, and complete information</li>
    <li>Maintain and update your information to keep it accurate</li>
    <li>Maintain the security of your password</li>
    <li>Accept all risks of unauthorized access to your account</li>
  </ul>
</div>

<h2>6. Privacy Policy</h2>
<p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our service. By using our service, you agree to the collection and use of information in accordance with our Privacy Policy.</p>

<h2>7. Prohibited Uses</h2>
<p>You may not use our service:</p>
<ol>
  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
  <li>To submit false or misleading information</li>
</ol>

<h2>8. Termination</h2>
<p>We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>

<blockquote>
  <p><strong>Important:</strong> If you wish to terminate your account, you may simply discontinue using the service.</p>
</blockquote>

<h2>9. Changes to Terms</h2>
<p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.</p>

<h2>10. Contact Information</h2>
<p>If you have any questions about these Terms and Conditions, please contact us at:</p>
<table style="width: 100%; max-width: 400px; border-collapse: collapse; margin: 16px 0;">
  <tr>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-weight: bold; background-color: #f9fafb;">Email:</td>
    <td style="padding: 8px 12px; border: 1px solid #ddd;">support@yourcompany.com</td>
  </tr>
  <tr>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-weight: bold; background-color: #f9fafb;">Phone:</td>
    <td style="padding: 8px 12px; border: 1px solid #ddd;">(555) 123-4567</td>
  </tr>
  <tr>
    <td style="padding: 8px 12px; border: 1px solid #ddd; font-weight: bold; background-color: #f9fafb;">Address:</td>
    <td style="padding: 8px 12px; border: 1px solid #ddd;">123 Business St, City, State 12345</td>
  </tr>
</table>

<hr style="margin: 32px 0; border: none; border-top: 2px solid #e5e7eb;" />
<p style="text-align: center; color: #6b7280; font-size: 14px;">
  <em>These terms and conditions are effective as of ${new Date().toLocaleDateString()}</em>
</p>
`.trim();

export const privacyPolicyTemplate = `
<h1>Privacy Policy</h1>
<p><em>Last updated: ${new Date().toLocaleDateString()}</em></p>

<h2>Information We Collect</h2>
<p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.</p>

<h3>Types of Information</h3>
<ul>
  <li><strong>Personal Information:</strong> Name, email address, phone number</li>
  <li><strong>Usage Data:</strong> How you interact with our service</li>
  <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
</ul>

<h2>How We Use Your Information</h2>
<div style="background-color: #f0fdf4; border: 1px solid #16a34a; border-radius: 8px; padding: 16px; margin: 16px 0;">
  <p>We use the information we collect to:</p>
  <ol>
    <li>Provide, maintain, and improve our services</li>
    <li>Process transactions and send related information</li>
    <li>Send technical notices and support messages</li>
    <li>Respond to your comments and questions</li>
  </ol>
</div>

<h2>Information Sharing</h2>
<p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this privacy policy.</p>

<h2>Data Security</h2>
<p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

<h2>Your Rights</h2>
<p>You have the right to:</p>
<ul>
  <li>Access your personal information</li>
  <li>Correct inaccurate information</li>
  <li>Delete your personal information</li>
  <li>Object to processing of your information</li>
</ul>

<h2>Contact Us</h2>
<p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:privacy@yourcompany.com">privacy@yourcompany.com</a></p>
`.trim();

interface TemplateButtonProps {
  label: string;
  template: string;
  onInsert: (template: string) => void;
  description?: string;
}

export const TemplateButton: React.FC<TemplateButtonProps> = ({ 
  label, 
  template, 
  onInsert, 
  description 
}) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900 dark:text-gray-100">{label}</h4>
        <button
          onClick={() => onInsert(template)}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Insert Template
        </button>
      </div>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      )}
    </div>
  );
};

interface TemplatesSectionProps {
  onInsertTemplate: (template: string) => void;
  type: 'terms' | 'privacy';
}

export const TemplatesSection: React.FC<TemplatesSectionProps> = ({ 
  onInsertTemplate, 
  type 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        Quick Start Templates
      </h3>
      
      {type === 'terms' ? (
        <TemplateButton
          label="Complete Terms and Conditions"
          template={termsAndConditionsTemplate}
          onInsert={onInsertTemplate}
          description="A comprehensive terms and conditions template covering user agreements, licensing, privacy, and contact information."
        />
      ) : (
        <TemplateButton
          label="Complete Privacy Policy"
          template={privacyPolicyTemplate}
          onInsert={onInsertTemplate}
          description="A comprehensive privacy policy template covering data collection, usage, sharing, and user rights."
        />
      )}
      
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Template Usage Tips:</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Customize the template with your company information</li>
          <li>• Review all sections and modify as needed for your business</li>
          <li>• Update contact information and dates</li>
          <li>• Consider consulting with legal professionals for compliance</li>
        </ul>
      </div>
    </div>
  );
};

export default TemplatesSection;
