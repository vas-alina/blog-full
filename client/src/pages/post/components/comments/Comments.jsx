import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Comment } from "./components";
import { Icon } from "../../../../components";
import { selectUserRole } from "../../../../selectors";
import { addCommentAsync } from "../../../../action";
import { PROP_TYPE, ROLE } from "../../../../constans";
import styled from "styled-components";

const CommentsContainer = ({ className, comments, postId }) => {
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();
  const userRole = useSelector(selectUserRole);

  const onNewCommentAdd = (postId, content) => {
    dispatch(addCommentAsync(postId, content));
    setNewComment("");
  };

  const isGuest = userRole === ROLE.GUEST;

  return (
    <div className={className}>
      {!isGuest && (
        <div className="new-comment">
          <textarea
            name="comment"
            value={newComment}
            placeholder="Комментарий..."
            onChange={({ target }) => setNewComment(target.value)}
          ></textarea>
          <Icon
            id="fa-paper-plane-o"
            margin="0 0 0 10px"
            size="21px"
            onClick={() => onNewCommentAdd(postId, newComment)}
          />
        </div>
      )}
      <div className="comments">
        {comments.map(({ id, author, content, publishedAt }) => (
          <Comment
            key={id}
            postId={postId}
            id={id}
            author={author}
            content={content}
            publishedAt={publishedAt}
          />
        ))}
      </div>
    </div>
  );
};

export const Comments = styled(CommentsContainer)`
  margin: 0 auto;
  width: 580px;

  & .new-comment {
    display: flex;
    width: 100%;
    margin: 20px 0 0;
  }

  & .new-comment textarea {
    width: 550px;
    height: 120px;
    font-size: 18px;
    resize: none;
  }
`;

CommentsContainer.prototype = {
  comments: PropTypes.arrayOf(PROP_TYPE.COMMENT).isRequired,
  postId: PropTypes.string.isRequired,
};
