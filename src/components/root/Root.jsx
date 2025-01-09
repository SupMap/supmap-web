import { Outlet } from "react-router-dom"
import MyNavbar from "../navbar/Navbar"

export default function Root() {

    return (
        <div
            className="root"
        >
            <MyNavbar />
            <main className="main">
                <Outlet />
            </main>
            {/* <Footer /> */}
        </div>
    )
}