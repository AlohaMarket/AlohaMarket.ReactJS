import { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  status: 'active' | 'inactive' | 'draft';
  image?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  sales: number;
  rating: number;
  reviews: number;
}

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium wireless headphones with noise cancellation',
    price: 299.99,
    category: 'Electronics',
    stock: 50,
    status: 'active',
    image: '/products/headphones.jpg',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    views: 1250,
    sales: 45,
    rating: 4.5,
    reviews: 32
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    description: 'Advanced fitness tracking smartwatch',
    price: 399.99,
    category: 'Electronics',
    stock: 25,
    status: 'active',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    views: 980,
    sales: 28,
    rating: 4.2,
    reviews: 18
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    description: 'Sustainable and comfortable cotton t-shirt',
    price: 29.99,
    category: 'Fashion',
    stock: 0,
    status: 'active',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-15',
    views: 420,
    sales: 67,
    rating: 4.8,
    reviews: 45
  },
  {
    id: '4',
    name: 'Gaming Mechanical Keyboard',
    description: 'RGB mechanical keyboard for gaming',
    price: 149.99,
    category: 'Electronics',
    stock: 15,
    status: 'inactive',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-12',
    views: 320,
    sales: 12,
    rating: 4.1,
    reviews: 8
  },
  {
    id: '5',
    name: 'Yoga Mat Premium',
    description: 'Non-slip premium yoga mat',
    price: 49.99,
    category: 'Sports',
    stock: 80,
    status: 'draft',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-16',
    views: 150,
    sales: 0,
    rating: 0,
    reviews: 0
  }
];

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'electronics': return 'bg-blue-100 text-blue-800';
    case 'fashion': return 'bg-purple-100 text-purple-800';
    case 'sports': return 'bg-green-100 text-green-800';
    case 'home': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: Product['status']) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'inactive': return 'bg-yellow-100 text-yellow-800';
    case 'draft': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const handleStatusChange = (productId: string, newStatus: Product['status']) => {
    setProducts(products.map(product => 
      product.id === productId ? { ...product, status: newStatus } : product
    ));
  };

  const ProductDetailDialog = ({ product }: { product: Product }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Product Details</DialogTitle>
        <DialogDescription>
          Detailed information about {product.name}
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Package className="h-16 w-16 text-gray-400" />
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{product.views} views</span>
            </div>
            
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{product.sales} sales</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Price</span>
              <span className="text-sm">${product.price.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm font-medium">Category</span>
              <Badge className={getCategoryColor(product.category)}>
                {product.category}
              </Badge>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm font-medium">Stock</span>
              <span className={`text-sm ${product.stock === 0 ? 'text-red-600' : 'text-green-600'}`}>
                {product.stock === 0 ? 'Out of Stock' : `${product.stock} items`}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm font-medium">Status</span>
              <Badge className={getStatusColor(product.status)}>
                {product.status}
              </Badge>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm font-medium">Created</span>
              <span className="text-sm">{new Date(product.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm font-medium">Updated</span>
              <span className="text-sm">{new Date(product.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );

  // Calculate summary stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const averagePrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products Management</h1>
          <p className="text-muted-foreground">
            Manage your store products, inventory, and pricing.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {activeProducts} active products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock}</div>
            <p className="text-xs text-muted-foreground">
              items in inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averagePrice.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              across all products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.stock < 10).length}
            </div>
            <p className="text-xs text-muted-foreground">
              products need restocking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Fashion">Fashion</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Home">Home</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
          <CardDescription>
            A list of all products in your store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(product.category)}>
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={product.stock === 0 ? 'text-red-600' : product.stock < 10 ? 'text-yellow-600' : 'text-green-600'}>
                      {product.stock === 0 ? 'Out of Stock' : product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(product.status)}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.sales}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => {
                              e.preventDefault();
                              setSelectedProduct(product);
                            }}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          {selectedProduct && <ProductDetailDialog product={selectedProduct} />}
                        </Dialog>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(product.id, 'active')}
                          disabled={product.status === 'active'}
                        >
                          Activate
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(product.id, 'inactive')}
                          disabled={product.status === 'inactive'}
                        >
                          Deactivate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
