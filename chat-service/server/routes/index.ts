import express from 'express';
// middlewares
import { encode } from '../middlewares/jwt';
import {User} from '../models/User';

const router = express.Router();

router.post('/login/:userId', encode, async (req: any, res: any) => {
  const user = await User.getUserById(req.params.userId);
  return res.status(200).json({
    success: true,
    authorization: req.authToken,
    user,
  });
});

export default router;
