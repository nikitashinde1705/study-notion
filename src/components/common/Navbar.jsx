import { useEffect, useState } from "react"
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { useSelector } from "react-redux"
import { Link, matchPath, useLocation } from "react-router-dom"

import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiconnector"
import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropDown"

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
      
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        
        setSubLinks(res.data.data)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])

  console.log("sub links", subLinks)

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }


  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>
        {/* Navigation links */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : subLinks.length ? (
                          <>
                          
                            {subLinks
                              ?.filter(
                                (subLink) => subLink?.courses?.length > 0
                              )


                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                   
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {/* Login / Signup / Dashboard */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>
        <button className="mr-4 md:hidden"
         onClick={() => setMobileMenuOpen(true)}
        >
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>
      {/* </div>
    </div> */}
          </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Side menu */}
          <div className="absolute right-0 top-0 h-full w-[250px] bg-richblack-800 p-6">
            
            {/* Close button */}
            <div className="flex justify-end">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Links */}
            <div className="mt-6 flex flex-col gap-6 text-richblack-25">
             
              {/* {NavbarLinks.map((link, index) => {
              const isActive = location.pathname === link?.path

              return (
                <Link
                  key={index}
                  to={link?.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <p
                    className={`block py-2 text-lg transition-all duration-200 ${
                      isActive
                        ? "text-yellow-25 font-semibold"
                        : "text-richblack-25 hover:text-yellow-25"
                    }`}
                  >
                    {link.title}
                  </p>
                </Link>
              )
            })} */}
            {NavbarLinks.map((link, index) => {

  if (link.title === "Catalog") {
    return (
      <div key={index}>
        
        {/* Catalog Toggle */}
        <button
          onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)}
          className="flex items-center justify-between w-full py-2 text-lg text-richblack-25 hover:text-yellow-25"
        >
          <span>Catalog</span>
          <BsChevronDown
            className={`transition-transform ${
              mobileCatalogOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Sub Categories */}
        {mobileCatalogOpen && (
          <div className="ml-4 mt-2 flex flex-col gap-3">
            {subLinks
              ?.filter((subLink) => subLink?.courses?.length > 0)
              ?.map((subLink, i) => (
                <Link
                  key={i}
                  to={`/catalog/${subLink.name
                    .split(" ")
                    .join("-")
                    .toLowerCase()}`}
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setMobileCatalogOpen(false)
                  }}
                  className="text-richblack-300 hover:text-yellow-25"
                >
                  {subLink.name}
                </Link>
              ))}
          </div>
        )}
      </div>
    )
  }

  // Normal Links
  const isActive = location.pathname === link?.path

  return (
    <Link
      key={index}
      to={link?.path}
      onClick={() => setMobileMenuOpen(false)}
    >
      <p
        className={`block py-2 text-lg transition-all duration-200 ${
          isActive
            ? "text-yellow-25 font-semibold"
            : "text-richblack-25 hover:text-yellow-25"
        }`}
      >
        {link.title}
      </p>
    </Link>
  )
})}
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default Navbar
