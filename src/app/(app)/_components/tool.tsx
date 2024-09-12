"use client";

import { cn } from "@/lib/utils";
import { jsPDF, type ImageFormat } from "jspdf";
import { ImagePlus, ImageUp } from "lucide-react";
import { nanoid } from "nanoid";
import Image from "next/image";
import { ChangeEvent, DragEvent, useState } from "react";

interface PDFImage {
  id: string;
  file: File;
  dataURL: string;
  width: number;
  height: number;
}

const transformImageFile = async (file: File): Promise<PDFImage> => {
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

const transformFiles = async (images: File[]) => {
  const res: PDFImage[] = [];

  for (let imgFile of images) {
    res.push(await transformImageFile(imgFile));
  }

  return res;
};

const getImageOptions = (image: PDFImage, pageSize: { w: number; h: number }) => {
  const pageAspectRatio = pageSize.w / pageSize.h;
  const imageAspectRatio = image.width / image.height;

  let dimension: { x: number; y: number; width: number; height: number };

  if (imageAspectRatio > pageAspectRatio) {
    const height = pageSize.w / imageAspectRatio;
    dimension = { x: 0, y: (pageSize.h - height) / 2, width: pageSize.w, height: height };
  } else {
    const width = pageSize.h * imageAspectRatio;
    dimension = { x: (pageSize.w - width) / 2, y: 0, width: width, height: pageSize.h };
  }

  return {
    imageData: image.dataURL,
    format: image.file.type.split("/")[1] as ImageFormat,
    ...dimension,
  };
};
function Tool() {
  const [images, setImages] = useState<PDFImage[]>([]);

  const handleSelectImages = async (files: File[]) => {
    setImages(await transformFiles(files));
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length < 1) return;

    const transformed = await transformFiles(files);
    setImages((prev) => [...prev, ...transformed]);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageSize = doc.internal.pageSize;
    images.forEach((image, index) => {
      doc.addImage(getImageOptions(image, { w: pageSize.getWidth(), h: pageSize.getHeight() }));
      if (index < images.length - 1) {
        doc.addPage();
      }
    });
    doc.save("file.pdf");
  };

  if (images.length === 0) {
    return <EmptyState onSelectImages={handleSelectImages} />;
  }

  return (
    <main className="p-8 grow">
      <div className="w-full max-w-screen-lg gap-6 mx-auto grid grid-cols-[repeat(auto-fit,200px)] justify-center">
        {images.map((img) => (
          <div
            key={img.id}
            className="bg-muted border rounded-md aspect-square inline-block relative"
          >
            <Image src={img.dataURL} alt="" fill className="object-contain" />
          </div>
        ))}
        <label
          id="add-more"
          className="aspect-square rounded-md bg-neutral-50 hover:bg-neutral-100 border flex flex-col justify-center items-center gap-2 cursor-pointer focus-within:border-neutral-500"
        >
          <ImagePlus size={32} />
          <span className="font-medium text-lg">Add more</span>
          <input
            className="sr-only"
            id="add-images"
            type="file"
            onChange={handleFileChange}
            multiple
            accept="image/*"
          />
        </label>

        <button
          id="add-more"
          onClick={generatePDF}
          className="aspect-square rounded-md bg-neutral-50 hover:bg-neutral-100 border flex flex-col justify-center items-center gap-2 cursor-pointer focus-within:border-neutral-500"
        >
          Generate
        </button>
      </div>
    </main>
  );
}

interface EmptyStateProps {
  onSelectImages: (images: File[]) => void;
}
function EmptyState({ onSelectImages }: EmptyStateProps) {
  return (
    <div className="p-8 flex flex-col justify-center items-center gap-4 grow">
      <div className="max-w-[600px] mx-auto text-center space-y-4">
        <h2 className="font-semibold text-xl">Upload Your Images to Create a PDF</h2>
        <p className="text-lg">
          Drag and drop your images below or click to upload. You can reorder, preview, and edit
          images before generating your PDF.
        </p>
      </div>
      <SelectImages onSelect={onSelectImages} />
    </div>
  );
}

interface SelectImagesProps {
  onSelect: (images: File[]) => void;
}
function SelectImages({ onSelect }: SelectImagesProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length < 1) return;
    onSelect(files);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer?.files || []).filter((f) =>
      f.type.startsWith("image/")
    );

    if (files.length < 1) return;
    onSelect(files);
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div>
      <label
        htmlFor="select-image"
        className={cn(
          "cursor-pointer hover:bg-primary-foreground border-2 border-dashed p-6 rounded-xl w-full max-w-[400px] aspect-[2/1] flex flex-col gap-4 items-center justify-center focus-within:border-black",
          { "bg-primary-foreground": isDragOver }
        )}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
      >
        <input
          className="sr-only"
          id="select-image"
          type="file"
          onChange={handleFileChange}
          multiple
          accept="image/*"
        />
        <ImageUp width={50} height={50} />
        <p className="text-center font-medium">
          Drag & drop images here or click to select images.
        </p>
      </label>
    </div>
  );
}

export default Tool;
