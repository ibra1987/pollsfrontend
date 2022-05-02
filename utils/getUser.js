import axios from "axios";

const getUser = async (req) => {
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
          user: response.data.user,
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
        user: null,
      },
    };
  }
};
export default getUser;
