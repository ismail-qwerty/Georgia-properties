-- Add image_url column to chat_messages table
ALTER TABLE chat_messages 
ADD COLUMN image_url TEXT NULL;

-- Add message_type column to distinguish text vs image messages
ALTER TABLE chat_messages 
ADD COLUMN message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image'));

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'chat_messages' 
AND column_name IN ('image_url', 'message_type');
