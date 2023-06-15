import Post from "../models/post.js";

export function addPost(req, res) {
  console.log(req.userData);
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
      return res.status(500).json(err);
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
      return res.status(200).json({posts, count});
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
}
export function deletePost(req, res) {
  const id = req.params.id;
  Post.findByIdAndDelete(id)
    .then((post) => {
      return res.status(200).json(post);
    })
    .catch((err) => {
      return res.status(500).json(err);
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
    };
  } else {
    post = {
      title: req.body.title,
      content: req.body.content,
      image: req.body.image,
    };
  }

  const id = req.params.id;

  Post.findByIdAndUpdate(id, post, { new: true })
    .then((post) => {
      return res.status(200).json(post);
    })

    .catch((err) => {
      return res.status(500).json(err);
    });
}
