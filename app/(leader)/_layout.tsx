import { Stack } from "expo-router";

const LeaderLayout = () => {
  return (
    <Stack
      screenOptions={{
        freezeOnBlur: true,
        headerShown: false,
      }}
    />
  );
};

export default LeaderLayout;
