import {FC, useEffect, useState} from "react";
import { a } from '@react-spring/three';
import { NodeRendererProps } from 'reagraph';
import { ColorRepresentation, Vector3 } from 'three';
import { Sphere, Icon } from "reagraph";
import {
  Billboard,
  Svg as DreiSvg,
  SvgProps as DreiSvgProps,
} from '@react-three/drei';
import { DoubleSide } from 'three';

enum ImageType {
    SVG,
    IMAGE
};

export interface SphereWithSvgProps extends SvgProps {
  /**
   * The image to display on the icon.
   */
  image: string;

  /**
   * The color of the svg fill.
   */
  svgFill?: ColorRepresentation;

  svgSize?: number;

  logoVisible: boolean;
}

export type SvgProps = NodeRendererProps &
  Omit<DreiSvgProps, 'src' | 'id'> & {
    /**
     * The image to display on the icon.
     */
    image: string;
  };

export const Svg: FC<SvgProps> = ({
  id,
  image,
  opacity = 1,
  ...rest
}) => {
    const [scale, setScale] = useState(new Vector3(0.1, 0.1, 0.1));
    const [position, setPosition] = useState(new Vector3(600, -600, 0));
    const [validLogo, setValidLogo] = useState<boolean>(false);

    const targetWidth = 15;
    const targetHeight = 15;

    const getSVGSize = (svgText: string): number[] => {
        try {
            // Create a DOM parser to parse the SVG
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

            // Get the <svg> element
            const svgElement = svgDoc.querySelector("svg");

            if (svgElement) {
                // Extract width and height attributes
                const width = svgElement.getAttribute("width");
                const height = svgElement.getAttribute("height");

                // If width/height are not explicitly set, use the viewBox
                if (!width || !height) {
                    const viewBox = svgElement.getAttribute("viewBox");
                    if (viewBox) {
                        const [, , viewBoxWidth, viewBoxHeight] = viewBox.split(" ").map(Number);
                        return [viewBoxWidth, viewBoxHeight];
                    } else {
                        return [100, 100]; // Default size if nothing is specified
                    }
                } else {
                    return [Number(width), Number(height)];
                }
            } else {
                throw new Error("Invalid SVG format");
            }      
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error:", error.message);
            } else {
                console.error("Error:", error);
            }
        }
        throw new Error("Could not determine SVG size");
    };

    const downloadImage = async (url: string): Promise<string | null> => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch Image file: " + response.statusText);
            return await response.text();
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error:", error.message);
            } else {
                console.error("Error:", error);
            }
        }
        return null;
    };

    useEffect(() => {
        downloadImage(image).then((imageText) => {
            if (!imageText) return;
            try {
                const [width, height] = getSVGSize(imageText);
                const scaleX = targetWidth / width;
                const scaleY = targetHeight > targetWidth ? targetHeight / height : targetHeight / (height / 2);
                const scale = Math.min(scaleX, scaleY);
                setScale(new Vector3(scale, scale, scale));
                setPosition(new Vector3(((-width * scale) * 20), ((-height * scale) * 20), 1));
                setValidLogo(true);
            } catch (error) {
                if (error instanceof Error) {
                    console.error("Error:", error.message);
                } else {
                    console.error("Error:", error);
                }
            }
        });
    }, [image]);

  return (
    <>
        {validLogo && (
            <a.group userData={{ id, type: 'node' }} scale={scale}>
                <Billboard position={[0, 0, 1]}>
                    <DreiSvg
                        {...rest}
                        src={image}
                        fillMaterial={{
                            fog: true,
                            depthTest: false,
                            transparent: true,
                            opacity,
                            side: DoubleSide,
                            ...(rest.fillMaterial || {})
                        }}
                        fillMeshProps={{
                            position: position,
                            ...(rest.fillMeshProps || {})
                        }}
                    />
                </Billboard>
            </a.group>
        )}
    </>
    );
};

export const SphereWithSvg: FC<SphereWithSvgProps> = ({
    color,
    id,
    size,
    node,
    svgFill,
    active = false,
    animated,
    image,
    selected,
    svgSize,
    logoVisible,
    ...rest
}) => {
    const [imageType, setImageType] = useState<ImageType>(ImageType.SVG);

    const getImageType = () => {
        if (
            image.toLowerCase().endsWith(".png") ||
            image.toLowerCase().endsWith(".jpg") ||
            image.toLowerCase().endsWith(".jpeg") ||
            image.toLowerCase().endsWith(".gif")
        ) {
            return ImageType.IMAGE;
        }
        return ImageType.SVG;
    };

    useEffect(() => {
        setImageType(getImageType());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [image]);

    return (
        <group>
            {logoVisible && (
                <>
                    {imageType === ImageType.SVG ? (
                        <Svg
                            id={id}
                            selected={selected}
                            size={svgSize || size * 0.8}
                            animated={animated}
                            color={svgFill || "#000000"}
                            node={node}
                            active={active}
                            image={image}
                            {...rest}
                        />
                    ) : (
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
                </>
            )}
            <Sphere
                id={id}
                selected={selected}
                size={size}
                opacity={0.7}
                animated={animated}
                color={color}
                node={node}
                active={active}
            />
        </group>
)}