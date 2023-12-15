import { useContext, useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { EditorContext } from "../App";

export function Editor() {
  const {
    selectedFile,
    setSelectedFile,
    totalPages,
    setTotalPages,
    pageOrder,
    setPageOrder,
    movePageUp,
    movePageDown,
    deletePage,
  } = useContext(EditorContext);

  // Code for  dynamic resize of pdf page starts
  const myDivRef = useRef<HTMLDivElement | null>(null);
  const [pageWidth, setPageWidth] = useState(0);

  useEffect(() => {
    getRefWidth();
    window.addEventListener("resize", getRefWidth);
    return () => {
      window.removeEventListener("resize", getRefWidth);
    };
  }, []);
  const getRefWidth = () => {
    if (myDivRef.current) {
      const width = myDivRef.current.getBoundingClientRect().width;
      setPageWidth(width);
    }
  };
  // Code for  dynamic resize of pdf page ends

  const handleDocLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages);
    setPageOrder(Array.from({ length: numPages }, (_, index) => index + 1));
    getRefWidth();
  };

  return (
    <Document
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      file={selectedFile}
      onLoadSuccess={handleDocLoadSuccess}
    >
      {pageOrder.map((pageNumber, index) => (
        <div
          className="border-solid border-4 border-[#0071e3] m-2 rounded-md"
          key={pageNumber}
          ref={index == 0 ? myDivRef : null}
          style={{ position: "relative", zIndex: "auto" }}
        >
          <div className="overlay absolute z-40 bg-blend-overlay bg-black/50 w-full flex justify-end">
            {pageNumber}
            {index !== 0 && (
              <button
                className="bg-violet-500 text-white hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 rounded-full m-1"
                onClick={() => movePageUp(pageNumber)}
              >
                <span className="material-symbols-outlined">arrow_upward</span>
              </button>
            )}
            {index !== totalPages - 1 && (
              <button
                className="bg-violet-500 text-white hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 rounded-full m-1"
                onClick={() => movePageDown(pageNumber)}
              >
                <span className="material-symbols-outlined">
                  arrow_downward
                </span>
              </button>
            )}
            <button
              className="bg-red-500 hover:bg-red-600 text-white active:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 rounded-full m-1"
              onClick={() => deletePage(index)}
            >
              <span className="material-symbols-outlined mt-[5px]">delete</span>
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
  );
}
