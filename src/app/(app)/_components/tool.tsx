"use client";

import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ImageOptions, jsPDF, type ImageFormat } from "jspdf";
import {
  DownloadIcon,
  ImagePlus,
  ImageUp,
  LoaderCircle,
  RefreshCwIcon,
  Settings2,
  X,
} from "lucide-react";
import { nanoid } from "nanoid";
import Image from "next/image";
import { ChangeEvent, DragEvent, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

interface PDFImage {
  id: string;
  file: File;
  dataURL: string;
  width: number;
  height: number;
}

const MARGINS = {
  normal: 0.05,
  large: 0.095,
  small: 0.02,
  none: 0,
};

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

  for (const imgFile of images) {
    res.push(await transformImageFile(imgFile));
  }

  return res;
};

const getImageOptions = (
  image: PDFImage,
  pageSize: { w: number; h: number },
  options: IPDFOptions
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
function Tool() {
  const [images, setImages] = useState<PDFImage[]>([]);
  const [modalContainer, setModalContainer] = useState<HTMLElement | null>(null);
  const handleSelectImages = async (files: File[]) => {
    setImages(await transformFiles(files));
  };

  const reset = () => {
    images.forEach(({ dataURL }) => URL.revokeObjectURL(dataURL));
    setImages([]);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length < 1) return;

    const transformed = await transformFiles(files);
    setImages((prev) => [...prev, ...transformed]);
    e.target.value = "";
  };

  const generatePDF = (options: IPDFOptions) => {
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

  if (images.length === 0) {
    return <EmptyState onSelectImages={handleSelectImages} />;
  }

  return (
    <main className="grow relative" ref={setModalContainer} id="options-modal-container">
      <div className="absolute inset-0">
        <div className="md:w-[calc(100vw_-_20rem)] max-h-full scrollbar-thin overflow-y-auto grow py-6 px-8 gap-6 justify-center grid grid-cols-[repeat(auto-fit,200px)]">
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-neutral-50 border rounded-md aspect-square inline-block relative"
            >
              <Image src={img.dataURL} alt="" fill className="object-contain" />
            </div>
          ))}
          <Label
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
          </Label>
        </div>
      </div>

      <PDFOptions onGenerate={generatePDF} onReset={reset} container={modalContainer} />
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

const optionsSchema = z.object({
  size: z.enum(["a4", "letter", "fit", "legal", "a3"]),
  margin: z.enum(["none", "small", "normal", "large"]),
  orientation: z.enum(["portrait", "landscape"]),
  filename: z.string().trim(),
  compress: z.boolean(),
});

type OptionsSchema = z.infer<typeof optionsSchema>;
type IPDFOptions = OptionsSchema;

interface PDFOptionsProps {
  onGenerate: (options: IPDFOptions) => void;
  onReset: () => void;
  container: HTMLElement | null;
}

function PDFOptions({ onGenerate, onReset, container }: PDFOptionsProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<OptionsSchema>({
    resolver: zodResolver(optionsSchema),
    defaultValues: {
      size: "a4",
      margin: "small",
      orientation: "portrait",
      filename: "",
      compress: false,
    },
  });

  const onSubmit = async (options: OptionsSchema) => {
    return new Promise<void>((resolve, reject) =>
      setTimeout(() => {
        try {
          onGenerate(options);
          resolve();
        } catch {
          reject();
        }
      })
    );
  };

  return (
    <>
      <div className="hidden md:w-80 w-full max-w-[90%] scrollbar-thin overflow-y-auto border border-l z-10 py-6 px-4 h-full shrink-0 bg-background absolute top-0 right-0 md:flex flex-col">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-between gap-4 grow"
        >
          <h2 className="text-lg font-semibold mb-6 sr-only">PDF Options</h2>

          <div className="flex flex-col gap-4 grow">
            <div className="space-y-2">
              <Label htmlFor="page-size">Page Size</Label>
              <Controller
                control={control}
                name="size"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} {...field}>
                    <SelectTrigger id="page-size">
                      <SelectValue placeholder="Select page size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a4">A4</SelectItem>
                      <SelectItem value="letter">Letter</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="fit">Fit (Same size as image)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="page-size">Margin</Label>

              <Controller
                control={control}
                name="margin"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} {...field}>
                    <SelectTrigger id="page-size">
                      <SelectValue placeholder="Select page margin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="large">Big</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orientation">Orientation</Label>
              <Controller
                control={control}
                name="orientation"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} {...field}>
                    <SelectTrigger id="orientation">
                      <SelectValue placeholder="Select orientation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="compress">Compress PDF</Label>
              <Controller
                control={control}
                name="compress"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} id="compress" />
                )}
              />
            </div>

            {/* <div className="space-y-2">
                <Label htmlFor="quality">Image Quality</Label>
                <Slider
                  id="quality"
                  min={0}
                  max={100}
                  step={1}
                  defaultValue={[80]}
                  className="w-full"
                />
                </div> */}

            <div className="space-y-2">
              <Label htmlFor="filename">Output Filename</Label>
              <Input id="filename" placeholder="Enter filename" {...register("filename")} />
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <Button type="button" variant="outline" className="flex-1" onClick={onReset}>
              <RefreshCwIcon className="mr-2 h-4 w-4" /> Reset
            </Button>

            <Button
              className={cn("flex-1 flex gap-2 items-center", { "bg-primary/80": isSubmitting })}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  <span>Generating</span>
                </>
              ) : (
                <>
                  <DownloadIcon className="h-4 w-4" />
                  <span>Generate PDF</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <DialogPrimitive.Root>
        <DialogTrigger className="md:hidden w-14 h-14 grid place-items-center rounded-full bg-primary text-white fixed right-6 bottom-6 z-40 hover:bg-primary/90 transition-all">
          <Settings2 className="w-6 h-6" />
          <span className="sr-only">Open</span>
        </DialogTrigger>

        <DialogPrimitive.Portal container={container}>
          <DialogPrimitive.Overlay className="absolute inset-0 z-50 bg-black/30" />
          <DialogPrimitive.Content asChild>
            <div className="w-full max-w-80 scrollbar-thin overflow-y-auto border border-l z-50 p-4 h-full shrink-0 bg-background md:flex flex-col absolute top-0 right-0 data-[state=open]:animate-in data-[state=closed]:animate-out slide-in-from-right slide-out-to-right">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col justify-between gap-4 grow"
              >
                <h2 className="text-lg font-semibold mb-6 sr-only">PDF Options</h2>

                <DialogPrimitive.Close className="p-1 hover:bg-neutral-50 w-fit rounded-full ml-auto">
                  <span className="sr-only">Close</span>
                  <X className="w-4 h-4" />
                </DialogPrimitive.Close>

                <div className="flex flex-col gap-4 grow">
                  <div className="space-y-2">
                    <Label htmlFor="page-size">Page Size</Label>
                    <Controller
                      control={control}
                      name="size"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} {...field}>
                          <SelectTrigger id="page-size">
                            <SelectValue placeholder="Select page size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="a4">A4</SelectItem>
                            <SelectItem value="letter">Letter</SelectItem>
                            <SelectItem value="legal">Legal</SelectItem>
                            <SelectItem value="fit">Fit (Same size as image)</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="page-size">Margin</Label>

                    <Controller
                      control={control}
                      name="margin"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} {...field}>
                          <SelectTrigger id="page-size">
                            <SelectValue placeholder="Select page margin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="large">Big</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="orientation">Orientation</Label>
                    <Controller
                      control={control}
                      name="orientation"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} {...field}>
                          <SelectTrigger id="orientation">
                            <SelectValue placeholder="Select orientation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="portrait">Portrait</SelectItem>
                            <SelectItem value="landscape">Landscape</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="compress">Compress PDF</Label>
                    <Controller
                      control={control}
                      name="compress"
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="compress"
                        />
                      )}
                    />
                  </div>

                  {/* <div className="space-y-2">
                <Label htmlFor="quality">Image Quality</Label>
                <Slider
                  id="quality"
                  min={0}
                  max={100}
                  step={1}
                  defaultValue={[80]}
                  className="w-full"
                />
                </div> */}

                  <div className="space-y-2">
                    <Label htmlFor="filename">Output Filename</Label>
                    <Input id="filename" placeholder="Enter filename" {...register("filename")} />
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-6">
                  <Button type="button" variant="outline" className="flex-1" onClick={onReset}>
                    <RefreshCwIcon className="mr-2 h-4 w-4" /> Reset
                  </Button>

                  <Button
                    className={cn("flex-1 flex gap-2 items-center", {
                      "bg-primary/80": isSubmitting,
                    })}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        <span>Generating</span>
                      </>
                    ) : (
                      <>
                        <DownloadIcon className="h-4 w-4" />
                        <span>Generate PDF</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
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
