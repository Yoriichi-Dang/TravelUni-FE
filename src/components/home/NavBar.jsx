import { Link } from "react-router-dom";
import DropdownItem from "./DropdownItem";
import NavItem from "./NavItem";
import { logo } from "@/assets/images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
function NavBar() {
    const pages = [
        { title: "Home", path: "/" },
        { title: "Bookings", path: "/booking" },
        { title: "Reviews", path: "/reviews" },
        {
            title: "Supports",
            children: [
                { title: "Schedule", path: "/schedule" },
                { title: "Find Partners", path: "/find-partners" },
            ],
        },
    ];
    return (
        <nav className="w-full px-8 py-2">
            <div className="flex justify-around items-center">
                <img src={logo} alt="" className="h-28" />
                <div className="flex gap-12 justify-between">
                    {pages.map((page, index) => {
                        if (page.children) {
                            return (
                                <DropdownItem key={index} title={page.title}>
                                    {page.children.map((child, index) => (
                                        <NavItem key={index} title={child.title} to={child.path} />
                                    ))}
                                </DropdownItem>
                            );
                        } else {
                            return <NavItem key={index} title={page.title} to={page.path} />;
                        }
                    })}
                </div>
                <div>
                    <Link
                        to="/auth/signin"
                        className="bg-black text-white px-6 py-3 rounded-2xl border-2 border-black duration-300 ease-in-out font-semibold text-lg hover:bg-white hover:text-black"
                    >
                        Sign In
                        <FontAwesomeIcon className="ml-2" icon={faUser} />
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
