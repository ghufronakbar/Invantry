import express from 'express';
import account from '../useCase/account/index.js'
import product from '../useCase/product/index.js'
import transaction from '../useCase/transaction/index.js'
import category from '../useCase/category/index.js'
import dashboard from '../useCase/dashboard/index.js'
import record from '../useCase/record/index.js'
import user from '../useCase/user/index.js'
const router = express.Router();

router.use('/account', account);
router.use('/products', product);
router.use('/categories', category);
router.use('/transactions', transaction);
router.use('/dashboard', dashboard);
router.use('/records', record);
router.use('/users', user);

export default router