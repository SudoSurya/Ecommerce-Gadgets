import { useState, useEffect } from 'react';
import Product from './Prodcuts';

interface Products {
    id: string;
    name: string;
    brand: string;
    price: number;
    rating: number;
    type: string;
    image: string;
    description: string;
}

export default function ProductPage() {
    const [products, setProducts] = useState<Products[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [productsPerPage] = useState(6);
    const [totalProducts, setTotalProducts] = useState(0);
    const [cache, setCache] = useState<{ [key: string]: Products[] }>({});

    useEffect(() => {
        fetchProducts();
    }, [currentPage, productsPerPage]);

    const fetchProducts = async () => {
        const cacheKey = `${currentPage}-${productsPerPage}`;

        if (cache[cacheKey]) {
            // Retrieve data from cache if available
            setProducts(cache[cacheKey]);
        } else {
            try {
                const response = await fetch(
                    `http://localhost:8080/products/page?page=${currentPage}&pageSize=${productsPerPage}`
                );
                const data = await response.json();
                setProducts(data.products);
                setTotalProducts(data.totalProducts);
                setCache((prevCache) => ({
                    ...prevCache,
                    [cacheKey]: data.products,
                }));
            } catch (error) {
                console.log("Error Fetching Products", error);
            }
        }
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            {products && <Product products={products} />}
            <div className="flex items-center justify-center my-4">
                <button
                    className="px-4 py-2 mr-2 text-white bg-blue-500 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="px-4 py-2 text-gray-800">
                    Page {currentPage}
                </span>
                <button
                    className="px-4 py-2 ml-2 text-white bg-blue-500 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage * productsPerPage >= totalProducts}
                >
                    Next
                </button>
            </div>
        </>
    );
}

