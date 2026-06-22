import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import ChatSupportDashboard from '../support/ChatSupportDashboard';

export default function Support() {
  const { user } = useAuth();

  // If user is ChatSupport, show the admin dashboard
  if (user?.user_type === 'ChatSupport') {
    return <ChatSupportDashboard />;
  }

  // Otherwise show regular user chat interface
  return <UserChatInterface />;
}

function UserChatInterface() {
  const { user } = useAuth();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    initChat();
  }, []);

  useEffect(() => {
    if (conversation?.id) {
      // Initial fetch
      fetchMessages(conversation.id);
      // Poll every 2 seconds for new messages
      const interval = setInterval(() => fetchMessages(conversation.id), 2000);
      return () => clearInterval(interval);
    }
  }, [conversation?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initChat = async () => {
    try {
      const { data } = await api.get('/chat/conversation');
      setConversation(data.data);
      await fetchMessages(data.data.id);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId) => {
    if (!convId) return;
    try {
      const { data } = await api.get(`/chat/conversations/${convId}/messages`);
      setMessages(data.data || []);
      // Mark as read
      await api.put(`/chat/conversations/${convId}/read`);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedImage) || !conversation) return;

    setSending(true);
    try {
      let imageUrl = null;
      
      if (selectedImage) {
        // Convert image to base64
        const reader = new FileReader();
        imageUrl = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(selectedImage);
        });
      }

      await api.post(`/chat/conversations/${conversation.id}/messages`, {
        message: newMessage || 'Sent an image',
        image_url: imageUrl,
      });
      
      setNewMessage('');
      handleRemoveImage();
      await fetchMessages(conversation.id);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#5DBDAE] to-[#7DCCC4] py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-white text-center">Customer Support</h1>
          <p className="text-white text-center mt-2">We're here to help you 24/7</p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: '600px' }}>
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Brookfield Properties Support</h3>
                <p className="text-xs text-blue-100">
                  {conversation?.status === 'InProgress' ? 'Agent responding...' : 'Online'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span className="text-sm">Active</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex flex-col h-[460px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  <p>Start a conversation with our support team</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender_id === user?.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      {msg.message_type === 'image' && msg.image_url ? (
                        <>
                          <img 
                            src={msg.image_url} 
                            alt="Shared image" 
                            className="rounded max-w-full h-auto max-h-64 mb-2"
                            onClick={() => window.open(msg.image_url, '_blank')}
                            style={{ cursor: 'pointer' }}
                          />
                          {msg.message !== 'Sent an image' && (
                            <p className="text-sm break-words">{msg.message}</p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm break-words">{msg.message}</p>
                      )}
                      <p className={`text-xs mt-1 ${msg.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="border-t p-4">
              {imagePreview && (
                <div className="mb-3 relative inline-block">
                  <img src={imagePreview} alt="Preview" className="max-h-32 rounded border" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                  disabled={sending || uploading}
                  title="Attach image"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={sending || uploading}
                />
                <button
                  type="submit"
                  disabled={sending || uploading || (!newMessage.trim() && !selectedImage)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  )}
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Help Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Quick Help</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Response time: Usually within 5 minutes</li>
            <li>• For urgent issues, please mention "URGENT" in your message</li>
            <li>• Include your transaction ID for faster resolution</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
