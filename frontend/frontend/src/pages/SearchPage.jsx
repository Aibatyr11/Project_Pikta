import React, { useState } from "react";
import { Link } from "react-router-dom";
import { searchUsers } from "../api";
import "../styles/SearchPage.css";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); 

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const users = await searchUsers(query);
      setResults(users);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <h2>Поиск пользователей</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введите имя пользователя..."
        />
        <button type="submit">Поиск</button>
      </form>

      {loading && <p>Загрузка...</p>}

      {!loading && searched && results.length === 0 && (
        <p className="no-results">Пользователь не найден</p>
      )}

      <ul className="search-results">
        {results.map((user) => (
          <li key={user.id} className="search-user">
            <Link to={`/profile/${user.username}`}>
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" className="avatar" />
              ) : (
                <div className="avatar empty">?</div>
              )}
              <span>@{user.username}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchPage;
