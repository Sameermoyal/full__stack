const express = require('express');
const cors = require('cors');
const mongoose=require('mongoose')


const app = express();
const PORT = 4000;
const mongoURL='mongodb://localhost:27017/test'
app.use(express.json())

// app.use(express.urlencoded{extend:true})

const userSchema=mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required:true },
    }    
)

const user=mongoose.model('user',userSchema)
mongoose.connect(mongoURL).then(()=>{
    console.log("mongodb connected successfully")
})


app.use(cors());


app.get('/api/products',async (req, res) => {
    try{
        const result = await user.find()
        res.status(200).json(result) 

    }catch(err){
        res.status(500).json({message:"ther is an error in fetching data",err})

    }
});
app.post('/api/products',async (req, res) => {
  try{
        const newProduct =new user(req.body)
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
  }catch(err){
    console.error('Error saving product:', err);
    res.status(500).json({ message: 'Failed to save product', error: err });

  }
});

app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Deleting product with id:', id);

    try {
        const deletedProduct = await user.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully', id });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Failed to delete product', error });
    }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
