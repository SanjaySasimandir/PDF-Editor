import { useContext } from "react";
import { ToolbarContext } from "../App";

export function Toolbar() {
  const {
    pageOrder,
    selectedPage,
    unselectFile,
    movePageUp,
    movePageDown,
    deletePage,
    handleFileUpload,
    resetPDF,
  } = useContext(ToolbarContext);
  return (
    <div className="md:container mx-auto flex justify-between px-2 pt-4">
      <button
        className="font-semibold text-[#0071e3] text-sm rounded-full hover:bg-gray-50 px-2 z-50 pt-1"
        onClick={unselectFile}
      >
        <span className="material-symbols-outlined">arrow_back</span>
      </button>

      <div className="fixed inset-x-0 top-0 flex justify-center z-40 p-5 max-[639px]:mt-[75px] -mt-2">
        <div className="drop-shadow-2xl">
          <button
            className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 rounded-l-md shadow-sm ring-1 ring-slate-900/5 hover:bg-[#0071e3] hover:text-white disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={() => movePageUp()}
            disabled={selectedPage === pageOrder[0]}
          >
            <span className="material-symbols-outlined">arrow_upward</span>
          </button>
          <button
            className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 shadow-sm ring-1 ring-slate-900/5 hover:bg-[#0071e3] hover:text-white disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={movePageDown}
            disabled={selectedPage === pageOrder[pageOrder.length - 1]}
          >
            <span className="material-symbols-outlined">arrow_downward</span>
          </button>
          <button
            className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 rounded-r-md shadow-sm ring-1 ring-slate-900/5 hover:text-white hover:bg-[#f44336] disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={deletePage}
            disabled={pageOrder.length === 1}
            aria-label="Delete Page"
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
          Finish
        </button>
      </div>
    </div>
  );
}
