import usePageStore from "../stores/pageStore";
import useUserStore from "../stores/userStore";

export default function Footer() {
  const { user } = useUserStore();
  const { setPage } = usePageStore();
  function mapClickHandler() {
    setPage("map");
  }
  function shopClickHandler() {
    setPage("shop");
  }
  function userClickHandler() {
    setPage("user");
  }
  return (
    <footer>
      <nav className="nav">
        <button onClick={mapClickHandler}>
          <img src="/icons/map.png" />
        </button>
        <button onClick={shopClickHandler}>
          <img src="/icons/shop.png" />
        </button>
        <button onClick={userClickHandler}>
          <img src="/icons/user.png" />
        </button>
      </nav>
      <div className="points">
        <img src="/icons/gold.png" />
        {user?.points}
      </div>
    </footer>
  );
}
