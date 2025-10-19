const bcrypt = require('bcrypt');

// Generar hash para la contraseña "password123"
const password = 'password123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error al generar hash:', err);
    return;
  }
  
  console.log('\n===========================================');
  console.log('Hash generado para la contraseña: password123');
  console.log('===========================================\n');
  console.log(hash);
  console.log('\n===========================================');
  console.log('Copia este hash y reemplázalo en seed.sql');
  console.log('===========================================\n');
});
