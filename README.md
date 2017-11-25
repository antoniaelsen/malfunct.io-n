# Design Document

## About
[malfunct.io/n](http://malfunct.io/n) is a web tool for generating glitch art.  
More information on the design of this app is available at the [malfunct.io/n blog](https://cascadi.us/malfunction/).

## Author
Antonia Elsen  
[aelsen @ github](https://github.com/aelsen/)

## Design

### Future Work
- Canvas Improvements
  - Zoom and pan, with scrolling
  - Selectable regions
    - Whole rows / columns
    - Rectangles
  - Multiple images
- Additional Filters
  - Databending (audio / frequency)
  - Chunking and overlaying
- General Appearance
  - Logo
  - Background color update wrt uploaded image

  
### DOM Structure  
- Canvas
- Navbar
  - Logo
  - About 
  - Image Controls
    - Load
    - Save
    - Clear
  - Filter Controls
    - [Filter Controls]
    - Tab: Filter Select
  
#### Filter Controls:  
Pixelsorting
- Mode
  - Luminosity
  - Hue
- Sort Orientation
  - Vertical
  - Horizontal
- Sort Direction
  - Ascending
  - Descending
- Threshold Mode
  - Luminosity
  - Hue
- Threshold Max
- Threshold MIn

### Sources
[HTML5 Zoom and Pan Canvas - CodePen](https://codepen.io/techslides/pen/zowLd)