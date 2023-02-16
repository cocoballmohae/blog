// 토큰 만들어서 받기때문에
// 로그인 되있다는걸 알려면 상태에 저장 - useState

import jwtDecode from "jwt-decode";
import React, { useEffect } from "react";
import { useState } from "react";

const AuthStore = () => {
  const [loginUser, setLoginUser] = useState(undefined);

  const setLoginUserByToken = (accessToken) => {
    try {
      const decodedAccessToken = jwtDecode(accessToken);
      setLoginUser(decodedAccessToken);
    } catch (error) {
      setLoginUser(null);
    }
  };
  //최초 한번만
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setLoginUserByToken(accessToken);
  }, []);

  useEffect(() => {
    if (loginUser === null) {
      localStorage.getItem("accessToken");
    }
  }, [loginUser]);

  return {
    loginUser,
    setLoginUser,
    setLoginUserByToken,
  };
};

export default AuthStore;
