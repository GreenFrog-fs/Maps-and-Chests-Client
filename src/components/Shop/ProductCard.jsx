import Avatar from "./Avatar";

const ProductCard = ({ style, url }) => {
  return (
    <div style={style} className="product_card">
      <Avatar url={url} />
      <div className="product_data">
        <div className="product_points">
          <img src="/icons/gold.png" />
          <p>20</p>
        </div>
        <button className="product_button">купить</button>
      </div>
    </div>
  );
};

export default ProductCard;