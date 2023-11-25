const catchAsyncError = require("../middlewares/catchAsyncError");
const orderModel = require("../models/orderModel");
const Order = require("../models/orderModel");
const ErrorHandler = require("../utils/errorHandler");


// Create New Order [Post Method] /api/order/new
exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user.id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});


// Get Single Order  - [GET Method] /api/order/:id

exports.getSingleOrder = catchAsyncError(async(req, res, next)=>{
const order = await Order.findById(req.params.id).populate('user', 'name, email')

if(!order){
  return next(new ErrorHandler(`Order not Found with this id: ${req.params.id}`, 404))

}
res.status(200).json({
  success: true,
  order
})

})


// Get Loggedin User Order [Get Method] /api/myorders


exports.myOrders = catchAsyncError(async(req, res, next)=>{
  const orders = await Order.find({user: req.user.id});

  res.status(200).json({
    success: true,
    orders
  })
})


// Admin : Get All Orders [Get Method]  /api/orders

exports.orders = catchAsyncError(async(req, res, next)=>{
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach(order=>{
    totalAmount +=   order.totalPrice
  })

  res.status(200).json({
    success: true,
    totalAmount,
    orders
  })
})

// Admin: Update Order / Order Status [Put Method] /api/order/:id

exports.updateOrder = catchAsyncError(async (req, res, next)=>{
  const order = await Order.findById(req.params.id);
  if(order.orderStatus == 'Delivered'){
    return next(new ErrorHandler('Order has been already Delivered'), 400)
  }
  
})