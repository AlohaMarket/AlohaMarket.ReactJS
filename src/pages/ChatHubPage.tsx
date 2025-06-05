import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useApp';
import { useChat } from '@/contexts/ChatContext';
import { ConversationList } from '@/components/chat/ConversationList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { NewChatDialog } from '@/components/chat/NewChatDialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, Plus, Settings, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ChatHubPage() {
    const { t } = useTranslation();
    const { isAuthenticated, user } = useAuth();
    const {
        conversations,
        activeConversation,
        connection,
        isLoading,
        setActiveConversation,
    } = useChat();

    const [showNewChatDialog, setShowNewChatDialog] = useState(false);
    const [isMobileConversationListOpen, setIsMobileConversationListOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            // Redirect to login if not authenticated
            window.location.href = '/login';
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h2 className="mt-4 text-lg font-medium text-gray-900">
                        {t('chat.pleaseLogin')}
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        {t('chat.loginRequired')}
                    </p>
                    <Button
                        onClick={() => window.location.href = '/login'}
                        className="mt-4"
                    >
                        {t('auth.login')}
                    </Button>
                </div>
            </div>
        );
    }

    if (isLoading && conversations.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="h-screen flex bg-gray-50">
            {/* Mobile conversation list overlay */}
            {isMobileConversationListOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setIsMobileConversationListOpen(false)}
                />
            )}

            {/* Sidebar - Conversation List */}
            <div className={`
        ${isMobileConversationListOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed inset-y-0 left-0 z-30 w-80 bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0 md:z-0
      `}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-2">
                            <MessageCircle className="h-6 w-6 text-primary-500" />
                            <h1 className="text-lg font-semibold text-gray-900">
                                {t('chat.title')}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowNewChatDialog(true)}
                                className="p-2"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="p-2"
                                onClick={() => {/* Open settings */ }}
                            >
                                <Settings className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Connection Status */}
                    {!connection.isConnected && (
                        <div className="p-3 bg-yellow-50 border-b border-yellow-200">
                            <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 bg-yellow-400 rounded-full animate-pulse" />
                                <span className="text-sm text-yellow-700">
                                    {t('chat.connecting')}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* User Info */}
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-medium">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {connection.isConnected ? t('chat.online') : t('chat.offline')}
                                </p>
                            </div>
                            <div className={`h-3 w-3 rounded-full ${connection.isConnected ? 'bg-green-400' : 'bg-gray-400'
                                }`} />
                        </div>
                    </div>

                    {/* Conversations */}
                    <div className="flex-1 overflow-hidden">
                        <ConversationList
                            conversations={conversations}
                            activeConversation={activeConversation}
                            onSelectConversation={(conversation) => {
                                setActiveConversation(conversation);
                                setIsMobileConversationListOpen(false);
                            }}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col md:min-w-0">
                {/* Mobile header */}
                <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsMobileConversationListOpen(true)}
                        className="p-2"
                    >
                        <Users className="h-4 w-4" />
                    </Button>
                    {activeConversation && (
                        <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                                {activeConversation.participants
                                    .filter(p => p.id !== user?.id)
                                    .map(p => p.name)
                                    .join(', ')
                                }
                            </span>
                        </div>
                    )}
                    <div /> {/* Spacer */}
                </div>

                {/* Chat Window */}
                {activeConversation ? (
                    <ChatWindow
                        conversation={activeConversation}
                        className="flex-1"
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-white">
                        <div className="text-center max-w-md mx-auto p-6">
                            <MessageCircle className="mx-auto h-16 w-16 text-gray-300" />
                            <h2 className="mt-4 text-xl font-medium text-gray-900">
                                {t('chat.selectConversation')}
                            </h2>
                            <p className="mt-2 text-gray-500">
                                {t('chat.selectConversationDesc')}
                            </p>
                            <Button
                                onClick={() => setShowNewChatDialog(true)}
                                className="mt-6"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {t('chat.startNewChat')}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* New Chat Dialog */}
            <NewChatDialog
                open={showNewChatDialog}
                onClose={() => setShowNewChatDialog(false)}
                onConversationCreated={(conversation) => {
                    setActiveConversation(conversation);
                    setShowNewChatDialog(false);
                }}
            />
        </div>
    );
}