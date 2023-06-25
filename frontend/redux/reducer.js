import { createReducer } from "@reduxjs/toolkit";

export const authReducer = createReducer(
  {},
  {
    loginRequest: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.message = action.payload.message;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },

    registerRequest: (state) => {
      state.loading = true;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.message = action.payload.message;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },

    loadUserRequest: (state) => {
      state.loading = true;
    },
    loadUserSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    loadUserFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },

    logoutRequest: (state) => {
      state.loading = true;
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    },
    logoutFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.error = action.payload;
    },

    verificationRequest: (state) => {
      state.loading = true;
    },
    verificationSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    verificationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    clearMessage: (state) => {
      state.message = null;
    },
  }
);

export const postReducer = createReducer(
  {},
  {
    allPostsRequest: (state) => {
      state.loading = true;
    },
    allPostsSuccess: (state, action) => {
      state.loading = false;
      // state.isAuthenticated = true;
      state.post = action.payload;
      // state.message = action.payload.message;
    },
    allPostsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    likePostRequest: (state) => {
      state.loading = true;
    },
    likePostSuccess: (state, action) => {
      const postId = action.payload.postId;
      const postToUpdate = state.post.find((p) => p._id === postId);
      postToUpdate.likes += 1;
    },    
    likePostFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },

    unLikePostRequest: (state) => {
      state.loading = true;
    },
    unLikePostSuccess: (state, action) => {
      const postId = action.payload.postId;
      const postToUpdate = state.post.find((p) => p._id === postId);
      postToUpdate.likes -= 1;
    },    
    unLikePostFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },

  },
);


export const cardReducer = createReducer(
  {},
  
  {    
   
    getUserCardsRequest: (state) => {
      state.loading = true;
    },
    getUserCardsSuccess: (state, action) => {
      // state.loading = false;
      state.isAuthenticated = true;
      state.card = action.payload;
      // state.message = action.payload.message;
    },
    getUserCardsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

  },
);

export const messageReducer = createReducer(
  {},
  {
    updateProfileRequest: (state) => {
      state.loading = true;
    },
    updateProfileSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    updateProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updatePasswordRequest: (state) => {
      state.loading = true;
    },
    updatePasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    updatePasswordFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    forgetPasswordRequest: (state) => {
      state.loading = true;
    },
    forgetPasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    forgetPasswordFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    resetPasswordRequest: (state) => {
      state.loading = true;
    },
    resetPasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    resetPasswordFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    clearMessage: (state) => {
      state.message = null;
    },

    addPostRequest: (state) => {
      state.loading = true;
    },
    addPostSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    addPostFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updatePostRequest: (state) => {
      state.loading = true;
    },
    updatePostSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    updatePostFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deletePostRequest: (state) => {
      state.loading = true;
    },
    deletePostSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    deletePostFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    scannIdRequest: (state) => {
      state.loading = true;
    },
    scannIdSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
      state.data = action.payload;
    },
    scannIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addCardRequest: (state) => {
      state.loading = true;
    },
    addCardSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    addCardFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  }
);
