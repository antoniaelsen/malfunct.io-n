# Malfunct.io/n

## About
[malfunct.io/n](http://malfunct.io/n) is a web tool for generating glitch art.  
More information on the design of this app is available at the [malfunct.io/n blog](https://cascadi.us/malfunction/).

## Author
Antonia Elsen  
[aelsen @ github](https://github.com/aelsen/)

## Design

### Glitching

### Data Bending


#### JPEG Corruption

Load image (jpeg, png)
Save image as JPEG
Then convert JPEG to ImageData

##### JPEG Image Structure
JFIF format
- Header
- Content
  - Markers
    - 0xFF byte followed by marker designation byte
  - Scan(s)
    - Color encoding: YCbCr or just Y for achromatic
    - Compressed image data

##### YCbCr - Color Encoding System

Y: Luma, Luminance, the brightness of an image

C: Chrominance

Cb: difference between the blue component and a reference value
Cr: different between the red component and a reference value


### Pixel Stretching


### Pixel Sorting

#### Sorting by quality

Sort pixels in a row, column, or slice by quality; HSL, RGB, etc.
HSL; hue, saturation, luminosity
RGB; red, blue green

Show thresholds

Sort [horizontally / vertically / diagonally]
Sort from [left, top to right, bottom / right, bottom to left, top]
Start sorting from the [most / least] [bright / saturated / red] pixel and end at the opposite


### Channel Shifting

Shift R, G, B or H, S, L channels by entire rows, columns, or by row-wise or column-wise pixels


### Wordpad Corruption

RTF corrections
- `0x07` (bell control code) is corrected to `0x20` (space)
- `0x0A` (line feed) `0x0D` (carriage return) and `0x0B` (vertical tab) corrected to `0x0A 0x0D`

What is happening: the line feed, carriage return, vertical tab parsing is inserting an additional byte.



### Audio Filters

#### Reverb

Freeberb algorithm
- 8 filtered-feedback comb-filters (Schroeder-Moorer) in parallel, summed, then four allpasses

- Onset
- Delay time (uniform)
- Decay (exponential)

#### Invert

Does what it says on the box. Reflection about mid-value.

#### Reverse

#### Echo

- Decay factor (echo amplitude) (linear)
- Delay time

### Combining Effects and Maintaining History

Supporting layered effects
- Every layer is a transformation function; the previous (or base) image is input, the output is passed to a layer above, if present
- Every layer contains information on the configuration of the transformation function
- Image is saved in redux
  - Simplified with URL.createObjectURL(object);
  - Simplified data should be cleaned up - URL.revokeObjectURL()
- Ever time a layer is updated, all layers above it will be updated, one after another
- Effects can be applied with 'opacity' (to previous layer)

### Libraries and Frameworks

### Typescript

#### Absolute Paths

https://github.com/facebook/create-react-app/issues/5118

### React Concurrent Mode

Interruptible rendering



## Future Work
For future work and bugfixes, see this repo's [issue tracker](https://github.com/haebou/malfunct.ion/issues).

### Sources
- Canvas
  - [HTML5 Zoom and Pan Canvas - CodePen](https://codepen.io/techslides/pen/zowLd)
- Colors
  - [HSL x RGB Color Conversion - Stack Overflow](https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion)
- JPEG, YCbCr
  - https://en.wikipedia.org/wiki/JPEG#Syntax_and_structure
  - https://wolfcrow.com/understanding-luminance-and-chrominance/
  - https://en.wikipedia.org/wiki/YCbCr
  - https://www.mathworks.com/help/images/convert-from-ycbcr-to-rgb-color-space.html
- Data Bending
  - https://github.com/snorpey/jpg-glitch
  - https://github.com/snorpey/glitch-canvas/blob/master/src/glitch/glitchByteArray.js
  - http://datamoshing.com/2016/06/15/how-to-glitch-jpg-images-with-data-corruption/
  - http://datamoshing.com/
  - https://sarranzchico.wordpress.com/pixel-sorting-glitch-art/
- Wordpad
  - http://blog.animalswithinanimals.com/2010/10/advanced-wordpad-editing-explained.html 
- Audio Filters
  - https://manual.audacityteam.org/man/reverb.html
  - https://www.nongnu.org/freeverb3/
  - https://questionsomething.wordpress.com/2012/07/26/databending-using-audacity-effects/

Gesso is a wrapper for the HTML Canvas and its 2D Context, with the purpose of enabling easy zooming and panning.


- Typescript
  - https://www.valentinog.com/blog/typescript/
  - https://create-react-app.dev/docs/adding-typescript/
