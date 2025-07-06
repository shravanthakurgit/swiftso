import mongoose from "mongoose"

const  sum = () => {

}

const connectDB = async () => {
    mongoose.connection.on('connected',()=>{
     
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/swiftso`)
       console.log("DB Connected")
}

export default connectDB;