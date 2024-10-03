import { useState } from "react";

function CommentLikesView({ user, like, token }) {
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
      <>
        {liker.id === user.id ? (
          <p>You liked this</p>
        ) : (
          <p>Liked by {liker.username}</p>
        )}
      </>
    );
  }
}

export default CommentLikesView;
