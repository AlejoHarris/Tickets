import Multer, { memoryStorage } from "multer";

const maxSize = 2 * 1024 * 1024;

let processFile = Multer({
  storage: memoryStorage(),
  limits: { fileSize: maxSize },
}).single("image");


export default processFile;