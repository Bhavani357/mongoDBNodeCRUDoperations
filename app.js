const Product = require("./models/productModel")
const express = require('express')
const mongoose = require('mongoose')
const multer = require("multer");
const ImageModel = require("./image.model");
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/products', async(req,res)=>{
    try{
        const products = await Product.find({})
        res.status(200).json(products)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

app.get('/products/:id', async(req,res)=>{
    try{
        const {id} = req.params;
        const product = await Product.findById(id)
        res.status(200).json(product)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

app.post("/products", async(req,res)=>{
    try{
        const product = await Product.create(req.body)
        res.status(200).json(product)
    }catch(err){
        console.log(err.message);
        res.status(500).json({message: err.message})
    }
})

app.delete('/products/:id', async(req,res)=>{
    try{
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({message:`Connot find any product with ID ${id}`})
        }
        res.status(200).json(product)
    }catch(error){
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
})

app.put("/products/:id", async(req,res)=>{
    try{
        const {id} = req.params;

        const product = await Product.findByIdAndUpdate(id, req.body)
        if(!product){
            return res.status(404).json({message: `connot find any product with ID ${id}`})
        }
        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct)

    }catch(err){
        console.log(err.message)
        res.status(500).json({message: err.message})
    }
})

const Storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb)=>{
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage:Storage
}).single('testImage')

app.get('/',(req,res)=>{
    res.send("upload file")
})

app.post('/upload', (req,res)=>{
    upload(req,res,(err)=>{
        if(err){
            console.log(err)
        }else{
            const newImage = new ImageModel({
                name: req.body.name,
                image:{
                    data:req.file.filename,
                    contentType:'image/png'
                }
            })
            newImage.save().then(()=>res.send('successfully uploaded')).catch(err=>console.log(err))
        }
    })
})

mongoose.set("strictQuery", false)
mongoose.
connect("mongodb+srv://Durga:durgabhavani21@cluster0.ddio97i.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0").then(
    ()=>{
        console.log("connected to MongoDB")
        app.listen(3000, ()=>{
            console.log("Node Api app is running on port 3000")
        })
    }
).catch(err=>{
    console.log(err)
})
