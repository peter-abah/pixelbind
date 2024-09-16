"use client";

import { useToast } from "@/hooks/use-toast";
import { ACCEPTED_IMAGE_TYPES, ACCEPTED_IMAGE_TYPES_WITH_PERIOD } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ImageUp } from "lucide-react";
import { ChangeEvent, DragEvent, useState } from "react";

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
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length < 1) return;

    onSelect(files);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer?.files || []).filter((f) =>
      ACCEPTED_IMAGE_TYPES_WITH_PERIOD.some((type) => f.type.endsWith(type))
    );

    if (files.length < 1) {
      const acceptedFormats =
        ACCEPTED_IMAGE_TYPES.slice(0, -1).join(", ") + `, and ${ACCEPTED_IMAGE_TYPES.at(0)}`;
      toast({
        description: `Invalid file. Accepted formats are ${acceptedFormats}`,
        variant: "destructive",
      });
      return;
    }
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
          accept={ACCEPTED_IMAGE_TYPES_WITH_PERIOD.join(",")}
        />
        <ImageUp width={50} height={50} />
        <p className="text-center font-medium">
          Drag & drop images here or click to select images.{" "}
          <span className="opacity-80">({ACCEPTED_IMAGE_TYPES.join(", ")})</span>
        </p>
      </label>
    </div>
  );
}

export default EmptyState;
