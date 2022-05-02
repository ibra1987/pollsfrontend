import Head from "next/head";
import Footer from "../components/home/Footer";
import GetStarted from "../components/home/GetStarted";
import Header from "../components/home/Header";
import Usage from "../components/home/Usage";
import UsersStats from "../components/home/UsersStats";
import Warranties from "../components/home/Warranties";
import UserContext from "../store/userContext";
import { useContext, useEffect } from "react";
import axios from "axios";

export default function Home({ currentUser }) {
  const { user, actions } = useContext(UserContext);

  useEffect(() => {
    currentUser?.isAuth
      ? actions.startSession(currentUser)
      : actions.endSession();
  }, [currentUser]);
  return (
    <div className="  mx-auto ">
      <Head>
        <title>Create free polls online </title>
        <meta
          name="description"
          content="create free polls for your fans, school projects for free"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col justify-start items-center">
        <Header />
        <Usage />
        <UsersStats />
        <Warranties />
        <GetStarted />
      </main>

      <footer className=""></footer>
    </div>
  );
}
export async function getServerSideProps({ req }) {
  try {
    const response = await axios.get("http://localhost:3000/api/users/auth", {
      withCredentials: true,
      headers: {
        cookie: req.headers.cookie,
      },
    });
    const isAuth = response.data.user.isAuth;
    if (isAuth) {
      return {
        props: {
          currentUser: response.data.user,
        },
      };
    }
  } catch (error) {
    return {
      props: {
        currentUser: { isAuth: false },
      },
    };
  }
}
