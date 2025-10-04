import { Stack } from "expo-router";

const StaffLayout = () => {
  return (
    <Stack
      screenOptions={{
        freezeOnBlur: true,
        headerShown: false,
      }}
    />
  );
};

export default StaffLayout;
