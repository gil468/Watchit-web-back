import express from "express";
const router = express.Router();
import multer from "multer";

const base = `${process.env.NODE_ENV !== "production" ? "http" : "https"}://${
  process.env.DOMAIN_BASE
}:${process.env.PORT}/`;

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "public/");
  },
  filename: function (_req, file, cb) {
    const ext = file.originalname.split(".").filter(Boolean).slice(1).join(".");
    cb(null, Date.now() + "." + ext);
  },
});
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), (req, res) => {
  res.status(200).send({ url: base + (req as any).file.path });
});
export = router;
