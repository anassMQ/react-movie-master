import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "../pages/Home";
import Catalog from "../pages/Catalog";
import Detail from "../pages/detail/Detail";
import Login from "../pages/Login";

import * as Config from "../constants/Config";

const Routes = () => {
  return (
    <Switch>
      <Route
        path={[
          `/${Config.LOGIN_PAGE}`,
          `/${Config.HOME_PAGE}/${Config.LOGIN_PAGE}`,
        ]}
        exact
        component={Login}
      />

      <Route
        path={`/${Config.HOME_PAGE}/:category/search/:keyword`}
        component={Catalog}
      />

      <Route
        path={`/${Config.HOME_PAGE}/:category/:id`}
        component={Detail}
      />

      <Route
        path={`/${Config.HOME_PAGE}/:category`}
        component={Catalog}
      />

      <Route
        path={`/${Config.HOME_PAGE}`}
        exact
        component={Home}
      />
    </Switch>
  );
};

export default Routes;
