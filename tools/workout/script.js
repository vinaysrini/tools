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
  generateBtn.addEventListener('click', generateWorkout);
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
 * Generate a workout based on user selections.
 * This function reads the chosen environment, push/pull preference and body
 * region from the DOM, filters the exercise catalogue accordingly, and
 * constructs an array of supersets. The results are then rendered into
 * the #workoutOutput container as a series of tables.
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

  // Group exercises by muscle group
  const byMuscle = {};
  candidates.forEach(ex => {
    if (!byMuscle[ex.muscleGroup]) {
      byMuscle[ex.muscleGroup] = [];
    }
    // Push a shallow copy to avoid mutating candidates
    byMuscle[ex.muscleGroup].push(Object.assign({}, ex));
  });

  const muscleGroups = Object.keys(byMuscle);
  shuffle(muscleGroups);

  // Determine how many exercises per superset and total supersets
  const exercisesPerSet = env === 'home' ? 2 : 3;
  // Aim for roughly a 45–60 minute session; adjust number of sets by environment
  const numSets = env === 'home' ? 4 : 5;

  const supersets = [];
  let usedMusclesOverall = new Set();

  for (let i = 0; i < numSets; i++) {
    const superset = [];
    const usedMusclesInSet = new Set();

    for (let j = 0; j < exercisesPerSet; j++) {
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
        usedMusclesOverall.add(selectedExercise.muscleGroup);
      }
    }
    if (superset.length > 0) {
      supersets.push(superset);
    }
  }

  // Render the supersets into the page
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
    header.textContent = `Superset ${index + 1}`;
    container.appendChild(header);
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    thead.innerHTML = '<tr><th>Muscle Group</th><th>Exercise</th><th>Description</th><th>Equipment</th><th>Video</th></tr>';
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    superset.forEach(ex => {
      const row = document.createElement('tr');
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
      row.appendChild(muscleCell);
      row.appendChild(nameCell);
      row.appendChild(descCell);
      row.appendChild(equipCell);
      row.appendChild(videoCell);
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    container.appendChild(table);
    output.appendChild(container);
  });
}