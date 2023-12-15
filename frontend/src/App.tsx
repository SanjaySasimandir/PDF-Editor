import React, {
  ChangeEvent,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Document, Page } from "react-pdf";
import "./App.css";
import { pdfjs } from "react-pdf";
import Axios from "axios";
import { Editor } from "./components/editor";
import { Modal } from "./components/modal";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export const EditorContext = createContext({
  selectedFile: null as File | null,
  setSelectedFile: (file: File | null) => {},
  totalPages: 1,
  setTotalPages: (number: number) => {},
  pageOrder: [] as number[],
  setPageOrder: (numbers: number[]) => {},
  movePageUp: (pageNumber: number) => {},
  movePageDown: (pageNumber: number) => {},
  deletePage: (index: number) => {},
  selectedPage: 1,
  setSelectedPage: (number: number) => {},
});

export const ModalContext = createContext({
  newPDFName: "",
  setShowModal: (showModal: boolean) => {},
});

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageOrder, setPageOrder] = useState<number[]>(
    Array.from({ length: totalPages }, (_, index) => index + 1)
  );
  const [newPDFName, setNewPDFName] = useState("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleUploadClick = () => {
    inputRef.current?.click();
  };
  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    }
  };

  const resetPDF = () => {
    setPageOrder(Array.from({ length: totalPages }, (_, index) => index + 1));
    setNewPDFName("");
  };

  const [selectedPage, setSelectedPage] = useState<number>(1);

  const handleFileUpload = () => {
    const fd = new FormData();
    if (selectedFile && pageOrder) {
      fd.append("file", selectedFile);
      fd.append("pageOrder", JSON.stringify(pageOrder));
    }
    Axios.post("http://localhost:4000/upload", fd)
      .then((res) => {
        setNewPDFName(res.data.file);
        setShowModal(true);
      })
      .catch((err) => console.log(err));
  };

  const movePageUp = () => {
    setPageOrder((prevPageOrder: any) => {
      const index = prevPageOrder.indexOf(selectedPage);
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

  const movePageDown = () => {
    setPageOrder((prevPageOrder: any) => {
      const index = prevPageOrder.indexOf(selectedPage);
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

  const deletePage = () => {
    setPageOrder((prevPageOrder: any) => {
      let newPageOrder = [...prevPageOrder];
      let selectedPageIndex = prevPageOrder.indexOf(selectedPage);
      newPageOrder.splice(selectedPageIndex, 1);
      setSelectedPage(newPageOrder[0]);
      return newPageOrder;
    });
  };

  const unselectFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="App bg-[#1d1d1f] min-h-screen">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />

      {!!!selectedFile && (
        <div className="flex items-center justify-center h-screen">
          <button
            className="px-4 py-2 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm hover:bg-cyan-600 
        active:bg-cyan-700 focus:outline-none focus:ring focus:ring-cyan-300"
            onClick={handleUploadClick}
          >
            Upload
          </button>
        </div>
      )}

      <input
        className="hidden"
        type="file"
        accept="application/pdf"
        onChange={handleFileSelection}
        ref={inputRef}
      />

      {selectedFile && (
        <div>
          <div className="md:container mx-auto flex justify-between px-2 pt-4">
            <button
              className="font-semibold text-[#0071e3] text-sm hover:bg-[red-800] px-2 z-50"
              onClick={unselectFile}
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>

            <div className="fixed inset-x-0 top-0 flex justify-center z-40 p-5 max-[639px]:mt-[75px]">
              <div className="drop-shadow-2xl">
                <button
                  className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 rounded-l-md shadow-sm ring-1 ring-slate-900/5 hover:bg-[#0071e3] hover:text-white disabled:opacity-70 disabled:cursor-not-allowed"
                  onClick={movePageUp}
                  disabled={selectedPage === pageOrder[0]}
                >
                  <span className="material-symbols-outlined">
                    arrow_upward
                  </span>
                </button>
                <button
                  className="px-4 py-2 font-semibold text-sm bg-white text-slate-700  shadow-sm ring-1 ring-slate-900/5 hover:bg-[#0071e3] hover:text-white disabled:opacity-70 disabled:cursor-not-allowed"
                  onClick={movePageDown}
                  disabled={selectedPage === pageOrder[pageOrder.length - 1]}
                >
                  <span className="material-symbols-outlined">
                    arrow_downward
                  </span>
                </button>
                <button
                  className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 rounded-r-md shadow-sm ring-1 ring-slate-900/5 hover:text-white hover:bg-[#f44336] disabled:opacity-70 disabled:cursor-not-allowed"
                  onClick={deletePage}
                  disabled={pageOrder.length === 1}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>

            <div className="space-x-4 z-50">
              <button
                className="underline rounded-full text-[#0071e3] font-semibold text-sm px-2 py-2 hover:bg-white hover:px-2"
                onClick={resetPDF}
              >
                Reset
              </button>

              <button
                className="bg-[#0071e3] rounded-full text-white font-semibold text-sm hover:bg-blue-800 px-4 py-2 disabled:opacity-50"
                onClick={handleFileUpload}
                disabled={pageOrder.length === 0}
              >
                Get Download Link
              </button>
            </div>
          </div>

          <div className="bg-[#141414] md:container mx-auto md:px-2 md:py-2 mt-4 rounded-lg max-[639px]:mt-[80px]">
            <EditorContext.Provider
              value={{
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
              }}
            >
              <Editor></Editor>
            </EditorContext.Provider>
          </div>
        </div>
      )}
      {showModal && (
        <ModalContext.Provider value={{ newPDFName, setShowModal }}>
          <Modal></Modal>
        </ModalContext.Provider>
      )}
    </div>
  );
}

export default App;
