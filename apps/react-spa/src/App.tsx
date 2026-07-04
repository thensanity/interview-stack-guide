import { Routes, Route, NavLink } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import GraphQLPage from "./pages/GraphQLPage";
import ComparePage from "./pages/ComparePage";
import ScenariosPage from "./pages/ScenariosPage";
import OfflineBanner from "./components/OfflineBanner";

export default function App() {
  return (
    <>
      <OfflineBanner />
      <header className="header">
        <div className="container header-inner">
          <h1>
            React SPA <span className="badge badge-react">Client-only</span>
          </h1>
          <nav>
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/products">Products (CSR)</NavLink>
            <NavLink to="/graphql">GraphQL Demo</NavLink>
            <NavLink to="/scenarios">Scenarios</NavLink>
            <NavLink to="/compare">React vs Next.js</NavLink>
            <a href="http://localhost:3000" target="_blank" rel="noreferrer">Open Next.js →</a>
          </nav>
        </div>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/graphql" element={<GraphQLPage />} />
          <Route path="/scenarios" element={<ScenariosPage />} />
          <Route path="/compare" element={<ComparePage />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container">
          Plain React + Vite + React Router — compare with Next.js at localhost:3000
        </div>
      </footer>
    </>
  );
}
