export const registerFormControls = [
    {
      name: "name",
      label: "User Name",
      placeholder: "Enter your user name",
      componentType: "input",
      type: "text",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      componentType: "input",
      type: "email",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      componentType: "input",
      type: "password",
    },
  ];
  
  export const loginFormControls = [
    {
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      componentType: "input",
      type: "email",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      componentType: "input",
      type: "password",
    },
  ];
  
  export const addProductFormControls = [
    {
      name: "title",
      label: "Title",
      componentType: "input",
      type: "text",
      placeholder: "Enter product title",
    },
    // description
    {
      name: "description",
      label: "Description",
      componentType: "textarea",
      placeholder: "Enter product description",
    },
    {
      name: "category",
      label: "Category",
      componentType: "select",
      options: [
        { id: "men", label: "Men" },
        { id: "women", label: "Woman" },
        { id: "kids", label: "Kids" },
        { id: "accessories", label: "Accessories" },
        { id: "footwear", label: "Footwear" },
      ],
    },
    {
      name: "brand",
      label: "Brand",
      componentType: "select",
      options: [
        { id: "nike", label: "Nike" },
        { id: "adidas", label: "Adidas" },
        { id: "puma", label: "Puma" },
        { id: "reebok", label: "Reebok" },
        { id: "under-armour", label: "Under Armour" },
      ],
    },
    {
      name: "price",
      label: "Price",
      componentType: "input",
      type: "number",
      placeholder: "Enter product price",
    },
    // sale price
    {
      name: "salePrice",
      label: "Sale Price",
      componentType: "input",
      type: "number",
      placeholder: "Enter product sale price (optional)",
    },
    // total stock
    {
      name: "totalStock",
      label: "Total Stock",
      componentType: "input",
      type: "number",
      placeholder: "Enter total stock",
    },
  ];
  
  export const shoppingViewHeaderMenuItems = [
    {
      id: "home",
      label: "Home",
      path: "/shop/home",
    },
    {
      id: "collections",
      label: "Collections",
      path: "/shop/listing",
    },
  ];
  
  export const shoppingProductFilterOptions = {
    category: [
      { id: "LG1", label: "RUNNING" },
      { id: "LG2", label: "FOOTBALL" },
      { id: "LG3", label: "CASUAL" },
      { id: "LG4", label: "FORMAL" },
    ],
    brand: [
      { id: "BR1", label: "NIKE" },
      { id: "BR2", label: "ADIDAS" },
      { id: "BR3", label: "HUSHPUPPIES" },
      { id: "BR4", label: "Reebok" },
      { id: "BR5", label: "Vans" }
    ],
    price: [
      { id: "0-50", label: "Under $50" },
      { id: "50-100", label: "50$ - $100" },
      { id: "100-200", label: "$100 - $200" },
      { id: "200+", label: "Over $200" }
    ]
  };
  
  export const shoppingProductSortOptions = [
    { id: "price-low-to-high", label: "Price: Low to High" },
    { id: "price-high-to-low", label: "Price: High to Low" },
    { id: "newest", label: "Newest" },
    { id: "oldest", label: "Oldest" },
    { id: "title-ascending", label: "Title: A-Z" },
    { id: "title-descending", label: "Title: Z-A" },
  ];
  
  export const orderListSortOptions = [
    { id: "newest", label: "Newest" },
    { id: "oldest", label: "Oldest" },
  ];
  
  export const orderStatusOptions = [
    { id: "confirmed", label: "Confirmed" },
    { id: "pending", label: "Pending" },
    { id: "cancelled", label: "Cancelled" },
    { id: "processing", label: "Processing" },
    { id: "shipping", label: "Shipping" },
    { id: "delivered", label: "Delivered" },
    { id: "completed", label: "Completed" },
  ];