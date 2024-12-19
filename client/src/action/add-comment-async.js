import { request } from "../utils";
import { addComment } from "./add-comment";

export const addCommentAsync = (postId, content) => (dispatch) => {
    request(`/api/posts/${postId}`,"POST", {content}).then((comment) => {
        dispatch(addComment(comment.data));
      }
    );
  };
