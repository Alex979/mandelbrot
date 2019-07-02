///<reference types="pixi.js"/>

import * as PIXI from "pixi.js";

// Create a new fullscreen pixi application using the #main-canvas element
const width = window.innerWidth;
const height = window.innerHeight;
const view = <HTMLCanvasElement>document.getElementById('main-canvas');
const app = new PIXI.Application({ width, height, view, resizeTo: view });

// Instantiate a fullscreen container that the mandelbrot filter will be applied to
const filterContainer = new PIXI.Container();
filterContainer.filterArea = new PIXI.Rectangle(0, 0, app.screen.width, app.screen.height);
app.stage.addChild(filterContainer);

// Instantiate variables for camera movement and mandelbrot iterations
let iterations = 15.0;
let zoom = 1.0;
let movement = new PIXI.Point();
let zoomDirection = 0;
let offset = new PIXI.Point();
let moveSpeed = 0.5;
let zoomSpeed = 1.025;

// Load mandelbrot shader
app.loader.add('shader', 'dist/mandelbrot.frag').load(onLoaded);

// Add event listeners for window resize and user input
window.addEventListener('resize', onResize);
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

function onLoaded(loader: PIXI.Loader, res: any) {

  // Instantiate a new filter for the mandelbrot set using the mandelbrot.frag shader
  const mandelbrotFilter = new PIXI.Filter(null, res.shader.data, {
    iterations,
    zoom,
    offset
  });
  // Apply the mandelbrot filter to the fullscreen container
  filterContainer.filters = [mandelbrotFilter];

  // Run every animation frame (60 frames per second if possible)
  app.ticker.add((delta) => {
    // Apply the current movement direction to the offset of the camera
    offset.x += (movement.x * moveSpeed * 0.1) / zoom;
    offset.y += (movement.y * moveSpeed * 0.1) / zoom;

    // Apply the current zoom direction to the zoom of the camera
    if (zoomDirection == 1)
      zoom *= zoomSpeed;
    else if (zoomDirection == -1)
      zoom /= zoomSpeed;

    // Increase the iterations as you zoom in (and vice versa)
    iterations = 20 + Math.log(zoom)*4;

    // Apply new offset and zoom to the current mandelbrot filter
    mandelbrotFilter.uniforms.offset = offset;
    mandelbrotFilter.uniforms.zoom = zoom;
    mandelbrotFilter.uniforms.iterations = iterations;
  });
}

// Resize the filter area as the viewport changes
function onResize() {
  app.resize();
  filterContainer.filterArea.width = app.screen.width;
  filterContainer.filterArea.height = app.screen.height;
}

// Handle movement with arrow keys, and zooming with W and S keys
function onKeyDown(event: KeyboardEvent) {
  if (event.key == 'ArrowRight')
    movement.x = 1;
  if (event.key == 'ArrowLeft')
    movement.x = -1;
  if (event.key == 'ArrowDown')
    movement.y = 1;
  if (event.key == 'ArrowUp')
    movement.y = -1;
  if (event.key.toLowerCase() == 'w')
    zoomDirection = 1;
  if (event.key.toLowerCase() == 's')
    zoomDirection = -1;
}

// Stop movement or zoom when keys are unpressed
function onKeyUp(event: KeyboardEvent) {
  if (event.key == 'ArrowRight' && movement.x == 1)
    movement.x = 0;
  if (event.key == 'ArrowLeft' && movement.x == -1)
    movement.x = 0;
  if (event.key == 'ArrowDown' && movement.y == 1)
    movement.y = 0;
  if (event.key == 'ArrowUp' && movement.y == -1)
    movement.y = 0;
  if (event.key.toLowerCase() == 'w' && zoomDirection == 1)
    zoomDirection = 0;
  if (event.key.toLowerCase() == 's' && zoomDirection == -1)
    zoomDirection = 0;
}