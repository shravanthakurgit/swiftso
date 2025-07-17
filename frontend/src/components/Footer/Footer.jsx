import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'



const Footer = () => {


  const {userData}= useAuth();
  return (
    <div className='w-full border-t mt-8 z-50 bottom-0'>

    <footer className="bg-white dark:bg-gray-900 w-full">
        <div className="mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 py-6 lg:py-8">

            <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Company</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                    <li className="mb-4">
                        <NavLink to='/about'
  className={({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold " 
      : "hover: text-gray-700"         
  }>About</NavLink>
                    </li>


                     <li className="mb-4">
                        <NavLink to='/shop'  className={({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold " 
      : "hover: text-gray-700 "         
  }>Shop</NavLink>
                    </li>



                     <li className="mb-4">
                        <NavLink to='/'  className={({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold " 
      : "hover: text-gray-700"         
  }>Home</NavLink>
                    </li>



{userData?.role === "admin" && (
  <li className="mb-4 text-[5px]">
    <a
      href={process.env.REACT_APP_ADMIN_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline cursor-pointer"
    >
      ADMIN LOGIN
    </a>
  </li>
)}



                </ul>
            </div>
            <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Help center</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">


                    <li className="mb-4">

                        <NavLink to='404'
  className={({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold " 
      : "hover: text-gray-700"         
  }>Instagram</NavLink>
                    </li>


                    <li className="mb-4">
                        <NavLink to='405'
  className={({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold " 
      : "hover: text-gray-700"         
  } >Facebook</NavLink>
                    </li>


                    <li className="mb-4">
                        <NavLink to="/contact-us"
  className={({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold " 
      : "hover: text-gray-700"         
  } >Contact Us</NavLink>
                    </li>


                </ul>


            </div>
            <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                    <li className="mb-4">
                        <NavLink to='/privacy-policy'  className={({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold " 
      : "hover: text-gray-700"         
  }>Privacy Policy</NavLink>
                    </li>


                    <li className="mb-4">
                        <NavLink to="/terms-&-condition"
  className={({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold " 
      : "hover: text-gray-700"         
  } >Terms &amp; Conditions</NavLink>
                    </li>
                </ul>
            </div>

        </div>
        <div className="py-6 bg-black dark:bg-gray-900 md:flex md:items-center md:justify-between w-full text-white px-8">
            <span className="text-sm sm:text-center">© 2025 <NavLink to='/'>SwiftSo™</NavLink>. All Rights Reserved.
            </span>
            <div className="flex mt-4 justify-center sm:justify-center md:mt-0 space-x-5 rtl:space-x-reverse lg:mx-8">


                <NavLink to='#'
  className={"hover: text-gray-700"         
  }>
                      <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                            <path fillRule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clipRule="evenodd"/>
                        </svg>
                      <span className="sr-only">Facebook page</span>
                  </NavLink>






                  <NavLink to='#'
  className={"hover: text-gray-700"         
  }>
                      <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                        <path fillRule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clipRule="evenodd"/>
                    </svg>
                      <span className="sr-only">Twitter page</span>
                  </NavLink>
                  <NavLink to='#'
  className={"hover: text-gray-700"         
  }>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                </NavLink>
                  {/* <NavLink to='#'
  className={({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold " 
      : "hover: text-gray-700"         
  } className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0a10 10 0 1 0 10 10A10.009 10.009 0 0 0 10 0Zm6.613 4.614a8.523 8.523 0 0 1 1.93 5.32 20.094 20.094 0 0 0-5.949-.274c-.059-.149-.122-.292-.184-.441a23.879 23.879 0 0 0-.566-1.239 11.41 11.41 0 0 0 4.769-3.366ZM8 1.707a8.821 8.821 0 0 1 2-.238 8.5 8.5 0 0 1 5.664 2.152 9.608 9.608 0 0 1-4.476 3.087A45.758 45.758 0 0 0 8 1.707ZM1.642 8.262a8.57 8.57 0 0 1 4.73-5.981A53.998 53.998 0 0 1 9.54 7.222a32.078 32.078 0 0 1-7.9 1.04h.002Zm2.01 7.46a8.51 8.51 0 0 1-2.2-5.707v-.262a31.64 31.64 0 0 0 8.777-1.219c.243.477.477.964.692 1.449-.114.032-.227.067-.336.1a13.569 13.569 0 0 0-6.942 5.636l.009.003ZM10 18.556a8.508 8.508 0 0 1-5.243-1.8 11.717 11.717 0 0 1 6.7-5.332.509.509 0 0 1 .055-.02 35.65 35.65 0 0 1 1.819 6.476 8.476 8.476 0 0 1-3.331.676Zm4.772-1.462A37.232 37.232 0 0 0 13.113 11a12.513 12.513 0 0 1 5.321.364 8.56 8.56 0 0 1-3.66 5.73h-.002Z" clipRule="evenodd"/>
                    </svg>
                      <span className="sr-only">Dribbble account</span>
                  </NavLink> */}
            </div>
          </div>
        </div>
    </footer>
    </div>
  )
}

export default Footer
