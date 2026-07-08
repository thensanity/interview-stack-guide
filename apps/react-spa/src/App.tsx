import { Routes, Route, NavLink } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import LoginPanel from "./components/LoginPanel";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import GraphQLPage from "./pages/GraphQLPage";
import ComparePage from "./pages/ComparePage";
import PatternsPage from "./pages/PatternsPage";
import OfflineBanner from "./components/OfflineBanner";
import { LazyRoute, LazyScenariosPage } from "./components/LazyRoutes";

export default function App() {
  return (
    <AuthProvider>
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
            <NavLink to="/patterns">Patterns</NavLink>
            <NavLink to="/compare">React vs Next.js</NavLink>
            <a href="http://localhost:3000/advanced" target="_blank" rel="noreferrer">Next.js Advanced →</a>
          </nav>
        </div>
        <div className="container">
          <LoginPanel />
        </div>
      </header>
      <main className="container">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/graphql" element={<GraphQLPage />} />
            <Route path="/scenarios" element={<LazyRoute><LazyScenariosPage /></LazyRoute>} />
            <Route path="/patterns" element={<PatternsPage />} />
            <Route path="/compare" element={<ComparePage />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <footer className="footer">
        <div className="container">
          Plain React + Vite + React Router — compare with Next.js at localhost:3000
        </div>
      </footer>
    </AuthProvider>
  );
}
