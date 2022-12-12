const urlModel= require('../model/urlModel')
const shortid=require('shortid')

const createUrl = async function(req,res){
  try{

    if(Object.keys(req.body).length==0) return res.status(400).send({status:false,message:"Request body cann't be empty"})
    const data=req.body
    const {longUrl}=data
    let urlCode= shortid.generate()
    urlCode= urlCode.toLowerCase()
    const shortUrl=`http://localhost:3000/${urlCode}`
    data.urlCode=urlCode
    data.shortUrl=shortUrl
    const createData= await urlModel.create(data)

    return res.status(201).send({status:true,data:createData})  

  }catch(error){
    return res.status(500).send({status:false,message:error.message})
  }
}

const getUrl= async function (req,res){
    try{

        let urlCode=req.params.urlCode
        let data= await urlModel.findOne({urlCode})
        return res.status(302).redirect(data.longUrl)

    }catch(error){
    return res.status(500).send({status:false,message:error.message})
  }
}

module.exports={createUrl,getUrl}