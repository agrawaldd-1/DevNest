import mongoose from "mongoose";
export const  connect_db = async()=>{
try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
}catch(error){
    console.error(error);
    process.exit(1);
}
}