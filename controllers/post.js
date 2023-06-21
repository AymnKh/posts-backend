import Post from "../models/post.js";

export function addPost(req, res) {
  let post = new Post();
  if (req.file) {
    const file = req.file;
    const fileName = file.filename; // get image name
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`; // get image path
    post = {
      title: req.body.title,
      content: req.body.content,
      creator: req.userData.userID,
      image: `${basePath}${fileName}`,
    };
  } else {
    post = {
      title: req.body.title,
      content: req.body.content,
      creator: req.userData.userID,
      image: "",
    };
  }

  Post.create(post)
    .then((post) => {
      return res.status(200).json(post);
    })
    .catch((err) => {
      return res.status(500).json({message:'Creating post failed !'});
    });
}
export function getPosts(req, res) {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const post = Post.find();
  if (pageSize && currentPage) {
    post.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  post
    .then(async (posts) => {
      const count = await Post.count();
      return res.status(200).json({ posts, count });
    })
    .catch((err) => {
      return res.status(500).json({message:'Getting posts failed !'});
    });
}
export function deletePost(req, res) {
  const id = req.params.id;
  Post.deleteOne({ _id: id, creator: req.userData.userID })
    .then((post) => {
      if (post.deletedCount > 0)
        return res.status(200).json({ message: "post deleted" });
      return res
        .status(401)
        .json({ message: "post not delete user not authorized" });
    })
    .catch((err) => {
      return res.status(500).json({message:'Delete post failed !'});
    });
}
export function updatePost(req, res) {
  const file = req.file;
  let post = new Post();
  if (file) {
    const fileName = file.filename; // get image name
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`; // get image path
    const image = `${basePath}${fileName}`;
    post = {
      title: req.body.title,
      content: req.body.content,
      image: image,
      creator: req.userData.userID,
    };
  } else {
    post = {
      title: req.body.title,
      content: req.body.content,
      image: req.body.image,
      creator: req.userData.userID,
    };
  }

  const id = req.params.id;

  Post.updateOne({ _id: id, creator: req.userData.userID }, post)
    .then((post) => {
      if (post.modifiedCount > 0) {
        return res.status(200).json({ message: "post updated" });
      }
      return res
        .status(401)
        .json({ message: "post not updated .. user not authecticated !" });
    })

    .catch((err) => {
      return res.status(500).json({message:'Update post failed !'});
    });
}
