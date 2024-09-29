import { useEffect, useState } from "react";
import useUserStore from "../../stores/userStore";
import PositionWrapper3D from "./PositionWrapper3D";
import UserModel3D from "./UserModel3D";
import calculateAngle from "../../calculations/calculateAngle";

export default function User3D({ position, prev }) {
  const { avatar_src } = useUserStore();
  const [currentPosition, setCurrentPosition] = useState(prev);
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    if (isNaN(prev[0]) || isNaN(prev[1])) {
      setCurrentPosition(position);
    } else {
      let frame = 0;
      const transitionFrames = 60;
      const startPosition = [...prev];
      const animate = () => {
        frame++;
        const lerpPosition = [
          startPosition[0] +
            ((position[0] - startPosition[0]) * frame) / transitionFrames,
          startPosition[1] +
            ((position[1] - startPosition[1]) * frame) / transitionFrames,
        ];
        setCurrentPosition(lerpPosition);
        if (prev[0] != position[0] && prev[1] != position[1]) {
          setAngle(calculateAngle(prev[0], prev[1], position[0], position[1]));
        }
        if (frame < transitionFrames) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  }, [position, prev]);

  return (
    <PositionWrapper3D position={currentPosition} angle={angle}>
      <UserModel3D
        avatar_src={avatar_src}
        walk={prev[0] != position[0] && prev[1] != position[1]}
      />
    </PositionWrapper3D>
  );
}
