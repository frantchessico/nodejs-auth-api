// import jwt from 'jsonwebtoken';

// const secret = process.env.TOKEN_SECRET_WORD!;
// const pass_secret = process.env.RESET_PASSWORD_TOKEN_SECRET_WORD!;

// interface JwtPayload {
//     userID: string;
//   }

// export const verifyToken = (token: string) => {
//     return jwt.verify(token, secret) as JwtPayload
// }

// export const generateToken = async(_id: string) => {
//       const token = jwt.sign({userID: _id}, secret, {expiresIn: '30min'});
//       return token
// }



// export const resetPasswordVerifyToken = (token: string) => {
//     const pass_token = jwt.verify(token, pass_secret) as JwtPayload
//     return pass_token
// }

// export const resetPasswordToken = async(_id: string) => {
//       const token = jwt.sign({userID: _id}, pass_secret, {expiresIn: '15min'});
//       return token
// }


// export const emailVerificationVerifyToken = (token: string) => {
//     const pass_token = jwt.verify(token, pass_secret) as JwtPayload
//     return pass_token
// }

// export const emailVerificationToken = async(_id: string) => {
//       const token = jwt.sign({userID: _id}, pass_secret, {expiresIn: '10min'});
//       return token
// }




import jwt from 'jsonwebtoken';

interface JwtPayload {
  userID: string;
}

interface TokenOptions {
  expiresIn: string;
}
const secre_default = process.env.TOKEN_SECRET_WORD!
const secret_reset_password = process.env.RESET_PASSWORD_TOKEN_SECRET_WORD!
const secret_email_verification = process.env.EMAIL_VERIFICATION_SECRET!
export const getSecret = (type: 'default' | 'resetPassword' | 'emailVerification') => {
  switch (type) {
    case 'default':
      return secre_default;
    case 'resetPassword':
      return secret_reset_password;
    case 'emailVerification':
      return secret_email_verification;
    default:
      return 'unrecognized token type.';
  }
}

export const verifyToken = (token: string, type: 'default' | 'resetPassword' | 'emailVerification'): JwtPayload => {
  const secret = getSecret(type);
  return jwt.verify(token, secret) as JwtPayload;
}

export const generateToken = async (_id: string, type: 'default' | 'resetPassword' | 'emailVerification', options: TokenOptions = { expiresIn: '30min' }): Promise<string> => {
  const secret = getSecret(type);
  const token = jwt.sign({ userID: _id }, secret, { expiresIn: options.expiresIn });
  return token;
}
