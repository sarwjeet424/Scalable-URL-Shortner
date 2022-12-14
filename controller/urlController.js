const urlModel= require('../model/urlModel')
const shortid=require('shortid')
const axios=require('axios')
const {SET_ASYNC,GET_ASYNC}=require('./redis')

const isValidString = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };

const createUrl = async function(req,res){
  try{

    if(Object.keys(req.body).length==0) return res.status(400).send({status:false,message:"Request body cann't be empty"})
    const data=req.body
    let baseUrl=req.headers.host
    let {longUrl}=data
    if(!longUrl) return res.status(400).send({status:false,message:"longUrl is required"})
    if(!isValidString(longUrl)) return res.status(400).send({status:false,message:"invalid longUrl"})
    let options={
      method:"get",
      url:longUrl
    }
    let fetchData= await axios(options)
    .then(()=>longUrl)
    .catch(()=> undefined)

    if(!fetchData) return res.status(400).send({status:false,message:`this ${longUrl} doesn't exist`})
    let unique= await urlModel.findOne({longUrl}).select({_id:0,longUrl:1,shortUrl:1,urlCode:1})
    if(unique)   return res.status(200).send({status:true,data:unique})
    let urlCode= shortid.generate()
    urlCode= urlCode.toLowerCase()

    const shortUrl=`http://${baseUrl}/${urlCode}`
    data.urlCode=urlCode
    data.shortUrl=shortUrl
    await urlModel.create(data)

    let urlInfo={}
    urlInfo.urlCode=urlCode
    urlInfo.longUrl=longUrl
    urlInfo.shortUrl=shortUrl
    return res.status(201).send({status:true,data:urlInfo})  

  }catch(error){
    return res.status(500).send({status:false,message:error.message})
  }
}

const getUrl= async function (req,res){
    try{

        let urlCode=req.params.urlCode
        if(!shortid.isValid(urlCode)) return res.status(400).send({status:false,message:"invalid urlCode"})

        let cahcedProfileData = await GET_ASYNC(`${req.params.authorId}`)
        if(cahcedProfileData)  res.send(cahcedProfileData)

        let data= await urlModel.findOne({urlCode})
        if(!data) return res.status(404).send({status:false,message:"urlCode not found"})
        await SET_ASYNC(`${data._id}`,3600, JSON.stringify(data))
        
        return res.status(302).redirect(data.longUrl)

    }catch(error){
    return res.status(500).send({status:false,message:error.message})
  }
}

module.exports={createUrl,getUrl}