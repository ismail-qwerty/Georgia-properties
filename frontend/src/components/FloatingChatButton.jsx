import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

export default function FloatingChatButton() {
  const location = useLocation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const pollRef = useRef(null);

  const isAdminOrSupport = user?.user_type === 'Admin' || user?.user_type === 'ChatSupport';
  const isHiddenPage = location.pathname === '/support' || location.pathname.startsWith('/administration');

  // Listen for external open trigger (from Contact nav buttons)
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-chat-widget', handler);
    return () => window.removeEventListener('open-chat-widget', handler);
  }, []);

  // Poll unread count when widget is closed
  useEffect(() => {
    if (!user || isAdminOrSupport || isHiddenPage) return;
    const interval = setInterval(async () => {
      if (!open) {
        try {
          const { data } = await api.get('/chat/unread-count');
          setUnreadCount(data.data || 0);
        } catch {}
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [user, open, isHiddenPage]);

  // Init chat when widget opens
  useEffect(() => {
    if (open && !conversation) {
      initChat();
    }
    if (open && conversation?.id) {
      startPolling(conversation.id);
    }
    if (!open) {
      stopPolling();
    }
    return () => stopPolling();
  }, [open, conversation?.id]);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const initChat = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/chat/conversation');
      setConversation(data.data);
      await fetchMessages(data.data.id);
    } catch (e) {
      console.error('Chat init failed', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId) => {
    if (!convId) return;
    try {
      const { data } = await api.get(`/chat/conversations/${convId}/messages`);
      setMessages(data.data || []);
      setUnreadCount(0);
      await api.put(`/chat/conversations/${convId}/read`);
    } catch {}
  };

  const startPolling = (convId) => {
    stopPolling();
    pollRef.current = setInterval(() => fetchMessages(convId), 2000);
  };

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return; }
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedImage) || !conversation) return;
    setSending(true);
    try {
      let imageUrl = null;
      if (selectedImage) {
        const reader = new FileReader();
        imageUrl = await new Promise((res, rej) => {
          reader.onloadend = () => res(reader.result);
          reader.onerror = rej;
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
    } catch {
      alert('Failed to send. Try again.');
    } finally {
      setSending(false);
    }
  };

  if (!user || isAdminOrSupport || isHiddenPage) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#5DBDAE] hover:bg-[#4da89a] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
        title="Customer Support"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        )}
        {!open && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Chat Widget */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50" style={{ height: '480px' }}>
          {/* Header */}
          <div className="bg-[#5DBDAE] text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">Brookfield Support</p>
                <p className="text-xs text-white/80">
                  {conversation?.status === 'InProgress' ? 'Agent responding...' : '● Online'}
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5DBDAE]"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm text-center px-4">
                <svg className="w-10 h-10 mb-2 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd" />
                </svg>
                <p>How can we help you today?</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${msg.sender_id === user?.id ? 'bg-[#5DBDAE] text-white rounded-br-none' : 'bg-white text-gray-800 shadow-sm rounded-bl-none'}`}>
                    {msg.message_type === 'image' && msg.image_url ? (
                      <>
                        <img src={msg.image_url} alt="img" className="rounded max-w-full h-auto max-h-40 mb-1 cursor-pointer" onClick={() => window.open(msg.image_url, '_blank')} />
                        {msg.message !== 'Sent an image' && <p>{msg.message}</p>}
                      </>
                    ) : (
                      <p className="break-words">{msg.message}</p>
                    )}
                    <p className={`text-xs mt-1 ${msg.sender_id === user?.id ? 'text-white/70' : 'text-gray-400'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="border-t bg-white px-3 py-2 flex-shrink-0">
            {imagePreview && (
              <div className="mb-2 relative inline-block">
                <img src={imagePreview} alt="preview" className="max-h-16 rounded border" />
                <button type="button" onClick={handleRemoveImage} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">✕</button>
              </div>
            )}
            <div className="flex gap-2 items-center">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="text-gray-400 hover:text-gray-600" disabled={sending}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5DBDAE]"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || (!newMessage.trim() && !selectedImage)}
                className="w-8 h-8 bg-[#5DBDAE] hover:bg-[#4da89a] disabled:opacity-40 text-white rounded-full flex items-center justify-center flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
