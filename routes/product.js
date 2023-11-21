const express = require('express');
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const router = express.Router();
const {isAuthenticatedUser, authoriseRoles} = require("../middlewares/authenticate");




router.route('/products').get(isAuthenticatedUser, getProducts)

router.route('/product/:id').get(getSingleProduct)
router.route('/product/:id').put(updateProduct)
router.route('/product/:id').delete(deleteProduct)


// /Admin Routes
router.route('/admin/product/new').post(isAuthenticatedUser, authoriseRoles('admin'), newProduct)


    
    

module.exports = router;