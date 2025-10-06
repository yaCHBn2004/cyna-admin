import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo-big.png";
import {
  HomeIcon,
  Bars3Icon,
  CubeIcon,
  ChevronDownIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  // Dark mode state with localStorage + system preference
  const [darkMode, setDarkMode] = useState(false);


  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const [open, setOpen] = useState(true);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [clientOpen, setClientOpen] = useState(false);
  const [fullyOpen, setFullyOpen] = useState(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setFullyOpen(true), 300);
      return () => clearTimeout(timer);
    } else {
      setFullyOpen(false);
    }
  }, [open]);

  // Custom styles
  const sidebarStyles = {
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-primary)",
    borderRight: "1px solid var(--border-color)",
  };

  const overlayStyles = {
    backgroundColor: "var(--overlay-bg)",
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden p-2 m-2 focus:outline-none"
        onClick={() => setOpen(!open)}
        style={{ color: "var(--text-primary)" }}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <motion.div
        animate={{ width: open ? (screenWidth < 768 ? "55vw" : "18vw") : 64 }}
        transition={{ duration: 0.3 }}
        className="h-screen flex flex-col fixed top-0 left-0 z-40 lg:relative"
        style={sidebarStyles}
      >
        {/* Logo */}
        <div className="flex items-center justify-center py-6">
          <button onClick={() => setOpen(!open)}>
            <motion.img
              src={logo}
              alt="logo"
              className="mx-auto"
              animate={{ width: open ? 200 : 40 }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-2 text-sm">
          {/* Dashboard */}
          <SidebarItem
            icon={HomeIcon}
            label="Dashboard"
            fullyOpen={fullyOpen}
            open={dashboardOpen}
            setOpen={setDashboardOpen}
            basePath="/admin/dashboard"
            subItems={[
              { label: "Main Dashboard", path: "/admin/dashboard" },
              { label: "Large Format", path: "/admin/dashboard/large-format" },
              { label: "Small Format", path: "/admin/dashboard/small-format" },
            ]}
            navigate={navigate}
            isActive={isActive}
          />

          {/* Clients */}
          <SidebarItem
            icon={UserIcon}
            label="Clients"
            fullyOpen={fullyOpen}
            open={clientOpen}
            setOpen={setClientOpen}
            basePath="/admin/clients"
            subItems={[
              { label: "Statistics", path: "/admin/clients/statistics" },
              { label: "Subcontractors", path: "/admin/clients/subcontractors" },
            ]}
            navigate={navigate}
            isActive={isActive}
          />

          {/* Products */}
          <button
            onClick={() => navigate("/admin/products")}
            className="flex items-center w-full px-3 py-3 rounded-md"
            style={{
              backgroundColor: isActive("/admin/products")
                ? "var(--active-bg)"
                : "transparent",
              color: isActive("/admin/products")
                ? "var(--active-text)"
                : "var(--text-primary)",
            }}
            onMouseEnter={(e) => {
              if (!isActive("/admin/products")) {
                e.currentTarget.style.backgroundColor = "var(--hover-bg)";
                e.currentTarget.style.color = "var(--special-text)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive("/admin/products")) {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--text-primary)";
              }
            }}
          >
            <CubeIcon className="h-5 w-5 mr-3 shrink-0" />
            <AnimatePresence>
              {fullyOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  Products
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Orders */}
          <button
            onClick={() => navigate("/admin/orders/")} // Example, usually you'd list orders
            className="flex items-center w-full px-3 py-3 rounded-md"
            style={{
              backgroundColor: isActive("/admin/orders")
                ? "var(--active-bg)"
                : "transparent",
              color: isActive("/admin/orders")
                ? "var(--active-text)"
                : "var(--text-primary)",
            }}
            onMouseEnter={(e) => {
              if (!isActive("/admin/orders")) {
                e.currentTarget.style.backgroundColor = "var(--hover-bg)";
                e.currentTarget.style.color = "var(--special-text)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive("/admin/orders")) {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--text-primary)";
              }
            }}
          >
            <ClipboardDocumentListIcon className="h-5 w-5 mr-3 shrink-0" />
            <AnimatePresence>
              {fullyOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  Orders
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </nav>

        {/* Dark mode toggle */}
        <div className="p-4 mt-auto">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center space-x-2 px-3 py-2 rounded-md w-full"
            style={{
              backgroundColor: "transparent",
              color: "var(--text-primary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--hover-bg)";
              e.currentTarget.style.color = "var(--special-text)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
          >
            {darkMode ? (
              <>
                <SunIcon className="h-5 w-5" />
                {fullyOpen && <span>Light Mode</span>}
              </>
            ) : (
              <>
                <MoonIcon className="h-5 w-5" />
                {fullyOpen && <span>Dark Mode</span>}
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Overlay for mobile */}
      {open && screenWidth < 768 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setOpen(false)}
          className="fixed top-0 left-0 w-full h-full backdrop-blur-sm z-30"
          style={overlayStyles}
        />
      )}
    </>
  );
};

// SidebarItem reusable component
const SidebarItem = ({
  icon: Icon,
  label,
  fullyOpen,
  open,
  setOpen,
  basePath,
  subItems,
  navigate,
  isActive,
}) => {
  const isSubItemActive = (subItems) =>
    subItems.some((item) => isActive(item.path));

  const mainButtonStyles = {
    backgroundColor: !isSubItemActive(subItems) && isActive(basePath)
      ? "var(--active-bg)"
      : "transparent",
    color: !isSubItemActive(subItems) && isActive(basePath)
      ? "var(--active-text)"
      : "var(--text-primary)",
  };

  return (
    <div>
      <div className="flex w-full px-3 py-3 rounded-md" style={mainButtonStyles}>
        <button
          onClick={() => {
            navigate(basePath);
            setOpen(!open);
          }}
          className="flex items-center flex-1 text-left"
        >
          <Icon className="h-5 w-5 mr-3 shrink-0" />
          <AnimatePresence>
            {fullyOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        {fullyOpen && (
          <button onClick={() => setOpen(!open)} className="p-1">
            <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDownIcon className="h-4 w-4" />
            </motion.div>
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && fullyOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="ml-8 mt-1 space-y-1 overflow-hidden"
          >
            {subItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="block w-full text-left p-2 rounded-md"
                style={{
                  backgroundColor: isActive(item.path)
                    ? "var(--active-bg)"
                    : "transparent",
                  color: isActive(item.path)
                    ? "var(--active-text)"
                    : "var(--text-primary)",
                }}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default Sidebar;
