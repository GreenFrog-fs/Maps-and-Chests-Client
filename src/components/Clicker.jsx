import { useState } from "react";
import usePageStore from "../stores/pageStore";
import { deactivateChest } from "../apiActions/deactivateChest";
import useUserStore from "../stores/userStore";

export default function Clicker() {
  const { id, closestChest } = useUserStore();
  const [count, setCount] = useState(10);
  const { hideClicker } = usePageStore();
  const clickHandler = () => {
    setCount(count - 1);
    if (count == 1) {
      hideClicker();
      deactivateChest(closestChest.id, id);
    }
  };
  return (
    <>
      <div className="clicker" onClick={clickHandler}>
        {count}
      </div>
      <div className="shadow" />
    </>
  );
}
