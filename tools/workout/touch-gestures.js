/**
 * touch-gestures.js
 * 
 * A lightweight touch gesture handler for mobile devices.
 * Implements swipe detection for changing exercises.
 */

class TouchGestureHandler {
  constructor(options = {}) {
    this.options = Object.assign({
      swipeThreshold: 50, // minimum distance for a swipe
      swipeTimeout: 300,  // maximum time for a swipe
      tapTimeout: 200     // maximum time for a tap
    }, options);
    
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.touchStartTime = 0;
    this.swipeHandlers = {
      left: [],
      right: [],
      up: [],
      down: []
    };
  }
  
  /**
   * Initialize touch events on a specific element
   * @param {HTMLElement} element - The element to attach touch events to
   */
  init(element) {
    element.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
    element.addEventListener('touchend', this.handleTouchEnd.bind(this), false);
    element.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
  }
  
  /**
   * Handle touch start event
   * @param {TouchEvent} event - The touch event
   */
  handleTouchStart(event) {
    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartTime = Date.now();
  }
  
  /**
   * Handle touch end event
   * @param {TouchEvent} event - The touch event
   */
  handleTouchEnd(event) {
    const touch = event.changedTouches[0];
    this.touchEndX = touch.clientX;
    this.touchEndY = touch.clientY;
    this.handleGesture(event.target);
  }
  
  /**
   * Handle touch move event
   * @param {TouchEvent} event - The touch event
   */
  handleTouchMove(event) {
    // Prevent scrolling when swiping on exercise items
    if (event.target.closest('.exercise-item')) {
      const touch = event.touches[0];
      const diffX = Math.abs(touch.clientX - this.touchStartX);
      const diffY = Math.abs(touch.clientY - this.touchStartY);
      
      // If horizontal swipe is more significant than vertical, prevent default
      if (diffX > diffY && diffX > 30) {
        event.preventDefault();
      }
    }
  }
  
  /**
   * Process the gesture after touch end
   * @param {HTMLElement} target - The element that was touched
   */
  handleGesture(target) {
    const elapsedTime = Date.now() - this.touchStartTime;
    
    // Check if it's a swipe (within time threshold)
    if (elapsedTime <= this.options.swipeTimeout) {
      const diffX = this.touchEndX - this.touchStartX;
      const diffY = this.touchEndY - this.touchStartY;
      
      // Horizontal swipe
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > this.options.swipeThreshold) {
        if (diffX > 0) {
          // Right swipe
          this.triggerSwipe('right', target);
        } else {
          // Left swipe
          this.triggerSwipe('left', target);
        }
      } 
      // Vertical swipe
      else if (Math.abs(diffY) > this.options.swipeThreshold) {
        if (diffY > 0) {
          // Down swipe
          this.triggerSwipe('down', target);
        } else {
          // Up swipe
          this.triggerSwipe('up', target);
        }
      }
    }
  }
  
  /**
   * Trigger swipe handlers for a specific direction
   * @param {string} direction - The swipe direction ('left', 'right', 'up', 'down')
   * @param {HTMLElement} target - The element that was swiped
   */
  triggerSwipe(direction, target) {
    this.swipeHandlers[direction].forEach(handler => {
      handler(target);
    });
  }
  
  /**
   * Add a swipe handler for a specific direction
   * @param {string} direction - The swipe direction ('left', 'right', 'up', 'down')
   * @param {Function} handler - The handler function
   */
  onSwipe(direction, handler) {
    if (this.swipeHandlers[direction]) {
      this.swipeHandlers[direction].push(handler);
    }
  }
}

// Create a global instance
const touchGestures = new TouchGestureHandler();
