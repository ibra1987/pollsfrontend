import UserContext from "../../store/userContext";
import { useContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const dashboard = ({ currentUser }) => {
  const router = useRouter();
  const { user, actions } = useContext(UserContext);
  useEffect(() => {
    currentUser?.isAuth
      ? actions.startSession(currentUser)
      : actions.endSession();
  }, [currentUser]);

  return (
    <section className="w-full lg:w-3/5 p-2">
      <div className="w-full p-2  border shadow-md rounded-md">{user.name}</div>
    </section>
  );
};

export default dashboard;

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
      redirect: {
        permanent: false,
        destination: "/users/login",
      },
      props: {
        currentUser: { isAuth: false },
      },
    };
  }
}
