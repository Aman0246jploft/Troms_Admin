"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import GlobalLoader from "@/components/GlobalLoader";
import AdvancedRichTextEditor from "@/components/common/AdvancedRichTextEditor";
import { TemplatesSection } from "@/components/common/TermsTemplates";
import { useAppDispatch, useAppSelector } from "@/store/hooks/redux";
import {
  updateTermsAndConditions,
  getTermsAndConditions,
} from "@/store/slices/contentManagement";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";

export default function TermsAndConditionsPage() {
  const dispatch = useAppDispatch();
  const { loading, termsAndConditions, error } = useAppSelector(
    (state) => state.contentManagement
  );

  const [content, setContent] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch current terms and conditions on component mount
  useEffect(() => {
    console.log("Fetching terms and conditions...");
    dispatch(getTermsAndConditions());
  }, [dispatch]);

  // Initialize content when terms and conditions is loaded
  useEffect(() => {
    if (termsAndConditions !== null && !isInitialized) {
      const initialContent = termsAndConditions?.content || "";
      console.log("Initializing terms and conditions content:", { termsAndConditions, initialContent });
      setContent(initialContent);
      setIsInitialized(true);
      setHasUserEdited(false);
    }
  }, [termsAndConditions, isInitialized]);

  // Handle content changes from editor
  const handleContentChange = useCallback((newContent: string) => {
    console.log("Editor content changed:", newContent);
    setContent(newContent);
    if (isInitialized) {
      setHasUserEdited(true);
    }
  }, [isInitialized]);

  // Reset to saved content
  const handleReset = useCallback(() => {
    if (termsAndConditions?.content) {
      setContent(termsAndConditions.content);
      setHasUserEdited(false);
      toast.success("Content reset to saved version");
    }
  }, [termsAndConditions?.content]);

  // Force refresh data from server
  const handleRefresh = useCallback(async () => {
    console.log("Refreshing terms and conditions data...");
    setIsInitialized(false);
    try {
      await dispatch(getTermsAndConditions()).unwrap();
      toast.success("Data refreshed from server");
    } catch (error: any) {
      toast.error("Failed to refresh data");
      console.error("Refresh error:", error);
    }
  }, [dispatch]);

  // Handle template insertion
  const handleInsertTemplate = useCallback((template: string) => {
    if (content.trim() && !confirm("This will replace your current content. Are you sure?")) {
      return;
    }
    setContent(template);
    setHasUserEdited(true);
    toast.success("Template inserted successfully");
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    setIsSaving(true);
    try {
      const htmlContent = content.trim();
      console.log("Saving terms and conditions content:", htmlContent);
      
      const result = await dispatch(updateTermsAndConditions({ 
        content: htmlContent 
      })).unwrap();
      
      toast.success("Terms and Conditions updated successfully");
      setHasUserEdited(false);
      
      // Refresh data to get the latest
      await dispatch(getTermsAndConditions());
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save terms and conditions");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <GlobalLoader loading={loading} />
      <PageBreadcrumb pageTitle="Terms and Conditions Management" />

      <div className="space-y-6">
        {/* Status Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  loading ? 'bg-yellow-500 animate-pulse' : 
                  error ? 'bg-red-500' : 
                  isInitialized ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <span className="text-sm font-medium">
                  {loading ? 'Loading...' : 
                   error ? 'Error' : 
                   isInitialized ? 'Ready' : 'Initializing'}
                </span>
              </div>
              
              {termsAndConditions && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Last updated: {new Date(termsAndConditions.updatedAt || termsAndConditions.createdAt).toLocaleString()}
                </div>
              )}
              
              {hasUserEdited && (
                <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                  • Unsaved changes
                </div>
              )}
            </div>
            
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Templates Section */}
        {(!termsAndConditions || !termsAndConditions.content) && (
          <ComponentCard title="Quick Start">
            <TemplatesSection 
              onInsertTemplate={handleInsertTemplate}
              type="terms"
            />
          </ComponentCard>
        )}

        {/* Editor Form */}
        <ComponentCard title="Terms and Conditions Editor">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <AdvancedRichTextEditor
                key={`editor-${termsAndConditions?.id || 'new'}-${isInitialized}`}
                value={content}
                onChange={handleContentChange}
                placeholder="Start writing your terms and conditions content here..."
                className="w-full"
                minHeight="500px"
                maxHeight="800px"
                showPreview={true}
              />
              
              {/* Content status */}
              <div className="mt-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                  <span>
                    {!isInitialized ? "Initializing editor..." :
                     !termsAndConditions ? "No saved content found" :
                     hasUserEdited ? "Content modified" :
                     "Content loaded from database"}
                  </span>
                </div>
                
                <div className="text-xs text-gray-400">
                  {termsAndConditions?.id && `ID: ${termsAndConditions.id}`}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={isSaving || loading || !content.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Terms and Conditions
                  </>
                )}
              </button>
              
              {hasUserEdited && termsAndConditions?.content && (
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isSaving || loading}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset to Saved
                </button>
              )}
              
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isSaving || loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Data
              </button>
            </div>
          </form>
        </ComponentCard>

        {/* Live Preview */}
  

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 text-red-500">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200">Error Loading Terms and Conditions</h4>
                <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

    
      </div>
    </div>
  );
}