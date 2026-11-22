import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import RouteErrorBoundary from "../components/layout/RouteErrorBoundary";

function FailedRoute() {
  throw new Error("Failed to fetch route module");
}

test("a failed route displays recovery instead of removing the app and resets on navigation", () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  const view = render(<RouteErrorBoundary key="failed"><FailedRoute /></RouteErrorBoundary>);
  expect(screen.getByRole("alert")).toHaveTextContent("Unable to load page");
  expect(screen.getByRole("button", { name: "Try Again" })).toBeInTheDocument();
  view.rerender(<RouteErrorBoundary key="next"><h1>Next page</h1></RouteErrorBoundary>);
  expect(screen.getByRole("heading", { name: "Next page" })).toBeInTheDocument();
});
