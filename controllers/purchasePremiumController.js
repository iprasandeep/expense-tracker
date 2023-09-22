import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import {User} from '../models/User.js';

// const razorpay = new Razorpay({
//   key_id: process.env.KEY_ID,
//   key_secret: process.env.KEY_SECRET
// });

export const purchasePremium = async (req, res) => {
  console.log(process.env.KEY_ID)
  try{
      let rzp=new Razorpay({
          key_id:process.env.KEY_ID,
          key_secret:process.env.KEY_SECRET
  })
  console.log(rzp)
  const amount=2500
  rzp.orders.create({amount,currency:"INR"},async(err,order)=>{
      if(err){
          throw new Error(JSON.stringify(err))
      }
      await Order.create({
          orderid:order.id,
          status:"PENDING",
          userId:req.user
      })
      return res.json({order,key_id:rzp.key_id})
  })

  }catch(err){

      console.log("Razorpay Errror",err)
      res.json({Error:err})
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const payment_id = req.body.payment_id;
    const order_id = req.body.order_id;
    
    const order = await Order.findOne({ where: { orderid: order_id } });

    if (payment_id === null) {
      await order.update({ paymentid: payment_id, status: "FAILED" });
      res.json({ message: "payment is failed" });
      return;
    }
    const user = await User.findOne({ where: { id: req.user.id } });

    async function updateTable(order) {
      await order.update({ paymentid: payment_id, status: "SUCCESS", UserId: user.id });
    }

    async function updateUserTable() {

      await user.update({ premiumUser: true });
      
    }    
    await Promise.all([updateTable(order), updateUserTable()]);
    res.json({
      success: true,
      message: "Hurrey..!! you are a premium user now"
    });
  } catch (err) {
    console.log("error in update transaction", err);
    res.json({ Error: err });
  }
};

export default {
  purchasePremium,
  updateTransaction
}