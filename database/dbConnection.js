
import mongoose from "mongoose"


export function mongoConection(){
mongoose.connect("mongodb+srv://User:cDCmn6YT6PZS7NXM@cluster0.a6vrp.mongodb.net/daily_task")
.then(()=>{console.log("Mongo is running too ..")})
.catch((err)=>{console.log("DataBase error", err)})
}