import PropTypes from "prop-types";
import { Icon } from "../../../../../components";
import { useDispatch, useSelector } from "react-redux";
import {
  openModal,
  CLOSE_MODAL,
  removeCommentAsync,
} from "../../../../../action";
import { selectUserRole } from "../../../../../selectors";
import { ROLE } from "../../../../../constans";
import styled from "styled-components";

const CommentContainer = ({
  className,
  postId,
  id,
  author,
  content,
  publishedAt,
}) => {
  const dispatch = useDispatch();
  const userRole = useSelector(selectUserRole);
  const onCommentRemove = (id) => {
    dispatch(
      openModal({
        text: " Удалить комментарий?",
        onConfirm: () => {
          dispatch(removeCommentAsync(postId, id));
          dispatch(CLOSE_MODAL);
        },
        onCancel: () => dispatch(CLOSE_MODAL),
      })
    );
  };

  const isAdminOrModerator = [ROLE.ADMIN, ROLE.MODERATOR].includes(userRole);
  return (
    <div className={className}>
      <div className="comment">
        <div className="information-panel">
          <div className="author">
            <Icon
              $inactive={true}
              id="fa-user-circle-o"
              margin="0 18px 0 0"
              size="21px"
              onClick={() => {}}
            />
            {author}
          </div>
          <div className="published-at">
            <Icon
              $inactive={true}
              id="fa-calendar-o"
              margin="0 10px 0 0"
              size="18px"
              onClick={() => {}}
            />
            {publishedAt}
          </div>
        </div>
        <div className="comment-text">{content}</div>
      </div>
      {isAdminOrModerator && (
        <Icon
          id="fa-trash-o"
          margin="0 0 0 10px"
          size="21px"
          onClick={() => onCommentRemove(id)}
        />
      )}
    </div>
  );
};

export const Comment = styled(CommentContainer)`
  display: flex;
  margin-top: 10px;
  & .comment {
    width: 550px;
    padding: 5px 10px;
    border: 1px solid black;
  }
  & .information-panel {
    display: flex;
    justify-content: space-between;
  }
  & .author {
    display: flex;
  }
  & .published-at {
    display: flex;
  }
`;
CommentContainer.prototype = {
  postId: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  author: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  publishedAt: PropTypes.string.isRequired,
};
