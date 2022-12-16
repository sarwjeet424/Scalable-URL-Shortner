const express=require('express')
const router=express.Router()
const {createUrl,getUrl}=require('../../controller/urlController')

//FIRST API------------------------------------- */
router.post('/url/shorten',createUrl)

//SECOND API------------------------------------*/
router.get('/:urlcode', getUrl)

//END POINT-------------------------------------*/
router.all('/*',function (req,res){
    return res.status(404).send({status:false,message:"Page Not Found"})
})

module.exports=router