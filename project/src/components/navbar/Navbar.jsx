import { useState, useEffect } from "react";
import { FaHeart, FaUserCircle, FaShoppingCart, FaBars, FaSearch } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Dropdown, Space, Input, Drawer } from "antd";
import { DownOutlined, SettingOutlined } from "@ant-design/icons";
import "./Navbar.css";

const Navbar = () => {
  const [tokenLogin, setTokenLogin] = useState(localStorage.getItem("tokenlogin"));
  const [username, setUsername] = useState(localStorage.getItem("userName") || "Guest");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth <= 1024);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false); // Controls visibility of search bar in tablet view

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("tokenlogin");
    setTokenLogin(token);
    setUsername(localStorage.getItem("userName") || "Guest");
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth <= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearchChange = (value) => setSearchQuery(value);
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLoginClick = () => navigate("/login");
  const handleSigninClick = () => navigate("/register");
  const handleLogoutClick = () => {
    localStorage.removeItem("tokenlogin");
    localStorage.removeItem("userName");
    setTokenLogin(null);
    setUsername("Guest");
    navigate("/");
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/restaurant", label: "Nirvana" },
    { path: "/states", label: "States" },
    { path: "/feed", label: "Feed" },
    { path: "/profile", label: "Profile" },
  ];

  const menuItems = [
    { key: "1", label: "My Account", disabled: true },
    { key: "2", label: <Link to="/profile"><SettingOutlined /> Settings</Link> },
    { key: "3", label: <Link to="/cart"><FaShoppingCart /> Cart</Link> },
    { key: "4", label: <Link to="/wishlist"><FaHeart /> Wishlist</Link> },
    { type: "divider" },
    tokenLogin
      ? { key: "5", label: <span onClick={handleLogoutClick}>Log Out</span> }
      : { key: "6", label: <span onClick={handleLoginClick}>Log In</span> },
  ];

  return (
    <nav id="nav">
      {/* Menu Icon - Clicking this will open the Drawer */}
      <div className="menu-icon" onClick={() => setIsDrawerOpen(true)}>
        <FaBars size={24} />
      </div>

      {/* Tablet: Show Search Icon Instead of Full Bar */}
      {isTablet && !showSearch && (
        <FaSearch size={20} className="search-icon" onClick={() => setShowSearch(true)} />
      )}

      {/* Mobile: Show Full Search Bar */}
      {isMobile && (
        <Input.Search
          className="search-bar mobile-search"
          placeholder="Search..."
          allowClear
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          onSearch={handleSearchSubmit}
          style={{ width: 200 }}
        />
      )}

      {/* Tablet: Expand Search Bar When Search Icon Clicked */}
      {isTablet && showSearch && (
        <div className="tablet-search-container">
          <Input.Search
            className="search-bar tablet-search"
            placeholder="Search..."
            allowClear
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onSearch={handleSearchSubmit}
            autoFocus
            style={{ width: 200 }}
          />
          <button onClick={() => setShowSearch(false)}>X</button>
        </div>
      )}

      {/* Logo */}
      <img src="/logoVindhu.png" alt="Logo" width={100} height={100} />

      {/* Navigation Links */}
      <ul className="nav-links">
        <div className="nav-links-center">
          {navLinks.map((link) => (
            <li key={link.path} className={location.pathname === link.path ? "active" : ""}>
              <Link to={link.path}>{link.label}</Link>
            </li>
          ))}
        </div>

        {/* Desktop Search Bar */}
        {!isMobile && !isTablet && (
          <Input.Search
            className="search-bar"
            placeholder="Search for a dish..."
            allowClear
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onSearch={handleSearchSubmit}
            style={{ width: 250, marginRight: "15px" }}
          />
        )}

        {/* User Account Dropdown */}
        <li className="account-icon">
          <span className="username">{username}</span>
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <FaUserCircle size={20} /> <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </li>
      </ul>

      {/* Drawer Menu for Mobile */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen} // State now correctly controls drawer visibility
      >
        <ul className="sidebar-links">
          {navLinks.map((link) => (
            <li key={link.path} onClick={() => setIsDrawerOpen(false)}>
              <Link to={link.path}>{link.label}</Link>
            </li>
          ))}
          <li>
            <Link to="/profile">
              <SettingOutlined /> Settings
            </Link>
          </li>
          <li>
            <Link to="/cart">
              <FaShoppingCart /> Cart
            </Link>
          </li>
          <li>
            <Link to="/wishlist">
              <FaHeart /> Wishlist
            </Link>
          </li>
          <li>
            {tokenLogin ? (
              <span onClick={() => { handleLogoutClick(); setIsDrawerOpen(false); }}>Log Out</span>
            ) : (
              <>
                <span onClick={() => { handleLoginClick(); setIsDrawerOpen(false); }}>Log In</span>
                <br />
                <span onClick={() => { handleSigninClick(); setIsDrawerOpen(false); }}>Sign Up</span>
              </>
            )}
          </li>
        </ul>
      </Drawer>
    </nav>
  );
};

export default Navbar;
