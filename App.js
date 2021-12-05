const express = require('express')
const PORT =8888
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

//Convert string data to json data
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//template engine 
app.set('view engine','ejs')

//RegEx Validations
const RegForEmail = RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.com$');
const RegForName = RegExp('^[a-zA-Z]+\\s[a-zA-Z]+$')
const RegForCity = RegExp('^[a-zA-Z]{3,15}$')

//db imports
const empModel = require('./db/empSchema')

//routes
app.get('/',(req,res)=>{
    empModel.find({},(err,data)=>{
        if(err) throw err
        console.log(data)
        res.render('EmpDisplay',({data:data}))
    })
    
})



app.post('/registerdata',(req,res)=>{
    const error = {name:'',email:'',age:'',city:''}
    error.name = RegForName.test(req.body.name)?'':'Please Enter Full Name'
    error.email = RegForEmail.test(req.body.email)?'':'Email must be in correct format'
    error.age = (req.body.age >= 18 && req.body.age <100)?'':'Age must be valid and above 18 years old'
    error.city = RegForCity.test(req.body.city)?'':'City character length must be 3 to 15'
    if(error.name!=='' || error.email!=='' || error.age!=='' || error.city!==''){
        res.render('Register',({error:error}))
    }else{
        let ins = new empModel({name:req.body.name,email:req.body.email,age:req.body.age,city:req.body.city})
        ins.save(err=>{
            if(err) { console.log("User Already exists")}
            res.redirect('/')
        })
    }
})

app.get('/register',(req,res)=>{
    const error = {name:'',email:'',age:'',city:''}
    res.render('Register',({error:error}))

})

app.get('/update/:email',(req,res)=>{
    const error = {name:'',email:'',age:'',city:''}
    empModel.find({email:req.params.email},(err,data)=>{
        if(err) throw err
        res.render('Update',({error:error,data:data[0]}))
    })
})

app.post('/update/:email',(req,res)=>{
    const error = {name:'',email:'',age:'',city:''}
    error.name = RegForName.test(req.body.name)?'':'Please Enter Full Name'
    error.email = RegForEmail.test(req.body.email)?'':'Email must be in correct format'
    error.age = (req.body.age >= 18 && req.body.age <100)?'':'Age must be valid and above 18 years old'
    error.city = RegForCity.test(req.body.city)?'':'City character length must be 3 to 15'
    if(error.name!=='' || error.email!=='' || error.age!=='' || error.city!==''){
        empModel.find({email:req.params.email},(err,data)=>{
            if(err) throw err
            res.render('Update',({error:error,data:data[0]}))
        })
    }else{
        empModel.updateOne({email:req.params.email},{$set:{name:req.body.name,email:req.body.email,age:req.body.age,city:req.body.city}},err=>{
            if(err) throw err
            res.redirect('/')
        })
    }
})

app.get('/delete/:email',(req,res)=>{
    empModel.deleteOne({email:req.params.email},err=>{
        if(err) throw err
        res.redirect('/')
    })
})

//mongoDB Connection 
const db="mongodb://localhost:27017/exp_validator"
const connectDB = async() =>{
    try{
        await mongoose.connect(db,{useNewUrlParser:true})
        console.log("Database Connected")
    }
    catch(err){
        console.log(err.message)
    }
}
connectDB()

//Start Server
app.listen(PORT,err=>{
    if(err) throw err
    console.log(`Server Started at PORT:${PORT}`)
})