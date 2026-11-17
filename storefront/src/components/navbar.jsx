import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar({ cartCount = 0, onSearch }) {
  const [searchText, setSearchText] = useState("");
  const [language, setLanguage] = useState("en");

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  function handleSearch(e) {
    e.preventDefault();
    if (onSearch) onSearch(searchText);
  }

    return (
    <nav className="navbar">
      {/* 1. Logo */}
      <div className="logo"> PM & Sons</div>

      {/* 2. Search bar */}
      <form className="search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchText}
          onChange={(e) => {setSearchText(e.target.value);
            if (onSearch) onSearch(e.target.value);
          }}
        />
        <button type="submit">Search</button>
      </form>

      {/* 3. Language */}
      <select
        className="language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
      </select>

      {/* 4. Theme toggle */}
      <button className="nav-btn" onClick={toggleTheme}>
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>

      {/* 5. Cart */}
      <button className="nav-btn">
        🛍️ Cart <span className="badge">{cartCount}</span>
      </button>

      {/* 6. Account / Sign in */}
      <button className="nav-btn signin">👤 Sign in</button>
    </nav>
  );
}

export default Navbar;