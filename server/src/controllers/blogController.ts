import { NextFunction, Response, Request } from "express";
import Blog from "../models/Blog";
import { GFS } from "../utils/multer";

export const getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { perPage, page } = req.params;

    const resp = await Blog.find({ isDeleted: false }).sort({ date: -1 }).limit(parseInt(perPage) ?? 10).skip((parseInt(page) - 1) * parseInt(perPage));

    res.status(200).send({ "data": resp })
    return;
  } catch (e: any) {
    console.log("e", e);
    res.status(500).send({ "message": "Db might be down. Please try again later" })
    return;
  }
}

export const getBlogsByCategroy = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const groupedBlogs = await Blog.aggregate([
      { $match: { isDeleted: false } },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category',
          blogs: { $push: { title: '$title', content: '$content', image: '$image', date: '$date', email: '$email', _id: "$_id" } }
        }
      },
      { $sort: { '_id': -1 } }
    ]);
    res.status(200).send({ "data": groupedBlogs })
    return;
  } catch (e: any) {
    console.log("e", e);
    res.status(500).send({ "message": "Db might be down. Please try again later" })
    return;
  }
}

export const getBlogById = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { id } = req.params;

    const resp = await Blog.findOne({ _id: id, isDeleted: false });

    let isLiked = false;

    if (req.user) {
      const { email } = req.user;
      if (resp?.likes?.includes(email)) {
        isLiked = true

      }
    }

    res.status(200).send({ "data": { ...resp?.toJSON(), isLiked } })
  } catch (e) {
    console.log("e", e);
    res.status(404).send({ "message": "Blog not found" })
  }
  return;
}

export const getImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { gfs, gridfsBucket } = await GFS();
    const resp = await Blog.findOne({ _id: id, isDeleted: false });
    const image = await gfs.files.findOne({ filename: resp?.image });
    if (image?._id) {
      const readstream = gridfsBucket.openDownloadStream(image?._id);
      readstream.pipe(res);
    } else {
      res.status(404).send({ "data": "Image not found" });
    }
  } catch (e) {
    res.status(404).send({ "data": "Image not found" });
  }
  return;
}

export const postBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.user;
  const { content, likes, title, category } = req.body;

  if (!content) {
    res.send({ "message": "Please enter the content" });
    return
  }
  if (!title) {
    res.send({ "message": "Please enter the title" });
    return;
  }

  try {

    const resp = await Blog.create({
      content: content,
      email: email,
      image: req?.file?.filename,
      likes: likes,
      title: title,
      date: new Date(),
      category: category ?? ["Others"],
    });

    res.status(201).send({ "message": "Posted!" })
    return;
  } catch (e) {
    console.log("e", e);
    res.status(500).send({ "message": "Db might be down. Please try again later" })
    return;
  }
}

export const editBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.user;
  const { content, image, title, category } = req.body;
  const { id } = req.params;

  if (!content) {
    res.send({ "message": "Please enter the content" });
    return
  }

  if (!title) {
    res.send({ "message": "Please enter the content" });
    return;
  }

  if (!category || category.length === 0) {
    res.send({ "message": "Please select the category" });
    return;
  }

  try {

    const resp = await Blog.updateOne(
      { _id: id, email: email },
      { $set: { title, content, category, image: req?.file?.filename } })

    res.status(200).send({ "message": "Updated!" })
    return;
  } catch (e) {
    console.log("e", e);
    res.status(500).send({ "message": "Db might be down. Please try again later" })
    return;
  }
}

export const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { email } = req.user;

  try {

    const resp = await Blog.updateOne({ _id: id, email: email }, { $set: { isDeleted: true } })

    res.status(200).send({ "message": "Blog deleted!" })
    return;
  } catch (e: any) {
    console.log("e", e);
    res.status(500).send({ "message": "Db might be down. Please try again later" })
    return;
  }
}

export const likeBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { email } = req.user;

  let blog = await Blog.findById(id);

  try {
    if (!blog?.likes?.includes(email)) {
      let resp = await Blog.findByIdAndUpdate(id, {
        $push: {
          likes: email,
        }
      },
        { new: true }
      );
      res.status(200).send({ "message": "Liked" })
      return;
    } else {

      let resp = await Blog.findByIdAndUpdate(id, {
        $pull: {
          likes: email,
        }
      }, { new: true }
      );

      res.status(200).send({ "message": "Like removed" })
      return;
    }
  } catch (e: any) {
    console.log("e", e);
    res.status(500).send({ "message": "Db might be down. Please try again later" })
    return;
  }
}


