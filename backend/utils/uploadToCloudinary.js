import { v2 as cloudinary } from "cloudinary"
// import connectCloudinary from "../config/cloudinary"

const uploadToCloudinary = async (image) =>{
    const buffer = image?.buffer || Buffer.from(await image.arrayBuffer())

    const uploadImage = await new Promise((resolve,reject)=>{
        cloudinary.uploader.upload_stream({folder: 'SwiftSo'},(error,uploadResult)=>{
            return resolve(uploadResult)
        }).end(buffer)
    })

    return uploadImage
}

export default uploadToCloudinary;