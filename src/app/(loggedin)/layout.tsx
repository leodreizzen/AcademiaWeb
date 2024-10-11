import NavBar from "@/components/ui/Navbar/NavBar";
import {fetchCurrentUser} from "@/lib/data/users";
export default async function Layout({ children }: { children: React.ReactNode }) {
    const user = await fetchCurrentUser();
    if(!user)
        throw new Error("Couldn`t fetch user")
    return (
        <div className="min-h-screen flex flex-col h-screen overflow-auto">
            <NavBar role={user.role} firstName={user.user.firstName} lastName={user.user.lastName}/>
            <main className="flex-grow w-full mx-auto overflow-auto bg-gray-900">
                {children}
            </main>
        </div>
    )
}