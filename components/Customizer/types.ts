interface Price {
  value: number;
  currencyCode?: string;
}

interface ImageNode {
  urlOriginal: string;
  altText: string;
  isDefault: boolean;
}

interface ImageEdge {
  node: ImageNode;
}

interface VariantNode {
  prices: {
    price: Price;
  };
  sku: string;
  inventory: {
    isInStock: boolean;
  };
  options: {
    edges: any[];
  };
  entityId: number;
  defaultImage: any;
}

interface VariantEdge {
  node: VariantNode;
}

interface CategoryNode {
  id: string;
  name: string;
}

interface CategoryEdge {
  node: CategoryNode;
}

export interface Product {
  entityId: number;
  name: string;
  path: string;
  brand: string | null;
  description: string;
  prices: {
    price: Price;
    salePrice: Price | null;
    retailPrice: Price | null;
  };
  images: {
    edges: ImageEdge[];
  };
  variants: {
    edges: VariantEdge[];
  };
  productOptions: {
    edges: any[];
  };
  categories: {
    edges: CategoryEdge[];
  };
  customFields: {
    edges: any[];
  };
}
