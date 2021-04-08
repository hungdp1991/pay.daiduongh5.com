import React from 'react';
import { Route, Redirect } from "react-router-dom";

/**
 * Private Route
 */
const PrivateRoutes = ({ component: Comp, isLogged, path, ...rest }) => {
  return (
    <Route
      path={path}
      {...rest}
      render={(props) => {
        return isLogged ? (
          <Comp {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: {
                prevLocation: path,
              },
            }}
          />
        );
      }}
    />
  );
};

export default PrivateRoutes;
