// import { CommentProps } from "./Comment";
import data from "./CommentExampleData.json";

const nestComments = (commentList) => {
  let commentMap = {};
  // console.log("0", commentList, commentMap);

  // move all the comments into a map of id => comment
  commentList.forEach(
    (comment) => (commentMap[comment.id] = comment)
  );

  // console.log("1", commentMap);

  // iterate over the comments again and correctly nest the children
  commentList.forEach((comment) => {
    if (comment.parentId !== null) {
      const parent = commentMap[comment.parentId];
      (parent.subComments = parent.subComments || []).push(comment);
    }
  });

  // console.log("2", commentMap, commentList);

  // filter the list to return a list of correctly nested comments
  commentMap = {};
  return commentList.filter((comment) => {
    return comment.parentId === null;
  });
};

nestComments(data);
