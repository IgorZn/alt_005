// app/prozhivanie/loading.tsx
export default function HousesLoading() {
    return (
        <div className="w-full min-h-screen bg-white dark:bg-black">
            <div className="bg-gradient-to-r from-amber-50 to-white dark:from-gray-900 dark:to-black py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="h-16 w-96 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg mb-4" />
                    <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="space-y-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse" />
                                <div className="p-6 space-y-4">
                                    <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                                    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                                    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                                    <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}