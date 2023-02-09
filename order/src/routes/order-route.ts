import { validateRequest } from '@rx-ecommerce-chat/common_lib';
import express from 'express';
import { OrderDomain } from '../domain/order-domain';
import { verifyCustomerToken, verifyToken, verifyVendorToken } from '../middlewares/current-user';


const router = express.Router();

// Order create
router.post('/api/order/create',verifyCustomerToken,validateRequest,OrderDomain.createOrder);

// Order create
router.post('/api/order/product/create',verifyCustomerToken,validateRequest,OrderDomain.productOrder);


// delete product from Order
router.get('/api/order/getorder/:id',verifyCustomerToken,OrderDomain.getSignleOrder);

// get all Order
router.get('/api/order/get',verifyToken,OrderDomain.getOrder);
router.get('/api/order/revenue',OrderDomain.revenue);
router.get('/api/order/totalorderbusinesscateg',OrderDomain.totalOrderFromEachBusinessCategory);
router.get('/api/order/totalrevnuebusinesscateg',OrderDomain.totalRevnueFromEachBusinessCategory);
router.get('/api/order/totalsalebusinessuserbased/:id',OrderDomain.totalSaleBusinessUserBased);
router.get('/api/order/totalcustomer/:id',OrderDomain.totalCustomerBasedBusinessUser);


router.get('/api/order/coupon/:id',verifyToken,OrderDomain.couponSuggestion);
router.post('/api/order/coupon/apply',verifyToken,OrderDomain.applyCoupon);
export { router as OrderRouter };
