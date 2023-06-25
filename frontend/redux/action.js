/* eslint-disable no-unused-vars */
import axios from "axios";

const serverUrl = "http://127.0.0.1:5000/api/v1";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: "loginRequest" });

    const { data } = await axios.post(
      `${serverUrl}/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch({ type: "loginSuccess", payload: data });
  } catch (error) {
    dispatch({ type: "loginFailure", payload: error.response.data.message });
  }
};

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: "loadUserRequest" });

    const { data } = await axios.get(`${serverUrl}/me`);
    dispatch({ type: "loadUserSuccess", payload: data });
  } catch (error) {
    dispatch({ type: "loadUserFailure", payload: error.response.data.message });
  }
};

export const addPost = (formData) => async (dispatch) => {
  try {
    console.log("aici")
    dispatch({ type: "addPostRequest" });
    console.log("aici1")
    const { data } = await axios.post(
      `${serverUrl}/createpost`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    console.log("aici2")
    dispatch({ type: "addPostSuccess", payload: data.message });
    console.log("aici3")
  } catch (error) {
    dispatch({ type: "addPostFailure", payload: error.response.data.message });
  }
};

export const scannId = (document) => async (dispatch) => {
  try {
    dispatch({ type: "scannIdRequest" });
    const { data } = await axios.post(`${serverUrl}/scannid`, document, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("data", data)
    dispatch({ type: "scannIdSuccess", payload: data });
  } catch (error) {
    dispatch({ type: "scannIdtFailure", payload: "Error scanning identity card" });
  }
};


export const getAllPosts = (dispatch) => async (dispatch) => {
  try {
    dispatch({ type: "allPostsRequest" });

    const { data } = await axios.get(`${serverUrl}/getallposts`);
    dispatch({ type: "allPostsSuccess", payload: data });
    //console.log(data);
  } catch (error) {
    dispatch({ type: "allPostsFailure", payload: error.response.data.message });
  }
};

export const AllUsers = (dispatch) => async (dispatch) => {
  try {
    dispatch({ type: "allUsersRequest" });

    const { data } = await axios.get(`${serverUrl}/getallposts`);
    dispatch({ type: "allUsersSuccess", payload: data });
  } catch (error) {
    dispatch({ type: "allUsersFailure", payload: error.response.data.message });
  }
};

export const getAllUsers = () => async (dispatch) => {
  try{
    const res= await AllUsers(dispatch);
    console.log(res);
    return res;
  }
  catch(error)
  {
    console.log(error);
  }
}

// export const updatePost = (postId) => async (dispatch) => {
//   try {
//     dispatch({ type: "updatePostRequest" });

//     const { data } = await axios.get(`${serverUrl}/post/${postId}`);
//     dispatch({ type: "updatePostSuccess", payload: data.message });
//   } catch (error) {
//     dispatch({
//       type: "updatePostFailure",
//       payload: error.response.data.message,
//     });
//   }
// };

// export const deletePost = (postId) => async (dispatch) => {
//   try {
//     dispatch({ type: "deletePostRequest" });

//     const { data } = await axios.delete(`${serverUrl}/post/${postId}`);
//     dispatch({ type: "deletePostSuccess", payload: data.message });
//   } catch (error) {
//     dispatch({
//       type: "deletePostFailure",
//       payload: error.response.data.message,
//     });
//   }
// };

export const updateProfile = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "updateProfileRequest" });

    const { data } = await axios.put(`${serverUrl}/updateprofile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch({ type: "updateProfileSuccess", payload: data.message });
  } catch (error) {
    dispatch({
      type: "updateProfileFailure",
      payload: error.response.data.message,
    });
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch({ type: "logoutRequest" });

    await axios.get(`${serverUrl}/logout`);
    dispatch({ type: "logoutSuccess" });
  } catch (error) {
    dispatch({
      type: "logoutFailure",
      payload: error.response.data.message,
    });
  }
};

export const register = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "registerRequest" });

    const { data } = await axios.post(`${serverUrl}/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch({ type: "registerSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "registerFailure",
      payload: error.response.data.message,
    });
  }
};

export const updatePassword =
  (oldPassword, newPassword) => async (dispatch) => {
    try {
      dispatch({ type: "updatePasswordRequest" });

      const { data } = await axios.put(
        `${serverUrl}/updatepassword`,
        { oldPassword, newPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch({ type: "updatePasswordSuccess", payload: data.message });
    } catch (error) {
      dispatch({
        type: "updatePasswordFailure",
        payload: error.response.data.message,
      });
    }
  };

export const verify = (otp) => async (dispatch) => {
  try {
    dispatch({ type: "verificationRequest" });

    const { data } = await axios.post(
      `${serverUrl}/verify`,
      { otp },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch({ type: "verificationSuccess", payload: data.message });
  } catch (error) {
    dispatch({
      type: "verificationFailure",
      payload: error.response.data.message,
    });
  }
};

export const forgetPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: "forgetPasswordRequest" });

    const { data } = await axios.post(
      `${serverUrl}/forgetpassword`,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch({ type: "forgetPasswordSuccess", payload: data.message });
  } catch (error) {
    dispatch({
      type: "forgetPasswordFailure",
      payload: error.response.data.message,
    });
  }
};

export const resetPassword = (otp, newPassword) => async (dispatch) => {
  try {
    dispatch({ type: "resetPasswordRequest" });

    const { data } = await axios.put(
      `${serverUrl}/resetpassword`,
      { otp, newPassword },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch({ type: "resetPasswordSuccess", payload: data.message });
  } catch (error) {
    dispatch({
      type: "resetPasswordFailure",
      payload: error.response.data.message,
    });
  }
};


export const likePost = (postId) => async (dispatch) => {
  try {
    dispatch({ type: "likePostRequest" });

    const { data } = await axios.put(`${serverUrl}/like/${postId}`);
    dispatch({ type: "likePostSuccess", payload: data.message });
  } catch (error) {
    dispatch({
      type: "likePostFailure",
      payload: error.response.data.message,
    });
  }
};

export const unLikePost = (postId) => async (dispatch) => {
  try {
    dispatch({ type: "unLikePostRequest" });

    const { data } = await axios.put(`${serverUrl}/unlike/${postId}`);
    dispatch({ type: "unLikePostSuccess", payload: data.message });
  } catch (error) {
    dispatch({
      type: "unLikePostFailure",
      payload: error.response.data.message,
    });
  }
};


export const addCard = (cardData) => async (dispatch) => {
  try {
    const response = await axios.post(`${serverUrl}/newcard`, cardData);
    console.log(response.data);
    dispatch({ type: 'addCardSuccess', payload: response.data });
  } catch (error) {
    console.error(error);
    dispatch({ type: 'addCardFailure', payload: error.message });
  }
};

export const getUserCards = (dispatch) => async (dispatch) => {
  try {
    dispatch({ type: "getUserCardsRequest" });
    const { data } = await axios.get(`${serverUrl}/usercards`);
    dispatch({ type: "getUserCardsSuccess", payload: data });
  } catch (error) {
    dispatch({ type: "getUserCardsFailure", payload: error.response.data.message });
  }
};