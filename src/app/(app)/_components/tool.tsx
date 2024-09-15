"use client";

import { Label } from "@/components/ui/label";
import { generatePDF } from "@/lib/jspdf";
import { transformFiles } from "@/lib/pdfimage";
import { PDFImage } from "@/lib/types";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { ImagePlus } from "lucide-react";
import { ChangeEvent, useState } from "react";
import EmptyState from "./empty-state";
import { DraggableImageCard, ImageCard } from "./image-card";
import PDFOptions from "./pdf-options";

function Tool() {
  const [images, setImages] = useState<PDFImage[]>([]);
  const [modalContainer, setModalContainer] = useState<HTMLElement | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor)
  );
  const [activeImageID, setActiveImageID] = useState<string | null>(null);
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

  if (images.length === 0) {
    return <EmptyState onSelectImages={handleSelectImages} />;
  }

  const removeImage = (id: PDFImage["id"]) => {
    setImages((images) => images.filter((img) => img.id !== id));
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setImages((images) => {
        const oldIndex = images.findIndex(({ id }) => id === active.id);
        const newIndex = images.findIndex(({ id }) => id === over?.id);

        return arrayMove(images, oldIndex, newIndex);
      });
    }

    setActiveImageID(null);
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;

    setActiveImageID(active.id as string);
  }

  return (
    <main className="grow relative" ref={setModalContainer} id="options-modal-container">
      <div className="absolute inset-0">
        <div className="md:w-[calc(100vw_-_20rem)] max-h-full scrollbar-thin overflow-y-auto grow py-6 px-8 gap-6 justify-center grid grid-cols-[repeat(auto-fit,200px)]">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            <SortableContext items={images}>
              {images.map((img) => (
                <DraggableImageCard image={img} key={img.id} onRemove={removeImage} />
              ))}
            </SortableContext>
            <DragOverlay>
              {activeImageID ? (
                <ImageCard
                  image={images.find((image) => image.id === activeImageID)!}
                  onRemove={removeImage}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
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

      <PDFOptions
        onGenerate={(options) => generatePDF(images, options)}
        onReset={reset}
        container={modalContainer}
      />
    </main>
  );
}

export default Tool;
