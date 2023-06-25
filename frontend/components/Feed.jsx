import React, { useState, useEffect} from 'react';
import {View} from 'react-native';
import {getAllPosts, likePost, unLikePost} from '../redux/action';
import { useDispatch, useSelector } from 'react-redux';
import Post from './Post.jsx'

const Feed = () => {
    const dispatch = useDispatch();

    const post = useSelector(state => state.post)
    const user = useSelector(state => state.auth)

    console.log(user);
    useEffect(() => {
      dispatch(getAllPosts());
    }, []);
  
    const [liked, setLiked] = useState([]);
  
    const handleLike = (id) => {
        dispatch(likePost(id));
        setLiked(prevLikedPosts => [...prevLikedPosts, id]);
      }

    const handleUnLike = (id) => {
        dispatch(unLikePost(id));
        setLiked(prevLikedPosts => prevLikedPosts.filter(postId => postId !== id));
      }
  
    const isPostLiked = id => liked?.includes(id);

    const [commentText, setCommentText] = useState('');
    const handleAddComment = (postId, commentText) => {
      // Handle adding a new comment
      console.log(`Adding comment "${commentText}" to post ${postId}`);
    };

    return (
      <View>
        {post.post?.slice(0).reverse().map((data, index) => {
          const isLiked = isPostLiked(data._id);
          return(
            <View key={index}>
              <Post
                 title= {data.title}
                 photo= {data.photo.secure_url}
                 name= {data.postedBy?.name}
                 avatar= {data.postedBy?.avatar.url}
                 commentAvatar = {user?.user?.avatar.url}
                 likes= {data.likes}
                 isLiked={isLiked}
                 _id= {data._id}
                 handleLike= {handleLike}
                 handleUnLike= {handleUnLike}
                 handleAddComment={handleAddComment}
                 commentText={commentText} // Pass commentText prop
                setCommentText={setCommentText} // Pass setCommentText prop
              />
            </View>
          )
        })}
      </View>
        
    )};
export default Feed;


