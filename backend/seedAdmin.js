const { supabase } = require('./config/supabase');
const bcrypt = require('bcryptjs');

async function run() {
  const salt = await bcrypt.genSalt(10);
  const h = await bcrypt.hash('password123', salt);
  
  const { data, error } = await supabase
    .from('User')
    .upsert(
      {
        email: 'admin@demo.com',
        name: 'System Admin',
        password: h,
        role: 'ADMIN'
      },
      { onConflict: 'email' }
    );

  if (error) {
    console.error('Error seeding admin:', error);
  } else {
    console.log('Admin user seeded securely.');
  }
}

run().catch(console.error);
