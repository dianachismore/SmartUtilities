import { User } from "../models/users.js";
import { Post } from "../models/post.js";
import cloudinary from "cloudinary";

export const createPost = async (req, res) => {
  try {
    const {title} = req.body;
    const photo = req.files.photo.tempFilePath;
    console.log(title, photo)
    const postFields = {
      title,
      postedBy: req.user._id,
    };
    console.log("1",postFields)
    if (!title || !photo) {
      return res.json({ message: 'Please add all the fields!' });
    }
    console.log("2",photo)
    // Upload photo to Cloudinary
    const uploadedPhoto = await cloudinary.uploader.upload(photo);
    console.log("3",uploadedPhoto)
    // Add Cloudinary photo details to postFields
    postFields.photo = {
      public_id: uploadedPhoto.public_id,
      secure_url: uploadedPhoto.secure_url,
    };
    console.log("4",postFields.photo)
    const newPost = new Post(postFields);
    console.log("5",newPost,title)
    await newPost.save();
    console.log("6",newPost)
    return res.status(200).send({
      status: 'success',
      message: 'Post has been created',
    });
  } catch (e) {
    return res.status(500).send({
      status: 'failure',
      message: e.message,
    });
  }
};


export const getAllPosts = async (req, res) => {
  try {
      const posts = await Post.find().populate(
        'postedBy',
        [
          'name',
          'avatar',
        ]
      );
      if (posts) {
          return res.status(200).send(posts);
      } else {
          return res.status(404).json({ msg: "Eroare" });
      }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  } return res.status(400).json({message: "Bad request"});
};


export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params._id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: "Post already liked" });
    }
    post.likes.push(req.user._id);
    await post.save();
    return res.status(200).send({
      status: "success",
      message: "post has been liked",
      post
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const unLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params._id);
    console.log(req.params._id)
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: "Post has not been liked yet" });
    }
    post.likes = post.likes.filter(like => like.toString() !== req.user._id.toString());
    await post.save();
    return res.status(200).send({
      status: "success",
      message: "Post has been unliked",
      post
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};


export const newComment = async (req, res) => {
  const { postId, text } = req.body; // Assuming postId is sent in the request body
  const user = req.user; // Assuming userId is extracted from the authenticated user
  const userId = req.user._id;
  try {
    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    // Create the new comment object
    const newComment = {
      text,
      postedBy: userId,
      createdAt: new Date()
    };
    // Add the comment to the post's comments array
    post.comments.push(newComment);
    // Save the updated post with the new comment
    await post.save();
    // Return the updated post as the response
    return res.status(201).json({ post });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Server error' });
  }
};


// Controller to get all comments of a specific post
export const getPostComments = async (req, res) => {
  const postId = req.params._id; // Assuming the postId is provided in the request parameters
  console.log(postId)
  try {
    const post = await Post.findById(postId).populate({
      path:'comments',
      populate: {
        path: 'postedBy',
        model: 'User',
        select: 'name avatar'
      }
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = post.comments;
    res.status(200).json({ comments });
  } catch (error) {
    console.error("Error retrieving post comments:", error);
    res.status(500).json({ message: "Server error" });
  }
};