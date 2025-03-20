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
import { toast } from "sonner";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) ||
      parseInt(sessionStorage.getItem("page")) ||
      1
  );
  const [totalPages, setTotalPages] = useState(1);
  const limitProductsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Construct query parameters
        const queryParams = new URLSearchParams({
          page: currentPage,
          limit: limitProductsPerPage,
          sort: sort
        });

        if (search) {
          queryParams.append('search', search);
        }

        // Add filters to query params
        if (Object.keys(filters).length > 0) {
          Object.entries(filters).forEach(([key, values]) => {
            if (values && values.length > 0) {
              queryParams.append(key, values.join(','));
            }
          });
        }

        const response = await axios.get(`${API_URLS.GET_PRODUCTS}?${queryParams}`);
        
        if (response.data) {
          setProducts(response.data.products || response.data);
          setTotalPages(Math.ceil((response.data.total || response.data.length) / limitProductsPerPage));
        }
      } catch (err) {
        setError(err.message);
        toast.error("Failed to fetch products: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, search, sort, filters]);

  // Update URL and session storage when state changes
  useEffect(() => {
    let params = new URLSearchParams();
    if (sort) params.set("sort", sort);
    if (currentPage) params.set("page", currentPage);
    if (search.length > 0) params.set("search", search);

    setSearchParams(params.toString());

    // Save to sessionStorage
    sessionStorage.setItem("filters", JSON.stringify(filters));
    sessionStorage.setItem("sort", sort);
    sessionStorage.setItem("page", currentPage.toString());
    sessionStorage.setItem("search", search);
  }, [filters, sort, currentPage, search, setSearchParams]);

  // Reset to page 1 when filters or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sort, search]);

  const handleSort = (value) => {
    setSort(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilter = (section, optionValue) => {
    setFilters(prevFilters => {
      const nextFilters = { ...prevFilters };
      if (!nextFilters[section]) {
        nextFilters[section] = [];
      }
      
      if (nextFilters[section].includes(optionValue)) {
        nextFilters[section] = nextFilters[section].filter(
          (value) => value !== optionValue
        );
      } else {
        nextFilters[section] = [...nextFilters[section], optionValue];
      }

      // Remove empty filter sections
      if (nextFilters[section].length === 0) {
        delete nextFilters[section];
      }

      return nextFilters;
    });
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearch("");
    setSort(shoppingProductSortOptions[0].id);
    setCurrentPage(1);
  };

  return (
    <div className="grid relative grid-cols-1 md:grid-cols-[250px_1fr] gap-6 p-4 md:p-6 mt-12">
      <aside className="space-y-4">
        <ProductFilter filters={filters} handleFilter={handleFilter} />
        {(Object.keys(filters).length > 0 || search) && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        )}
      </aside>
      
      <div className="w-full rounded-lg shadow-sm bg-background">
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b gap-4">
          <h2 className="text-lg font-bold">All Products</h2>
          
          {/* Search */}
          <div className="w-full sm:w-[400px] lg:w-[500px]">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Search products..."
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                type="submit"
                className="flex items-center gap-2"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? <Loader className="animate-spin" /> : <SearchIcon />}
                Search
              </Button>
            </div>
          </div>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 min-w-[150px]"
              >
                <ArrowUpDownIcon className="w-4 h-4" />
                <span>
                  {shoppingProductSortOptions.find(item => item.id === sort)?.label || 'Sort'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuRadioGroup
                value={sort}
                onValueChange={handleSort}
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

        <div className="pb-6">
          {error ? (
            <div className="p-4 text-center text-red-500">
              {error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {loading ? (
                  Array.from({ length: limitProductsPerPage }).map((_, index) => (
                    <div key={index} className="w-full h-full max-w-sm mx-auto">
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
                      className="rounded-md transition-shadow duration-200 hover:shadow-lg"
                    >
                      <ShoppingProductCard product={product} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No products found
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShoppingListing;