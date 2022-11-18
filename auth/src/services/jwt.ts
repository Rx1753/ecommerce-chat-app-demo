import jwt from 'jsonwebtoken';

export class JwtService {
  static  accessToken = async (payload: object, jwtKey : string) => {
    return jwt.sign(payload, process.env.JWT_KEY!, { expiresIn: '15' });
  };

  static refreshToken = async (payload: object, jwtKey : string) => {
    return jwt.sign(payload, process.env.JWT_KEY!, { expiresIn: '1d' });
  };
}
