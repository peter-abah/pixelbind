import { PDFImage } from "@/lib/types";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { X } from "lucide-react";
import Image from "next/image";
import { CSSProperties, forwardRef } from "react";

interface ImageCardProps {
  image: PDFImage;
  onRemove: (id: PDFImage["id"]) => void;
  _internal?: {
    style?: CSSProperties;
    attributes?: DraggableAttributes;
    listeners?: SyntheticListenerMap;
  };
}
export function DraggableImageCard(props: ImageCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props.image.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition,
      }
    : undefined;
  return <ImageCard ref={setNodeRef} {...props} _internal={{ attributes, listeners, style }} />;
}

export const ImageCard = forwardRef<HTMLDivElement, ImageCardProps>(function ImageCard(
  { image, onRemove, _internal },
  ref
) {
  return (
    <div
      ref={ref}
      className="bg-neutral-50 border rounded-md inline-block p-2 min-w-[200px] touch-manipulation"
      {..._internal?.attributes}
      {..._internal?.listeners}
      style={_internal?.style}
    >
      <div className="flex justify-end">
        <button
          className="p-2 rounded-full hover:bg-neutral-200 top-0 right-0 bg-neutral-50"
          title="Remove image"
          type="button"
          onClick={() => onRemove(image.id)}
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Remove image</span>
        </button>
      </div>

      <div className="relative aspect-square">
        <Image src={image.dataURL} alt="" fill className="object-contain" />
      </div>
    </div>
  );
});

export default ImageCard;
