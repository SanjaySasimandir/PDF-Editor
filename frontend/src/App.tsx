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
  const [pageOrder, setPageOrder] = useState<number[]>(
    Array.from({ length: totalPages }, (_, index) => index + 1)
  );

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    }
  };

  const handleDocLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages);
    setPageOrder(Array.from({ length: numPages }, (_, index) => index + 1));
    getRefWidth();
  };

  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const movePageUp = (pageNumber: number) => {
    setPageOrder((prevPageOrder) => {
      const index = prevPageOrder.indexOf(pageNumber);
      if (index > 0) {
        let newPageOrder = [...prevPageOrder];
        [newPageOrder[index - 1], newPageOrder[index]] = [
          newPageOrder[index],
          newPageOrder[index - 1],
        ];
        return newPageOrder;
      }
      return prevPageOrder;
    });
  };

  const movePageDown = (pageNumber: number) => {
    setPageOrder((prevPageOrder) => {
      const index = prevPageOrder.indexOf(pageNumber);
      if (index < prevPageOrder.length - 1) {
        let newPageOrder = [...prevPageOrder];
        [newPageOrder[index + 1], newPageOrder[index]] = [
          newPageOrder[index],
          newPageOrder[index + 1],
        ];
        return newPageOrder;
      }
      return prevPageOrder;
    });
  };

  const deletePage = (index: number) => {
    setPageOrder((prevPageOrder) => {
      let newPageOrder = [...prevPageOrder];
      newPageOrder.splice(index, 1);
      return newPageOrder;
    });
  };

  return (
    <div className="App bg-gray-800">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      <button
        className="px-4 py-2 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm hover:bg-cyan-600 
        active:bg-cyan-700 focus:outline-none focus:ring focus:ring-cyan-300"
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
        {pageOrder.map((pageNumber, index) => (
          <div
            className="border-solid border-4 border-sky-500 m-2 rounded-md"
            key={pageNumber}
            ref={index == 0 ? myDivRef : null}
            style={{ position: "relative", zIndex: "auto" }}
          >
            <div className="overlay absolute z-40 bg-blend-overlay bg-black/50 w-full flex justify-end">
              {pageNumber}
              {index !== 0 && (
                <button
                  className="bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 rounded-full m-1"
                  onClick={() => movePageUp(pageNumber)}
                >
                  <span className="material-symbols-outlined">
                    arrow_upward
                  </span>
                </button>
              )}
              {index !== totalPages - 1 && (
                <button
                  className="bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 rounded-full m-1"
                  onClick={() => movePageDown(pageNumber)}
                >
                  <span className="material-symbols-outlined">
                    arrow_downward
                  </span>
                </button>
              )}
              <button
                className="bg-red-500 hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 rounded-full m-1"
                onClick={() => deletePage(index)}
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
            <Page
              pageNumber={pageNumber}
              width={pageWidth - 8}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            ></Page>
          </div>
        ))}
      </Document>
      <button
        onClick={() => {
          console.log(pageOrder);
        }}
      >
        order
      </button>
    </div>
  );
}

export default App;
