import PhotoGallery from "@/components/PhotoGallery";
import WelcomeSection from "@/components/WelcomeSection";

export default function Home() {
    return (
        <div>

            <div className="w-full max-h-1/2">
                <PhotoGallery/>
            </div>
            <WelcomeSection />
            {/*<main*/}
            {/*    className="flex min-h-screen w-full max-w-6xl flex-col items-center justify-between py-8 px-16 bg-white dark:bg-black sm:items-start">*/}
            {/*</main>*/}
        </div>
    );
}
