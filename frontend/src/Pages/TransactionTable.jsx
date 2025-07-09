import React, { useEffect, useState } from "react";
// import "./TransactionTable.css";

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState(""); // Actual query used in fetch

  const fetchData = async () => {
    try {
      setLoading(true);
      const url = `http://localhost:5000/a/product?search=${query}&page=${page}`;
      const res = await fetch(url);
      const data = await res.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, query]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on search
    setQuery(search.trim());
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>Transaction Table</h2>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by title, description, or price"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", width: "250px", marginRight: "10px" }}
        />
        <button type="submit" style={{ padding: "8px 16px", cursor: "pointer" }}>
          Search
        </button>
      </form>

      <div className="table-container">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>ID</th>
              <th>Title</th>
              <th>Price ($)</th>
              <th>Category</th>
              <th>Sold</th>
              <th>Date of Sale</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((item) => (
                <tr key={item._id}>
                  <td>
                    <img src={item.image} alt={item.title} className="product-img" />
                  </td>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{item.price}</td>
                  <td>{item.category}</td>
                  <td>{item.sold ? "Yes" : "No"}</td>
                  <td>{new Date(item.dateOfSale).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No results found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
      </div>
    </div>
  );
};

export default TransactionTable;
