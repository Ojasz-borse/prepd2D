// declarations.d.ts
declare module "react-native-math-view" {
  import { ComponentProps } from "react";
    import { ViewStyle } from "react-native";

  interface MathViewProps extends ComponentProps<any> {
    math: string;
    style?: ViewStyle;
  }

  export class MathView extends React.Component<MathViewProps> {}
}
