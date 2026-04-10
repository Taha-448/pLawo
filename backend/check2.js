const { execSync } = require('child_process');
try {
  let out = execSync('npx prisma validate', { env: { ...process.env, NO_COLOR: '1' }, stdio: 'pipe' });
  console.log(out.toString());
} catch(e) {
  console.log('STDOUT:');
  console.log(e.stdout.toString());
  console.log('STDERR:');
  console.log(e.stderr.toString());
}
