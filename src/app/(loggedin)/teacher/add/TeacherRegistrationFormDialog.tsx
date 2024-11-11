import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {X} from "lucide-react";
import {useState} from "react";
import {GradeWithSubjects} from "@/lib/definitions/grade";


interface TeacherRegistrationFormDialogProps {
    assignedGrades: {[key: number]: string[]},
    onAssignSubject: (grade: string, subject: string) => void,
    onRemoveSubject: (grade: string, subject: string) => void,
    grades: GradeWithSubjects[]
}

export default function TeacherRegistrationFormDialog({assignedGrades, onAssignSubject, onRemoveSubject, grades}: TeacherRegistrationFormDialogProps) {
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null)
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null)

    const gradesWithSubjects = grades

    const handleAssignSubject = () => {
        if (selectedGrade !== null && selectedSubject) {
            onAssignSubject(selectedGrade, selectedSubject)
            setSelectedSubject(null)
        }
    }

    return (

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="outline" className="w-full bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600">
                    Asignar Cursos y Materias
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-800 text-gray-100">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Asignar Cursos y Materias</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="curso" className="text-right text-gray-300">
                            Curso
                        </Label>
                        <Select onValueChange={(value) => setSelectedGrade(value)}>
                            <SelectTrigger className="col-span-3 bg-gray-700 text-gray-100 border-gray-600">
                                <SelectValue placeholder="Seleccionar curso" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 text-gray-100 border-gray-600">
                                {gradesWithSubjects.map((curso) => (
                                    <SelectItem key={curso.name} value={curso.name} className="focus:bg-gray-600">
                                        {curso.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="materia" className="text-right text-gray-300">
                            Materia
                        </Label>
                        <Select onValueChange={setSelectedSubject}>
                            <SelectTrigger className="col-span-3 bg-gray-700 text-gray-100 border-gray-600">
                                <SelectValue placeholder="Seleccionar materia" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 text-gray-100 border-gray-600">
                                {gradesWithSubjects[0].subjects.map((materia) => (
                                    <SelectItem key={materia.name} value={materia.name} className="focus:bg-gray-600">
                                        {materia.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button
                    onClick={handleAssignSubject}
                    disabled={!selectedGrade || !selectedSubject}
                    className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-600"
                >
                    Asignar Materia
                </Button>
                <div className="mt-6 space-y-4">
                    <h4 className="font-semibold text-gray-300">Materias Asignadas:</h4>
                    {Object.entries(assignedGrades).length != 0 && Object.entries(assignedGrades).map(([curso, materias]) => (
                        <div key={curso} className="bg-gray-700 p-3 rounded-md">
                            <h5 className="font-medium text-gray-200">{curso}:</h5>
                            <ul className="list-none mt-1 space-y-1">
                                {materias.map((materia) => (
                                    <li key={materia} className="flex justify-between items-center text-gray-300">
                                        <span>{materia}</span>
                                        <Button
                                            onClick={() => onRemoveSubject(curso, materia)}
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-100 hover:bg-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                            <span className="sr-only">Eliminar {materia}</span>
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}