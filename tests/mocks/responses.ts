export const GET_SELLER_RESPONSE = {
  code: "0",
  data: {
    seller_id: "123456",
    user_id: "789",
    name: "Test Store PK",
    email: "test@example.com",
    status: "active",
    country: "PK",
    shop_name: "TestShopPK",
    cb: "false",
  },
};

export const GET_PRODUCTS_RESPONSE = {
  code: "0",
  data: {
    total_products: 2,
    products: [
      {
        item_id: "100001",
        attributes: {
          name: "Wireless Bluetooth Headphones",
          description: "<p>High-quality wireless headphones</p>",
          brand: "SoundMax",
          color_family: "Black",
        },
        skus: [
          {
            seller_sku: "WBH-001-BLK",
            shop_sku: "100001_PK-100001",
            price: "2500.00",
            special_price: "2200.00",
            quantity: 50,
            status: "active",
            images: ["https://img.daraz.pk/image1.jpg"],
          },
        ],
        primary_category: "5678",
        status: "active",
        created_at: "2024-01-10 08:00:00",
        updated_at: "2024-01-15 12:30:00",
      },
      {
        item_id: "100002",
        attributes: {
          name: "USB-C Fast Charger 65W",
          description: "<p>Universal fast charger</p>",
          brand: "ChargePro",
        },
        skus: [
          {
            seller_sku: "USBC-65W",
            shop_sku: "100002_PK-100002",
            price: "1800.00",
            quantity: 120,
            status: "active",
            images: ["https://img.daraz.pk/image2.jpg"],
          },
        ],
        primary_category: "9012",
        status: "active",
        created_at: "2024-01-12 09:15:00",
        updated_at: "2024-01-14 16:45:00",
      },
    ],
  },
};

export const GET_PRODUCT_RESPONSE = {
  code: "0",
  data: {
    item_id: "100001",
    attributes: {
      name: "Wireless Bluetooth Headphones",
      description: "<p>High-quality wireless headphones</p>",
      brand: "SoundMax",
      color_family: "Black",
    },
    skus: [
      {
        seller_sku: "WBH-001-BLK",
        shop_sku: "100001_PK-100001",
        price: "2500.00",
        special_price: "2200.00",
        quantity: 50,
        status: "active",
        images: ["https://img.daraz.pk/image1.jpg"],
      },
    ],
    primary_category: "5678",
    status: "active",
  },
};

export const CREATE_PRODUCT_RESPONSE = {
  code: "0",
  data: {
    item_id: "100003",
    seller_sku: ["NEW-SKU-001"],
  },
};

export const UPDATE_PRODUCT_RESPONSE = {
  code: "0",
  data: {
    item_id: "100001",
  },
};

export const UPDATE_PRICE_QUANTITY_RESPONSE = {
  code: "0",
  data: {},
};

export const GET_CATEGORY_TREE_RESPONSE = {
  code: "0",
  data: [
    {
      category_id: "1",
      name: "Electronics",
      children: [
        {
          category_id: "100",
          name: "Mobile Phones",
          children: [],
          leaf: true,
        },
        {
          category_id: "101",
          name: "Headphones",
          children: [],
          leaf: true,
        },
      ],
      leaf: false,
    },
    {
      category_id: "2",
      name: "Fashion",
      children: [
        {
          category_id: "200",
          name: "Men's Clothing",
          children: [],
          leaf: true,
        },
      ],
      leaf: false,
    },
  ],
};

export const GET_CATEGORY_ATTRIBUTES_RESPONSE = {
  code: "0",
  data: [
    {
      name: "name",
      label: "Product Name",
      is_mandatory: true,
      input_type: "text",
    },
    {
      name: "brand",
      label: "Brand",
      is_mandatory: true,
      input_type: "singleSelect",
      options: [
        { name: "Samsung" },
        { name: "Apple" },
        { name: "Xiaomi" },
      ],
    },
    {
      name: "color_family",
      label: "Color Family",
      is_mandatory: false,
      input_type: "singleSelect",
      options: [
        { name: "Black" },
        { name: "White" },
        { name: "Blue" },
      ],
    },
  ],
};

export const GET_BRANDS_RESPONSE = {
  code: "0",
  data: {
    total: 3,
    brands: [
      { brand_id: "1", name: "Samsung", global_identifier: "samsung" },
      { brand_id: "2", name: "Apple", global_identifier: "apple" },
      { brand_id: "3", name: "Xiaomi", global_identifier: "xiaomi" },
    ],
  },
};

export const GET_ORDERS_RESPONSE = {
  code: "0",
  data: {
    count: 2,
    orders: [
      {
        order_id: "111222333",
        created_at: "2024-01-15 10:30:00",
        updated_at: "2024-01-15 11:00:00",
        status: "pending",
        price: "2500.00",
        item_count: 2,
        buyer_username: "buyer123",
        payment_method: "COD",
        address: {
          first_name: "Ahmed",
          last_name: "Khan",
          phone: "+923001234567",
          address1: "123 Main Street",
          city: "Karachi",
          country: "Pakistan",
          post_code: "75500",
        },
      },
      {
        order_id: "111222334",
        created_at: "2024-01-15 11:45:00",
        updated_at: "2024-01-15 12:00:00",
        status: "ready_to_ship",
        price: "1800.00",
        item_count: 1,
        buyer_username: "buyer456",
        payment_method: "Online",
        address: {
          first_name: "Sara",
          last_name: "Ali",
          phone: "+923009876543",
          address1: "456 Park Avenue",
          city: "Lahore",
          country: "Pakistan",
          post_code: "54000",
        },
      },
    ],
  },
};

export const GET_ORDER_RESPONSE = {
  code: "0",
  data: {
    order_id: "111222333",
    created_at: "2024-01-15 10:30:00",
    updated_at: "2024-01-15 11:00:00",
    status: "pending",
    price: "2500.00",
    item_count: 2,
    buyer_username: "buyer123",
    payment_method: "COD",
    address: {
      first_name: "Ahmed",
      last_name: "Khan",
      phone: "+923001234567",
      address1: "123 Main Street",
      city: "Karachi",
      country: "Pakistan",
      post_code: "75500",
    },
  },
};

export const GET_ORDER_ITEMS_RESPONSE = {
  code: "0",
  data: [
    {
      order_id: "111222333",
      order_item_id: "AAA111",
      name: "Wireless Bluetooth Headphones",
      sku: "WBH-001-BLK",
      status: "pending",
      paid_price: "2200.00",
      quantity: 1,
      product_main_image: "https://img.daraz.pk/image1.jpg",
      tracking_code: "",
    },
    {
      order_id: "111222333",
      order_item_id: "AAA112",
      name: "USB-C Fast Charger 65W",
      sku: "USBC-65W",
      status: "pending",
      paid_price: "1800.00",
      quantity: 1,
      product_main_image: "https://img.daraz.pk/image2.jpg",
      tracking_code: "",
    },
  ],
};

export const SET_STATUS_TO_PACKED_RESPONSE = {
  code: "0",
  data: {
    order_items: [
      {
        order_item_id: "AAA111",
        purchase_order_id: "PO12345",
        purchase_order_number: "PON12345",
      },
    ],
  },
};

export const SET_STATUS_TO_RTS_RESPONSE = {
  code: "0",
  data: {
    order_items: [
      {
        order_item_id: "AAA111",
        purchase_order_id: "PO12345",
        purchase_order_number: "PON12345",
      },
    ],
  },
};

export const SET_STATUS_TO_CANCELLED_RESPONSE = {
  code: "0",
  data: {},
};

export const GET_FAILURE_REASONS_RESPONSE = {
  code: "0",
  data: [
    { reason_id: "1", reason: "Out of stock" },
    { reason_id: "2", reason: "Wrong price" },
    { reason_id: "3", reason: "Duplicate order" },
    { reason_id: "4", reason: "Customer request" },
    { reason_id: "5", reason: "Sourcing issue" },
  ],
};

export const GET_SHIPMENT_PROVIDERS_RESPONSE = {
  code: "0",
  data: [
    {
      name: "Daraz Express",
      cod: true,
      tracking_code_validation_regex: "^[A-Z0-9]+$",
      enabled_delivery_options: ["dropship", "pickup"],
    },
    {
      name: "Leopards Courier",
      cod: true,
      tracking_code_validation_regex: "^[0-9]+$",
      enabled_delivery_options: ["dropship"],
    },
    {
      name: "TCS",
      cod: true,
      tracking_code_validation_regex: "^[A-Z0-9]+$",
      enabled_delivery_options: ["dropship", "pickup"],
    },
  ],
};

export const GET_DOCUMENT_RESPONSE = {
  code: "0",
  data: {
    document: {
      file: "JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKP7/...",
      mime_type: "application/pdf",
      document_type: "shippingLabel",
    },
  },
};

export const SET_INVOICE_NUMBER_RESPONSE = {
  code: "0",
  data: {},
};

export const GET_TRACKING_INFO_RESPONSE = {
  code: "0",
  data: {
    tracking_number: "TRK789456123",
    shipping_provider: "Daraz Express",
    package_id: "PKG001",
    tracking_url: "https://track.daraz.pk/TRK789456123",
    events: [
      {
        timestamp: "2024-01-16 09:00:00",
        status: "picked_up",
        description: "Package picked up from seller",
      },
      {
        timestamp: "2024-01-16 14:00:00",
        status: "in_transit",
        description: "Package in transit to hub",
      },
    ],
  },
};

export const GET_PAYOUT_STATUS_RESPONSE = {
  code: "0",
  data: {
    payouts: [
      {
        payout_id: "PAY001",
        amount: "45000.00",
        currency: "PKR",
        status: "completed",
        paid_at: "2024-01-20 00:00:00",
        period_start: "2024-01-01 00:00:00",
        period_end: "2024-01-15 23:59:59",
      },
    ],
  },
};

export const GET_TRANSACTION_DETAILS_RESPONSE = {
  code: "0",
  data: {
    total: 3,
    transactions: [
      {
        transaction_id: "TXN001",
        order_id: "111222333",
        amount: "2200.00",
        transaction_type: "order_revenue",
        created_at: "2024-01-15 10:30:00",
        status: "settled",
      },
      {
        transaction_id: "TXN002",
        order_id: "111222333",
        amount: "-220.00",
        transaction_type: "commission",
        created_at: "2024-01-15 10:30:00",
        status: "settled",
      },
      {
        transaction_id: "TXN003",
        order_id: "111222334",
        amount: "1800.00",
        transaction_type: "order_revenue",
        created_at: "2024-01-15 11:45:00",
        status: "pending",
      },
    ],
  },
};

export const GET_TRANSACTION_TYPES_RESPONSE = {
  code: "0",
  data: [
    { type: "order_revenue", label: "Order Revenue" },
    { type: "commission", label: "Commission" },
    { type: "shipping_fee", label: "Shipping Fee" },
    { type: "refund", label: "Refund" },
    { type: "adjustment", label: "Adjustment" },
    { type: "promotion", label: "Promotion Subsidy" },
  ],
};

export const UPLOAD_IMAGE_RESPONSE = {
  code: "0",
  data: {
    image: {
      url: "https://img.daraz.pk/uploaded/abc123.jpg",
      hash: "abc123def456",
    },
  },
};

export const MIGRATE_IMAGE_RESPONSE = {
  code: "0",
  data: {
    image: {
      url: "https://img.daraz.pk/migrated/xyz789.jpg",
      hash: "xyz789ghi012",
    },
  },
};

export const MIGRATE_IMAGES_RESPONSE = {
  code: "0",
  data: {
    images: [
      {
        url: "https://img.daraz.pk/migrated/img1.jpg",
        hash: "hash001",
      },
      {
        url: "https://img.daraz.pk/migrated/img2.jpg",
        hash: "hash002",
      },
    ],
  },
};

export const SET_IMAGES_RESPONSE = {
  code: "0",
  data: {},
};

export const GET_QC_STATUS_RESPONSE = {
  code: "0",
  data: [
    {
      seller_sku: "WBH-001-BLK",
      status: "approved",
      reason: "",
    },
    {
      seller_sku: "USBC-65W",
      status: "pending",
      reason: "Under review",
    },
  ],
};
