import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/apis/client';
import { useApiError } from '@/hooks/useApiError';
import { type Product, type ApiError } from '@/types';
import { toast } from 'react-hot-toast';

// Example API functions
const fetchProducts = async (): Promise<Product[]> => {
    return api.get<Product[]>('/products');
};

const fetchProductsPaginated = async (page: number = 1) => {
    return api.getPaginated<Product>(`/products?page=${page}&limit=10`);
};

const createProduct = async (productData: Partial<Product>): Promise<Product> => {
    return api.post<Product>('/products', productData);
};

const ExampleApiUsage: React.FC = () => {
    const { handleError, handleValidationErrors } = useApiError();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Query example - Fetch products
    const {
        data: products,
        isLoading,
        error: queryError,
        isError,
    } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
    });

    // Handle query error effect
    React.useEffect(() => {
        if (isError && queryError) {
            handleError(queryError as unknown as ApiError);
        }
    }, [isError, queryError, handleError]);

    // Query example - Fetch paginated products
    const {
        data: paginatedProducts,
        isLoading: isPaginatedLoading,
        error: paginatedError,
        isError: isPaginatedError,
    } = useQuery({
        queryKey: ['products', 'paginated'],
        queryFn: () => fetchProductsPaginated(1),
    });

    // Handle paginated query error effect
    React.useEffect(() => {
        if (isPaginatedError && paginatedError) {
            handleError(paginatedError as unknown as ApiError);
        }
    }, [isPaginatedError, paginatedError, handleError]);

    // Mutation example - Create product
    const createProductMutation = useMutation({
        mutationFn: createProduct,
        onSuccess: (data) => {
            toast.success('Product created successfully!');
            console.log('Created product:', data);
            // Reset form
            setFormData({ title: '', description: '', price: '' });
            setFormErrors({});
        },
        onError: (error: ApiError) => {
            if (error.code === 'VALIDATION_ERROR') {
                // Set form field errors for validation errors
                const validationErrors = handleValidationErrors(error);
                setFormErrors(validationErrors);
            } else {
                // Show general error toast
                handleError(error);
            }
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        setFormErrors({});

        createProductMutation.mutate({
            name: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear field error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    if (isLoading) {
        return <div className="p-4">Loading products...</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">API Usage Examples</h1>

            {/* Products List */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Products (Single Response)</h2>
                {isError && (
                    <div className="text-red-600 mb-4">
                        Error loading products: {(queryError as unknown as ApiError)?.message || 'Unknown error'}
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products?.map((product) => (
                        <div key={product.id} className="border rounded-lg p-4">
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-gray-600">${product.price}</p>
                            <p className="text-sm text-gray-500 mt-2">{product.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Paginated Products */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Paginated Products</h2>
                {isPaginatedLoading ? (
                    <div>Loading paginated data...</div>
                ) : (
                    <div>
                        <div className="mb-4 text-sm text-gray-600">
                            Showing {paginatedProducts?.items?.length || 0} of {paginatedProducts?.meta?.total_items || 0} products
                            (Page {paginatedProducts?.meta?.current_page || 1} of {paginatedProducts?.meta?.total_pages || 1})
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {paginatedProducts?.items?.map((product) => (
                                <div key={product.id} className="border rounded-lg p-4">
                                    <h3 className="font-semibold">{product.name}</h3>
                                    <p className="text-gray-600">${product.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* Create Product Form */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Create Product (Mutation Example)</h2>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className={`w-full border rounded px-3 py-2 ${formErrors['Title'] ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter product title"
                        />
                        {formErrors['Title'] && (
                            <p className="text-red-500 text-sm mt-1">{formErrors['Title']}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                            className={`w-full border rounded px-3 py-2 ${formErrors['Description'] ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter product description"
                        />
                        {formErrors['Description'] && (
                            <p className="text-red-500 text-sm mt-1">{formErrors['Description']}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-sm font-medium mb-1">
                            Price
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            step="0.01"
                            min="0"
                            className={`w-full border rounded px-3 py-2 ${formErrors['Price'] ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter product price"
                        />
                        {formErrors['Price'] && (
                            <p className="text-red-500 text-sm mt-1">{formErrors['Price']}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={createProductMutation.isPending}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {createProductMutation.isPending ? 'Creating...' : 'Create Product'}
                    </button>
                </form>
            </section>

            {/* Error Handling Examples */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Error Handling Examples</h2>
                <div className="space-y-2">
                    <button
                        onClick={() => api.get('/non-existent-endpoint').catch(() => { })}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2"
                    >
                        Trigger 404 Error
                    </button>
                    <button
                        onClick={() => api.post('/products', { invalidData: true }).catch(() => { })}
                        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 mr-2"
                    >
                        Trigger Validation Error
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ExampleApiUsage;
