import express from "express";
const router = express.Router();
import multer from "multer";

// const base = "http://" + process.env.DOMAIN_BASE + ":" + process.env.PORT + "/";
const base = "http://localhost:3000/";

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "public/");
  },
  filename: function (_req, file, cb) {
    const ext = file.originalname
      .split(".")
      .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
      .slice(1)
      .join(".");
    cb(null, Date.now() + "." + ext);
  },
});
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), (req, res) => {
  console.log("router.post(/file: " + base + (req as any).file.path);
  res.status(200).send({ url: base + (req as any).file.path });
});
export = router;
