import { Outlet } from "react-router-dom"

export default function Root() {

    return (
        <div className="root">
            <main className="main">
                <Outlet />
            </main>
        </div>
    )
}