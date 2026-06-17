import * as React from "react";

/** Removable chip/label. Pass `onRemove` to render the dismiss button. */
export interface TagProps {
  tone?: "neutral" | "action";
  onRemove?: () => void;
  children?: React.ReactNode;
}
export function Tag(props: TagProps): JSX.Element;
