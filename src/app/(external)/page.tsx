import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, Laptop, Lock, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import screenshot from "~/public/images/landing.png";

export default function PixelBindLanding() {
  return (
    <>
      <main className="flex-1">
        <section className="w-full min-h-screen grid place-items-center py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Transform Images to PDF Locally
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  pixelbind converts your images to high-quality PDFs in seconds, right on your
                  device. No data sent to servers, complete privacy guaranteed.
                </p>
              </div>
              <Link href="/app" className={cn(buttonVariants({ size: "lg" }), "text-base")}>
                Get Started
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container mx-auto px-6">
            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl animate-fade-in-up">
                  Simple, Powerful, and Secure
                </h2>
                <p className="text-muted-foreground md:text-xl animate-fade-in-up animation-delay-200">
                  pixelbind offers an intuitive interface for converting your images to PDF. With
                  customizable options and drag-and-drop functionality, creating the perfect PDF has
                  never been easier.
                </p>
              </div>
              <div className="flex justify-center animate-fade-in-up animation-delay-400">
                <div className="p-6 bg-background rounded-xl w-full max-w-2xl shadow-xl">
                  <div className="relative aspect-video overflow-hidden rounded-sm ">
                    <Image src={screenshot} alt="pixelbind Interface" layout="fill" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32" id="features">
          <div className="container px-6 mx-auto">
            <h2 className="text-3xl font-semibold tracking-tighter sm:text-4xl text-center mb-12">
              Key Features
            </h2>
            <div className="gap-10 sm:grid-cols-2 md:grid-cols-3 flex flex-wrap justify-center">
              <div className="flex flex-col items-center text-center w-full max-w-[300px]">
                <Laptop className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">100% Local Processing</h3>
                <p className="text-muted-foreground">
                  All conversions happen on your device. Your files never leave your computer.
                </p>
              </div>
              <div className="flex flex-col items-center text-center w-full max-w-[300px]">
                <Settings className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Customizable Options</h3>
                <p className="text-muted-foreground">
                  Set margins, size, orientation, and more to get the perfect PDF output.
                </p>
              </div>
              <div className="flex flex-col items-center text-center w-full max-w-[300px]">
                <FileText className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Multiple Formats</h3>
                <p className="text-muted-foreground">
                  Support for JPG, PNG, TIFF, and more. Convert any image to PDF.
                </p>
              </div>

              <div className="flex flex-col items-center text-center w-full max-w-[300px]">
                <Lock className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">100% Secure & Private</h3>
                <p className="text-muted-foreground">
                  Your files never leave your device. Complete privacy and security guaranteed.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted" id="how-it-works">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-semibold tracking-tighter sm:text-4xl text-center mb-12">
              How It Works
            </h2>
            <div className="grid gap-6 lg:grid-cols-3 justify-center">
              {[
                {
                  title: "Select Images",
                  description: "Choose the images you want to convert from your local device.",
                },
                {
                  title: "Customize",
                  description:
                    "Set margins, size, orientation, and other options to your preference.",
                },
                {
                  title: "Convert",
                  description:
                    "Click convert and get your PDF instantly, all processed locally on your device.",
                },
              ].map(({ title, description }, index) => (
                <div
                  key={title}
                  className="p-8 flex flex-col items-center text-center space-y-4 rounded-xl bg-card text-card-foreground max-w-[500px]"
                >
                  <p className="rounded-full bg-primary/10 w-16 h-16 grid place-items-center text-4xl font-semibold text-primary">
                    {index + 1}
                  </p>
                  <h3 className="text-2xl font-semibold">{title}</h3>
                  <p className="text-muted-foreground text-lg">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-semibold tracking-tighter sm:text-4xl text-center mb-12">
              Customization Options
            </h2>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 max-w-3xl mx-auto">
              <div className="flex flex-col space-y-2">
                <h3 className="text-xl font-semibold">Page Size</h3>
                <p className="text-muted-foreground">
                  Choose from standard sizes like A4, Letter, Legal, or set a custom size.
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <h3 className="text-xl font-semibold">Orientation</h3>
                <p className="text-muted-foreground">
                  Set your PDF to portrait or landscape orientation.
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <h3 className="text-xl font-semibold">Margins</h3>
                <p className="text-muted-foreground">Adjust margins as needed.</p>
              </div>
              <div className="flex flex-col space-y-2">
                <h3 className="text-xl font-semibold">Image Quality</h3>
                <p className="text-muted-foreground">
                  Balance between file size and image quality with our compression options.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4">
              100% Free, No Strings Attached
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mb-8">
              pixelbind is completely free to use. No hidden fees, no subscriptions, just a powerful
              tool at your fingertips.
            </p>
            <Link href="/app" className={cn(buttonVariants({ size: "lg" }), "text-base")}>
              Get Started
            </Link>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2024 pixel. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <p className="text-xs">
            Built with ❤️ by{" "}
            <a
              className="text-xs font-medium hover:underline underline-offset-4"
              href="https://peterabah.vercel.app"
              target="_blank"
            >
              Peter Abah
            </a>
          </p>
        </nav>
      </footer>
    </>
  );
}
