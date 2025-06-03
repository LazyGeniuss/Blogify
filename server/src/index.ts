import express from "express";
import userRoute from "./routes/userRoute";
import blogRoute from "./routes/blogRoute";


const cors = require("cors");

const app = express();

app.use(cors({
  origin: 'https://blogify-frontend-0o5m.onrender.com',
  // origin: 'http://localhost:5173',
  // credentials: true // if you're using cookies or auth headers
}));
app.use(express.json())

app.use("/user", userRoute)
app.use("/blog", blogRoute)

app.use("/", (_, res) => {
  res.status(400).send("No route found")
  return;
})

app.listen(3000, () => {
  console.log("listening at port 3000");
})
