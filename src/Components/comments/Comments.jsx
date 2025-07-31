import React from 'react';
import style from './Comments.module.css'
import PropTypes from 'prop-types';
import { dateAndTimeFormat } from '../../helper';


function Comments({comments}) {
    return (
        <div className={style.comments_parent}>
            {comments?.map((comment) => (
                <div key={comment.id} className={style[comment.userType]}>
                    <p>{comment.comment}</p>
                    <p>
                        <sapn>{dateAndTimeFormat(comment.createdAt)}</sapn>
                        <sapn>{comment.userType}</sapn>
                    </p>
                </div>
            ))}
        </div>
    )
}

export default Comments;

Comments.propTypes = {
  comments: PropTypes.func.isRequired
};