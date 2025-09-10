import express from 'express';
import dotenv from 'dotenv';


dotenv.config();
const app=express();

app.use(express.json());


app.get('/',(req,res)=>{
    res.send("hey there from backend");
})


const PORT=process.env.PORT ||5000;

app.listen(PORT,()=>{
    console.log(`server running on port $(PORT)`);
});
