// import jwt, { JwtPayload } from 'jsonwebtoken';
// // models
// import { User } from '../models/User';


// export const encode = async (req: any, res: any, next: any) => {
//   try {
//     const { userId } = req.params;
//     const user = await User.getUserById(userId);
//     const payload = {
//       userId: user._id,
//       userType: user.type,
//     };
//     const authToken = jwt.sign(payload, process.env.JWT_KEY!);

//     req.authToken = authToken;
//     next();
//   } catch (error: any) {
//     return res.status(400).json({ success: false, message: error.error });
//   }
// };

// export const decode = (req: any, res: any, next: any) => {
//   if (!req.headers['authorization']) {
//     return res
//       .status(400)
//       .json({ success: false, message: 'No access token provided' });
//   }
//   const accessToken = req.headers.authorization.split(' ')[1];
//   try {
//     const decoded = jwt.verify(accessToken, process.env.JWT_KEY!) as JwtPayload;
//     req.userId = decoded.id;
//     req.userType = decoded.type;
//     req.userEmail = decoded.email;
//     console.log(`decode userId :: ${req.userId}`)

//     return next();
//   } catch (error: any) {
//     return res.status(401).json({ success: false, message: error.message });
//   }
// };
