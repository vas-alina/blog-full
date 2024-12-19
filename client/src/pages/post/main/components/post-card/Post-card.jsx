import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Icon } from "../../../../components";

const PostCardContainer = ({
  className,
  id,
  title,
  imageUrl,
  publishedAt,
  commentsCount,
}) => {
  return (
    <div className={className}>
      <Link to={`/post/${id}`}>
        <img src={imageUrl} alt={title} />
        <div className="post-card-footer">
          <h4>{title}</h4>
          <div className="post-card-info">
            <div className="published-at">
              <Icon
                $inactive={true}
                id="fa-calendar-o"
                margin="0 7px 0 0"
                size="18px"
                onClick={() => {}}
              />
              {publishedAt}
            </div>
            <div className="comment-count">
              <Icon
                $inactive={true}
                id="fa-comment-o"
                margin="0 7px 0 0"
                size="18px"
                onClick={() => {}}
              />
              {commentsCount}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export const PostCard = styled(PostCardContainer)`
  display: flex;
  flex-direction: column;
  width: 280px;
  margin: 20px;
  border: 1px solid #000;
  height: 230px;
  & img {
    display: block;
    width: 100%;
  }

  & h4 {
    margin: 5px 0 0;
  }

  & .post-card-footer {
    border-top: 1px solid #000;
    padding: 5px;
  }

  & .post-card-info {
    display: flex;
    justify-content: space-between;
    padding: 5px;
    margin-top: 5px;
  }

  & .published-at {
    display: flex;
  }

  & .comment-count {
    display: flex;
  }
`;
PostCardContainer.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  publishedAt: PropTypes.string.isRequired,
  commentsCount: PropTypes.number.isRequired,
}