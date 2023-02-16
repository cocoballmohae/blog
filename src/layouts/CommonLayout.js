import React from "react";
import MyNavbar from "../components/common/MyNavbar";

const CommonLayout = ({ children }) => {
  return (
    <div>
      <MyNavbar />
      {children}
    </div>
  );
};

export default CommonLayout;
