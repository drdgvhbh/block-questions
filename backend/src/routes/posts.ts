import { Router } from 'express';
import { listConfirmed } from '../services/post';

const router = Router();

router.get('/', listConfirmed);

export { router };
