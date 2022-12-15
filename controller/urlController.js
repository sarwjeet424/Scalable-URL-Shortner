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

    if(Object.keys(req.body).length==0)  return res.status(400).send({status:false,message:"Request body cann't be empty"})
    const data=req.body

    /*---------baseUrl = localhost:3000----------*/
    let baseUrl=req.headers.host           

    let {longUrl}=data
    if(!longUrl) return res.status(400).send({status:false,message:"longUrl is required"})

    /*-----------Validation of longUrl -------------------*/
    if(!isValidString(longUrl)) return res.status(400).send({status:false,message:"invalid longUrl"})

    /*----------Axios call--------------------------------*/
    let options={
      method:"get",
      url:longUrl
    }
    let fetchData= await axios(options)
    .then(()=>[])
    .catch(()=> "")

    if(!fetchData) return res.status(400).send({status:false,message:`this ${longUrl} doesn't exist`})

    /*--------Checking in cache--------------------------*/
    let cachedData = await GET_ASYNC(`${longUrl}`)
    if(cachedData){
      let caching=JSON.parse(cachedData)
      return res.status(200).send({status:true,message:"cachedData",data:caching})
    }

    /*---------Checking in DB and Setting in cache------------------------ */
    let unique= await urlModel.findOne({longUrl}).select({_id:0,longUrl:1,shortUrl:1,urlCode:1})
    if(unique){
      await SET_ASYNC(`${longUrl}`,60*5, JSON.stringify(unique))
      return res.status(200).send({status:true,message:"DBData",data:unique})
    } 

    let urlCode= shortid.generate().toLowerCase()
  
    const shortUrl=`http://${baseUrl}/${urlCode}`
    data.urlCode=urlCode
    data.shortUrl=shortUrl

    await urlModel.create(data)

    /*-----------Setting key-value in new object-------------------------- */
    let urlInfo={}
    urlInfo.urlCode=urlCode
    urlInfo.longUrl=longUrl
    urlInfo.shortUrl=shortUrl

    /*-----------Setting in cache---------------------- */
    await SET_ASYNC(`${longUrl}`,60*5, JSON.stringify(urlInfo))
    return res.status(201).send({status:true,message:"Success",data:urlInfo})  

  }catch(error){
    return res.status(500).send({status:false,message:error.message})
  }
}

const getUrl= async function (req,res){
    try{

        let urlCode=req.params.urlCode
        if(!shortid.isValid(urlCode))  return res.status(400).send({status:false,message:"Invalid urlCode"})

        /*---------------Checking in cache---------------------- */
        let cachedData = await GET_ASYNC(`${urlCode}`)
        if(cachedData){
          let data1=JSON.parse(cachedData)
          return res.status(302).redirect(data1)
        }  

        /*--------------Checking in DB and setting in cache-------------------------- */
        let data= await urlModel.findOne({urlCode})
        if(!data) return res.status(404).send({status:false,message:"urlCode not found"})
        await SET_ASYNC(`${urlCode}`,60*5, JSON.stringify(data.longUrl))
        
        return res.status(302).redirect(data.longUrl)

    }catch(error){
    return res.status(500).send({status:false,message:error.message})
  }
}

module.exports={createUrl,getUrl}