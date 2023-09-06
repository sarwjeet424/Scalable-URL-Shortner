const express= require('express')
const mongoose=require('mongoose')
const route=require('./route/route')
const app=express()

app.use(express.json())

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URL ,{useNewUrlParser:true})
.then(()=>  console.log("MongoDB Connected"))
.catch((err)=> console.log(err))

app.use("/",route)

app.listen(3000,function (){
    console.log("connected on port 3000")
})



