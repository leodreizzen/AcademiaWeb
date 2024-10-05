import {Card, CardContent} from "@/components/ui/card";
import React from "react";

export function NoResultCard() {
    return <Card key="show" className="bg-gray-700">
        <CardContent className="flex items-center justify-between p-3">
            <div>
                <p className="font-semibold text-white text-xl">No se encontraron resultados</p>
            </div>
        </CardContent>
    </Card>;
}