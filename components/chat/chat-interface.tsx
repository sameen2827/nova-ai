"use client";

import { useState } from "react";

import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ErrorMessage } from "@/components/shared/error-message";
import { PageLoading } from "@/components/shared/loading-spinner";
import { useChatStore } from "@/hooks/use-chat-store";
import { useFileUpload } from "@/hooks/use-file-upload";

export function ChatInterface() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const {
    threads,
    activeThread,
    activeThreadId,
    isGenerating,
    loading,
    error,
    searchQuery,
    inputValue,
    setInputValue,
    setSearchQuery,
    sendMessage,
    regenerateLast,
    stopGeneration,
    newChat,
    selectThread,
    deleteThread,
    reload,
    clearError,
  } = useChatStore();

  const {
    files,
    uploading,
    error: uploadError,
    uploadFiles,
    removeFile,
    clearFiles,
    accept,
  } = useFileUpload(activeThreadId);

  const handleSend = () => {
    const attachmentIds = files.map((f) => f.id);
    const pendingAttachments = [...files];
    void sendMessage(inputValue, attachmentIds, pendingAttachments);
    setInputValue("");
    clearFiles();
  };

  if (loading) return <PageLoading label="Loading conversations…" />;

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <a
        href="#chat-main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to chat
      </a>

      <ChatSidebar
        threads={threads}
        activeThreadId={activeThreadId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewChat={newChat}
        onSelectThread={selectThread}
        onDeleteThread={deleteThread}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div
        id="chat-main"
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
      >
        {error && (
          <div className="p-4">
            <ErrorMessage message={error} onRetry={reload} />
            <button
              type="button"
              onClick={clearError}
              className="mt-2 text-xs text-muted-foreground underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <ChatMessages
          thread={activeThread}
          isGenerating={isGenerating}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSend={handleSend}
          onStop={stopGeneration}
          onRegenerate={regenerateLast}
          onOpenSidebar={() => setMobileSidebarOpen(true)}
          onSuggestionClick={(text) => {
            void sendMessage(text);
          }}
          attachments={files}
          uploading={uploading}
          uploadError={uploadError}
          onUpload={uploadFiles}
          onRemoveAttachment={removeFile}
          accept={accept}
        />
      </div>
    </div>
  );
}
