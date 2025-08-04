/*
 * editor.js
 *
 * This script powers the Exercise Catalogue Editor. It lets users view the
 * existing exercises, add new ones, edit or delete entries, and download an
 * updated `exercises.js` file. The goal is to maintain the same structure
 * used by the workout generator so the resulting file can be seamlessly
 * swapped in. Data is kept in memory only and not persisted unless the
 * generated file is downloaded and manually saved by the user.
 */

// Clone the existing exercises array into local state so edits do not
// accidentally mutate the original imported array. We deep clone simple
// properties, but nested objects like equipment and environment arrays are
// shallow cloned since they are primitives.
let exerciseData = (window.exercises || []).map(ex => Object.assign({}, ex, {
  equipment: Array.isArray(ex.equipment) ? ex.equipment.slice() : [],
  environment: Array.isArray(ex.environment) ? ex.environment.slice() : []
}));

document.addEventListener('DOMContentLoaded', () => {
  renderTable();
  document.getElementById('addExerciseBtn').addEventListener('click', onAdd);
  document.getElementById('exerciseForm').addEventListener('submit', onSave);
  document.getElementById('downloadBtn').addEventListener('click', onDownload);
});

/**
 * Render the exercise table from exerciseData. Clears any existing rows and
 * repopulates the tbody with current data, attaching edit and delete
 * handlers to each row's buttons.
 */
function renderTable() {
  const tbody = document.querySelector('#exerciseTable tbody');
  tbody.innerHTML = '';
  exerciseData.forEach((ex, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${escapeHtml(ex.name)}</td>
      <td>${escapeHtml(ex.muscleGroup)}</td>
      <td>${escapeHtml(ex.description)}</td>
      <td>${Array.isArray(ex.equipment) ? ex.equipment.map(e => escapeHtml(e)).join(', ') : ''}</td>
      <td>${escapeHtml(ex.pushPull)}</td>
      <td>${escapeHtml(ex.bodyRegion)}</td>
      <td>${Array.isArray(ex.environment) ? ex.environment.map(e => escapeHtml(e)).join(', ') : ''}</td>
      <td>${escapeHtml(ex.video)}</td>
      <td>
        <button class="editBtn" data-index="${index}">Edit</button>
        <button class="deleteBtn" data-index="${index}">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
  // Attach event listeners to edit and delete buttons
  document.querySelectorAll('.editBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      loadExercise(idx);
    });
  });
  document.querySelectorAll('.deleteBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      deleteExercise(idx);
    });
  });
}

/**
 * Escape HTML special characters to avoid injection when rendering user input.
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>"']/g, (char) => {
    const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return entities[char] || char;
  });
}

/**
 * Initialize the form for adding a new exercise. Clears existing values and
 * resets the hidden index field.
 */
function onAdd() {
  document.getElementById('exerciseIndex').value = '';
  document.getElementById('formTitle').textContent = 'Add Exercise';
  document.getElementById('name').value = '';
  document.getElementById('muscleGroup').value = '';
  document.getElementById('description').value = '';
  document.getElementById('equipment').value = '';
  document.getElementById('pushPullSelect').value = 'push';
  document.getElementById('bodyRegionSelect').value = 'upper';
  document.getElementById('environmentSelect').value = 'home';
  document.getElementById('video').value = '';
}

/**
 * Load an existing exercise into the form for editing.
 * @param {number} index
 */
function loadExercise(index) {
  const ex = exerciseData[index];
  if (!ex) return;
  document.getElementById('exerciseIndex').value = index;
  document.getElementById('formTitle').textContent = 'Edit Exercise';
  document.getElementById('name').value = ex.name || '';
  document.getElementById('muscleGroup').value = ex.muscleGroup || '';
  document.getElementById('description').value = ex.description || '';
  document.getElementById('equipment').value = Array.isArray(ex.equipment) ? ex.equipment.join(', ') : '';
  document.getElementById('pushPullSelect').value = ex.pushPull || 'push';
  document.getElementById('bodyRegionSelect').value = ex.bodyRegion || 'upper';
  // Determine environment select based on stored array
  let envValue = 'home';
  if (Array.isArray(ex.environment)) {
    if (ex.environment.length === 2) {
      envValue = 'both';
    } else if (ex.environment.includes('gym')) {
      envValue = 'gym';
    } else {
      envValue = 'home';
    }
  }
  document.getElementById('environmentSelect').value = envValue;
  document.getElementById('video').value = ex.video || '';
}

/**
 * Delete an exercise from the data and re-render the table.
 * @param {number} index
 */
function deleteExercise(index) {
  if (!confirm('Are you sure you want to delete this exercise?')) return;
  exerciseData.splice(index, 1);
  renderTable();
  onAdd();
}

/**
 * Handle form submission for adding or editing an exercise.
 * Determines whether to create a new entry or update an existing one.
 * @param {Event} e
 */
function onSave(e) {
  e.preventDefault();
  const indexVal = document.getElementById('exerciseIndex').value;
  const name = document.getElementById('name').value.trim();
  const muscleGroup = document.getElementById('muscleGroup').value.trim();
  const description = document.getElementById('description').value.trim();
  const equipmentInput = document.getElementById('equipment').value.trim();
  const pushPull = document.getElementById('pushPullSelect').value;
  const bodyRegion = document.getElementById('bodyRegionSelect').value;
  const environmentSel = document.getElementById('environmentSelect').value;
  const video = document.getElementById('video').value.trim();

  if (!name || !muscleGroup || !description || !equipmentInput || !pushPull || !bodyRegion || !environmentSel || !video) {
    alert('Please fill in all fields.');
    return;
  }

  // Generate a simple id by slugifying the name
  const id = slugify(name);
  const equipment = equipmentInput.split(',').map(s => s.trim()).filter(s => s);
  let environment;
  if (environmentSel === 'both') {
    environment = ['home', 'gym'];
  } else {
    environment = [environmentSel];
  }
  const exerciseObj = {
    id,
    name,
    muscleGroup,
    description,
    equipment,
    pushPull,
    bodyRegion,
    environment,
    video
  };
  if (indexVal === '') {
    // Add new
    exerciseData.push(exerciseObj);
  } else {
    // Update existing
    const idx = parseInt(indexVal, 10);
    exerciseData[idx] = exerciseObj;
  }
  // Refresh table and reset form
  renderTable();
  onAdd();
}

/**
 * Create a slug from a string by converting to lowercase, removing
 * non-alphanumeric characters and replacing spaces with underscores.
 * @param {string} str
 * @returns {string}
 */
function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

/**
 * Generate the contents of a new exercises.js file from the current state
 * and create a download link. This constructs a string containing the
 * `exercises` array in the same format as the original file, including
 * exports for both Node and browser environments.
 */
function onDownload() {
  // Build the string representation of the exercises array
  const lines = [];
  lines.push('// Generated exercise catalogue');
  lines.push('const exercises = [');
  exerciseData.forEach((ex, idx) => {
    const entry = {
      id: ex.id,
      name: ex.name,
      muscleGroup: ex.muscleGroup,
      description: ex.description,
      equipment: ex.equipment,
      pushPull: ex.pushPull,
      bodyRegion: ex.bodyRegion,
      environment: ex.environment,
      video: ex.video
    };
    // Format entry as JSON but with keys unquoted where appropriate for aesthetics
    const json = JSON.stringify(entry, null, 2)
      .replace(/"id":/g, 'id:')
      .replace(/"name":/g, 'name:')
      .replace(/"muscleGroup":/g, 'muscleGroup:')
      .replace(/"description":/g, 'description:')
      .replace(/"equipment":/g, 'equipment:')
      .replace(/"pushPull":/g, 'pushPull:')
      .replace(/"bodyRegion":/g, 'bodyRegion:')
      .replace(/"environment":/g, 'environment:')
      .replace(/"video":/g, 'video:');
    lines.push(`  ${json}${idx < exerciseData.length - 1 ? ',' : ''}`);
  });
  lines.push('];');
  lines.push('');
  lines.push('// Export for Node.js');
  lines.push("if (typeof module !== 'undefined') { module.exports = exercises; }");
  lines.push('// Export for browser');
  lines.push("if (typeof window !== 'undefined') { window.exercises = exercises; }\n");
  const content = lines.join('\n');

  // Create a blob and a temporary anchor element to trigger the download
  const blob = new Blob([content], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'exercises.js';
  document.body.appendChild(a);
  a.click();
  // Cleanup
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}