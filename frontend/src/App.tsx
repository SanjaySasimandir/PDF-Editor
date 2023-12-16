import React, {
  ChangeEvent,
  createContext,
  useRef,
  useState,
} from "react";
import "./App.css";
import { pdfjs } from "react-pdf";
import Axios from "axios";
import { Editor } from "./components/editor";
import { Modal } from "./components/modal";
import { Toolbar } from "./components/toolbar";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export const EditorContext = createContext({
  selectedFile: null as File | null,
  setTotalPages: (number: number) => {},
  pageOrder: [] as number[],
  setPageOrder: (numbers: number[]) => {},
  selectedPage: 1,
  setSelectedPage: (number: number) => {},
});

export const ModalContext = createContext({
  newPDFName: "",
  setShowModal: (showModal: boolean) => {},
});
export const ToolbarContext = createContext({
  pageOrder: [] as number[],
  movePageUp: () => {},
  movePageDown: () => {},
  deletePage: () => {},
  selectedPage: 1,
  unselectFile: () => {},
  resetPDF: () => {},
  handleFileUpload: () => {},
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
            className="px-4 py-2 font-semibold text-sm bg-[#0071e3] text-white rounded-full shadow-sm hover:bg-blue-800 
        active:bg-cyan-700 focus:outline-none focus:ring focus:ring-cyan-300 scale-125"
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
        <div className="pb-5">
          <ToolbarContext.Provider
            value={{
              pageOrder,
              selectedPage,
              unselectFile,
              movePageUp,
              movePageDown,
              deletePage,
              handleFileUpload,
              resetPDF,
            }}
          >
            <Toolbar></Toolbar>
          </ToolbarContext.Provider>
          <div className="bg-[#141414] md:container mx-auto md:px-2 md:py-2 mt-4 rounded-lg max-[639px]:mt-[80px]">
            <EditorContext.Provider
              value={{
                selectedFile,
                setTotalPages,
                pageOrder,
                setPageOrder,
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
