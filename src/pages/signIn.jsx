import React from "react";

const SignIn = () => {
  return (
    <div>
      <h1>Sign Up Successful</h1>
      <a href={process.env.REACT_APP_NEXT_PUBLIC_CMU_OAUTH_URL}>
        <button>Sign-in with CMU Account</button>
      </a>
    </div>
  );
};

export default SignIn;
