import { useLayoutEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Icon, Input } from "../../../../components";
import { savePostAsync } from "../../../../action";
import { SpecialPanel } from "../special-panel/Special-panel";
import { sanitazeContent } from "./utils";
import { useNavigate } from "react-router";
import { PROP_TYPE } from "../../../../constans";
import styled from "styled-components";

const PostFormContainer = ({
  className,
  post: { id, title, imageUrl, content, publishedAt },
}) => {
  const [imageUrlvalue, setImageUrlvalue] = useState(imageUrl);
  const [titlevalue, setTitlevalue] = useState(title);

  const contentRef = useRef(null);

  useLayoutEffect(() => {
    setImageUrlvalue(imageUrl);
    setTitlevalue(title);
  }, [imageUrl, title]);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const onSave = () => {
    const newContent = sanitazeContent(contentRef.current.innerHTML);

    dispatch(
      savePostAsync(id, {
        imageUrl: imageUrlvalue,
        title: titlevalue,
        content: newContent,
      })
    ).then(({ id }) => navigate(`/post/${id}`));
  };
  const onImageChange = ({ target }) => setImageUrlvalue(target.value);
  const onTitleChange = ({ target }) => setTitlevalue(target.value);
  return (
    <div className={className}>
      <Input
        value={imageUrlvalue}
        placeholder="Изображение..."
        onChange={onImageChange}
      />
      <Input
        value={titlevalue}
        placeholder="Заголовок..."
        onChange={onTitleChange}
      />
      <SpecialPanel
        id={id}
        publishedAt={publishedAt}
        margin="20px 0"
        editButton={
          <Icon
            id="fa-floppy-o"
            size="21px"
            margin="0 10px 0 0"
            onClick={onSave}
          />
        }
      />
      <div
        ref={contentRef}
        contentEditable={true}
        suppressContentEditableWarning={true}
        className="post-text"
      >
        {content}
      </div>
    </div>
  );
};

export const PostForm = styled(PostFormContainer)`
  & img {
    float: left;
    margin: 0 20px 10px 0;
  }
  & .post-text {
    min-height: 80px;
    border: 1px solid #000;
    font-size: 18px;
    white-space: pre-line;
  }
`;
PostFormContainer.propTypes = {
  post: PROP_TYPE.POST.isRequired
}