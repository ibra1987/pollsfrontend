import { createContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    isAuth: false,
    name: null,
    id: null,
  });
  const actions = {
    startSession: (payload) => {
      setUser({
        ...user,
        isAuth: true,
        name: payload.name,
        id: payload.id,
      });
    },
    endSession: () => {
      setUser({
        isAuth: false,
        name: null,
        id: null,
      });
    },
  };

  return (
    <UserContext.Provider value={{ user, actions }}>
      {children}
    </UserContext.Provider>
  );
}
export default UserContext;
