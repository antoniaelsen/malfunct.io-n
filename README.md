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
START
- from the [most / least] [bright / saturated / hue] pixel 
END
- at the [least / most] [bright / saturated / hue] pixel
- after x pixels 


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

### Canvas implementation

#### Options

- Vanilla Canvas
  - Easy to manipulate pixels
- ThreeJS
  - Allows for other effects, post-processing, shaders, etc.
    - Film grain
    - Glitch
    - Halftone
    - Pixel



### Combining Effects and Maintaining History

Supporting layered effects
- Every layer is a transformation function; the previous (or base) image is input, the output is passed to a layer above, if present
- Every layer contains information on the configuration of the transformation function
- Image is saved in redux
  - Simplified with URL.createObjectURL(object);
  - Simplified data should be cleaned up - URL.revokeObjectURL()
- Ever time a layer is updated, all layers above it will be updated, one after another
- Effects can be applied with 'opacity' (to previous layer)

### Implementing Layers in the Canvas
- Singled canvas used, NOT multiple dom elements
- Using multiple DOM elements
  - pros:
    - easier to implement, in terms of written HTML and JS
    - cons:
      - saving: can't save all canvasses save to single image without extra combination logic
      - blending layers: can only easily blend layers via opacity, can't easily blend other ways such as multiply, screen, etc.

### Canvas Sizing

To keep the canvas size congruent with the available space in the window, or not?
Links
- http://phrogz.net/tmp/canvas_zoom_to_cursor.html

#### Dynamically Resizing Canvas with Window Dimensions
Considerations:
- Every time the window is resized, the canvas will have to be resized
- Similarly, if a pull-out vertical nav bar is revealed or hidden, then the canvas will have to be resized to accommodate for changing amount of free space

#### Sizing Canvas to Dimensions of Image
- Canvas could maintain a specific width, height (set by imported image)
- Zooming could be done within this constrained width, OR
- Zooming could be done by both resizing canvas and managing image data?

According to the [Mozilla canvas Documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas)
```
The displayed size of the canvas can be changed using CSS, but if you do this the image is scaled during rendering to fit the styled size, which can make the final graphics rendering end up being distorted.
It is better to specify your canvas dimensions by setting the width and height attributes directly on the <canvas> elements, either directly in the HTML or by using JavaScript.
```


### Loading an Image

- maximum filesize must be enforced
  - dimensions must satisfy max width and height criteria of html canvas

#### Security, Cross-Origin Access and Canvas Tainting

Loading images from another origin without CORS approval (what is cors approval) poses a security risk.
As such, any canvas with data loaded from an image acquired without proper cors approval is considered tainted.
Attempting to retrieve (save) an image from a tainted canvas will result in an exception.
Blocked retrieval methods include
  - getImageData()
  - toBlob() (on the tainted <canvas> element)
  - toDataUrl()

More information
- Tainted canvas: https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image#What_is_a_.22tainted.22_canvas.3F
- The crossorigin attribute: https://html.spec.whatwg.org/multipage/#attr-img-crossorigin


##### CORS and crossorigin

So what does proper CORS approval look like?
- Appropriate CORS header
- Server must be configured with cross-origin access permitted (for images, at least)
  - `Access-Control-Allow-Origin` must be set
- Appropriate crossorigin attribute on the image html element
  - With this attribute, the browser will make the request for cross-origin access when requesting the image source 

### Draggable layer list with React DnD

https://react-dnd.github.io/react-dnd/about
At the time of writing, the some of the documentation examples (in Overview) use an old API (the decorator API) instead of the newer hooks API. The [tutorial](https://react-dnd.github.io/react-dnd/examples/tutorial) uses the hook API. The documentation also doesn't include Typescript definitions. 

App HOC to use HTML DnD backent
'useDrop' hook to make a component a drop "target"
'useDrag' hook to make a component draggable

The list items are draggable -- but only by their handle. To implement this, the drag handle icon button is assigned the 'drag' ref, while the containing ListItem element is assigned the 'preview' ref, similar to [the React DnD example for drag handles](https://react-dnd.github.io/react-dnd/examples/customize/handles-and-previews).
Ref is passsed to 'innerRef' prop for material ui components

Choice to store the layer order either by
- using the order of the indeces in the layer list
- using an 'index' or 'order' property on each layer object

If I store the order as a property on each layer object, then to move a layer to an index, every layer must be searched for their index value, to determine if it's after the source or target indece; and if it is, they must be moved.
If I store the order by the ordering of the indeces, I only need to manipulate a small list of scalars.

Concerning history and the ability to undo, and applying layer effects sequentially by order...
- It would be more efficient to iterate through a list directly rather than search a list of layers for the next layer by index.
- If the list of layer indeces is in redux, I can easily keep changes logged in history

In order to separate layer objects from their orders (indeces), I can normalize / denormalize with immutable js. Specifically, this lets pass an array of indeces to the list component, rather than a list of Layer objects -- the latter would mean my list component would re-render anytime any property on a layer was updated, while the former means the component only re-renders when a layer is added, removed, or moved.

### Libraries and Frameworks

### Typescript

#### Absolute Paths

https://github.com/facebook/create-react-app/issues/5118
Resolved by updating to CRA ~3.0+

### Material Ui
https://material-ui.com/guides/typescript/
https://medium.com/@egctoru/extend-material-ui-theme-in-typescript-a462e207131f

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
