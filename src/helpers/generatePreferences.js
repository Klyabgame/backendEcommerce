export const generatePreferences = (products) => {
  const preference = {
    items: products.map((product) => ({
      id: product.idProductos,
      title: product.nombreProducto,
      description: product.descripcion,
      quantity: product.cantidadCarrito,
      currency_id: "PEN",
      unit_price: Number(product.precioUnitario),
    })),
    back_urls: {
      success: "http://localhost:5173/success",
      failure: "http://localhost:5173/",
    },
  };
  return preference;
};
