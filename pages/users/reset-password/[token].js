import Link from "next/link";
import Spinner from "../../../components/shared/Spinner";
import { useState, useEffect } from "react";
import { checkpassword, isEmpty } from "../../../utils/helpers";

import { useRouter } from "next/router";
import axios from "axios";

const token = ({ validLink, msg, resetToken }) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  useEffect(() => {
    validLink
      ? setSuccessMessage(msg)
      : router.replace(`/users/reset-password?err=${msg}`);

    return () => {
      validLink = false;
      msg = null;
    };
  }, [msg, validLink]);

  const handleOnSubmit = async (e) => {
    setIsLoading(true);
    setErrors([]);
    setSuccessMessage("");
    e.preventDefault();

    //empty fields
    if (isEmpty(password)) {
      setIsLoading(false);
      return (
        !errors.includes("Please enter  password ") &&
        setErrors([...errors, "Please enter your password "])
      );
    }
    if (password !== passwordConfirmation) {
      setIsLoading(false);
      return (
        !errors.includes("Passwords do not match ") &&
        setErrors([...errors, "Passwords do not match "])
      );
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/setnewpassword",
        { password, passwordConfirmation, resetToken },
        {
          withCredentials: true,
          headers: {
            "content-type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        //setSuccessMessage(response.data.success[0].msg);
        setIsLoading(false);
        setSuccessMessage("your new password has been set successfully");
        setTimeout(() => {
          router.replace("/users/login");
        }, 1500);
      }
    } catch (err) {
      setIsLoading(false);
      const returnedErrors = err.response?.data?.errors.map((element) => {
        return element?.msg;
      });
      setErrors([...returnedErrors]);
    }
  };

  const handleOnChange = (e) => {
    e.target.name === "password"
      ? setPassword(e.target.value)
      : setPasswordConfirmation(e.target.value);

    setErrors([]);
    setSuccessMessage("");
  };

  return (
    <section className="w-full p-2 flex flex-col justify-start items-center  ">
      <form
        onSubmit={handleOnSubmit}
        className="w-full md:w-3/5 lg:w-2/5 border  rounded-md bg-white my-6 flex flex-col justify-start items-center"
      >
        <h1 className=" w-4/5 mt-8 mx-auto text-gray-500 text-3xl font-bold tracking-widest">
          Reset Your Password
        </h1>
        <div className=" w-5/6 rounded-md  bg-white text-sm   my-2 ">
          {errors.length > 0 && (
            <ul className="text-red-600 p-4 w-full bg-red-50">
              {errors.map((error, index) => (
                <li key={index}>*{error}</li>
              ))}
            </ul>
          )}
          {successMessage.length > 0 && errors.length === 0 && (
            <ul className="text-green-600 p-4 w-full bg-green-50">
              <li>{successMessage} </li>
            </ul>
          )}
        </div>
        <div className="my-2 w-full md:w-4/5 pb-1 flex flex-col justify-start items-start ">
          <label htmlFor="password" className=" px-2 text-gray-500">
            password:
          </label>
          <input
            type="password"
            value={password}
            onChange={handleOnChange}
            name="password"
            className="outline-none w-full px-2 border-b-2 mt-2 
             focus:border-b-2 focus:border-blue-400"
          />
        </div>
        <div className="my-2 w-full md:w-4/5 pb-1 flex flex-col justify-start items-start ">
          <label htmlFor="passwordConfirmation" className=" px-2 text-gray-500">
            Re-type Password:
          </label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={handleOnChange}
            name="passwordConfirmation"
            className="outline-none w-full px-2 border-b-2 mt-2 
             focus:border-b-2 focus:border-blue-400"
          />
        </div>

        <div className="my-2 w-full md:w-4/5 pb-1 flex  justify-center items-start ">
          <input
            type="submit"
            value={isLoading ? <Spinner /> : "Reset Password"}
            className="block w-full py-3
             text-white text-2xl rounded-md 
            bg-blue-500 cursor-pointer 
            tracking-widest hover:bg-blue-600 font-extrabold"
          />
        </div>
      </form>
      <span className="text-gray-700">
        don't have an account?
        <Link href="/users/register">
          <a className="text-emerald-500 mx-4 underline">Register</a>
        </Link>
      </span>
    </section>
  );
};

export default token;

export async function getServerSideProps({ query }) {
  const { token } = query;
  try {
    const response = await axios.get(
      `http://localhost:3000/api/users/${token}`
    );

    return {
      props: {
        validLink: true,
        msg: response.data?.success[0].msg || null,
        resetToken: response.data?.success[0].resetToken,
      },
    };
  } catch (err) {
    return {
      props: {
        validLink: false,
        msg: err.response.data.errors[0].msg || "Something went wrong!",
      },
    };
  }
}
