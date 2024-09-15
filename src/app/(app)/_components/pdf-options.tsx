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
import { DownloadIcon, LoaderCircle, RefreshCwIcon, Settings2, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import {
  type PDFOptionsSchema,
  type PDFOptions as IPDFOptions,
  pdfOptionsSchema,
} from "@/lib/schema";

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
  } = useForm<PDFOptionsSchema>({
    resolver: zodResolver(pdfOptionsSchema),
    defaultValues: {
      size: "a4",
      margin: "small",
      orientation: "portrait",
      filename: "",
      compress: false,
    },
  });

  const onSubmit = async (options: PDFOptionsSchema) => {
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
      <div className="hidden md:w-80 w-full max-w-[90%] scrollbar-thin overflow-y-auto border-l z-10 py-6 px-4 h-full shrink-0 bg-background absolute top-0 right-0 md:flex flex-col">
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
            <div className="w-full max-w-80 scrollbar-thin overflow-y-auto border-l z-50 p-4 h-full shrink-0 bg-background md:flex flex-col absolute top-0 right-0 data-[state=open]:animate-in data-[state=closed]:animate-out slide-in-from-right slide-out-to-right">
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

export default PDFOptions;
