const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require("../middlewares/catchAsyncError")
const APIFeatures = require("../utils/apiFeatures");


// Read all Products - [Get Method] - /api/products
exports.getProducts = async(req, res, next)=>{

    const resPerPage = 4;
    

    let buildQuery = ()=>{
        return new APIFeatures(Product.find(), req.query).search().filter()
    }

    const filteredProductsCount = await buildQuery().query.countDocuments({});

    const totalProductsCount = await Product.countDocuments({});

    let productsCount = totalProductsCount

    if(filteredProductsCount !== totalProductsCount){
        productsCount = filteredProductsCount

    }

    const products = await buildQuery().paginate(resPerPage).query;

    // await new Promise (resolve=> setTimeout(resolve, 3000))
    // return next(new ErrorHandler("Unable to send Products!", 400))
   res.status(200).json({
    success : "true",
    count : productsCount,
    resPerPage,
    products
   }) 
  
    
}


//Admin: Create New Product [Post Method]- /api/admin/product/new
exports.newProduct = catchAsyncError( async (req, res, next)=>{
    req.body.user = req.user.id
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
    // await new Promise(resolve=>setTimeout(resolve, 3000))
    res.status(201).json({
        success : true,
        product
    })
}


// Admin: Update Product [Put Method] - /api/admin/product/:id'

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


// Create Review -[Post Method] /api/review

exports.createReview = catchAsyncError(async(req, res,next)=>{
    const {productId, rating, comment} = req.body;

    const review={
        user: req.user.id,
         rating,
         comment

    }

    const product = await Product.findById(productId);

    // Finding if user already reviewed
    const isReviewed = product.reviews.find(review=>{
      return  review.user.toString() == req.user.id.toString()
    })
    if(isReviewed){
        // Updating the Reviews
product.reviews.forEach(review=>{
    if(review.user.toString() ==  req.user.id.toString()){
        review.comment = comment
        review.rating = rating
    }
})


    }else{
        // Creating the Reviews
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // Find the average of the Product Reviews
    product.ratings = product.reviews.reduce((acc, review)=>{
        return review.rating + acc;
    },0) / product.reviews.length;

    product.ratings = isNaN(product.ratings)?0:product.ratings

    await product.save({validateBeforeSave: false})

    res.status(200).json({
        success: true
    })

        
})


// Get Reviews [ Get Method]  /api/reviews?id={productId}

exports.getReviews = catchAsyncError(async(req, res, next)=>{
    const product = await Product.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})


// Delete Review  [Delete Method]  /api/review/

exports.deleteReview = catchAsyncError(async(req, res, next)=>{
    const product = await Product.findById(req.query.productId);

    // Filering the Reviews which does  match the Deleting Review Id

    const reviews = product.reviews.filter(review=>{
        return review._id.toString() !== req.query.id.toString()
    })

    // Updating Number of Reviews
    const numOfReviews = reviews.length;

    // Finding the Average with the filtered Reviews

let ratings = reviews.reduce((acc, review)=>{
        return review.rating + acc;
    },0) / product.reviews.length;

    ratings = isNaN(ratings)?0:ratings;

    // Saving the product documents

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        numOfReviews,
        ratings
    })

    res.status(200).json({
        success: true
    })
})


