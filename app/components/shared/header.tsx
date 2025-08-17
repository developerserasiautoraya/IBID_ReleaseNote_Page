import Logo from "../../assets/images/logo-web.svg";
const Header = () => { 
    return (
        <div className="flex p-8">
            <div>
               <img src={Logo} alt="Logo" className="w-64" />
            </div>
        </div>
    )
}

export default Header;