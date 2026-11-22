import { Component } from "react";
import ErrorState from "../ui/ErrorState";

class RouteErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-background px-6 pt-20">
          <ErrorState
            title="Unable to load page"
            message="Please reload the page to try again."
            onRetry={() => window.location.reload()}
          />
        </main>
      );
    }

    return this.props.children;
  }
}

export default RouteErrorBoundary;
