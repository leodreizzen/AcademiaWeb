import NavBar from "@/components/ui/Navbar/NavBar";
import {fetchCurrentUser} from "@/lib/data/users";
import {countCurrentUserChildren, fetchSelectedChild} from "@/lib/data/children";
export default async function Layout({ children }: { children: React.ReactNode }) {
    const user = await fetchCurrentUser();
    if(!user)
        throw new Error("Couldn`t fetch user")

    let roleParams;
    if(user.role == "Parent"){
        const selectedChild = await fetchSelectedChild();
        if(!selectedChild)
            throw new Error("Couldn`t fetch selected child")
        const childrenCount = await countCurrentUserChildren();
        roleParams = {role: user.role, selectedChild: selectedChild, hasMultipleChildren: childrenCount > 1}
    }
    else
        roleParams = {role: user.role}

    return (
        <div className="min-h-screen flex flex-col h-screen overflow-clip">
            <NavBar firstName={user.user.firstName} lastName={user.user.lastName} {...roleParams}/>
            <main className="flex-grow w-full mx-auto overflow-auto">
                {children}
            </main>
        </div>
    )
}