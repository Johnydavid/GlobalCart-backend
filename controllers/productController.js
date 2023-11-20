const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require("../middlewares/catchAsyncError")
const APIFeatures = require("../utils/apiFeatures");


// Read all Products - [Get Method] - /api/products
exports.getProducts = async(req, res, next)=>{

    const resPerPage = 2;
    const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter().paginate(resPerPage);

    const products = await apiFeatures.query;
   res.status(200).json({
    success : "true",
    count : products.length,
    products
   }) 
  
    
}


// Create New Product [Post Method]- /api/product/new
exports.newProduct = catchAsyncError( async (req, res, next)=>{
    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product : product
    })
}
)


// Read Single Product [Get Method] - /api/product/:id

exports.getSingleProduct = async(req, res, next)=>{
    const product = await Product.findById(req.params.id)

    if(!product){
      return next(new ErrorHandler('Product Not Found', 400))
       
    }
    res.status(201).json({
        success : true,
        product
    })
}


// Update Product [Put Method] - /api/product/:id'

exports.updateProduct = async(req, res, next)=>{
    let product = await Product.findById(req.params.id)
    if(!product){
        return res.status(404).json({
             success : false,
             message : "Product Not Found"
         })
     }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators : true

     })
     res.status(200).json({
        success: true,
        product
     })
}


// Delete Product [Delete Method] - /api/product/:id'

exports.deleteProduct = async(req, res, next)=>{
    const product = await Product.findById(req.params.id)

    if(!product){
       return res.status(404).json({
            success : false,
            message : "Product Not Found"
        })
    }
    await product.deleteOne();
    
    res.status(200).json({
        success : true,
        message : "Product Deleted"
    })

}
