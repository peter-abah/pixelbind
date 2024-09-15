import { PDFImage } from "@/lib/types";
import Image from "next/image";

interface ImageCardProps {
  image: PDFImage;
//   onRemove: (id: PDFImage["id"]) => void;
}
function ImageCard({ image }: ImageCardProps) {
  return (
    <div
      key={image.id}
      className="bg-neutral-50 border rounded-md aspect-square inline-block relative"
    >
      <Image src={image.dataURL} alt="" fill className="object-contain" />
    </div>
  );
}

export default ImageCard;