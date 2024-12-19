import { request } from '../utils';
import { setPostData } from './set-post-data';

export const savePostAsync = (id, newPostData) => (dispatch) => {

    const saveRequest = id ?
        request(`/api/posts/${id}`, "PATCH", newPostData) :
        request('/api/posts', "POST", newPostData)

    return saveRequest.then((updatedPost) => {
        dispatch(setPostData(updatedPost.data))
        return updatedPost.data;
    })
}