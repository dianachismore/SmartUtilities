import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    photo: {
        public_id: {
            type: String,
            default: "60111_epj0kr",
          },
          secure_url: {
            type: String,
            default: "https://res.cloudinary.com/dhqzw4noh/image/upload/v1672901281/60111_epj0kr.jpg",
          },
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    comments: [{
        text: String,
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
});

export const Post = mongoose.model("Post", postSchema);

