import {FC} from "react";
import { Sphere, Icon, IconProps } from "reagraph";

export interface SphereWithSvgProps extends IconProps {
  logoVisible: boolean;
}

export const SphereWithSvg: FC<SphereWithSvgProps> = ({
    color,
    id,
    size,
    node,
    active = false,
    animated,
    image,
    selected,
    logoVisible,
}) => (
    <group>
        <Sphere
            id={id}
            selected={selected}
            size={size}
            opacity={1}
            animated={animated}
            color={color}
            node={node}
            active={active}
        />
        {logoVisible && (
            <Icon
                id={id}
                image={image}
                selected={selected}
                size={size + 8}
                opacity={1}
                animated={animated}
                color={color}
                node={node}
                active={active}
            />
        )}
    </group>
);