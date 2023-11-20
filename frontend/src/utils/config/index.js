import { decode } from "../local-storage-items";
import { jwtDecode } from "jwt-decode";

export const routes = {
  chatRoom: "/",
  login: "/login",
  register: "/register",
};

export const memoryStrings = {
  authorization: "authorizationToken",
};

export const appConfig = {
  appColor: "#818cf8",
};

export const getUserFromLocal = () => {
  if (decode(memoryStrings.authorization)) {
    let _user = jwtDecode(decode(memoryStrings.authorization));
    return _user;
  }
};
