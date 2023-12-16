import { useContext } from "react";
import { ModalContext } from "../App";

export function Modal() {
  const { newPDFName, setShowModal } = useContext(ModalContext);
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 z-[100] w-screen overflow-y-auto">
      <div className="overflow-y-auto sm:p-0 pt-4 pr-4 pb-20 pl-4 bg-gray-800/75">
        <div
          className="flex justify-center items-end text-center min-h-screen sm:block"
          onClick={handleCloseModal}
        >
          <div className=" transition-opacity bg-opacity-75"></div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
          <div className="inline-block text-left bg-[#1d1d1f] rounded-lg overflow-hidden align-bottom transition-all transform shadow-2xl sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
            <div className="items-center w-full mr-auto ml-auto relative max-w-7xl md:px-12 lg:px-24">
              <div className="grid grid-cols-1">
                <div
                  className="mt-4 mr-auto mb-4 ml-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div className="flex flex-col items-center pt-6 pr-6 pb-6 pl-6">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <span className="material-symbols-outlined">
                        download
                      </span>
                    </div>
                    <p className="mt-8 text-2xl font-semibold leading-none text-white tracking-tighter lg:text-3xl">
                      Download
                    </p>
                    <p className="mt-3 text-base leading-relaxed text-center text-gray-200">
                      Click Download to start your download.
                    </p>
                    <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mt-6">
                      <a
                        type="button"
                        className="inline-flex w-full justify-center rounded-full bg-[#0071e3] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 sm:ml-3 sm:w-auto"
                        href={"http://localhost:4000/download/" + newPDFName}
                        download onClick={handleCloseModal}
                      >
                        Download
                      </a>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-full px-3 py-2 text-sm font-semibold text-gray-50 shadow-sm hover:bg-gray-50 hover:text-[#0071e3] sm:mt-0 sm:w-auto"
                        onClick={handleCloseModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
