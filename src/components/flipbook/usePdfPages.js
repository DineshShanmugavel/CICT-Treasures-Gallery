import { useCallback, useEffect, useRef, useState } from 'react';

/** Rendered page images kept in memory per open book. */
const MAX_CACHED_PAGES = 24;

let pdfjsPromise;
/** pdf.js is large, so it is only fetched the first time a PDF is opened. */
function loadPdfJs() {
  pdfjsPromise ??= Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url')]).then(
    ([pdfjs, worker]) => {
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
      return pdfjs;
    },
  );
  return pdfjsPromise;
}

/**
 * Opens a PDF with range requests (rare scans can be hundreds of MB, so pages are
 * fetched on demand) and reports its page count and the first page's aspect ratio.
 */
export function usePdfDocument(url) {
  const [state, setState] = useState({ doc: null, aspect: 0.7, error: null });

  useEffect(() => {
    if (!url) return undefined;
    let cancelled = false;
    let loadingTask;
    setState({ doc: null, aspect: 0.7, error: null });
    (async () => {
      const pdfjs = await loadPdfJs();
      if (cancelled) return;
      loadingTask = pdfjs.getDocument({ url, disableAutoFetch: true, disableStream: true, rangeChunkSize: 256 * 1024 });
      const doc = await loadingTask.promise;
      const viewport = (await doc.getPage(1)).getViewport({ scale: 1 });
      if (!cancelled) setState({ doc, aspect: viewport.width / viewport.height, error: null });
    })().catch((error) => {
      if (!cancelled) setState({ doc: null, aspect: 0.7, error });
    });
    return () => {
      cancelled = true;
      loadingTask?.destroy();
    };
  }, [url]);

  return state;
}

/**
 * Renders PDF pages to image URLs on demand, sized for the current page width.
 * `ensure(index)` queues a render; `get(index)` returns the URL once ready.
 */
export function usePdfPages(doc, pageWidth) {
  const [, setVersion] = useState(0);
  const cacheRef = useRef(new Map());
  const pendingRef = useRef(new Set());
  // Snap the render width to 200px steps so resizing doesn't re-render every page.
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(400, Math.ceil((pageWidth * pixelRatio) / 200) * 200);

  useEffect(() => {
    const cache = cacheRef.current;
    const pending = pendingRef.current;
    return () => {
      cache.forEach((url) => URL.revokeObjectURL(url));
      cache.clear();
      pending.clear();
    };
  }, [doc]);

  const ensure = useCallback(
    (index) => {
      if (!doc || index < 0 || index >= doc.numPages) return;
      const key = `${index}@${width}`;
      const cache = cacheRef.current;
      const cached = cache.get(key);
      if (cached) {
        // Refresh recency so pages on screen are never evicted.
        cache.delete(key);
        cache.set(key, cached);
        return;
      }
      if (pendingRef.current.has(key)) return;
      pendingRef.current.add(key);
      (async () => {
        const page = await doc.getPage(index + 1);
        const viewport = page.getViewport({ scale: width / page.getViewport({ scale: 1 }).width });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await page.render({ canvas, canvasContext: canvas.getContext('2d'), viewport }).promise;
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.88));
        page.cleanup();
        if (!pendingRef.current.has(key) || !blob) return; // book closed meanwhile
        cache.set(key, URL.createObjectURL(blob));
        while (cache.size > MAX_CACHED_PAGES) {
          const [oldestKey, oldestUrl] = cache.entries().next().value;
          cache.delete(oldestKey);
          URL.revokeObjectURL(oldestUrl);
        }
        setVersion((version) => version + 1);
      })()
        .catch(() => {})
        .finally(() => pendingRef.current.delete(key));
    },
    [doc, width],
  );

  const get = (index) => cacheRef.current.get(`${index}@${width}`);
  return { ensure, get };
}
