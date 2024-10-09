import {Card, CardContent} from "@/components/ui/card";
import React from "react";

export function NoResultCard({user}: {user: string}) {
    return <Card key="show" className="bg-gray-700">
        <CardContent className="flex items-center justify-between p-3">
            <div>
                <p className="font-semibold text-white text-xl">No se encontraron {user} con esos filtros</p>
            </div>
        </CardContent>
    </Card>;
}