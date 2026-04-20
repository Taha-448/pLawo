const { supabase } = require('./config/supabase');

async function run() {
  const { data, error } = await supabase
    .from('User')
    .upsert(
      {
        email: 'admin@demo.com',
        name: 'System Admin',
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
