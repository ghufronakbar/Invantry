import express from 'express';
import auth from '../useCase/auth/index.js'
import product from '../useCase/admin/product/index.js'
import transaction from '../useCase/admin/transaction/index.js'
const router = express.Router();

router.use('/auth', auth);
router.use('/products', product);
router.use('/transactions', transaction);

export default router