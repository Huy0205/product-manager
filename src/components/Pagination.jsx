
function Pagination({currentPage, totalPages, onPageChange}) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center mt-4 ">
            <button
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </button>
            <span className="mx-4 text-gray-500">
                Page {currentPage} of {totalPages}
            </span>
            <button
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    )

}

export default Pagination;
