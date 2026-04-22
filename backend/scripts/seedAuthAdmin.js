const { supabase } = require('./config/supabase');

async function createAdmin() {
  const email = 'admin@demo.com';
  const password = 'password123';
  const name = 'System Admin';

  console.log(`Attempting to create admin user: ${email}`);

  // 1. Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, role: 'ADMIN' }
  });

  if (authError) {
    if (authError.message.includes('already registered')) {
      console.log('User already exists in Supabase Auth. Updating role in database...');
      // Get the user ID if it exists
      const { data: existingUsers } = await supabase.from('users').select('id').eq('email', email);
      if (existingUsers && existingUsers.length > 0) {
        const userId = existingUsers[0].id;
        await updateRole(userId);
      }
    } else {
      console.error('Error creating auth user:', authError.message);
    }
    return;
  }

  console.log('Auth user created successfully:', authData.user.id);

  // 2. The trigger should have created the record in public.users. 
  // Let's wait a moment and then update its role.
  setTimeout(async () => {
    await updateRole(authData.user.id);
  }, 2000);
}

async function updateRole(userId) {
  const { error: dbError } = await supabase
    .from('users')
    .update({ role: 'ADMIN' })
    .eq('id', userId);

  if (dbError) {
    console.error('Error updating role in users table:', dbError.message);
    // Fallback: If trigger didn't work, insert manually
    const { error: insertError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: 'admin@demo.com',
        name: 'System Admin',
        role: 'ADMIN'
      });
    if (insertError) console.error('Manual insert also failed:', insertError.message);
    else console.log('Admin role set via manual upsert.');
  } else {
    console.log('Admin role successfully set in User table.');
  }
}

createAdmin().catch(console.error);
