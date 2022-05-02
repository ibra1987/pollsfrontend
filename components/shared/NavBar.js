import Link from "next/link";
import { useRouter } from "next/router";
import UserContext from "../../store/userContext";
import { useContext, useState } from "react";
import axios from "axios";
import Spinner from "./Spinner";

const NavBar = () => {
  const router = useRouter();
  //const { isLoading, loadingActions } = useContext(LoadingContext);
  const { user, actions } = useContext(UserContext);

  const logOut = async () => {
    //loadingActions.setIsLoading(true)

    try {
      const response = await axios.post("/api/users/logout", {
        withCredentials: true,
      });
      if (response.status === 200) {
        actions.endSession();
      }
    } catch (error) {
      //userActions.endSession()
      //errorActions.setError("error")
      console.log(error);
    }
  };

  return (
    <div className=" w-full flex justify-center items-center shadow border-b border-gray-100 ">
      <nav className="w-4/5 flex justify-between items-center  py-4 px-2">
        <div className="underline">Free Polls Online</div>

        <ul className=" flex flex-1  justify-end items-center px-2 ">
          <li className="mx-4 text-lg ">
            <Link href="/">
              <a
                className={
                  router.pathname === "/"
                    ? "bg-blue-400 text-red px-4 py-2 rounded text-white transition duration-500 ease-in"
                    : "text-gray-600"
                }
              >
                Home
              </a>
            </Link>
          </li>

          {!user?.isAuth && (
            <li className="mx-4 text-lg text-gray-600">
              <Link href="/users/register">
                <a
                  className={
                    router.pathname === "/users/register"
                      ? "bg-blue-400 text-red px-4 py-2 rounded text-white transition duration-500 ease-in"
                      : "text-gray-600"
                  }
                >
                  Register
                </a>
              </Link>
            </li>
          )}
          {!user.isAuth ? (
            <li className="mx-4 text-lg text-gray-600">
              <Link href="/users/login">
                <a
                  className={
                    router.pathname === "/users/login"
                      ? "bg-blue-400 text-red px-4 py-2 rounded text-white transition duration-500 ease-in"
                      : "text-gray-600"
                  }
                >
                  Login
                </a>
              </Link>
            </li>
          ) : (
            <li
              className="mx-4 text-lg text-gray-600 cursor-pointer"
              onClick={logOut}
            >
              <a className="hover:bg-blue-400    text-gray-600 px-4 py-2 rounded hover:text-white transition duration-500 ease-in">
                Log Out
              </a>
            </li>
          )}

          {user?.isAuth && (
            <li className="mx-4 text-lg ">
              <Link href="/users/dashboard">
                <a
                  className={
                    router.pathname === "/users/dashboard"
                      ? "bg-blue-400 text-red px-4 py-2 rounded text-white transition duration-500 ease-in"
                      : "text-gray-600"
                  }
                >
                  Dashboard
                </a>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
