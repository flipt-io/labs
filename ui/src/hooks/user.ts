import { useContext } from "react";

import { UserContext } from "components/UserProvider";

export const useUser = () => {
  return useContext(UserContext);
};
