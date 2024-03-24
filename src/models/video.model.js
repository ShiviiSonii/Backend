import mongoose from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = new mongoose.Schema({
    owner : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required : true,
        unique:true,
        lowercase : true
    }, 
    title : {
        type:String,
        required : true,
    },
    description : {
        type:String,
        requured : true,
    },
    avatar : {

    },
    videoFile : {
        type:String, //cloudinary url
        required : true
    },
    thumbnail : {
        type:String, //cloudinary url
        required : true
    },
    duration : {
        type:Number,
        required : true
    },
    views : {
        type:Number,
        default:0
    },
    isPublished : {
        type:Boolean,
        default :true
    },
},{timestamps : true})

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema)
