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
    selectedPage,
    setSelectedPage,
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
    <div>
      <Document
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        file={selectedFile}
        onLoadSuccess={handleDocLoadSuccess}
      >
        {pageOrder.map((pageNumber, index) => (
          <div
            className={`border-solid border-[5px] m-2 rounded-md ${
              selectedPage === pageNumber
                ? "border-[#0071e3]"
                : "border-[#fafafa]"
            }`}
            key={pageNumber}
            ref={index === 0 ? myDivRef : null}
            style={{ position: "relative", zIndex: "auto" }}
            onClick={() => setSelectedPage(pageNumber)}
          >
            <Page
              pageNumber={pageNumber}
              width={pageWidth - 8}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            ></Page>
          </div>
        ))}
      </Document>
    </div>
  );
}
