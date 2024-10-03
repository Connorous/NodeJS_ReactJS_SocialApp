import { useState } from "react";

function PostLikesView({ user, like, token }) {
  const [liker, setLiker] = useState(null);

  if (liker === null) {
    if (user.id === like.likerId) {
      setLiker(user);
    } else {
      setLiker(like.liker);
    }
  }

  if (liker !== null) {
    return (
      <div className="post-like">
        {liker.id === user.id ? (
          <p>You liked this</p>
        ) : (
          <p>Liked by {liker.username}</p>
        )}
      </div>
    );
  }
}

export default PostLikesView;
