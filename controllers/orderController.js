const catchAsyncError = require("../middlewares/catchAsyncError");
const Order = require("../models/orderModel");
const ErrorHandler = require("../utils/errorHandler");
const Product = require("../models/productModel");

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

exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name, email"
  );

  if (!order) {
    return next(
      new ErrorHandler(`Order not Found with this id: ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    order,
  });
});

// Get Loggedin User Order [Get Method] /api/myorders

exports.myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Admin : Get All Orders [Get Method]  /api/orders

exports.orders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalOrdersCount: orders.length,
    totalAmount,
    orders,
  });
});

// Admin: Update Order / Order Status [Put Method] /api/order/:id

exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (order.orderStatus == "Delivered") {
    return next(new ErrorHandler("Order has already been Delivered", 400));
  }

  // Updating the Product Stock of each Order Item [Put Method]
  order.orderItems.forEach(async (orderItem) => {
    await updateStock(orderItem.product, orderItem.quantity);
  });

  order.orderStatus = req.body.orderStatus;
  order.deliveredAt = Date.now();
  await order.save();

  res.status(200).json({
    success: true,
    message: "Order Status and Stock Updated",
  });
});

async function updateStock(productId, quantity) {
  const product = await Product.findById(productId);
  product.stock = product.stock - quantity;
  product.save({ validateBeforeSave: false });
}


// Delete Order [Delete Method] /admin/api/order/:id

exports.deleteOrder = catchAsyncError(async(req, res, next)=>{
  const order = await Order.findById(req.params.id)

  if(!order){
    return next(new ErrorHandler(`Order Not Found in this id ${id}`))
  }
  await order.deleteOne();
  res.status(200).json({
    success: true,
    message: "Order Deleted"
  })
})
