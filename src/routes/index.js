import express from 'express';
import auth from '../useCase/auth/index.js'
import product from '../useCase/product/index.js'
import transaction from '../useCase/transaction/index.js'
import category from '../useCase/category/index.js'
import dashboard from '../useCase/dashboard/index.js'
const router = express.Router();

router.use('/auth', auth);
router.use('/products', product);
router.use('/categories', category);
router.use('/transactions', transaction);
router.use('/dashboard', dashboard);

export default router