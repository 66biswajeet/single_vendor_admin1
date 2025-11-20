import React, { useContext, useState } from "react";
import { NavLink, Route } from "react-router-dom";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { Button, WindmillContext } from "@windmill/react-ui";
import { IoLogOutOutline } from "react-icons/io5";

//internal import
import sidebar from "@/routes/sidebar";
// import SidebarSubMenu from "SidebarSubMenu";
import logoDark from "@/assets/img/logo/logo-color.svg";
import logoLight from "@/assets/img/logo/logo-dark.svg";
import { AdminContext } from "@/context/AdminContext";
import SidebarSubMenu from "@/components/sidebar/SidebarSubMenu";
import useGetCData from "@/hooks/useGetCData";

const SidebarContent = () => {
  const { t } = useTranslation();
  const { mode } = useContext(WindmillContext);
  const { dispatch } = useContext(AdminContext);
  const { accessList } = useGetCData();

  const handleLogOut = () => {
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("adminInfo");
  };

  const updatedSidebar = sidebar
    .map((route) => {
      // Filter sub-routes if they exist
      if (route.routes) {
        const validSubRoutes = route.routes.filter((subRoute) => {
          const routeKey = subRoute.path.split("?")[0].split("/")[1];
          // console.log("subRoute", routeKey);
          return accessList.includes(routeKey);
        });

        // Only include the route if it has valid sub-routes
        if (validSubRoutes.length > 0) {
          return { ...route, routes: validSubRoutes };
        }
        return null; // Exclude the main route if no sub-routes are valid
      }
      // Handle top-level route: check root path part
      const routeKey = route.path?.split("?")[0].split("/")[1];
      return routeKey && accessList.includes(routeKey) ? route : null;
    })
    .filter(Boolean);

  return (
    <div className="py-2 text-gray-500 dark:text-gray-400">
      <a
        className="flex flex-col items-center justify-center text-gray-900 dark:text-gray-200 px-4 py-3"
        href="/dashboard"
      >
        {mode === "dark" ? (
          <img
            src={logoLight}
            alt="InfotechIndia"
            className="w-auto h-20 mb-2"
          />
        ) : (
          <img
            src={logoDark}
            alt="InfotechIndia"
            className="w-auto h-20 mb-2"
          />
        )}
        <div className="relative">
          <span className="text-brown-700 dark:text-brown-400 font-bold text-sm tracking-[0.3em] uppercase">
            Admin Panel
          </span>
          <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brown-600 to-transparent"></div>
        </div>
      </a>
      <ul className="mt-4 mb-6">
        {updatedSidebar?.map((route) =>
          route.routes ? (
            <SidebarSubMenu route={route} key={route.name} />
          ) : (
            <li className="relative" key={route.name}>
              <NavLink
                exact
                to={route.path}
                target={`${route?.outside ? "_blank" : "_self"}`}
                className="px-6 py-4 inline-flex items-center w-full text-sm font-semibold transition-all duration-200 hover:text-brown-700 dark:hover:text-gray-200 hover:bg-brown-50 dark:hover:bg-gray-700 rounded-lg mx-2"
                // activeClassName="text-brown-600 dark:text-gray-100"
                activeStyle={{
                  color: "#9a5533",
                  backgroundColor: "rgba(200, 126, 88, 0.1)",
                }}
                rel="noreferrer"
              >
                <Route path={route.path} exact={route.exact}>
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-brown-600 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span>
                </Route>
                <route.icon className="w-5 h-5" aria-hidden="true" />
                <span className="ml-4">{t(`${route.name}`)}</span>
              </NavLink>
            </li>
          )
        )}
      </ul>
      <div className="px-4 py-3 w-full">
        <Button onClick={handleLogOut} size="large" className="w-full">
          <span className="flex items-center justify-center">
            <IoLogOutOutline className="mr-3 text-lg" />
            <span className="text-sm">{t("LogOut")}</span>
          </span>
        </Button>
      </div>
    </div>
  );
};

export default SidebarContent;
