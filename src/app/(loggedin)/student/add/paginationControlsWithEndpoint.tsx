'use client'

import { Button } from "@/components/ui/button"

interface PaginationControlsProps {
    onAction: (page: number) => void;
    currentPage: number;
    lastPage: number;
}


function PaginationControlsWithEndpoint({onAction, currentPage, lastPage}: PaginationControlsProps) {


    return (
        <div className='bg-inherit m-5 text-gray-100 flex items-center justify-center overflow-hidden'>
            <Button
                type="button"
                className='bg-gray-700 text-gray-100 hover:bg-gray-600'
                size="lg"
                disabled={currentPage <= 1} // Deshabilitar el botón si estamos en la primera página
                onClick={() => {
                    const newPage = currentPage - 1;
                    onAction(newPage);
                }}
            >
                Prev Page
            </Button>

            <div className="mx-4 text-[#76ABAE]">
                {currentPage}
            </div>

            <Button
                type="button"
                className="bg-gray-700 text-gray-100 hover:bg-gray-600"
                size="lg"
                disabled={currentPage >= lastPage}
                onClick={() => {
                    if (currentPage < lastPage) {
                        const newPage = currentPage + 1;
                        onAction(newPage);
                    }
                }}
            >
                Next Page
            </Button>
        </div>
    );
}

export default PaginationControlsWithEndpoint
