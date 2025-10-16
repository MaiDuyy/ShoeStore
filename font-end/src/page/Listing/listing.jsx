import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu";
import { shoppingProductSortOptions } from "@/config";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Pagination from "@/components/common/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import ProductFilter from "@/components/ui/filter";
import ShoppingProductCard from "@/components/ui/ProductCard/product-card";
import axios from "axios";
import API_URLS from "@/config/config";
import { toast } from "sonner";

function ShoppingListing() {
  const [searchParams, setSearchParams] = useSearchParams();
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

  // Chuẩn hoá 1 item sản phẩm từ API -> shape thống nhất cho FE
  const normalizeProduct = (raw) => {
    if (!raw || typeof raw !== 'object') return null;

    const _id = raw._id || raw.id || raw.sku || raw.slug || null;
    const name = raw.name || raw.shoes_name || raw.title || raw.productName || 'Unnamed';
    const price = Number(
      raw.price ??
      raw.sale_price ??
      raw.original_price ??
      0
    );
    const imageURL =
      raw.imageURL ||
      raw.image ||
      (Array.isArray(raw.images) ? raw.images[0] : null) ||
      'https://placehold.co/600x600?text=No+Image';

    const is_in_inventory = Boolean(
      raw.is_in_inventory ?? (raw.items_left > 0)
    );
    const items_left = Number(raw.items_left ?? 0);

    const brand = raw.brand || '';
    const category = raw.category || raw.category_name || '';
    const attributes = {
      size: raw.attributes?.size || raw.attributes?.sizes || raw.sizes || [],
      colors: raw.attributes?.colors || raw.colors || [],
    };
    const slug = raw.slug || null;

    return {
      _id,
      name,
      price,
      imageURL,
      brand,
      category,
      is_in_inventory,
      items_left,
      attributes,
      slug,
      _raw: raw,
    };
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          page: currentPage,
          limit: limitProductsPerPage,
          sort: sort
        });

        Object.entries(filters || {}).forEach(([key, values]) => {
          if (Array.isArray(values) && values.length > 0) {
            queryParams.append(key, values.join(','));
          }
        });

        const res = await axios.get(`${API_URLS.GET_PRODUCTS}?${queryParams.toString()}`);
        const data = res.data;

        if (!data) {
          setProducts([]);
          setTotalPages(1);
          return;
        }

        let fetchedProducts = data.products || data || [];

        if (filters.price && filters.price.length > 0) {
          fetchedProducts = fetchedProducts.filter(product => {
            const priceCandidate = product.price || product.sale_price || product.original_price || 0;
            return filters.price.some(range => {
              const [min, max] = range.split('-').map(Number);
              return max ? (priceCandidate >= min && priceCandidate <= max) : priceCandidate >= min;
            });
          });
        }

        const normalized = fetchedProducts.map(normalizeProduct).filter(Boolean);
        setProducts(normalized);
        setTotalPages(Number(data.totalPages) || Math.ceil(normalized.length / limitProductsPerPage) || 1);

      } catch (err) {
        console.error('Fetch products failed:', err);
        setError(err.message || 'Failed to fetch products');
        toast.error(`Failed to fetch products: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, sort, filters]);

  // Update URL + sessionStorage
  useEffect(() => {
    let params = new URLSearchParams();
    if (sort) params.set("sort", sort);
    if (currentPage) params.set("page", currentPage);
    Object.entries(filters || {}).forEach(([key, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        params.set(key, values.join(','));
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params.toString());

    sessionStorage.setItem("filters", JSON.stringify(filters));
    sessionStorage.setItem("sort", sort);
    sessionStorage.setItem("page", currentPage.toString());
  }, [filters, sort, currentPage, setSearchParams]);

  // Reset page khi đổi filter/sort
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sort]);

  const handleSort = (value) => setSort(value);
  const handlePageChange = (page) => setCurrentPage(page);

  const handleFilter = (section, optionValue) => {
    setFilters(prevFilters => {
      const nextFilters = { ...prevFilters };
      if (!nextFilters[section]) nextFilters[section] = [];
      if (nextFilters[section].includes(optionValue)) {
        nextFilters[section] = nextFilters[section].filter(v => v !== optionValue);
      } else {
        nextFilters[section] = [...nextFilters[section], optionValue];
      }
      if (nextFilters[section].length === 0) delete nextFilters[section];
      return nextFilters;
    });
  };

  const handleClearFilters = () => {
    setFilters({});
    setSort(shoppingProductSortOptions[0].id);
    setCurrentPage(1);
  };

  return (
    <div className="grid relative grid-cols-1 md:grid-cols-[250px_1fr] gap-6 p-4 md:p-6 mt-12">
      <aside className="space-y-4">
        <ProductFilter filters={filters} handleFilter={handleFilter} />
        {Object.keys(filters).length > 0 && (
          <Button variant="outline" className="w-full" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        )}
      </aside>

      <div className="w-full rounded-lg shadow-sm bg-background">
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b gap-4">
          <h2 className="text-lg font-bold">All Products</h2>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1 min-w-[150px]">
                <ArrowUpDownIcon className="w-4 h-4" />
                <span>{shoppingProductSortOptions.find(item => item.id === sort)?.label || 'Sort'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                {shoppingProductSortOptions.map((sortItem) => (
                  <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
                    {sortItem.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="pb-6">
          {error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
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
                  products.map((p) => (
                    <div key={p._id || p.slug} className="rounded-md transition-shadow duration-200 hover:shadow-lg">
                      <ShoppingProductCard product={p} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No products found
                  </div>
                )}
              </div>

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
