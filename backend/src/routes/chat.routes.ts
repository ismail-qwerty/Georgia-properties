import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// User routes
router.get('/conversation', ChatController.getUserConversation);
router.get('/conversations/:conversationId/messages', ChatController.getMessages);
router.post('/conversations/:conversationId/messages', ChatController.sendMessage);
router.put('/conversations/:conversationId/read', ChatController.markAsRead);
router.get('/unread-count', ChatController.getUnreadCount);

// Support agent routes
router.get('/support/conversations', ChatController.getAllConversations);
router.put('/support/conversations/:conversationId/assign', ChatController.assignConversation);
router.put('/support/conversations/:conversationId/close', ChatController.closeConversation);

export default router;
