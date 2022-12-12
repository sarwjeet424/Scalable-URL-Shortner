const express= require('express')
const mongoose=require('mongoose')
const route=require('./route/route')
const app=express()

app.use(express.json())
mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://sarwjeet424:96568437528p@cluster0.8tsocgw.mongodb.net/group20Database",{useNewUrlParser:true})
.then(()=>  console.log("MongoDB Connected"))
.catch((err)=> console.log(err))

app.use("/",route)
app.listen(3000,function (){
    console.log("connected on port 3000")
})



