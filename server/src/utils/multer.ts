import mongoose from "mongoose";

const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage")
const Grid = require("gridfs-stream");
require('dotenv').config()

let gridfsBucket;
mongoose.connect(process.env.MONGO_URL!).then((mongoose) => {
  console.log("connected to mongo ");
}).catch(e => {
  console.log("e", e);
})

const storage = new GridFsStorage({
  url: process.env.MONGO_URL!,
  file: (req: any, file: any) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      return {
        bucketName: "blogImages",
        filename: `${Date.now()}_${file.originalname}`,
      }
    } else {
      return `${Date.now()}_${file.originalname}`
    }
  },
})

export const upload = multer({ storage: storage });

export const GFS = async () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db!, {
    bucketName: 'blogImages'
  });

  const gfs = new Grid(mongoose.connection.db, mongoose.mongo)
  gfs.collection("blogImages");
  return { gfs, gridfsBucket };
};

