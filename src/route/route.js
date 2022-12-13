const express=require('express')
const router=express.Router()
const {createUrl,getUrl}=require('../../controller/urlController')

router.post('/url/shorten',createUrl)

router.get('/:urlCode',getUrl)

router.all('/*',function (req,res){
    return res.status(404).send({status:false,message:"Page Not Found"})
})

module.exports=router