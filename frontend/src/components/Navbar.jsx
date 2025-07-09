import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
      <Link to="/" style={{ marginRight: '15px' }}>Transactions</Link>
      <Link to="/stats" style={{ marginRight: '15px' }}>Stats</Link>
      <Link to="/price" style={{ marginRight: '15px' }}>Price Chart</Link>
      <Link to="/category" style={{ marginRight: '15px' }}>Category Chart</Link>
      <Link to="/dashboard">Combined Dashboard</Link>
    </nav>
  );
};

export default Navbar;
