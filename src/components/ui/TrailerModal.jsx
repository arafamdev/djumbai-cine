import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

function TrailerModal({ trailer, onClose }) {
  const closeButtonRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const previousActiveElement = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const closeButton = closeButtonRef.current;
      const video = videoRef.current;

      if (!closeButton || !video) return;

      // Keep focus within the modal.
      if (event.shiftKey && document.activeElement === closeButton) {
        event.preventDefault();
        video.focus();
      } else if (!event.shiftKey && document.activeElement === video) {
        event.preventDefault();
        closeButton.focus();
      }
    }

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [onClose]);

  const videoUrl = `https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1`;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-8">
      <div className="absolute inset-0" aria-hidden="true" onClick={onClose} />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="trailer-modal-title"
        className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
      >
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <h2
            id="trailer-modal-title"
            className="truncate text-base font-semibold text-foreground"
          >
            {trailer.name}
          </h2>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close trailer"
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-elevated hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="aspect-video w-full bg-black">
          <iframe
            ref={videoRef}
            className="h-full w-full"
            src={videoUrl}
            title={`${trailer.name} video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </section>
    </div>,
    document.body,
  );
}

export default TrailerModal;
