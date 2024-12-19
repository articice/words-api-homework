import express, { urlencoded, json } from "express";

import {router as wordsApiRouter} from "./routes/words";

const port = process.env.PORT || 8000;
const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());

app.use('/words', wordsApiRouter);

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Server is up and running" });
});

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
