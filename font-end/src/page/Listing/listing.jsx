import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu";
import { shoppingProductSortOptions } from "@/config";
import { ArrowUpDownIcon, Loader, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Pagination from "@/components/common/pagination";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import ProductFilter from "../../components/ui/filter";
import ShoppingProductCard from "../../components/ui/ProductCard/product-card";
import axios from "axios";
import API_URLS from "../../config/config";



function ShoppingListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(
    searchParams.get("search") || sessionStorage.getItem("search") || ""
  );
  const [filters, setFilters] = useState(
    JSON.parse(sessionStorage.getItem("filters")) || {}
  );
  const [sort, setSort] = useState(
    sessionStorage.getItem("sort") || shoppingProductSortOptions[0].id
  );
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]); // State để lưu trữ sản phẩm
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) ||
      parseInt(sessionStorage.getItem("page")) ||
      1
  );
  const [totalPages, setTotalPages] = useState(1);
  const limitProductsPerPage = 12;

  // Fetch products từ API
//   useEffect(() => {
//     setLoading(true);
//     axios
//       .get(API_URLS.GET_PRODUCTS, {
//         params: {
//           page: currentPage,
//           limit: limitProductsPerPage,
//           search,
//           sort,
//           filters: JSON.stringify(filters),
//         },
//       })
//       .then((response) => {
//         setProducts(response.data.products);
//         setTotalPages(Math.ceil(response.data.total / limitProductsPerPage));
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching products:", error);
//         setLoading(false);
//       });
//   }, [currentPage, search, sort, filters]);


useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(API_URLS.GET_PRODUCTS)
        setProducts(response.data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [currentPage, search, sort, filters])



  // Update URL khi state thay đổi
  useEffect(() => {
    let params = new URLSearchParams();
    if (sort) params.set("sort", sort);
    if (currentPage) params.set("page", currentPage);
    if (search.length > 0) params.set("search", search);

    setSearchParams(params.toString());

    // Lưu vào sessionStorage
    sessionStorage.setItem("filters", JSON.stringify(filters));
    sessionStorage.setItem("sort", sort);
    sessionStorage.setItem("page", currentPage);
    sessionStorage.setItem("search", search);
  }, [filters, sort, currentPage, search]);

  // Reset về trang 1 khi filters hoặc sort thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sort]);

  const handleSort = (value) => {
    setSort(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilter = (section, optionValue) => {
    let nextFilters = { ...filters };
    if (nextFilters[section] && nextFilters[section].includes(optionValue)) {
      nextFilters[section] = nextFilters[section].filter(
        (value) => value !== optionValue
      );
    } else {
      nextFilters[section] = [...(nextFilters[section] || []), optionValue];
    }
    setFilters(nextFilters);
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  return (
    <div className="grid relative grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6 mt-12">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="w-full rounded-lg shadow-sm bg-background">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">All Products</h2>
          {/* Search */}
          <div className="">
            <div className="flex items-center w-full sm:w-[400px] lg:w-[500px] space-x-2">
              <Input
                type="text"
                placeholder="Search Collections"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                type="submit"
                className="flex space-x-2"
                onClick={handleSearch}
              >
                {!loading ? <SearchIcon /> : <Loader />} Search
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="w-4 h-4" />
                  <span className="">
                    {shoppingProductSortOptions.map(
                      (sortItem) => sortItem.id === sort && sortItem.label
                    )}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => handleSort(value)}
                >
                  {shoppingProductSortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="pb-6">
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
            {loading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="w-full h-full max-w-sm mz-auto">
                  <Skeleton className="w-full aspect-square" />
                  <Skeleton className="w-full h-4 mt-2" />
                  <Skeleton className="w-1/2 h-4 mt-2" />
                  <Skeleton className="w-1/3 h-6 mt-2" />
                </div>
              ))
            ) : products?.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  className="rounded-md hover:shadow-2xl hover:cursor-pointer"
                >
                  <ShoppingProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground">
                No products found
              </div>
            )}
          </div>
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default ShoppingListing;