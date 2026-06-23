import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function getReferenceCodes() {
  try {
    console.log('Fetching active users with reference codes...\n');
    
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, reference_code, user_status, email')
      .eq('user_status', 'Active')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    if (!users || users.length === 0) {
      console.log('No active users found in database.');
      console.log('\n📝 You need to create at least one user first!');
      return;
    }

    console.log(`Found ${users.length} active users:\n`);
    console.log('─'.repeat(100));
    console.log('USERNAME'.padEnd(20), 'REFERENCE CODE'.padEnd(20), 'EMAIL'.padEnd(30), 'STATUS');
    console.log('─'.repeat(100));

    users.forEach(user => {
      console.log(
        user.username.padEnd(20),
        user.reference_code.padEnd(20),
        user.email.padEnd(30),
        user.user_status
      );
    });

    console.log('─'.repeat(100));
    console.log(`\n✅ Use any of the above reference codes to register new users.`);
    console.log(`\n📋 Example: Use reference code "${users[0].reference_code}" from user "${users[0].username}"`);
  } catch (error) {
    console.error('Error:', error);
  }
}

getReferenceCodes().then(() => {
  console.log('\nDone!');
  process.exit(0);
});
