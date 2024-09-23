import { useEffect } from "react";
import useShopStore from "../../stores/shopStore";
import ProductCard from "./ProductCard";

const Shop = ({ style }) => {
  const { avatars, getAvatars } = useShopStore();
  useEffect(() => {
    getAvatars();
  }, []);
  return (
    <div style={style}>
      <p className="shop_items_name">аватары</p>
      <div className="products_list">
        {avatars.map((url) => (
          <ProductCard key={url} url={url} />
        ))}
      </div>
    </div>
  );
};

export default Shop;
