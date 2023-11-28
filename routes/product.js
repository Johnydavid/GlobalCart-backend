const express = require('express');
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createReview, getReviews, deleteReview } = require('../controllers/productController');
const router = express.Router();
const {isAuthenticatedUser, authoriseRoles} = require("../middlewares/authenticate");




router.route('/products').get( getProducts)
router.route('/product/:id').get(getSingleProduct)
router.route('/product/:id').delete(deleteProduct)
router.route('/review').post(isAuthenticatedUser, createReview)
router.route('/reviews').get(getReviews)
router.route('/review').delete(isAuthenticatedUser,deleteReview)



// /Admin Routes
router.route('/admin/product/new').post(isAuthenticatedUser, authoriseRoles('admin'), newProduct)
router.route('/admin/product/:id').put(isAuthenticatedUser, authoriseRoles('admin'), updateProduct)


    
    

module.exports = router;