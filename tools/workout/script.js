/*
 * script.js
 *
 * This file contains the logic for generating a customized workout based on
 * user selections. It relies on the `exercises` array provided by
 * exercises.js. When the user clicks the Generate button, the script
 * filters exercises according to the chosen environment, push/pull focus and
 * body region, then assembles supersets with a variety of muscle groups.
 * 
 * The script also includes functionality to share workouts via URL.
 */

/**
 * Encodes workout data for sharing in a URL
 * @param {Object} workoutData - The workout data to encode
 * @returns {string} Base64 encoded workout data
 */
function encodeWorkoutData(workoutData) {
  // Convert the workout data to a JSON string
  const jsonString = JSON.stringify(workoutData);
  
  // Handle Unicode characters by encoding to UTF-8 first
  // This converts the string to a format that btoa can handle
  const utf8String = encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g, (_, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  });
  
  // Encode the UTF-8 string using Base64
  const base64 = btoa(utf8String);
  
  // Make the Base64 string URL-safe by replacing characters
  const urlSafe = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  
  return urlSafe;
}

/**
 * Decodes workout data from a shared URL
 * @param {string} encodedData - The encoded workout data
 * @returns {Object} The decoded workout data
 */
function decodeWorkoutData(encodedData) {
  try {
    // Restore padding if needed
    let base64 = encodedData;
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    
    // Replace URL-safe characters with Base64 characters
    base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decode Base64 to UTF-8 string
    const rawString = atob(base64);
    
    // Convert from UTF-8 to Unicode
    const utf8String = Array.from(rawString).map(char => {
      return '%' + char.charCodeAt(0).toString(16).padStart(2, '0');
    }).join('');
    
    // Decode the UTF-8 string
    const jsonString = decodeURIComponent(utf8String);
    
    // Parse JSON string to object
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error decoding workout data:', error);
    throw new Error('Invalid workout data');
  }
}

/**
 * Creates a shareable URL containing the current workout state
 * @returns {string} The shareable URL
 */
function createShareableUrl() {
  if (!window.workoutState) {
    alert('Please generate a workout first.');
    return null;
  }
  
  // Get all current supersets from the DOM to ensure we have the latest state
  const supersets = [];
  const supersetElements = document.querySelectorAll('.superset');
  
  supersetElements.forEach((supersetElement) => {
    const exercises = [];
    const exerciseItems = supersetElement.querySelectorAll('.exercise-item');
    
    exerciseItems.forEach((item) => {
      const mainRow = item.querySelector('.exercise-main-row');
      const detailsSection = item.querySelector('.exercise-details');
      
      const muscleGroup = mainRow.querySelector('.muscle-group').textContent;
      const name = mainRow.querySelector('.exercise-name').textContent;
      
      // Extract description from details section
      const descriptionText = detailsSection.querySelector('.detail-item:nth-child(1)').textContent;
      const description = descriptionText.replace('Description: ', '');
      
      // Extract equipment from details section
      const equipmentText = detailsSection.querySelector('.detail-item:nth-child(2)').textContent;
      const equipment = equipmentText.replace('Equipment: ', '').split(', ');
      
      // Extract video link from details section
      const videoLink = detailsSection.querySelector('.detail-item:nth-child(3) a').href;
      
      exercises.push({
        muscleGroup,
        name,
        description,
        equipment,
        video: videoLink
      });
    });
      
    supersets.push(exercises);
  });
  
  // Create a simplified version of the workout state for sharing
  const shareState = {
    env: window.workoutState.env,
    pushPull: window.workoutState.pushPull,
    bodyRegion: window.workoutState.bodyRegion,
    exercisesPerSet: window.workoutState.exercisesPerSet,
    numSets: window.workoutState.numSets,
    supersets: supersets
  };
  
  // Encode the workout state
  const encodedData = encodeWorkoutData(shareState);
  
  // Create the shareable URL
  const url = new URL(window.location.href);
  url.search = ''; // Clear any existing query parameters
  url.searchParams.set('workout', encodedData);
  
  return url.toString();
}

/**
 * Shares the current workout using the Web Share API if available,
 * or copies the link to clipboard as fallback
 */
function shareWorkout() {
  const shareUrl = createShareableUrl();
  
  if (!shareUrl) {
    return;
  }
  
  // Try to use the Web Share API if available
  if (navigator.share) {
    navigator.share({
      title: 'Check out my workout!',
      text: 'Here\'s a workout I generated. Try it out!',
      url: shareUrl
    }).catch((error) => {
      console.error('Error sharing:', error);
      copyToClipboard(shareUrl);
    });
  } else {
    // Fallback to clipboard copy
    copyToClipboard(shareUrl);
  }
}

/**
 * Copies text to clipboard and shows a notification
 * @param {string} text - The text to copy
 */
function copyToClipboard(text) {
  // Create a temporary input element
  const input = document.createElement('input');
  input.style.position = 'fixed';
  input.style.opacity = 0;
  input.value = text;
  document.body.appendChild(input);
  
  // Select and copy the text
  input.select();
  input.setSelectionRange(0, 99999);
  document.execCommand('copy');
  
  // Remove the temporary element
  document.body.removeChild(input);
  
  // Show a notification
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = 'Share link copied to clipboard!';
  document.body.appendChild(notification);
  
  // Remove the notification after a delay
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 2000);
}

/**
 * Checks for a shared workout in the URL and loads it if found
 * @returns {boolean} True if a shared workout was loaded, false otherwise
 */
function checkForSharedWorkout() {
  const urlParams = new URLSearchParams(window.location.search);
  const sharedData = urlParams.get('workout');
  
  if (sharedData) {
    try {
      // Decode the shared workout data
      const decodedWorkout = decodeWorkoutData(sharedData);
      
      // Set form values based on the shared workout
      document.getElementById('environment').value = decodedWorkout.env;
      document.getElementById('pushPull').value = decodedWorkout.pushPull;
      document.getElementById('bodyRegion').value = decodedWorkout.bodyRegion;
      document.getElementById('exercisesPerSet').value = decodedWorkout.exercisesPerSet;
      document.getElementById('numSets').value = decodedWorkout.numSets;
      
      // Restore the workout state
      window.workoutState = decodedWorkout;
      
      // Render the shared workout
      const supersets = decodedWorkout.supersets;
      if (supersets && supersets.length > 0) {
        renderWorkout(supersets);
        return true;
      }
    } catch (error) {
      console.error('Error loading shared workout:', error);
    }
  }
  
  return false;
}

// Wait until the DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialize touch gestures on the workout output container
  const workoutOutput = document.getElementById('workoutOutput');
  touchGestures.init(workoutOutput);
  
  // Set up swipe handlers
  touchGestures.onSwipe('left', handleSwipeOnExercise);
  touchGestures.onSwipe('right', handleSwipeOnExercise);
  // Hide the workout options by default
  const controlsSection = document.querySelector('.controls');
  controlsSection.classList.add('hidden');
  
  // Create container for buttons
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'button-container';
  
  // Create and add the Edit button
  const editBtn = document.createElement('button');
  editBtn.id = 'editBtn';
  editBtn.className = 'edit-workout-btn';
  editBtn.innerHTML = '<i class="fas fa-sliders"></i> <span class="btn-text">Edit</span>';
  editBtn.addEventListener('click', toggleWorkoutOptions);
  
  // Create and add the Share button
  const shareBtn = document.createElement('button');
  shareBtn.id = 'shareBtn';
  shareBtn.className = 'share-workout-btn';
  shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> <span class="btn-text">Share</span>';
  shareBtn.addEventListener('click', shareWorkout);
  
  // Add buttons to container
  buttonContainer.appendChild(editBtn);
  buttonContainer.appendChild(shareBtn);
  
  // Insert the button container in the header
  const editBtnContainer = document.getElementById('editBtnContainer');
  editBtnContainer.appendChild(buttonContainer);
  
  // Set up the Generate button event listeners
  const generateBtn = document.getElementById('generateBtn');
  // Add click event for desktop
  generateBtn.addEventListener('click', function() {
    generateWorkout();
    // Hide the options after generating
    controlsSection.classList.add('hidden');
  });
  
  // Add touch events for mobile devices (especially Safari on iOS)
  generateBtn.addEventListener('touchstart', function(e) {
    // Prevent default to avoid double-firing with click events
    e.preventDefault();
    generateWorkout();
    // Hide the options after generating
    controlsSection.classList.add('hidden');
  });
  
  // Check for shared workout or generate a new one
  if (!checkForSharedWorkout()) {
    // If no shared workout was found, generate a new one
    generateWorkout();
  }
});

/**
 * Toggles the visibility of the workout options panel
 */
function toggleWorkoutOptions() {
  const controlsSection = document.querySelector('.controls');
  controlsSection.classList.toggle('hidden');
  
  // Update button text based on visibility state
  const editBtn = document.getElementById('editBtn');
  if (controlsSection.classList.contains('hidden')) {
    editBtn.innerHTML = '<i class="fas fa-sliders"></i> <span class="btn-text">Edit</span>';
    // If options were just hidden and changes were made, regenerate the workout
    generateWorkout();
  } else {
    editBtn.innerHTML = '<i class="fas fa-check"></i> <span class="btn-text">Done</span>';
  }
}

/**
 * Shuffle an array in place using the Fisher‑Yates algorithm.
 * @param {Array} array
 * @returns {Array}
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Changes the muscle group of an exercise in a specific set to the next available muscle group
 * @param {number} setIndex - The index of the set
 * @param {number} exIndex - The index of the exercise within the set
 * @param {string} currentMuscleGroup - The current muscle group of the exercise
 */
function changeMuscleGroup(setIndex, exIndex, currentMuscleGroup) {
  if (!window.workoutState) {
    alert('Please generate a workout first.');
    return;
  }
  
  // Get all available muscle groups from the exercises array
  const allMuscleGroups = [...new Set(exercises.map(ex => ex.muscleGroup))];
  
  // Find the current muscle group's index
  const currentIndex = allMuscleGroups.indexOf(currentMuscleGroup);
  
  // Get the next muscle group (cycle back to the beginning if at the end)
  const nextIndex = (currentIndex + 1) % allMuscleGroups.length;
  const newMuscleGroup = allMuscleGroups[nextIndex];
  
  // Change the exercise to one from the new muscle group
  changeExercise(setIndex, exIndex, newMuscleGroup);
}

/**
 * Handle swipe gestures on exercise items
 * @param {HTMLElement} target - The element that was swiped
 */
function handleSwipeOnExercise(target) {
  // Find the closest exercise item
  const exerciseItem = target.closest('.exercise-item');
  if (!exerciseItem) return;
  
  // Get the set index and exercise index from data attributes
  const setIndex = parseInt(exerciseItem.getAttribute('data-set'));
  const exIndex = parseInt(exerciseItem.getAttribute('data-exercise'));
  
  // Get the muscle group from the element
  const muscleGroupEl = exerciseItem.querySelector('.muscle-group');
  if (!muscleGroupEl) return;
  
  const muscleGroup = muscleGroupEl.textContent;
  
  // Change the exercise
  changeExercise(setIndex, exIndex, muscleGroup);
}

/**
 * Changes an exercise in a specific set
 * @param {number} setIndex - The index of the set
 * @param {number} exIndex - The index of the exercise within the set
 * @param {string} muscleGroup - The muscle group of the exercise to change
 */
function changeExercise(setIndex, exIndex, muscleGroup) {
  if (!window.workoutState) {
    alert('Please generate a workout first.');
    return;
  }
  
  let newExercise = null;
  const state = window.workoutState;
  
  // Find the original exercise data to compare against
  const currentExercise = {};
  const supersetElement = document.querySelectorAll('.superset')[setIndex];
  if (supersetElement) {
    // Get the exercise item
    const exerciseItem = supersetElement.querySelectorAll('.exercise-item')[exIndex];
    if (exerciseItem) {
      const mainRow = exerciseItem.querySelector('.exercise-main-row');
      currentExercise.name = mainRow.querySelector('.exercise-name').textContent;
    }
  }
  
  // Filter the original exercises array to find exercises of the same muscle group
  // that aren't currently displayed in the workout
  const availableExercises = exercises.filter(ex => {
    // Match muscle group
    if (ex.muscleGroup !== muscleGroup) return false;
    
    // Match environment
    if (!ex.environment.includes(state.env)) return false;
    
    // Match push/pull if specified
    if (state.pushPull !== 'no-preference' && ex.pushPull !== state.pushPull) return false;
    
    // Match body region if specified
    if (state.bodyRegion !== 'full' && ex.bodyRegion !== state.bodyRegion) return false;
    
    // Don't use the current exercise
    if (ex.name === currentExercise.name) return false;
    
    return true;
  });
  
  if (availableExercises.length > 0) {
    // Randomly select a new exercise
    const randomIndex = Math.floor(Math.random() * availableExercises.length);
    newExercise = availableExercises[randomIndex];
    
    // Get all current supersets from the DOM
    const supersets = [];
    const supersetElements = document.querySelectorAll('.superset');
    
    supersetElements.forEach((supersetElement, i) => {
      const exercises = [];
      const exerciseItems = supersetElement.querySelectorAll('.exercise-item');
      
      exerciseItems.forEach((item, j) => {
        if (i === setIndex && j === exIndex) {
          // Replace with new exercise
          exercises.push(newExercise);
        } else {
          // Keep existing exercise
          const mainRow = item.querySelector('.exercise-main-row');
          const detailsSection = item.querySelector('.exercise-details');
          
          const muscleGroup = mainRow.querySelector('.muscle-group').textContent;
          const name = mainRow.querySelector('.exercise-name').textContent;
          
          // Extract description from details section
          const descriptionText = detailsSection.querySelector('.detail-item:nth-child(1)').textContent;
          const description = descriptionText.replace('Description: ', '');
          
          // Extract equipment from details section
          const equipmentText = detailsSection.querySelector('.detail-item:nth-child(2)').textContent;
          const equipment = equipmentText.replace('Equipment: ', '').split(', ');
          
          // Extract video link from details section
          const videoLink = detailsSection.querySelector('.detail-item:nth-child(3) a').href;
          
          exercises.push({
            muscleGroup,
            name,
            description,
            equipment,
            video: videoLink
          });
        }
      });
        
      supersets.push(exercises);
    });
    
    // Store the display state of all exercise details before re-rendering
    const detailsStates = [];
    document.querySelectorAll('.superset').forEach((set, i) => {
      const setStates = [];
      set.querySelectorAll('.exercise-details').forEach((details) => {
        setStates.push(details.style.display === 'block');
      });
      detailsStates.push(setStates);
    });
    
    // Re-render the workout with the updated exercise
    renderWorkout(supersets);
    
    // Restore the display state of all exercise details after re-rendering
    document.querySelectorAll('.superset').forEach((set, i) => {
      if (detailsStates[i]) {
        set.querySelectorAll('.exercise-details').forEach((details, j) => {
          if (detailsStates[i][j]) {
            details.style.display = 'block';
          }
        });
      }
    });
  } else {
    alert('No more exercises available for this muscle group. Try generating a new workout.');
  }
}

/**
 * Generate a workout based on user selections.
 * This function reads the chosen environment, push/pull preference and body
 * region from the DOM, filters the exercise catalogue accordingly, and
 * constructs an array of supersets with either a core OR cardio exercise (not both).
 * The results are then rendered into the #workoutOutput container as a series of tables.
 */
function generateWorkout() {
  // Get selected values
  const env = document.getElementById('environment').value;
  const pushPull = document.getElementById('pushPull').value;
  const bodyRegion = document.getElementById('bodyRegion').value;

  // Copy the exercises array to avoid mutating the original dataset
  let candidates = exercises.slice();

  // Filter by environment: candidate environments are arrays like ['home','gym']
  candidates = candidates.filter(ex => {
    if (!Array.isArray(ex.environment)) return false;
    return ex.environment.includes(env);
  });

  // Filter by push/pull if a specific focus is chosen
  if (pushPull !== 'no-preference') {
    candidates = candidates.filter(ex => ex.pushPull === pushPull);
  }

  // Filter by body region if a specific region is chosen
  if (bodyRegion !== 'full') {
    candidates = candidates.filter(ex => ex.bodyRegion === bodyRegion);
  }

  // Separate core and cardio exercises
  const coreExercises = candidates.filter(ex => ex.muscleGroup === 'Core');
  const cardioExercises = candidates.filter(ex => ex.muscleGroup === 'Cardio');
  
  // Group remaining exercises by muscle group
  const byMuscle = {};
  candidates.forEach(ex => {
    if (ex.muscleGroup !== 'Core' && ex.muscleGroup !== 'Cardio') {
      if (!byMuscle[ex.muscleGroup]) {
        byMuscle[ex.muscleGroup] = [];
      }
      // Push a shallow copy to avoid mutating candidates
      byMuscle[ex.muscleGroup].push(Object.assign({}, ex));
    }
  });

  const muscleGroups = Object.keys(byMuscle);
  shuffle(muscleGroups);

  // Get custom values for exercises per set and number of sets from the select dropdowns
  const exercisesPerSet = parseInt(document.getElementById('exercisesPerSet').value);
  const numSets = parseInt(document.getElementById('numSets').value);

  // Shuffle core and cardio exercises to ensure variety
  shuffle(coreExercises);
  shuffle(cardioExercises);

  // Store all generated exercises for regeneration later
  window.workoutState = {
    coreExercises: [...coreExercises],
    cardioExercises: [...cardioExercises],
    byMuscle: JSON.parse(JSON.stringify(byMuscle)),
    muscleGroups: [...muscleGroups],
    env: env,
    pushPull: pushPull,
    bodyRegion: bodyRegion,
    exercisesPerSet: exercisesPerSet,
    numSets: numSets
  };

  const supersets = [];
  let usedMusclesOverall = new Set();

  for (let i = 0; i < numSets; i++) {
    const superset = [];
    const usedMusclesInSet = new Set();
    
    // Save cardio/core exercise for the end of the set
    let coreOrCardioExercise = null;
    let coreOrCardioMuscleGroup = null;
    
    // Randomly decide whether to add core or cardio
    const addCore = Math.random() > 0.5;
    
    // Select the core or cardio exercise but don't add it to the superset yet
    if (addCore && coreExercises.length > 0) {
      // Select a core exercise if available and chosen
      coreOrCardioExercise = coreExercises.pop();
      coreOrCardioMuscleGroup = 'Core';
    } else if (!addCore && cardioExercises.length > 0) {
      // Select a cardio exercise if available and chosen
      coreOrCardioExercise = cardioExercises.pop();
      coreOrCardioMuscleGroup = 'Cardio';
    } else if (coreExercises.length > 0) {
      // Fallback to core if cardio was selected but not available
      coreOrCardioExercise = coreExercises.pop();
      coreOrCardioMuscleGroup = 'Core';
    } else if (cardioExercises.length > 0) {
      // Fallback to cardio if core was selected but not available
      coreOrCardioExercise = cardioExercises.pop();
      coreOrCardioMuscleGroup = 'Cardio';
    }

    // Calculate remaining slots - if we have a core/cardio exercise, reserve one slot for it
    const remainingSlots = coreOrCardioExercise ? exercisesPerSet - 1 : exercisesPerSet;
    for (let j = 0; j < remainingSlots; j++) {
      let selectedExercise = null;
      // First attempt: pick an exercise from a muscle group not yet used in this set and overall if possible
      for (const mg of muscleGroups) {
        const pool = byMuscle[mg];
        if (pool && pool.length > 0 && !usedMusclesInSet.has(mg) && !usedMusclesOverall.has(mg)) {
          selectedExercise = pool.pop();
          usedMusclesInSet.add(mg);
          break;
        }
      }
      // Second attempt: pick any unused in this set
      if (!selectedExercise) {
        for (const mg of muscleGroups) {
          const pool = byMuscle[mg];
          if (pool && pool.length > 0 && !usedMusclesInSet.has(mg)) {
            selectedExercise = pool.pop();
            usedMusclesInSet.add(mg);
            break;
          }
        }
      }
      // Final attempt: pick any remaining exercise
      if (!selectedExercise) {
        for (const mg of muscleGroups) {
          const pool = byMuscle[mg];
          if (pool && pool.length > 0) {
            selectedExercise = pool.pop();
            usedMusclesInSet.add(mg);
            break;
          }
        }
      }
      if (selectedExercise) {
        superset.push(selectedExercise);
      }
    }
    // Add the core or cardio exercise at the end of the set if we have one
    if (coreOrCardioExercise) {
      superset.push(coreOrCardioExercise);
      usedMusclesInSet.add(coreOrCardioMuscleGroup);
    }
    
    if (superset.length > 0) {
      supersets.push(superset);
    }
    // Add used muscles to overall set to avoid repeating across sets
    usedMusclesInSet.forEach(mg => usedMusclesOverall.add(mg));
  }

  renderWorkout(supersets);
}

/**
 * Renders the workout to the page
 * @param {Array} supersets - Array of exercise sets
 */
function renderWorkout(supersets) {
  const output = document.getElementById('workoutOutput');
  output.innerHTML = '';
  
  if (supersets.length === 0) {
    const msg = document.createElement('p');
    msg.innerHTML = '<i class="fas fa-exclamation-circle"></i> No exercises available for the selected criteria. Try changing your options.';
    msg.style.textAlign = 'center';
    output.appendChild(msg);
    return;
  }
  
  // Store the current workout state for later use
  window.workoutState = window.workoutState || {};
  window.workoutState.supersets = supersets;
  
  supersets.forEach((superset, index) => {
    const container = document.createElement('div');
    container.className = 'superset';
    
    // Create a header for the superset
    const headerContainer = document.createElement('div');
    headerContainer.className = 'superset-header';
    
    const setTitle = document.createElement('h3');
    setTitle.textContent = `${index + 1}`;
    headerContainer.appendChild(setTitle);
    
    // Add set controls (refresh and remove)
    const setControls = document.createElement('div');
    setControls.className = 'set-controls';
    
    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'set-control-btn';
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    refreshBtn.title = 'Regenerate this set';
    refreshBtn.addEventListener('click', function() {
      const setIndex = parseInt(this.getAttribute('data-set'));
      regenerateSet(setIndex);
    });
    refreshBtn.setAttribute('data-set', index);
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'set-control-btn';
    removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
    removeBtn.title = 'Remove this set';
    removeBtn.addEventListener('click', function() {
      const setIndex = parseInt(this.getAttribute('data-set'));
      removeSet(setIndex);
    });
    removeBtn.setAttribute('data-set', index);
    
    setControls.appendChild(refreshBtn);
    setControls.appendChild(removeBtn);
    headerContainer.appendChild(setControls);
    
    container.appendChild(headerContainer);
    
    // Create a mobile-friendly exercise list
    const exerciseList = document.createElement('ul');
    exerciseList.className = 'exercise-list';
    
    superset.forEach((ex, exIndex) => {
      // Create the exercise item
      const exerciseItem = document.createElement('li');
      exerciseItem.className = 'exercise-item';
      exerciseItem.setAttribute('data-set', index);
      exerciseItem.setAttribute('data-exercise', exIndex);
      exerciseItem.dataset.setIndex = index;
      exerciseItem.dataset.exIndex = exIndex;
      
      // Create the main exercise row (always visible)
      const mainRow = document.createElement('div');
      mainRow.className = 'exercise-main-row';
      
      // Muscle group cell (clickable to change muscle group)
      const muscleGroup = document.createElement('div');
      muscleGroup.className = 'muscle-group';
      muscleGroup.textContent = ex.muscleGroup;
      muscleGroup.title = 'Click to change muscle group';
      muscleGroup.onclick = function(e) {
        e.stopPropagation(); // Prevent row click event
        changeMuscleGroup(index, exIndex, ex.muscleGroup);
      };
      
      // Exercise name
      const exerciseName = document.createElement('div');
      exerciseName.className = 'exercise-name';
      exerciseName.textContent = ex.name;
      
      // Make the main row clickable to toggle details
      mainRow.style.cursor = 'pointer';
      mainRow.onclick = function() {
        const details = this.parentNode.querySelector('.exercise-details');
        if (details.style.display === 'none' || !details.style.display) {
          details.style.display = 'block';
        } else {
          details.style.display = 'none';
        }
      };
      
      // Add elements to main row - exercise name first, then muscle group
      mainRow.appendChild(exerciseName);
      mainRow.appendChild(muscleGroup);
      exerciseItem.appendChild(mainRow);
      
      // Create collapsible details section
      const detailsSection = document.createElement('div');
      detailsSection.className = 'exercise-details';
      detailsSection.style.display = 'none'; // Hidden by default
      
      // Description
      const description = document.createElement('div');
      description.className = 'detail-item';
      description.innerHTML = `<strong>Description:</strong> ${ex.description}`;
      detailsSection.appendChild(description);
      
      // Equipment
      const equipment = document.createElement('div');
      equipment.className = 'detail-item';
      equipment.innerHTML = `<strong>Equipment:</strong> ${Array.isArray(ex.equipment) ? ex.equipment.join(', ') : ex.equipment}`;
      detailsSection.appendChild(equipment);
      
      // Video link
      const videoLink = document.createElement('div');
      videoLink.className = 'detail-item';
      const link = document.createElement('a');
      link.href = ex.video;
      link.textContent = 'Watch Video';
      link.target = '_blank';
      videoLink.innerHTML = '<strong>Video:</strong> ';
      videoLink.appendChild(link);
      detailsSection.appendChild(videoLink);
      
      // Change exercise button
      const actionDiv = document.createElement('div');
      actionDiv.className = 'detail-item';
      const changeBtn = document.createElement('button');
      changeBtn.className = 'change-exercise';
      changeBtn.innerHTML = '<i class="fas fa-random"></i> <span class="btn-text">Change</span>';
      changeBtn.title = 'Change this exercise';
      changeBtn.onclick = function(e) {
        e.stopPropagation(); // Prevent row click event from triggering
        changeExercise(index, exIndex, ex.muscleGroup);
      };
      actionDiv.appendChild(changeBtn);
      detailsSection.appendChild(actionDiv);
      
      // Add details section to exercise item
      exerciseItem.appendChild(detailsSection);
      
      // Add exercise item to list
      exerciseList.appendChild(exerciseItem);
    });
    
    container.appendChild(exerciseList);
    output.appendChild(container);
  });
  
  // Add 'Add New Set' button at the bottom
  const addContainer = document.createElement('div');
  addContainer.className = 'add-set-container';
  
  const addBtn = document.createElement('button');
  addBtn.className = 'add-set-btn';
  addBtn.innerHTML = '<i class="fas fa-plus"></i>';
  addBtn.title = 'Add another set';
  addBtn.onclick = addNewSet;
  
  addContainer.appendChild(addBtn);
  output.appendChild(addContainer);
}

/**
 * Regenerates a specific workout set with new exercises
 * @param {number} setIndex - The index of the set to regenerate
 */
function regenerateSet(setIndex) {
  if (!window.workoutState || !window.workoutState.supersets) {
    alert('Please generate a workout first.');
    return;
  }
  
  // Get current workout state
  const state = window.workoutState;
  const currentSupersets = state.supersets;
  
  if (setIndex < 0 || setIndex >= currentSupersets.length) {
    console.error('Invalid set index:', setIndex);
    return;
  }
  
  // Get the current set's muscle groups to maintain the same structure
  const currentSet = currentSupersets[setIndex];
  const muscleGroups = currentSet.map(ex => ex.muscleGroup);
  
  // Create a new set with the same muscle groups but different exercises
  const newSet = [];
  
  // Get selected values from the form
  const env = document.getElementById('environment').value;
  const pushPull = document.getElementById('pushPull').value;
  const bodyRegion = document.getElementById('bodyRegion').value;
  
  // For each muscle group in the current set, find a new exercise
  muscleGroups.forEach(muscleGroup => {
    // Filter exercises by muscle group and other criteria
    const availableExercises = exercises.filter(ex => {
      // Match muscle group
      if (ex.muscleGroup !== muscleGroup) return false;
      
      // Match environment
      if (!ex.environment.includes(env)) return false;
      
      // Match push/pull if specified
      if (pushPull !== 'no-preference' && ex.pushPull !== pushPull) return false;
      
      // Match body region if specified
      if (bodyRegion !== 'full' && ex.bodyRegion !== bodyRegion) return false;
      
      // Don't use exercises already in the current set
      const isInCurrentSet = currentSet.some(currentEx => currentEx.name === ex.name);
      if (isInCurrentSet) return false;
      
      return true;
    });
    
    if (availableExercises.length > 0) {
      // Randomly select a new exercise
      const randomIndex = Math.floor(Math.random() * availableExercises.length);
      newSet.push(availableExercises[randomIndex]);
    } else {
      // If no new exercise is available, keep the current one
      const currentExercise = currentSet.find(ex => ex.muscleGroup === muscleGroup);
      if (currentExercise) {
        newSet.push(currentExercise);
      }
    }
  });
  
  // Replace the old set with the new one
  currentSupersets[setIndex] = newSet;
  
  // Re-render the workout
  renderWorkout(currentSupersets);
}

/**
 * Removes a specific workout set
 * @param {number} setIndex - The index of the set to remove
 */
function removeSet(setIndex) {
  if (!window.workoutState || !window.workoutState.supersets) {
    alert('Please generate a workout first.');
    return;
  }
  
  // Get current workout state
  const state = window.workoutState;
  const currentSupersets = state.supersets;
  
  if (setIndex < 0 || setIndex >= currentSupersets.length) {
    console.error('Invalid set index:', setIndex);
    return;
  }
  
  // Remove the set at the specified index
  currentSupersets.splice(setIndex, 1);
  
  // Re-render the workout
  renderWorkout(currentSupersets);
}

/**
 * Adds a new workout set
 */
function addNewSet() {
  if (!window.workoutState) {
    alert('Please generate a workout first.');
    return;
  }
  
  // Get current workout state
  const state = window.workoutState;
  const currentSupersets = state.supersets || [];
  
  // Get selected values from the form
  const env = document.getElementById('environment').value;
  const pushPull = document.getElementById('pushPull').value;
  const bodyRegion = document.getElementById('bodyRegion').value;
  
  // Create a new set with similar structure to existing sets
  let newSet = [];
  let targetMuscleGroups = [];
  
  // If there are existing sets, use a similar structure
  if (currentSupersets.length > 0) {
    // Get a random existing set to use as a template
    const templateSetIndex = Math.floor(Math.random() * currentSupersets.length);
    const templateSet = currentSupersets[templateSetIndex];
    
    // Use the same muscle groups as the template
    targetMuscleGroups = templateSet.map(ex => ex.muscleGroup);
  } else {
    // Default structure if no existing sets
    // Include a mix of upper body, lower body, and core/cardio
    const allMuscleGroups = [...new Set(exercises.map(ex => ex.muscleGroup))];
    const upperBodyGroups = allMuscleGroups.filter(mg => 
      ['Chest', 'Back', 'Shoulders', 'Arms', 'Biceps', 'Triceps'].includes(mg));
    const lowerBodyGroups = allMuscleGroups.filter(mg => 
      ['Legs', 'Quads', 'Hamstrings', 'Glutes', 'Calves'].includes(mg));
    const coreCardioGroups = allMuscleGroups.filter(mg => 
      ['Core', 'Cardio'].includes(mg));
    
    // Select 1-2 upper body, 1-2 lower body, and 1 core/cardio exercise
    if (upperBodyGroups.length > 0) {
      targetMuscleGroups.push(upperBodyGroups[Math.floor(Math.random() * upperBodyGroups.length)]);
      if (Math.random() > 0.5 && upperBodyGroups.length > 1) {
        let secondGroup;
        do {
          secondGroup = upperBodyGroups[Math.floor(Math.random() * upperBodyGroups.length)];
        } while (secondGroup === targetMuscleGroups[targetMuscleGroups.length - 1]);
        targetMuscleGroups.push(secondGroup);
      }
    }
    
    if (lowerBodyGroups.length > 0) {
      targetMuscleGroups.push(lowerBodyGroups[Math.floor(Math.random() * lowerBodyGroups.length)]);
      if (Math.random() > 0.5 && lowerBodyGroups.length > 1) {
        let secondGroup;
        do {
          secondGroup = lowerBodyGroups[Math.floor(Math.random() * lowerBodyGroups.length)];
        } while (secondGroup === targetMuscleGroups[targetMuscleGroups.length - 1]);
        targetMuscleGroups.push(secondGroup);
      }
    }
    
    if (coreCardioGroups.length > 0) {
      targetMuscleGroups.push(coreCardioGroups[Math.floor(Math.random() * coreCardioGroups.length)]);
    }
  }
  
  // For each target muscle group, find an appropriate exercise
  targetMuscleGroups.forEach(muscleGroup => {
    // Filter exercises by muscle group and other criteria
    const availableExercises = exercises.filter(ex => {
      // Match muscle group
      if (ex.muscleGroup !== muscleGroup) return false;
      
      // Match environment
      if (!ex.environment.includes(env)) return false;
      
      // Match push/pull if specified
      if (pushPull !== 'no-preference' && ex.pushPull !== pushPull) return false;
      
      // Match body region if specified
      if (bodyRegion !== 'full' && ex.bodyRegion !== bodyRegion) return false;
      
      return true;
    });
    
    if (availableExercises.length > 0) {
      // Randomly select an exercise
      const randomIndex = Math.floor(Math.random() * availableExercises.length);
      newSet.push(availableExercises[randomIndex]);
    }
  });
  
  // Add the new set if it has exercises
  if (newSet.length > 0) {
    currentSupersets.push(newSet);
    
    // Re-render the workout
    renderWorkout(currentSupersets);
  } else {
    alert('Could not create a new set with the current filters. Try adjusting your criteria.');
  }
}