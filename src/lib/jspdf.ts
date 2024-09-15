import { MARGINS } from "@/lib/constants";
import { PDFOptions as IPDFOptions, PDFOptions } from "@/lib/schema";
import { PDFImage } from "@/lib/types";
import jsPDF, { ImageOptions, type ImageFormat } from "jspdf";

const getImageOptions = (
  image: PDFImage,
  pageSize: { w: number; h: number },
  options: PDFOptions
): ImageOptions => {
  const pageAspectRatio = pageSize.w / pageSize.h;
  const imageAspectRatio = image.width / image.height;
  const margin = image.width * MARGINS[options.margin];

  let dimension: { x: number; y: number; width: number; height: number };
  if (imageAspectRatio > pageAspectRatio) {
    const width = pageSize.w - margin * 2;
    const height = width / imageAspectRatio;
    dimension = { x: margin, y: (pageSize.h - height) / 2, width, height };
  } else {
    const height = pageSize.h - margin * 2;
    const width = height * imageAspectRatio;
    dimension = { x: (pageSize.w - width) / 2, y: margin, width: width, height: height };
  }

  return {
    imageData: image.dataURL,
    format: image.file.type.split("/")[1] as ImageFormat,
    ...dimension,
  };
};

const getPageOptions = (image: PDFImage, options: IPDFOptions) => {
  if (options.size === "fit") {
    const margin = image.width * MARGINS[options.margin];
    const size = [image.width + margin * 2, image.height + margin * 2];
    const orientation = image.width > image.height ? "landscape" : "portrait";

    return { size, orientation } as const;
  } else {
    return {
      size: options.size,
      orientation: options.orientation,
    };
  }
};

export const generatePDF = (images: PDFImage[], options: IPDFOptions) => {
  const currentPageOptions = getPageOptions(images[0], options);
  const doc = new jsPDF({
    format: currentPageOptions.size,
    orientation: currentPageOptions.orientation,
    unit: "px",
    compress: options.compress,
  });
  const pageSize = doc.internal.pageSize;

  images.forEach((image, index) => {
    doc.addImage(
      getImageOptions(image, { w: pageSize.getWidth(), h: pageSize.getHeight() }, options)
    );
    if (index < images.length - 1) {
      const nextImage = images[index + 1];
      const { size, orientation } = getPageOptions(nextImage, options);

      doc.addPage(size, orientation);
    }
  });

  const defaultFilename = "file";
  doc.save(`${options.filename || defaultFilename}.pdf`);
};
