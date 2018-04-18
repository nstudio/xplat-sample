import { isIOS } from 'tns-core-modules/platform';
import { ImageSource } from 'tns-core-modules/image-source';

export function resizeImage(img: ImageSource, size: {width: number;height: number}) {
  if (isIOS) {
    const image = img.ios;
    const newSize = CGSizeMake(size.width,size.height);
    const newRect = CGRectIntegral(CGRectMake(0, 0, newSize.width, newSize.height));
    const imageRef = image.CGImage;
  
    UIGraphicsBeginImageContextWithOptions(newSize, true, UIScreen.mainScreen.scale);
    const context = UIGraphicsGetCurrentContext();
  
    // Set the quality level to use when rescaling
    CGContextSetInterpolationQuality(context, 3);//kCGInterpolationHigh);
    const flipVertical = CGAffineTransformMake(1, 0, 0, -1, 0, newSize.height);
  
    CGContextConcatCTM(context, flipVertical);  
    // Draw into the context; this scales the image
    CGContextDrawImage(context, newRect, imageRef);
  
    // Get the resized image from the context and a UIImage
    const newImageRef = CGBitmapContextCreateImage(context);
    const newImage = UIImage.imageWithCGImage(newImageRef);
  
    CGImageRelease(newImageRef);
    UIGraphicsEndImageContext();    
  
    return newImage;
  }

}