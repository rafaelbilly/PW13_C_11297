import React, { useEffect, useState } from "react";
import { GetKomentarsById } from "../api/apiKomentar";

const CommentPage = ({ match }) => {
  const [comment, setComment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const commentData = await GetKomentarsById(match.params.commentId);
        setComment(commentData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching comment:", error);
        setError("Error fetching comment. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [match.params.commentId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!comment) {
    return <div>No comment found</div>;
  }

  return (
    <div>
      <h2>Comment Page</h2>
      <p>{comment.text}</p>
      {/* Render other comment details as needed */}
    </div>
  );
};

export default CommentPage;
