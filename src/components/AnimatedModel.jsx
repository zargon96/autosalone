import { useEffect, useRef, memo } from "react";
import { useGLTF, Center } from "@react-three/drei";
import gsap from "gsap";
import PropTypes from "prop-types";
function AnimatedModel({
  modelPath,
  scaleFactor = 1,
  rotation = [0, 0, 0],
  offset = [0, 0, 0],
}) {
  const { scene } = useGLTF(modelPath);
  const wrapper = useRef();

  useEffect(() => {
    if (!wrapper.current) return;

    /* set iniziale */
    wrapper.current.rotation.set(...rotation);
    wrapper.current.position.set(...offset);
    wrapper.current.scale.setScalar(0);

    gsap.to(wrapper.current.scale, {
      x: scaleFactor,
      y: scaleFactor,
      z: scaleFactor,
      duration: 1,
      ease: "power3.out",
    });
  }, [modelPath, scaleFactor, rotation, offset]);

  return (
    <group ref={wrapper}>
      <Center top>
        <primitive object={scene.clone()} />
      </Center>
    </group>
  );
}

AnimatedModel.propTypes = {
  modelPath: PropTypes.string.isRequired,
  scaleFactor: PropTypes.number,
  rotation: PropTypes.array,
  offset: PropTypes.array,
};

export default memo(AnimatedModel);
