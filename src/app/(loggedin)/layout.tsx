import NavBar from "@/components/ui/NavBar";
import {fetchCurrentUser} from "@/lib/data/users";
export default function Layout({ children }: { children: React.ReactNode }) {
    const user = fetchCurrentUser();
    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
            <NavBar } />
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    )
}