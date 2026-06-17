/** Circular avatar: image (`src`) or auto initials from `name`. */
export interface AvatarProps {
  name?: string;
  src?: string;
  size?: number;
  tone?: "action" | "purple" | "neutral";
}
export function Avatar(props: AvatarProps): JSX.Element;
