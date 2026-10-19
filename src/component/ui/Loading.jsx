export const Loading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <div className="w-16 h-16 border-8 border-blue-500 border-dotted rounded-full animate-spin"></div>
        </div>
    // <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 z-50">
    //     <div className="w-20 h-20 border-8 border-t-8 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
    //     <p className="mt-4 text-lg text-blue-500">Loading...</p>
    // </div>
    );
};