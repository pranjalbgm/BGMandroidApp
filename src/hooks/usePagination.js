import {useState} from 'react';

const usePagination = (totalItems, initialPage = 1, initialPageSize = 50) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
  };

  const handlePageSizeChange = size => {
    setPageSize(size);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const getPageItems = data => {
    const currentPageItems = data.slice(startIndex, endIndex);
    return currentPageItems;
  };

  return {
    currentPage,
    totalPages,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    getPageItems,
  };
};

export default usePagination;
