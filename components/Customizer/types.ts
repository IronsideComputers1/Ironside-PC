interface Price {
  value: number
  currencyCode?: string
}

interface Image {
  node: {
    urlOriginal: string
    altText: string
    isDefault: boolean
  }
}

interface Variant {
  node: {
    prices: {
      price: Price
    }
    sku: string
    inventory: {
      isInStock: boolean
    }
    options: {
      edges: any[]
    }
    entityId: number
    defaultImage: any
  }
}

interface Category {
  node: {
    id: string
    name: string
  }
}

interface CustomField {
  node: {
    value: string
  }
}

export interface Product {
  entityId: string
  name: string
  description: string
  images: {
    edges: Image[]
  }
  categories: {
    edges: Category[]
  }
  prices: {
    price: Price
  }
  customFields: {
    edges: CustomField[]
  }
  variants: {
    edges: Variant[]
  }
}

export interface ModalData {
  categoryName: string
  products: Product[]
}
