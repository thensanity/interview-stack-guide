import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/** Class Error Boundary — interview contrast with Next.js error.tsx file boundary */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="card" style={{ borderColor: "#ef4444" }}>
            <h3>Something went wrong</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{this.state.error?.message}</p>
            <button type="button" className="scenario-btn" onClick={() => this.setState({ hasError: false, error: null })}>
              Retry
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
