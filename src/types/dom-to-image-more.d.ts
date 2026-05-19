declare module 'dom-to-image-more' {
  export interface Options {
    width?: number;
    height?: number;
    style?: any;
    quality?: number;
    imagePlaceholder?: string;
    cacheBust?: boolean;
    bgcolor?: string;
    filter?: (node: Node) => boolean;
    adjustClonedNode?: (original: Node, cloned: Node, after: boolean) => void;
  }

  export function toPng(node: Node, options?: Options): Promise<string>;
  export function toJpeg(node: Node, options?: Options): Promise<string>;
  export function toBlob(node: Node, options?: Options): Promise<Blob>;
  export function toSvg(node: Node, options?: Options): Promise<string>;
  export function toPixelData(node: Node, options?: Options): Promise<Uint8ClampedArray>;

  const domtoimage: {
    toPng: typeof toPng;
    toJpeg: typeof toJpeg;
    toBlob: typeof toBlob;
    toSvg: typeof toSvg;
    toPixelData: typeof toPixelData;
  };

  export default domtoimage;
}
