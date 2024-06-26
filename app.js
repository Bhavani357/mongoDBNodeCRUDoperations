// Import necessary modules
const Product = require("./models/productModel"); // Importing the Product model
const express = require('express'); // Importing Express framework
const mongoose = require('mongoose'); // Importing Mongoose for MongoDB interactions

const multer = require("multer"); // Importing Multer for handling file uploads
const ImageModel = require("./image.model"); // Importing the Image model

// Create Express application
const app = express();
// Middleware setup for parsing JSON data
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// Multer disk storage configuration for uploading images
const Storage = multer.diskStorage({
    destination: "uploads", // Destination folder for uploaded images
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Setting filename
    }
});

// Multer middleware for file uploads
const upload = multer({
    storage: Storage
}).single('testImage'); // Accepting single file uploads with field name 'testImage'

// Route to handle file upload
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
        } else {
            // Creating a new ImageModel instance with uploaded image data
            const newImage = new ImageModel({
                name: req.body.name,
                imagefile: {
                    data: req.file.filename, // Storing uploaded image filename
                    contentType: req.file.mimetype // Specifying content type
                }
            });
            // Saving the new image data to the database
            newImage.save().then(() => res.send('Successfully uploaded')).catch(err => console.log(err));
        }
    });
});

// Route to fetch an image by ID
app.get('/images/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Find the ImageModel instance by ID
        const image = await ImageModel.findById(id);

        // If image is not found, return 404 Not Found
        if (!image) {
            return res.status(404).json({ message: `Cannot find any image with ID ${id}` });
        }

        // Set response content type based on the stored contentType
        res.set('Content-Type', image.contentType);

        // Send the image data as response
        res.send(image.data);
    } catch (error) {
        // Handle errors
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});










// Route to fetch all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find({}); // Finding all products in the database
        res.status(200).json(products); // Sending products as JSON response
    } catch (error) {
        res.status(500).json({message: error.message}); // Handling errors
    }
});

// Route to fetch a specific product by ID
app.get('/products/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id); // Finding product by ID
        res.status(200).json(product); // Sending product as JSON response
    } catch (error) {
        res.status(500).json({message: error.message}); // Handling errors
    }
});

// Route to create a new product
app.post("/products", async (req, res) => {
    try {
        const product = await Product.create(req.body); // Creating a new product
        res.status(200).json(product); // Sending created product as JSON response
    } catch (err) {
        console.log(err.message);
        res.status(500).json({message: err.message}); // Handling errors
    }
});

// Route to delete a product by ID
app.delete('/products/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id); // Deleting product by ID
        if (!product) {
            return res.status(404).json({message: `Cannot find any product with ID ${id}`});
        }
        res.status(200).json(product); // Sending deleted product as JSON response
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message}); // Handling errors
    }
});

// Route to update a product by ID
app.put("/products/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body); // Updating product by ID
        if (!product) {
            return res.status(404).json({message: `Cannot find any product with ID ${id}`});
        }
        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct); // Sending updated product as JSON response
    } catch (err) {
        console.log(err.message);
        res.status(500).json({message: err.message}); // Handling errors
    }
});

// Connection to MongoDB Atlas
mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://Durga:durgabhavani21@cluster0.ddio97i.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0").then(
    () => {
        console.log("Connected to MongoDB"); // Connection success message
        // Starting the Express server
        app.listen(3000, () => {
            console.log("Node API app is running on port 3000"); // Server start message
        });
    }
).catch(err => {
    console.log(err); // Logging connection errors
});
