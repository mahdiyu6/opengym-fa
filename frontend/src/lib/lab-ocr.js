
let pdfPromise;
let ocrPromise;

async function loadPdfJs() {
  if (!pdfPromise) {
    pdfPromise = import(
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs'
    ).then(lib => {
      lib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';
      return lib;
    });
  }

  return pdfPromise;
}

async function loadOcr() {
  if (!ocrPromise) {
    ocrPromise = import(
      'https://cdn.jsdelivr.net/npm/tesseract.js@6/dist/tesseract.esm.min.js'
    ).then(async lib => {
      const worker = await lib.createWorker('fas+eng');
      return worker;
    }).catch(error => {
      ocrPromise = null;
      throw error;
    });
  }

  return ocrPromise;
}

async function recognizeCanvas(canvas, worker, onProgress) {
  const result = await worker.recognize(canvas);

  if (onProgress) {
    onProgress(result.data.confidence);
  }

  return result.data.text || '';
}

export async function extractImageTextWithOcr(file, onProgress) {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Unsupported image file.');
  }

  let canvas;

  try {
    const bitmap = await createImageBitmap(file);

    canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const context = canvas.getContext('2d');
    context.drawImage(bitmap, 0, 0);
    bitmap.close();

    const worker = await loadOcr();

    return await recognizeCanvas(canvas, worker, onProgress);
  } finally {
    if (canvas) {
      canvas.width = 0;
      canvas.height = 0;
    }
  }
}

export async function extractPdfTextWithOcr(file, onProgress) {
  if (!file || file.size > 20 * 1024 * 1024) {
    throw new Error('Invalid PDF file or file exceeds 20 MB.');
  }

  const pdfjs = await loadPdfJs();
  const pdf = await pdfjs.getDocument({
    data: await file.arrayBuffer()
  }).promise;

  if (pdf.numPages > 20) {
    throw new Error('OCR is limited to 20 pages per PDF.');
  }

  const worker = await loadOcr();
  const results = [];

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 2.2 });

      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);

      try {
        const context = canvas.getContext('2d', {
          willReadFrequently: true
        });

        await page.render({
          canvasContext: context,
          viewport
        }).promise;

        const text = await recognizeCanvas(
          canvas,
          worker,
          onProgress
        );

        results.push(`--- PAGE ${pageNumber} ---\n${text}`);
      } finally {
        canvas.width = 0;
        canvas.height = 0;
        page.cleanup();
      }
    }

    return results.join('\n\n');
  } finally {
    await pdf.destroy();
  }
}

export async function terminateLabOcr() {
  if (!ocrPromise) return;

  const worker = await ocrPromise;
  await worker.terminate();
  ocrPromise = null;
}
