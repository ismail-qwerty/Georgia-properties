import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function ChatSupportDashboard() {
  const { user, logout } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [filter, setFilter] = useState('Open');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchConversations();
  }, [filter]);

  useEffect(() => {
    // Poll conversations every 3 seconds
    const convInterval = setInterval(fetchConversations, 3000);
    return () => clearInterval(convInterval);
  }, [filter]);

  useEffect(() => {
    // Poll messages every 2 seconds when a conversation is selected
    if (selectedConv?.id) {
      const msgInterval = setInterval(() => fetchMessages(selectedConv.id), 2000);
      return () => clearInterval(msgInterval);
    }
  }, [selectedConv?.id]);

  const fetchConversations = async () => {
    try {
      const { data } = await api.get(`/chat/support/conversations?status=${filter}`);
      setConversations(data.data || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId) => {
    try {
      const { data } = await api.get(`/chat/conversations/${convId}/messages`);
      setMessages(data.data || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSelectConversation = async (conv) => {
    setSelectedConv(conv);
    await fetchMessages(conv.id);
    
    if (!conv.support_agent_id) {
      try {
        await api.put(`/chat/support/conversations/${conv.id}/assign`);
        fetchConversations();
      } catch (error) {
        console.error('Failed to assign:', error);
      }
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
    if ((!newMessage.trim() && !selectedImage) || !selectedConv) return;

    try {
      setUploading(true);
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

      await api.post(`/chat/conversations/${selectedConv.id}/messages`, {
        message: newMessage || 'Sent an image',
        image_url: imageUrl,
      });
      
      setNewMessage('');
      handleRemoveImage();
      await fetchMessages(selectedConv.id);
    } catch (error) {
      console.error('Failed to send:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCloseConversation = async () => {
    if (!selectedConv) return;
    try {
      await api.put(`/chat/support/conversations/${selectedConv.id}/close`);
      setSelectedConv(null);
      setMessages([]);
      fetchConversations();
    } catch (error) {
      console.error('Failed to close:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Chat Support Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Agent: {user?.username}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-3 gap-6" style={{ height: 'calc(100vh - 150px)' }}>
          <div className="bg-white rounded-lg shadow flex flex-col">
            <div className="p-4 border-b">
              <h2 className="font-semibold mb-3">Conversations</h2>
              <div className="flex gap-2">
                {['Open', 'InProgress', 'Closed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 py-1 rounded text-sm ${
                      filter === status ? 'bg-blue-600 text-white' : 'bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-400">No conversations</div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedConv?.id === conv.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">{conv.user?.username}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{conv.user?.email}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="col-span-2 bg-white rounded-lg shadow flex flex-col">
            {selectedConv ? (
              <>
                <div className="p-4 border-b flex justify-between bg-blue-600 text-white">
                  <div>
                    <h3 className="font-semibold">{selectedConv.user?.username}</h3>
                    <p className="text-sm">{selectedConv.user?.email}</p>
                  </div>
                  <button
                    onClick={handleCloseConversation}
                    className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
                  >
                    Close
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md px-4 py-2 rounded-lg ${
                          msg.sender_id === user?.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
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
                              <p className="text-sm">{msg.message}</p>
                            )}
                          </>
                        ) : (
                          <p className="text-sm">{msg.message}</p>
                        )}
                        <p className={`text-xs mt-1 ${msg.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t">
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
                      id="support-image-upload"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                      disabled={uploading}
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
                      placeholder="Type response..."
                      className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={uploading}
                    />
                    <button
                      type="submit"
                      disabled={uploading || (!newMessage.trim() && !selectedImage)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {uploading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        'Send'
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Select a conversation
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
