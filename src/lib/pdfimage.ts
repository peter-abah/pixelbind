import { nanoid } from "nanoid";
import { PDFImage } from "./types";

export const transformImageFile = async (file: File): Promise<PDFImage> => {
  return new Promise((resolve) => {
    const imgElem = document.createElement("img");
    const dataURL = URL.createObjectURL(file);

    imgElem.addEventListener("load", () => {
      resolve({
        id: nanoid(),
        file,
        dataURL,
        width: imgElem.naturalWidth,
        height: imgElem.naturalHeight,
      });
    });
    imgElem.src = dataURL;
  });
};

export const transformFiles = async (images: File[]) => {
  const res: PDFImage[] = [];

  for (const imgFile of images) {
    res.push(await transformImageFile(imgFile));
  }

  return res;
};
