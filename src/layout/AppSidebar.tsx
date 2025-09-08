"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { MoreHorizontal } from "lucide-react";
import { 
  Grid, 
  User, 
  FileText, 
  LogOut, 
  Box, 
  PieChart, 
  Archive, 
  MessageSquare,
  ChevronDown 
} from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string; // for normal navigation
  action?: () => void; // for buttons like Sign Out
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// Custom hook for authentication
const useAuth = () => {
  const signOut = useCallback(() => {
    console.log("Signing out...");

    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("Troms_token");
        window.location.href = "/signin";
      }
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  }, []);

  return { signOut };
};

// Static items that don't need to be recreated

const othersItems: NavItem[] = [
  {
    icon: <PieChart size={20} />, // Charts
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart" },
      { name: "Bar Chart", path: "/bar-chart" },
    ],
  },
  {
    icon: <Box size={20} />, // UI Elements
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts" },
      { name: "Avatar", path: "/avatars" },
      { name: "Badge", path: "/badge" },
      { name: "Buttons", path: "/buttons" },
      { name: "Images", path: "/images" },
      { name: "Videos", path: "/videos" },
    ],
  },
  {
    icon: <Archive size={20} />, // Authentication
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin" },
      { name: "Sign Up", path: "/signup" },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { signOut } = useAuth();
  const router = useRouter();

  // Create navItems outside of useMemo to avoid signOut dependency issues
  // const navItems: NavItem[] = [
  //   {
  //     icon: <GridIcon />,
  //     name: "Dashboard",
  //     path: "/",
  //   },
  //   {
  //     icon: <UserCircleIcon />,
  //     name: "User Management",
  //     path: "/userManagement",
  //   },
  //   {
  //     icon: <DocsIcon />,
  //     name: "Content Management",
  //     path: "/terms-and-conditions", 
  //     subItems: [
  //       { name: "Terms and Conditions", path: "/terms-and-conditions", pro: false },
  //       { name: "Privacy Policy", path: "/privacy-policy", pro: false },
  //     ],
  //   },
  //   {
  //     icon: <UserCircleIcon />,
  //     name: "Sign Out",
  //     action: signOut,
  //   },
  // ];

  const navItems: NavItem[] = [
  {
    icon: <Grid size={20} />, // Dashboard
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <User size={20} />, // User Management
    name: "User Management",
    path: "/userManagement",
  },
  {
    icon: <MessageSquare size={20} />, // Contact Us Management
    name: "Contact Us",
    path: "/contactUs",
  },
  {
    icon: <FileText size={20} />, // Content Management
    name: "Content Management",
    path: "/terms-and-conditions",
    subItems: [
      { name: "Terms and Conditions", path: "/terms-and-conditions" },
      { name: "Privacy Policy", path: "/privacy-policy" },
    ],
  },
  {
    icon: <LogOut size={20} />, // Sign Out
    name: "Sign Out",
    action: signOut,
  },
];

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const handleSubmenuToggle = useCallback((index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  }, []);

  const renderMenuItems = useCallback((
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <>
              {/* Parent button */}
              <button
                onClick={() => {
                  if (nav.path) router.push(nav.path);
                  handleSubmenuToggle(index, menuType);
                }}
                className={`menu-item group ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                }`}
                aria-expanded={openSubmenu?.type === menuType && openSubmenu?.index === index}
                aria-controls={`submenu-${menuType}-${index}`}
              >
                <span
                  className={`${
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDown
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                      openSubmenu?.type === menuType && openSubmenu?.index === index
                        ? "rotate-180 text-brand-500"
                        : ""
                    }`}
                  />
                )}
              </button>

              {/* Dropdown */}
              {(isExpanded || isHovered || isMobileOpen) && (
                <div
                  id={`submenu-${menuType}-${index}`}
                  ref={(el) => {
                    subMenuRefs.current[`${menuType}-${index}`] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height:
                      openSubmenu?.type === menuType && openSubmenu?.index === index
                        ? `${subMenuHeight[`${menuType}-${index}`]}px`
                        : "0px",
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9" role="menu">
                    {nav.subItems.map((subItem) => (
                      <li key={subItem.name} role="none">
                        <Link
                          href={subItem.path}
                          role="menuitem"
                          className={`menu-dropdown-item ${
                            isActive(subItem.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.name}
                          <span className="flex items-center gap-1 ml-auto">
                            {subItem.new && (
                              <span
                                className={`ml-auto ${
                                  isActive(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                              >
                                new
                              </span>
                            )}
                            {subItem.pro && (
                              <span
                                className={`ml-auto ${
                                  isActive(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                              >
                                pro
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : nav.action ? (
            // Handle action items (like Sign Out)
            <button
              onClick={nav.action}
              className={`menu-item group menu-item-inactive cursor-pointer w-full ${
                !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
              }`}
              type="button"
            >
              <span className="menu-item-icon-inactive">
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
            </button>
          ) : (
            // Handle regular navigation items
            <Link
              href={nav.path ?? "#"}
              className={`menu-item group ${
                isActive(nav.path ?? "")
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
              }`}
            >
              <span
                className={`${
                  isActive(nav.path ?? "")
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
            </Link>
          )}
        </li>
      ))}
    </ul>
  ), [isExpanded, isHovered, isMobileOpen, openSubmenu, router, handleSubmenuToggle, isActive]);

  // Auto-open submenu if current path matches any submenu item
  useEffect(() => {
    let submenuMatched = false;
    
    // Check main menu items
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        const hasActiveSubItem = nav.subItems.some(subItem => subItem.path === pathname);
        if (hasActiveSubItem) {
          setOpenSubmenu({ type: "main", index });
          submenuMatched = true;
        }
      }
    });

    // Check others menu items
    othersItems.forEach((nav, index) => {
      if (nav.subItems) {
        const hasActiveSubItem = nav.subItems.some(subItem => subItem.path === pathname);
        if (hasActiveSubItem) {
          setOpenSubmenu({ type: "others", index });
          submenuMatched = true;
        }
      }
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname]); // Only depend on pathname, not on navItems or isActive

  // Calculate submenu heights
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      const element = subMenuRefs.current[key];
      if (element) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: element.scrollHeight,
        }));
      }
    }
  }, [openSubmenu]);

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="navigation"
      aria-label="Main navigation"
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
                priority
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
                priority
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
              priority
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <MoreHorizontal  />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            {/* Uncomment if you want to show others items */}
            {/* <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div> */}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;