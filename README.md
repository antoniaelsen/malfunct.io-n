# Design Document

### About
`pixelsort` is a simple webapp tool to perform pixelsorting and other glitch-art operations on user imported images.  
It is a personal project to experiment with webdesign, html / css, and JS.

### Author
Antonia Elsen  
aelsen @ github

### Design

#### Requirements
- Canvas for editing images
- Load an image into the canvas
- Save an image from the canvas
- Clear the canvas


- Perform operations
  - Pixel sort
- Configure operations
  - Operation direction
    - Horizontal vs vertical vs diagonal
    - Top to bottom vs bottom to top
    - Left to right vs right to left
  - Value direction
    - Lesser to greater vs greater to lesser
  - Sort criteria
    - Brightness, hue, saturation
- Define areas of operation
  - Whole rows / columns / diagonals
  - Row beginnings / ends


#### Components and Controls
- GUI
  - Canvas
  - Drop down choice boxes (to be enabled / disabled; hidden / shown)
  - Sliders (to be enabled / disabled; hidden / shown)

#### Layout
- Canvas (main component)
- Options / configuration (expandable menu)
