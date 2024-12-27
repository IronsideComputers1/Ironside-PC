interface Price {
  value: number;
  currencyCode?: string;
}

interface ImageEdge {
  node: {
    urlOriginal: string;
    altText: string;
    isDefault: boolean;
  };
}

interface VariantEdge {
  node: {
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
  };
}


interface CategoryEdge {
  node: {
    id: string;
    name: string;
  };
}

export interface CustomFieldEdge {
  node: {
    value: string;
  };
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
    edges: CustomFieldEdge[];
  };
}

export interface ModalData {
  categoryName: string;
  products: Product[];
}

export type SelectedOption = {
  category_name: string;
  option_id: number;
  option_value: number;
  parent_id: number;
  productPrice: number;
  product_id: number;
  product_image: string;
  product_name: string;
};

export interface ColorOption {
  entityId: string;
  variants: { edges: { node: { inventory: { isInStock: boolean } } }[] };
  prices: { price: { value: number } };
  name: string;
  product_id: string;
}
