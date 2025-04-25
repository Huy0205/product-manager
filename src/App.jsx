import { useEffect, useState } from "react";
import ProductTable from "./components/ProductTable";
import Pagination from "./components/Pagination";
import ProductModal from "./components/ProductModal";
import db from "./db/dexieDB";
import seedProducts from "./data/seed";
import { toast, ToastContainer } from "react-toastify";

const ITEMS_PER_PAGE = 10;

function App() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  const fetchProducts = async () => {
    const products = await db.products.orderBy('id').reverse().toArray();
    setProducts(products);
    setFilteredProducts(products);
    setTotalPages(Math.ceil(products.length / ITEMS_PER_PAGE));
  };

  useEffect(() => {
    const checkAndSeedDatabase = async () => {
      const hasProducts = await db.products.count();

      if (hasProducts === 0) {
        await seedProducts();
      }
      fetchProducts();
    };
    checkAndSeedDatabase();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredProducts(products);
      return;
    }
    const filteredProducts = products.filter((product) => {
      return product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             product.price.toString().includes(searchQuery) || 
             product.quantity.toString().includes(searchQuery);
    });
    setFilteredProducts(filteredProducts);
    setTotalPages(Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  }; 

  const handleModalOpen = () => {
    setIsModalOpen(true);
    setSelectedProduct(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleAddProduct = async (product) => {
    await db.products.add(product);
    const newProducts = [product, ...products];
    setProducts(newProducts);
    setFilteredProducts(newProducts);
    setIsModalOpen(false);
    setSearchQuery('');
    setCurrentPage(1);
    setTotalPages(Math.ceil(products.length / ITEMS_PER_PAGE));
    toast.success('Product added successfully');
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    await db.products.delete(id);
    setProducts(products.filter((product) => product.id !== id));
    setFilteredProducts(filteredProducts.filter((product) => product.id !== id));
    setSelectedProduct(null);
    toast.success('Product deleted successfully');
  };

  const handleSubmit = async (product) => {
    if (selectedProduct) {
      await db.products.put(product);
      setProducts(products.map((p) => (p.id === selectedProduct.id ? product : p)));
      setFilteredProducts(filteredProducts.map((p) => (p.id === selectedProduct.id ? product : p)));
      setSelectedProduct(null);
      toast.success('Product updated successfully');
    } else {
      await handleAddProduct(product);
    }
    setIsModalOpen(false);
  };
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-100">
      <div className="pt-2 pb-4 flex-none bg-blue-600">
        <h2 className="text-center text-4xl font-bold text-white">Product Manager</h2>
      </div>

      <div className="flex-1 flex flex-col items-center overflow-hidden">
        <div className="w-3/4 mx-auto h-full flex flex-col bg-white">
          <div className="flex-none bg-white shadow-sm p-4">
            <div className="flex justify-between items-center">
              <div className="w-1/3 px-2 flex items-center gap-2 border border-gray-300 rounded-md">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" placeholder="Search" className="flex-1 py-2 outline-none text-md font-medium text-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                onClick={handleModalOpen}
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Product
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-hidden">
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto">
                  <ProductTable
                    products={currentProducts}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                </div>
        
                {totalPages > 1 && (
                  <div className="flex-none border-t border-gray-300">
                    <div className="flex justify-center">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  </div>
                )}
              </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
      />

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        product={selectedProduct}
      />
    </div>
  )
}

export default App
