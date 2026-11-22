import { act, render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import TrailerModal from "../components/ui/TrailerModal";
import useSearchMedia from "../features/search/hooks/useSearchMedia";
import { searchMedia } from "../services/tmdb/searchService";

vi.mock("../services/tmdb/searchService", () => ({ searchMedia: vi.fn() }));

test("changing query aborts the old request and ignores stale responses", async () => {
  let resolveOld;
  searchMedia.mockImplementation(query => query === "old"
    ? new Promise(resolve => { resolveOld = resolve; })
    : Promise.resolve({ results: [{ id: 2 }], total_pages: 1 }));
  const { result, rerender, unmount } = renderHook(({ query }) => useSearchMedia(query), { initialProps: { query: "old" } });
  const oldSignal = searchMedia.mock.calls[0][2];
  rerender({ query: "new" });
  expect(oldSignal.aborted).toBe(true);
  await waitFor(() => expect(result.current.results).toEqual([{ id: 2 }]));
  await act(async () => resolveOld({ results: [{ id: 1 }], total_pages: 5 }));
  expect(result.current.results).toEqual([{ id: 2 }]);
  const currentSignal = searchMedia.mock.calls[1][2];
  unmount();
  expect(currentSignal.aborted).toBe(true);
});

test("trailer traps boundary focus, closes with Escape, and restores page state on cleanup", async () => {
  const trigger = document.createElement("button");
  document.body.append(trigger);
  trigger.focus();
  document.body.style.overflow = "auto";
  const onClose = vi.fn();
  const { unmount } = render(<TrailerModal trailer={{ key: "test", name: "Trailer" }} onClose={onClose} />);
  const close = screen.getByRole("button", { name: "Close trailer" });
  const iframe = screen.getByTitle("Trailer video");
  expect(close).toHaveFocus();
  expect(document.body.style.overflow).toBe("hidden");
  const user = userEvent.setup();
  await user.keyboard("{Shift>}{Tab}{/Shift}");
  expect(iframe).toHaveFocus();
  await user.keyboard("{Tab}");
  expect(close).toHaveFocus();
  await user.keyboard("{Escape}");
  expect(onClose).toHaveBeenCalledOnce();
  unmount();
  expect(trigger).toHaveFocus();
  expect(document.body.style.overflow).toBe("auto");
  trigger.remove();
  document.body.style.overflow = "";
});
