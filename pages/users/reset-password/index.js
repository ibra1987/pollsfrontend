import Link from "next/link";
import { useEffect, useState } from "react";
import { checkEmail, isEmpty } from "../../../utils/helpers";
import { useRouter } from "next/router";
import axios from "axios";

const ResetPassword = () => {
  const router = useRouter();
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const { err } = router.query;

    if (err) {
      setErrors([...errors, err]);
    }
  }, [router.query]);

  const handleOnSubmit = async (e) => {
    setErrors([]);
    setSuccessMessage("");
    e.preventDefault();

    //empty fields
    if (isEmpty(email)) {
      return (
        !errors.includes("Please enter your email address") &&
        setErrors([...errors, "Please enter your email address"])
      );
    }

    // email regex and email confirmatiom
    if (!checkEmail(email)) {
      return (
        !errors.includes("Please enter a valid email address") &&
        setErrors([...errors, "lease enter a valid email address"])
      );
    }

    try {
      const response = await axios.post(
        "/api/users/resetpassword",
        { email },
        {
          withCredentials: true,
          headers: {
            "content-type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        //setSuccessMessage(response.data.success[0].msg);
        setSuccessMessage(
          "a rest password has been sent to your email address, please check!"
        );
      }
    } catch (err) {
      const returnedErrors = err.response?.data?.errors.map((element) => {
        return element?.msg;
      });
      if (returnedErrors !== undefined) {
        return setErrors([...errors, returnedErrors]);
      }
      setErrors([...errors, err.messsage]);
    }
  };

  const handleOnChange = (e) => {
    setErrors([]);
    setSuccessMessage("");
    setEmail(e.target.value);
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
          <label htmlFor="email" className=" px-2 text-gray-500">
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={handleOnChange}
            name="email"
            className="outline-none w-full px-2 border-b-2 mt-2 
             focus:border-b-2 focus:border-blue-400"
          />
        </div>

        <div className="my-2 w-full md:w-4/5 pb-1 flex  justify-center items-start ">
          <input
            type="submit"
            value="Reset Password"
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

export default ResetPassword;
