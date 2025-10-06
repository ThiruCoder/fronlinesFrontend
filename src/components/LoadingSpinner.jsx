import React from 'react'

const LoadingSpinner = () => {
    return (
        <div>
            <div className="flex items-center justify-center align-middle min-h-[200px]">
                <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
        </div>
    )
}

export default LoadingSpinner