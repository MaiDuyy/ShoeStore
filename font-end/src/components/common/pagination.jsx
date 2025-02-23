import {
    Pagination as PaginationComponent,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
  
  function Pagination({ currentPage, totalPages, onPageChange, className = "" }) {
    const getPageNumbers = () => {
      const pages = [];
      const maxPagesToShow = 5;
      const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
  
      if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= halfMaxPagesToShow + 1) {
          for (let i = 1; i <= maxPagesToShow; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(totalPages);
        } else if (currentPage >= totalPages - halfMaxPagesToShow) {
          pages.push(1);
          pages.push("...");
          for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push("...");
          for (
            let i = currentPage - halfMaxPagesToShow;
            i <= currentPage + halfMaxPagesToShow;
            i++
          ) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(totalPages);
        }
      }
  
      return pages;
    };
    let pages = getPageNumbers();
  
    return (
      <div className={className}>
        <PaginationComponent>
          <PaginationContent>
            {currentPage !== 1 && (
              <PaginationItem
                className="hover:cursor-pointer"
                onClick={() => onPageChange(currentPage - 1)}
              >
                <PaginationPrevious />
              </PaginationItem>
            )}
            {pages.map((page, index) => (
              <PaginationItem key={index}>
                {page !== "..." ? (
                  <PaginationLink
                    className="hover:cursor-pointer"
                    isActive={currentPage === page}
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </PaginationLink>
                ) : (
                  <PaginationEllipsis />
                )}
              </PaginationItem>
            ))}
            {currentPage !== totalPages && (
              <PaginationItem
                className="hover:cursor-pointer"
                onClick={() => onPageChange(currentPage + 1)}
              >
                <PaginationNext />
              </PaginationItem>
            )}
          </PaginationContent>
        </PaginationComponent>
      </div>
    );
  }
  
  export default Pagination;