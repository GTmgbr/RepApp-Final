// components/BackgroundShape.tsx
import React from "react";
import Svg, { Path } from "react-native-svg";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function BackgroundShape() {
  return (
    <Svg
      width={width}
      height={height}
      style={{ position: "absolute", top: 0, left: 0 }}
      viewBox={`0 0 ${width} ${height}`}
    >
      <Path
        d={`M0 0 L${width} 0 L0 ${height * 0.55} Z`}
        fill="#0F2B10" // mesma cor do botão
      />
      <Path
        d={`M${width} 0 L${width} ${height} L0 ${height} L0 ${height * 0.55} Z`}
        fill="#207723"
      />
    </Svg>
  );
}
