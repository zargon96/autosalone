import { useEffect, useRef, useMemo, memo } from "react";
import { useGLTF, Center } from "@react-three/drei";
import gsap from "gsap";
import PropTypes from "prop-types";

function AnimatedModel({
  modelPath,
  scaleFactor = 1,
  rotation = [0, 0, 0],
  offset = [0, 0, 0],
  shadows = false,
  inDuration = 1,
}) {
  const { scene } = useGLTF(modelPath);
  const wrapper = useRef();

  const cloned = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    if (!shadows) return;
    cloned.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }, [cloned, shadows]);

  useEffect(() => {
    if (!wrapper.current) return;

    wrapper.current.rotation.set(...rotation);
    wrapper.current.position.set(...offset);
    wrapper.current.scale.setScalar(0);

    const ctx = gsap.context(() => {
      gsap.to(wrapper.current.scale, {
        x: scaleFactor,
        y: scaleFactor,
        z: scaleFactor,
        duration: inDuration,
        ease: "power3.out",
      });
    }, wrapper);

    return () => ctx.revert();
  }, [modelPath, scaleFactor, rotation, offset, inDuration]);

  return (
    <group ref={wrapper}>
      <Center top>
        <primitive object={cloned} dispose={null} />
      </Center>
    </group>
  );
}

AnimatedModel.propTypes = {
  modelPath: PropTypes.string.isRequired,
  scaleFactor: PropTypes.number,
  rotation: PropTypes.arrayOf(PropTypes.number),
  offset: PropTypes.arrayOf(PropTypes.number),
  shadows: PropTypes.bool,
  inDuration: PropTypes.number,
};

export default memo(AnimatedModel);
