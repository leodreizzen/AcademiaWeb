// PaginationControls.tsx
'use client'

import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import { Button } from "@/components/ui/button"


function PaginationControls({ cantPages }: { cantPages: number }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const page = parseInt(searchParams.get('page') ?? '1', 10);


    return (
        <div className='bg-inherit m-5 text-gray-100 flex items-center justify-center overflow-hidden'>
            <Button
                className='bg-[#59999C] hover:bg-[#5FC8CD]'
                size="lg"
                disabled={page <= 1} // Deshabilitar el botón si estamos en la primera página
                onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set('page', String(page - 1));
                    router.push(`${pathname}/?${newParams.toString()}`);
                }}
            >
                Prev Page
            </Button>

            <div className="mx-4 text-[#76ABAE]">
                {page}
            </div>

            <Button
                className="bg-[#59999C] hover:bg-[#5FC8CD]"
                size="lg"
                disabled={page >= cantPages}
                onClick={() => {
                    if (page < cantPages) {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set('page', String(page + 1));
                        router.push(`${pathname}/?${newParams.toString()}`);
                    }
                }}
            >
                Next Page
            </Button>
        </div>
    );
}

export default PaginationControls