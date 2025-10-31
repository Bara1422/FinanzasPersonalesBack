import { Router } from 'express';
import { getCategory } from '../controllers/categorias.controller';

const router = Router();

router.get('/', getCategory);

export default router;