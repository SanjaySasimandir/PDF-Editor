import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import "./App.css";
import { pdfjs } from "react-pdf";
import { relative } from "path";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

function App() {
  // Code for  dynamic resize of pdf page starts
  const myDivRef = useRef<HTMLDivElement | null>(null);
  const [pageWidth, setPageWidth] = useState(0);
  const getRefWidth = () => {
    if (myDivRef.current) {
      const width = myDivRef.current.getBoundingClientRect().width;
      setPageWidth(width);
    }
  };
  useEffect(() => {
    getRefWidth();
    window.addEventListener("resize", getRefWidth);
    return () => {
      window.removeEventListener("resize", getRefWidth);
    };
  }, []);
  // Code for  dynamic resize of pdf page ends

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    }
  };

  const handleDocLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages);
    getRefWidth();
  };

  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="App bg-gray-800">
      <button
        className="px-4 py-2 font-semibold text-sm bg-cyan-600 text-white rounded-full shadow-sm"
        onClick={handleUploadClick}
      >
        Upload
      </button>
      <input
        className="hidden"
        type="file"
        accept="application/pdf"
        onChange={handleFileSelection}
        ref={inputRef}
      />
      <Document
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        file={selectedFile}
        onLoadSuccess={handleDocLoadSuccess}
      >
        {Array.from(new Array(totalPages), (_, index) => (
          <div
            className="border-solid border-4 border-sky-500 m-2 rounded-md"
            key={index}
            ref={index == 0 ? myDivRef : null}
            style={{ position: "relative", zIndex: "auto" }}
          >
            <Page
              pageNumber={index + 1}
              width={pageWidth - 8}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </div>
        ))}
      </Document>
    </div>
  );
}

export default App;
