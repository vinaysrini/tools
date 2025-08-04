/*
 * script.js
 *
 * This file contains the logic for generating a customized workout based on
 * user selections. It relies on the `exercises` array provided by
 * exercises.js. When the user clicks the Generate button, the script
 * filters exercises according to the chosen environment, push/pull focus and
 * body region, then assembles supersets with a variety of muscle groups.
 */

// Wait until the DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.getElementById('generateBtn');
  // Add click event for desktop
  generateBtn.addEventListener('click', generateWorkout);
  // Add touch events for mobile devices (especially Safari on iOS)
  generateBtn.addEventListener('touchstart', function(e) {
    // Prevent default to avoid double-firing with click events
    e.preventDefault();
    generateWorkout();
  });
});

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
    const row = supersetElement.querySelectorAll('tbody tr')[exIndex];
    if (row) {
      currentExercise.name = row.cells[1].textContent;
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
      const rows = supersetElement.querySelectorAll('tbody tr');
      
      rows.forEach((row, j) => {
        if (i === setIndex && j === exIndex) {
          // Replace with new exercise
          exercises.push(newExercise);
        } else {
          // Keep existing exercise
          const muscleGroup = row.cells[0].textContent;
          const name = row.cells[1].textContent;
          const description = row.cells[2].textContent;
          const equipment = row.cells[3].textContent.split(', ');
          const videoLink = row.cells[4].querySelector('a').href;
          
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
    
    // Re-render the workout with the updated exercise
    renderWorkout(supersets);
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
    msg.textContent = 'No exercises found for the selected criteria. Try adjusting your filters.';
    output.appendChild(msg);
    return;
  }
  
  supersets.forEach((superset, index) => {
    const container = document.createElement('div');
    container.className = 'superset';
    const header = document.createElement('h3');
    header.textContent = `Set ${index + 1}`;
    container.appendChild(header);
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    thead.innerHTML = '<tr><th>Muscle Group</th><th>Exercise</th><th>Description</th><th>Equipment</th><th>Video</th><th>Action</th></tr>';
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    
    superset.forEach((ex, exIndex) => {
      const row = document.createElement('tr');
      row.dataset.setIndex = index;
      row.dataset.exIndex = exIndex;
      
      const muscleCell = document.createElement('td');
      muscleCell.textContent = ex.muscleGroup;
      
      const nameCell = document.createElement('td');
      nameCell.textContent = ex.name;
      
      const descCell = document.createElement('td');
      descCell.textContent = ex.description;
      
      const equipCell = document.createElement('td');
      equipCell.textContent = Array.isArray(ex.equipment) ? ex.equipment.join(', ') : ex.equipment;
      
      const videoCell = document.createElement('td');
      const link = document.createElement('a');
      link.href = ex.video;
      link.textContent = 'Video';
      link.target = '_blank';
      videoCell.appendChild(link);
      
      const actionCell = document.createElement('td');
      const changeBtn = document.createElement('button');
      changeBtn.textContent = 'Change';
      changeBtn.className = 'change-exercise';
      changeBtn.onclick = function() {
        changeExercise(index, exIndex, ex.muscleGroup);
      };
      actionCell.appendChild(changeBtn);
      
      row.appendChild(muscleCell);
      row.appendChild(nameCell);
      row.appendChild(descCell);
      row.appendChild(equipCell);
      row.appendChild(videoCell);
      row.appendChild(actionCell);
      
      tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    container.appendChild(table);
    output.appendChild(container);
  });
}