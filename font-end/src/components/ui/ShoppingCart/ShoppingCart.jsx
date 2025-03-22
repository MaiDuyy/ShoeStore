import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet";
  
  import emptyCartImage from "@/assets/common/empty-cart.svg";
  
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
  import { Button } from "@/components/ui/button";
  import {
    EllipsisIcon,
    MinusIcon,
    PlusIcon,
    ShoppingCartIcon,
    Trash,
    TrashIcon,
  } from "lucide-react";
  import { useDispatch, useSelector } from "react-redux";
  import { Skeleton } from "../ui/skeleton";
  import { Separator } from "../ui/separator";
  import { useToast } from "@/hooks/use-toast";
  import {
    decreaseCartProductQuantityThunk,
    getCartDataThunk,
    increaseCartProductQuantityThunk,
    removeProductFromCartThunk,
  } from "@/store/shop/CartSlice";
  import { Badge } from "../ui/badge";
  import { useNavigate } from "react-router-dom";
  
  function ShoppingCart() {
    const { cart } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const { toast } = useToast();
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    function handleIncreaseQuantity({ productId, quantity }) {
      dispatch(
        increaseCartProductQuantityThunk({
          userId: user.id,
          productId,
          quantity,
        })
      ).then(() => {
        dispatch(getCartDataThunk(user.id));
      });
    }
  
    function handleDecreaseQuantity({ productId, quantity }) {
      dispatch(
        decreaseCartProductQuantityThunk({
          userId: user.id,
          productId,
          quantity,
        })
      ).then(() => {
        dispatch(getCartDataThunk(user.id));
      });
    }
  
    function handleRemoveProductFromCart({ productId }) {
      dispatch(
        removeProductFromCartThunk({
          userId: user.id,
          productId,
        })
      ).then((response) => {
        dispatch(getCartDataThunk(user.id));
        toast({
          title: response.payload.message,
        });
      });
    }
  
    // Calculate subtotal price of products in cart
    let subtotal = 0;
    if (cart.products) {
      cart.products.map((product) => {
        subtotal +=
          product.quantity *
          (product.productId.salePrice ?? product.productId.price);
      });
    }
    let shippingCost = 10;
    let total = subtotal + shippingCost;
  
    function handleCheckout() {
      if (cart.products.length > 0) {
        navigate("/shop/checkout");
      } else {
        toast({
          title: "Your cart is empty!",
        });
      }
    }
  
    return (
      <Sheet className="w-full h-full">
        <SheetTrigger asChild>
          <Button className="relative" variant="outline" size="icon">
            <ShoppingCartIcon className="w-6 h-6" />
            <span className="sr-only">View cart</span>
            {cart.products?.length > 0 && (
              <span className="absolute w-5 h-5 text-white rounded-full bg-rose-600 -top-2 -right-2">
                {cart.products?.length}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetTitle className="flex items-center gap-3 mb-4">
            <span className="block p-3 rounded-full bg-secondary">
              <ShoppingCartIcon className="w-4 h-4" />
            </span>
            Shopping Cart
          </SheetTitle>
          <p className="mb-1 text-sm font-normal text-neutral-700">
            {cart?.products?.length > 0
              ? `You have ${cart.products.length} items in your cart`
              : "Your cart is empty"}
          </p>
          <Separator />
          <div className="">
            <div className="h-[50vh] overflow-y-auto">
              {cart.products?.length > 0 ? (
                <ul className="grid gap-4 py-4">
                  {cart.products.map((product, i) => (
                    <li
                      className="flex items-center justify-between gap-2"
                      key={product.productId._id ? product.productId._id : i}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={product.productId.image}
                          alt={product.productId.title}
                          className="object-cover rounded-lg w-14 h-14"
                        />
                        <div className="flex flex-col gap-2">
                          <h4 className="text-sm font-semibold line-clamp-2">
                            {product.productId.title}
                          </h4>
                          <div className="flex gap-2">
                            {product.selectedSize && (
                              <Badge variant="outline" className="text-xs">
                                Size: {product.selectedSize.name}
                              </Badge>
                            )}
                            {product.selectedColor && (
                              <Badge variant="outline" className="text-xs">
                                Color: {product.selectedColor.name}
                              </Badge>
                            )}
                          </div>
                          <p className="flex items-baseline text-sm text-gray-500 gap-x-1.5">
                            <span className="flex items-center justify-center w-auto h-5 px-2 text-sm font-medium rounded-full gap-x-1 text-background bg-primary/80">
                              {product.quantity}
                              <span className="text-xs">pcs</span>
                            </span>{" "}
                            x
                            <span className="text-sm">
                              $
                              {product.productId.salePrice ??
                                product.productId.price}{" "}
                            </span>
                            : &nbsp;
                            <span className="text-sm font-medium text-foreground">
                              $
                              {product.quantity *
                                (product.productId.salePrice ??
                                  product.productId.price)}
                            </span>
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="aspect-square"
                            size="icon"
                          >
                            <EllipsisIcon className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-72">
                          <div className="flex items-center justify-between gap-2 p-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              Quantity :{" "}
                            </span>
                            <div className="flex items-center gap-2">
                              <Button
                                className="w-8 h-8"
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  handleDecreaseQuantity({
                                    productId: product.productId._id,
                                    quantity: 1,
                                  })
                                }
                                disabled={product.quantity === 1}
                              >
                                <MinusIcon className="w-2 h-2" />
                              </Button>
                              <span>{product.quantity}</span>
                              <Button
                                className="w-8 h-8"
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  handleIncreaseQuantity({
                                    productId: product.productId._id,
                                    quantity: 1,
                                  })
                                }
                                disabled={product.quantity >= product.availableQuantity}
                              >
                                <PlusIcon className="w-2 h-2" />
                              </Button>
                            </div>
                            |
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  className="w-8 h-8"
                                  size="icon"
                                >
                                  <TrashIcon className="w-2 h-2" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure you want to remove this product?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {product.productId.title}
                                    {product.selectedSize && ` - Size: ${product.selectedSize.name}`}
                                    {product.selectedColor && ` - Color: ${product.selectedColor.name}`}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleRemoveProductFromCart({
                                        productId: product.productId._id,
                                      })
                                    }
                                  >
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="space-y-4">
                    <div className="flex justify-center w-full h-32">
                      <img
                        src={emptyCartImage}
                        alt="no data image"
                        className="object-contain h-full"
                      />
                    </div>
                    <h3 className="text-sm font-medium text-neutral-600">
                      Your cart is empty!
                    </h3>
                  </div>
                </div>
              )}
            </div>
            <Separator className="mb-4" />
            <div className="relative overflow-hidden">
              <div className="flex flex-col w-full h-auto px-8 py-4 rounded-lg gap-y-2 bg-secondary">
                <div className="grid items-center justify-between grid-cols-3 gap-2">
                  <span className="text-sm font-medium text-primary/70">
                    Subtotal
                  </span>
                  <span className="w-auto overflow-hidden text-muted-foreground">
                    ........................................
                  </span>
                  <span className="font-medium text-md text-primary/80">
                    {subtotal > 0 ? (
                      <span>
                        {subtotal.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </span>
                    ) : (
                      0
                    )}
                  </span>
                </div>
                <div className="grid items-center justify-between grid-cols-3 gap-2">
                  <span className="text-sm font-medium text-primary/70">
                    Shipping
                  </span>
                  <span className="w-auto overflow-hidden text-muted-foreground">
                    ........................................
                  </span>
                  <span className="font-medium text-md text-primary/80">
                    <span>
                      {shippingCost.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  </span>
                </div>
                <Separator className="" />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-primary/70">
                    TOTAL
                  </span>
                  <span className="text-lg font-semibold">
                    {total > 0 ? (
                      <span>
                        {total.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </span>
                    ) : (
                      0
                    )}
                  </span>
                </div>
              </div>
  
              {/* decorative */}
              <span className="absolute left-0 block w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 bg-background"></span>
              <span className="absolute right-0 block w-8 h-8 translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 bg-background"></span>
            </div>
          </div>
          <SheetFooter className="flex flex-col gap-4 mt-4">
            <SheetClose asChild>
              <Button className="w-full" onClick={handleCheckout}>
                Checkout
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }
  
  export default ShoppingCart;