import { useMemo, useEffect, useState } from "react";
import { request } from "../../utils";
import { Pagination, PostCard, Search } from "./components";
import { PAGINATION_LIMIT } from "../../constans";
import { debounce } from "./utils";
import styled from "styled-components";

const MainContainer = ({ className }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(2);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [shouldSearch, setShouldSearch] = useState(false);

  useEffect(() => {
    request(
      `/api/posts?search=${searchPhrase}&page=${page}&limit=${PAGINATION_LIMIT}`
    ).then(({ data: { posts, lastPage } }) => {
      setPosts(posts);
      setLastPage(lastPage);
    });
  }, [page, shouldSearch]);

  const startDelayedSearch = useMemo(() => debounce(setShouldSearch, 2000), []);

  const onSearch = ({ target }) => {
    setSearchPhrase(target.value);
    startDelayedSearch(!shouldSearch);
  };

  return (
    <div className={className}>
      <div className="posts-and-search">
        <Search onChange={onSearch} searchPhrase={searchPhrase} />
        {posts.length > 0 ? (
          <div className="post-list">
            {posts.map(
              ({ id, title, imageUrl, publishedAt, comments }) => (
                <PostCard
                  key={id}
                  id={id}
                  imageUrl={imageUrl}
                  title={title}
                  publishedAt={publishedAt}
                  commentsCount={comments}
                />
              )
            )}
          </div>
        ) : (
          <div className="no-posts-found">Ничего не нашлось</div>
        )}
      </div>

      {lastPage > 1 && posts.length > 0 && (
        <Pagination page={page} lastPage={lastPage} setPage={setPage} />
      )}
    </div>
  );
};

export const Main = styled(MainContainer)`
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  & .post-list {
    display: flex;
    flex-wrap: wrap;
    padding: 20px 20px 80px;
  }

  & .no-posts-found {
    font-size: 18px;
    margin-top: 40px;
    text-align: center;
  }
`;
