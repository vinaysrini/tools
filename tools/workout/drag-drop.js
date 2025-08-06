/**
 * drag-drop.js
 * 
 * Implements drag and drop functionality for workout exercises within the same set.
 * Allows users to reorder exercises by dragging them up or down.
 */

class DragDropHandler {
  constructor() {
    this.draggedItem = null;
    this.draggedItemIndex = -1;
    this.draggedItemSetIndex = -1;
    this.placeholder = null;
    this.isDragging = false;
    this.dragStartY = 0;
    this.initialY = 0;
    this.currentY = 0;
    this.yOffset = 0;
    this.draggedItemHeight = 0;
  }

  /**
   * Initialize drag and drop functionality for all exercise items
   */
  init() {
    // Add drag handle to all exercise items
    this.addDragHandlesToExercises();
    
    // Listen for new exercises being added to the DOM
    this.observeDOMChanges();
  }

  /**
   * Add drag handles to all exercise items in the document
   */
  addDragHandlesToExercises() {
    const exerciseItems = document.querySelectorAll('.exercise-item');
    
    exerciseItems.forEach(item => {
      this.addDragHandleToExercise(item);
    });
  }

  /**
   * Add a drag handle to a specific exercise item
   * @param {HTMLElement} exerciseItem - The exercise item to add a drag handle to
   */
  addDragHandleToExercise(exerciseItem) {
    // Check if this exercise item already has a drag handle
    if (exerciseItem.querySelector('.drag-handle')) {
      return;
    }
    
    // Create drag handle
    const dragHandle = document.createElement('div');
    dragHandle.className = 'drag-handle';
    dragHandle.innerHTML = '<i class="fas fa-grip-lines"></i>';
    dragHandle.setAttribute('title', 'Drag to reorder');
    
    // Add drag handle to the exercise main row
    const mainRow = exerciseItem.querySelector('.exercise-main-row');
    mainRow.insertBefore(dragHandle, mainRow.firstChild);
    
    // Add event listeners for drag and drop
    this.addDragListeners(exerciseItem, dragHandle);
  }

  /**
   * Add drag and drop event listeners to an exercise item
   * @param {HTMLElement} exerciseItem - The exercise item
   * @param {HTMLElement} dragHandle - The drag handle element
   */
  addDragListeners(exerciseItem, dragHandle) {
    // Touch events for mobile
    dragHandle.addEventListener('touchstart', (e) => this.handleDragStart(e, exerciseItem), { passive: false });
    document.addEventListener('touchmove', (e) => this.handleDragMove(e), { passive: false });
    document.addEventListener('touchend', (e) => this.handleDragEnd(e), { passive: false });
    
    // Mouse events for desktop
    dragHandle.addEventListener('mousedown', (e) => this.handleDragStart(e, exerciseItem));
    document.addEventListener('mousemove', (e) => this.handleDragMove(e));
    document.addEventListener('mouseup', (e) => this.handleDragEnd(e));
  }

  /**
   * Handle the start of a drag operation
   * @param {Event} e - The event object
   * @param {HTMLElement} exerciseItem - The exercise item being dragged
   */
  handleDragStart(e, exerciseItem) {
    // Prevent default behavior to avoid text selection during drag
    e.preventDefault();
    
    // Store reference to the dragged item
    this.draggedItem = exerciseItem;
    
    // Get the set index and exercise index
    this.draggedItemSetIndex = parseInt(exerciseItem.getAttribute('data-set'));
    this.draggedItemIndex = parseInt(exerciseItem.getAttribute('data-exercise'));
    
    // Get the initial position
    this.initialY = this.draggedItem.getBoundingClientRect().top;
    this.draggedItemHeight = this.draggedItem.offsetHeight;
    
    // Get the starting position of the pointer/touch
    if (e.type === 'touchstart') {
      this.dragStartY = e.touches[0].clientY;
    } else {
      this.dragStartY = e.clientY;
    }
    
    // Reset the y offset
    this.yOffset = 0;
    
    // Add dragging class to the item
    this.draggedItem.classList.add('dragging');
    
    // Create a placeholder
    this.createPlaceholder();
    
    // Set dragging state
    this.isDragging = true;
  }

  /**
   * Handle the drag movement
   * @param {Event} e - The event object
   */
  handleDragMove(e) {
    if (!this.isDragging) return;
    
    // Prevent default to avoid scrolling while dragging on mobile
    e.preventDefault();
    
    // Calculate the current position
    if (e.type === 'touchmove') {
      this.currentY = e.touches[0].clientY;
    } else {
      this.currentY = e.clientY;
    }
    
    // Calculate the y offset
    this.yOffset = this.currentY - this.dragStartY;
    
    // Update the dragged item's position
    const newY = this.initialY + this.yOffset;
    this.draggedItem.style.top = `${newY}px`;
    
    // Check if we need to swap with another exercise
    this.checkForSwap();
  }

  /**
   * Handle the end of a drag operation
   */
  handleDragEnd() {
    if (!this.isDragging) return;
    
    // Reset the transform and positioning
    this.draggedItem.style.transform = '';
    this.draggedItem.style.position = '';
    this.draggedItem.style.zIndex = '';
    this.draggedItem.style.width = '';
    this.draggedItem.style.top = '';
    this.draggedItem.style.left = '';
    
    // Remove the dragging class
    this.draggedItem.classList.remove('dragging');
    
    // Replace the placeholder with the dragged item
    if (this.placeholder && this.placeholder.parentNode) {
      this.placeholder.parentNode.replaceChild(this.draggedItem, this.placeholder);
    }
    
    // Reset the dragging state
    this.isDragging = false;
    this.draggedItem = null;
    this.draggedItemIndex = -1;
    this.draggedItemSetIndex = -1;
    this.placeholder = null;
  }

  /**
   * Create a placeholder element for the dragged item
   */
  createPlaceholder() {
    this.placeholder = document.createElement('div');
    this.placeholder.className = 'exercise-placeholder';
    this.placeholder.style.height = `${this.draggedItemHeight}px`;
    
    // Insert the placeholder in place of the dragged item
    this.draggedItem.parentNode.insertBefore(this.placeholder, this.draggedItem);
    
    // Make the dragged item absolute positioned to float above other elements
    this.draggedItem.style.position = 'absolute';
    this.draggedItem.style.zIndex = '1000';
    this.draggedItem.style.width = `${this.draggedItem.offsetWidth}px`;
    this.draggedItem.style.top = `${this.initialY}px`;
    this.draggedItem.style.left = `${this.draggedItem.getBoundingClientRect().left}px`;
  }

  /**
   * Check if we need to swap the dragged item with another exercise
   */
  checkForSwap() {
    // Get all exercise items in the same set
    const setContainer = this.draggedItem.closest('.superset');
    const exerciseItems = Array.from(setContainer.querySelectorAll('.exercise-item'));
    
    // Filter out the dragged item
    const otherExercises = exerciseItems.filter(item => item !== this.draggedItem);
    
    // Calculate the center position of the dragged item
    const draggedRect = this.draggedItem.getBoundingClientRect();
    const draggedCenter = draggedRect.top + (draggedRect.height / 2);
    
    // Find the exercise to swap with
    for (const exercise of otherExercises) {
      const rect = exercise.getBoundingClientRect();
      const exerciseCenter = rect.top + (rect.height / 2);
      
      // If the dragged item's center is above the other exercise's center
      // and the dragged item is below the other exercise in the DOM
      if (draggedCenter < exerciseCenter && 
          this.draggedItemIndex > parseInt(exercise.getAttribute('data-exercise'))) {
        // Swap the exercises
        this.swapExercises(exercise, 'before');
        break;
      }
      
      // If the dragged item's center is below the other exercise's center
      // and the dragged item is above the other exercise in the DOM
      if (draggedCenter > exerciseCenter && 
          this.draggedItemIndex < parseInt(exercise.getAttribute('data-exercise'))) {
        // Swap the exercises
        this.swapExercises(exercise, 'after');
        break;
      }
    }
  }

  /**
   * Swap the dragged item with another exercise
   * @param {HTMLElement} targetExercise - The exercise to swap with
   * @param {string} position - Where to insert the dragged item ('before' or 'after')
   */
  swapExercises(targetExercise, position) {
    const targetIndex = parseInt(targetExercise.getAttribute('data-exercise'));
    const exerciseList = this.draggedItem.parentNode;
    
    // Update the data-exercise attributes
    this.draggedItem.setAttribute('data-exercise', targetIndex);
    targetExercise.setAttribute('data-exercise', this.draggedItemIndex);
    
    // Update the draggedItemIndex
    this.draggedItemIndex = targetIndex;
    
    // Move the dragged item in the DOM
    if (position === 'before') {
      exerciseList.insertBefore(this.draggedItem, targetExercise);
    } else {
      exerciseList.insertBefore(this.draggedItem, targetExercise.nextSibling);
    }
    
    // Move the placeholder to maintain its position relative to the dragged item
    if (this.placeholder && this.placeholder.parentNode) {
      exerciseList.insertBefore(this.placeholder, this.draggedItem.nextSibling);
    }
    
    // Update the workout state to reflect the new order
    this.updateWorkoutState();
  }

  /**
   * Update the workout state to reflect the new exercise order
   */
  updateWorkoutState() {
    if (!window.workoutState) return;
    
    // Get all exercise items in the set
    const setContainer = this.draggedItem.closest('.superset');
    const setIndex = parseInt(setContainer.getAttribute('data-set-index'));
    const exerciseItems = Array.from(setContainer.querySelectorAll('.exercise-item'));
    
    // Create a new array for the reordered exercises
    const reorderedExercises = [];
    
    // Fill the array with exercises in their new order
    exerciseItems.forEach(item => {
      const index = parseInt(item.getAttribute('data-exercise'));
      reorderedExercises[index] = window.workoutState.supersets[setIndex][index];
    });
    
    // Update the workout state
    window.workoutState.supersets[setIndex] = reorderedExercises;
  }

  /**
   * Observe DOM changes to add drag handles to new exercises
   */
  observeDOMChanges() {
    // Create a MutationObserver to watch for new exercise items
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              // Check if this is an exercise item
              if (node.classList && node.classList.contains('exercise-item')) {
                this.addDragHandleToExercise(node);
              }
              
              // Check for exercise items within the added node
              const exerciseItems = node.querySelectorAll('.exercise-item');
              exerciseItems.forEach(item => {
                this.addDragHandleToExercise(item);
              });
            }
          });
        }
      });
    });
    
    // Start observing the workout output container
    const workoutOutput = document.getElementById('workoutOutput');
    observer.observe(workoutOutput, { childList: true, subtree: true });
  }
}

// Create a global instance
const dragDrop = new DragDropHandler();

// Initialize drag and drop when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  dragDrop.init();
});
