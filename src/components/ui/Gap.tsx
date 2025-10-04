import { GapProps } from "@/src/types/component";
import React, { FC, memo } from "react";
import { View } from "react-native";

const Gap: FC<GapProps> = ({ vertical, horizontal }) => {
  return (
    <View
      style={{
        height: vertical ?? 0,
        width: horizontal ?? 0,
      }}
    />
  );
};

export default memo(Gap);
