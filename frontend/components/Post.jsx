import React, {useState} from 'react';
import {
  View, Text, Image, TouchableOpacity, TextInput, ScrollView
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionic from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import moment from 'moment';
import Modal from 'react-native-modal';


function Post({title, photo, name, avatar, commentAvatar, _id, likes, isLiked, handleLike, handleUnLike, commentText, setCommentText}) {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const handleAddComment = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/v1/newcomment', {
        postId: _id,
        text: commentText,
      });
      // Handle successful comment submission if needed
      console.log(response.data);
      setCommentText('');
    } catch (error) {
      // Handle error if needed
      console.log(error);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const isCommentsEmpty = comments.length === 0;
  const fetchPostComments = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/v1/getpostcomments/${_id}`);
      setComments(response.data.comments);
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewComments = () => {
    setModalVisible(true);
    fetchPostComments();
  };

  const renderComments = () => {
    const commentItems = comments.reverse().map((comment, index) => {
      const timeSinceCreation = moment(comment.createdAt).fromNow();
  
      return (
        <View key={index} style={{ padding: 20, paddingBottom: 0 }}>
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={{ uri: comment.postedBy?.avatar.url }}
                style={{ width: 40, height: 40, borderRadius: 100, marginRight: 10 }}
              />
              <View style={{ width: 240 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontWeight: 'bold', marginRight: 10 }}>{comment.postedBy?.name}</Text>
                  <Text style={{ fontSize: 12, color: 'gray', marginTop: 2 }}>{timeSinceCreation}</Text>
                </View>
                <Text>{comment.text}</Text>
              </View>
            </View>
            <View
              style={{
                borderBottomColor: 'grey',
                borderBottomWidth: 0.2,
                paddingBottom: 15
              }}
            />
          </View>
        </View>
      );
    });
  
    if (isCommentsEmpty) {
      commentItems.push(
        <View key="no-comments" style={{ padding: 20, paddingBottom: 0 }}>
          <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>No comments yet</Text>
        </View>
      );
    }
  
    return commentItems;
  };
  

  

  return (
    <View>
      <View
        style={{
          paddingBottom: 10,
          borderBottomColor: 'gray',
          borderBottomWidth: 0.1,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 15,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={{ uri: avatar }}
              style={{ width: 40, height: 40, borderRadius: 100 }}
            />
            <View style={{ paddingLeft: 5 }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                {name}
              </Text>
            </View>
          </View>
          <Feather name="more-vertical" style={{ fontSize: 20 }} />
        </View>
        <View
          style={{
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={{ uri: photo }}
            style={{ width: '90%', height: 300, borderRadius: 25 }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 15,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => isLiked ? handleUnLike(_id) : handleLike(_id)}>
            <AntDesign
              name={isLiked ? 'heart' : 'hearto'}
              style={{
              paddingRight: 10,
              fontSize: 20,
              color: isLiked ? 'red' : 'black',
              }}
            />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowCommentInput(true)}>
              <Ionic
                name="ios-chatbubble-outline"
                style={{ fontSize: 20, paddingRight: 10 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ paddingHorizontal: 15 }}>
          <Text>
            Liked by
            {' '}
            {isLiked ? 'you and' : ''}
            {' '}
            {likes.length}
            {' '}
            others
          </Text>

          <Text
            style={{
              fontWeight: '700',
              fontSize: 14,
              paddingVertical: 2,
            }}
          >
            {title}
          </Text>
    
        <Text style={{ opacity: 0.4, paddingVertical: 2 }} onPress={handleViewComments}>
          View all comments
        </Text>

        <Modal
          isVisible={modalVisible}
          swipeDirection="down"
          onSwipeComplete={() => setModalVisible(false)}
          onBackdropPress={() => setModalVisible(false)}
          animationIn="slideInUp"
          animationOut="slideOutDown"
        >
          {/* Modal content */}
          <View style={{  justifyContent: 'center', alignItems: 'center', height:400 }}>
            <ScrollView style={{ width: '90%', backgroundColor: 'white', borderRadius: 10 }}>
              <TouchableOpacity>
                {renderComments()}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>

        {showCommentInput && (
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between'}}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={{ uri: commentAvatar }}
                  style={{
                    width: 25,
                    height: 25,
                    borderRadius: 100,
                    backgroundColor: 'orange',
                    marginRight: 10,
                  }}
                />
                <TextInput
                  placeholder="Add a comment"
                  style={{ opacity: 0.5, width: 290 }}
                  value={commentText}
                  onChangeText={setCommentText}
                />
              </View>
              <TouchableOpacity onPress={handleAddComment} style={{marginTop:3, marginRight:15}}>
                <Text>Submit</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

export default Post;
