import { useTheme } from "@/src/contexts/ThemeContext";
import React, { forwardRef } from "react";

export function withTheme<C extends React.ComponentClass<any>>(Component: C) {
  type OriginalProps = React.ComponentProps<C>;
  type Ref = InstanceType<C>;

  const Wrapped = forwardRef<Ref, OriginalProps>((props, ref) => {
    const { theme } = useTheme();

    return <Component {...(props as any)} ref={ref} theme={theme} />;
  });

  Wrapped.displayName = `withTheme(${Component.displayName || Component.name})`;

  return Wrapped as unknown as C;
}
