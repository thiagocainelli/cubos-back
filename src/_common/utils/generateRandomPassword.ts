export const generateRandomPassword = (): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'; 
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
  const numbers = '0123456789'; 
  const special = '!@#$%*'; 

  const allCharacters = lowercase + uppercase + numbers + special;


  const randomLowercase = lowercase.charAt(
    Math.floor(Math.random() * lowercase.length), 
  );
  const randomUppercase = uppercase.charAt(
    Math.floor(Math.random() * uppercase.length),
  );
  const randomNumber = numbers.charAt(
    Math.floor(Math.random() * numbers.length), 
  );
  const randomSpecial = special.charAt(
    Math.floor(Math.random() * special.length), 
  );

  const remainingLength = 5; 
  let remainingCharacters = '';
  for (let i = 0; i < remainingLength; i++) {
    remainingCharacters += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
  }

  const password =
    randomLowercase + randomUppercase + randomNumber + randomSpecial + remainingCharacters;

  return password
    .split('') 
    .sort(() => Math.random() - 0.5)
    .join('');
};
