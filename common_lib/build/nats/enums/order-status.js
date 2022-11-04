"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    // when order is created, but the
    // ticket it is trying to order has not been reserved
    OrderStatus["Created"] = "created";
    //the ticket the order is trying to reserve has already been resvered
    //or
    // when the user has cancelled the order 
    //or
    // the order expires before payment
    OrderStatus["Cancelled"] = "cancelled";
    // The order has successfully reserved the ticket
    OrderStatus["AwaitingPayment"] = "awaiting:payment";
    // the order has reserved the ticket and the user has provided payment successfully
    OrderStatus["Complete"] = "complete";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
