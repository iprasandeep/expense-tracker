const crypto = require('crypto');
const User = require('../models/User');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const { userInfo } = require('os');
require('dotenv').config();
// const {v4: uuid} = require('uuidv4');

const sendinblueApiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

async function forgotPassword(req, res) {
    try{
        const email=req.body.email;
        console.log(req.body.email)
        const users=await User.findOne({
            where:{email:email}
        })
        // console.log(users.__proto__)
        if(users){
            const id= 1234;
        const client=SibApiV3Sdk.ApiClient.instance
            
        const apiKey=client.authentications['api-key']
        apiKey.apiKey='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'
        
        const transEmailApi=new SibApiV3Sdk.TransactionalEmailsApi();
        const sender={
            email:"nestalchemy@gmail.com"
        }
    
        const receivers=[
            {
                email:email
            }
        ]

        const data= await transEmailApi.sendTransacEmail({
            sender,
            to:receivers,
            subject:`Reset Your Password`,
            textcontent:`Click the link below to reset your password:`,
            htmlContent:`Click the link below to reset your password:\n\n` + `\n<a href="http://app-name/password/reset_password/${id}">Reset password</a>`
            
        })
        console.log(data)
        res.json({message:"Mail sent successfully..!!",success:true})
        }else{
            console.log("user doesn't exist")
            res.json({message:"user doesnt exist",success:false})
        }
    
    }catch(err){
        console.log("error in forgot password: ",err)
    }
}

module.exports = {
  forgotPassword
};
