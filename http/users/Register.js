import axios from "axios";

const register = async (user) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/api/users/register",
      user,
      {
        withCredentials: true,
        headers: {
          "content-type": "application/json",
        },
      }
    );
    if (response.status === 201) {
      //setSuccessMessage(response.data.success[0].msg);
      console.log(response);
    }
  } catch (err) {
    return err;
  }
};

export default register;
