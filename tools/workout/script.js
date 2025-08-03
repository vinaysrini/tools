/*
 * Full‑Body Workout Generator
 *
 * This script defines a small catalogue of exercises and exposes logic to
 * generate randomized supersets based on the user’s available equipment,
 * workout duration and superset size. Each exercise is tagged with its
 * primary body part and the equipment required. When a workout is generated
 * the script assembles supersets of different body parts and attaches a
 * “Redo” button to each exercise so it can be swapped out on demand.
 */

// Catalogue of exercises. Each entry contains a name, the primary body part
// it targets and a list of equipment required. Exercises requiring no
// equipment are labelled as 'body weight'.
const EXERCISES = [
  // Chest
  {
    id: 1,
    name: "Push‑Up",
    bodyPart: "Chest",
    equipment: ["body weight"],
    instructions: [
      "Start in a plank position with your hands beneath your shoulders and your body forming a straight line from head to heels.",
      "Lower your chest toward the floor by bending your elbows, keeping your elbows close to your torso.",
      "Push through your palms to extend your arms and return to the starting plank position."
    ]
  },
  {
    id: 2,
    name: "Barbell Bench Press",
    bodyPart: "Chest",
    equipment: ["barbell"],
    instructions: [
      "Lie on a flat bench with your feet on the floor and grasp the barbell with hands slightly wider than shoulder‑width.",
      "Unrack the bar and lower it to mid‑chest, keeping your elbows at about a 45‑degree angle.",
      "Press the bar upward until your arms are straight, then repeat."
    ]
  },
  {
    id: 3,
    name: "Dumbbell Bench Press",
    bodyPart: "Chest",
    equipment: ["dumbbell"],
    instructions: [
      "Lie on a flat bench holding a dumbbell in each hand with arms extended above your chest.",
      "Lower the dumbbells until your elbows are at about 90 degrees, keeping wrists straight.",
      "Press the weights back up until your arms are fully extended."
    ]
  },
  {
    id: 4,
    name: "Incline Dumbbell Press",
    bodyPart: "Chest",
    equipment: ["dumbbell"],
    instructions: [
      "Set an incline bench to about 30–45 degrees and sit back with a dumbbell in each hand at shoulder height.",
      "Press the weights upward above your chest until your arms are straight.",
      "Lower the dumbbells back to shoulder height with control."
    ]
  },
  {
    id: 5,
    name: "Kettlebell Floor Press",
    bodyPart: "Chest",
    equipment: ["kettlebell"],
    instructions: [
      "Lie on your back on the floor with knees bent, holding a kettlebell in one hand at your chest.",
      "Press the kettlebell up until your arm is straight, keeping your elbow tucked.",
      "Lower the weight until your triceps lightly touch the floor, then repeat."
    ]
  },
  // Back
  {
    id: 6,
    name: "Pull‑Up",
    bodyPart: "Back",
    equipment: ["body weight"],
    instructions: [
      "Hang from a pull‑up bar with an overhand grip slightly wider than shoulder‑width.",
      "Pull your chest toward the bar by driving your elbows down and back.",
      "Lower yourself under control until your arms are fully extended."
    ]
  },
  {
    id: 7,
    name: "Barbell Bent‑Over Row",
    bodyPart: "Back",
    equipment: ["barbell"],
    instructions: [
      "Stand with feet hip‑width apart and hold the barbell with an overhand grip.",
      "Hinge at your hips until your torso is roughly parallel to the floor, keeping your back flat.",
      "Row the bar toward your lower ribcage, squeezing your shoulder blades together, then lower it."
    ]
  },
  {
    id: 8,
    name: "Single‑Arm Dumbbell Row",
    bodyPart: "Back",
    equipment: ["dumbbell"],
    instructions: [
      "Place one knee and hand on a bench for support and hold a dumbbell in the other hand.",
      "Keep your back flat and row the weight up toward your hip by pulling your elbow back.",
      "Lower the dumbbell under control and repeat before switching sides."
    ]
  },
  {
    id: 9,
    name: "Inverted Row",
    bodyPart: "Back",
    equipment: ["body weight"],
    instructions: [
      "Set a bar at waist height and lie underneath it with your heels on the ground.",
      "Grasp the bar with an overhand grip and pull your chest up to the bar by squeezing your shoulder blades.",
      "Lower yourself back down until your arms are straight."
    ]
  },
  {
    id: 10,
    name: "Kettlebell Row",
    bodyPart: "Back",
    equipment: ["kettlebell"],
    instructions: [
      "Place one hand on a bench and stagger your stance while holding a kettlebell in the other hand.",
      "Keeping your back straight, row the kettlebell toward your hip, driving your elbow up.",
      "Lower the weight under control and repeat on both sides."
    ]
  },
  // Shoulders
  {
    id: 11,
    name: "Barbell Overhead Press",
    bodyPart: "Shoulders",
    equipment: ["barbell"],
    instructions: [
      "Stand with feet shoulder‑width apart and hold a barbell at your shoulders with palms facing forward.",
      "Press the bar straight overhead until your arms are fully extended.",
      "Lower the bar back to your shoulders under control."
    ]
  },
  {
    id: 12,
    name: "Dumbbell Shoulder Press",
    bodyPart: "Shoulders",
    equipment: ["dumbbell"],
    instructions: [
      "Sit or stand with a dumbbell in each hand at shoulder height.",
      "Press the weights overhead until your arms are straight, keeping your core engaged.",
      "Lower the dumbbells back to shoulder height with control."
    ]
  },
  {
    id: 13,
    name: "Kettlebell Push Press",
    bodyPart: "Shoulders",
    equipment: ["kettlebell"],
    instructions: [
      "Clean the kettlebell to the rack position at your shoulder with your elbow tucked.",
      "Dip your knees slightly and then drive through your legs as you press the kettlebell overhead.",
      "Lower it back to the rack position and repeat before switching sides."
    ]
  },
  {
    id: 14,
    name: "Lateral Raise",
    bodyPart: "Shoulders",
    equipment: ["dumbbell"],
    instructions: [
      "Stand with a dumbbell in each hand at your sides.",
      "Keeping a slight bend in your elbows, raise your arms out to the sides until they reach shoulder height.",
      "Lower the weights back down slowly and repeat."
    ]
  },
  {
    id: 15,
    name: "Handstand Push‑Up",
    bodyPart: "Shoulders",
    equipment: ["body weight"],
    instructions: [
      "Kick into a handstand against a wall with your hands shoulder‑width apart on the floor.",
      "Lower yourself by bending your elbows until your head nearly touches the floor.",
      "Press through your hands to straighten your arms and return to the handstand."
    ]
  },
  // Legs & glutes
  {
    id: 16,
    name: "Barbell Back Squat",
    bodyPart: "Legs",
    equipment: ["barbell"],
    instructions: [
      "Position a barbell across your upper back and stand with feet shoulder‑width apart.",
      "Descend by bending your hips and knees, keeping your chest up and knees tracking over your toes.",
      "Lower until your thighs are roughly parallel to the floor, then drive through your heels to stand back up."
    ]
  },
  {
    id: 17,
    name: "Barbell Deadlift",
    bodyPart: "Legs",
    equipment: ["barbell"],
    instructions: [
      "Stand with feet hip‑width apart and the bar over your mid‑foot.",
      "Hinge at your hips and bend your knees to grasp the bar with hands just outside your shins.",
      "Keeping a neutral spine, push through your heels and extend your hips and knees to stand, then lower the bar back to the floor."
    ]
  },
  {
    id: 18,
    name: "Dumbbell Lunge",
    bodyPart: "Legs",
    equipment: ["dumbbell"],
    instructions: [
      "Stand tall holding a dumbbell in each hand with arms at your sides.",
      "Step forward and lower your back knee toward the floor until both knees form roughly 90‑degree angles.",
      "Push through your front foot to return to the starting position and alternate legs."
    ]
  },
  {
    id: 19,
    name: "Goblet Squat",
    bodyPart: "Legs",
    equipment: ["dumbbell", "kettlebell"],
    instructions: [
      "Hold a dumbbell or kettlebell vertically at chest height with both hands.",
      "Squat down by bending at the hips and knees while keeping your chest up and elbows pointed down.",
      "Drive through your heels to stand back up, maintaining a neutral spine throughout."
    ]
  },
  {
    id: 20,
    name: "Kettlebell Swing",
    bodyPart: "Legs",
    equipment: ["kettlebell"],
    instructions: [
      "Stand with feet slightly wider than shoulder‑width and hold a kettlebell with both hands.",
      "Hinge at your hips to swing the kettlebell between your legs, keeping your back flat.",
      "Thrust your hips forward to swing the kettlebell up to chest height, then allow it to swing back between your legs for the next rep."
    ]
  },
  {
    id: 21,
    name: "Bodyweight Lunge",
    bodyPart: "Legs",
    equipment: ["body weight"],
    instructions: [
      "Stand with feet hip‑width apart.",
      "Step forward and lower your hips until both knees are bent at about 90 degrees.",
      "Push through your front foot to return to the starting position and repeat with the other leg."
    ]
  },
  {
    id: 22,
    name: "Hip Thrust",
    bodyPart: "Legs",
    equipment: ["barbell"],
    instructions: [
      "Sit on the floor with your upper back against a bench and roll a barbell over your hips.",
      "Drive through your heels to lift your hips until your torso and thighs are parallel to the floor.",
      "Pause at the top, then lower your hips back down under control."
    ]
  },
  // Arms
  {
    id: 23,
    name: "Barbell Biceps Curl",
    bodyPart: "Arms",
    equipment: ["barbell"],
    instructions: [
      "Stand with your torso upright and grasp the barbell with an underhand grip at shoulder width.",
      "Curl the bar toward your shoulders by bending your elbows while keeping your upper arms stationary.",
      "Lower the bar back down until your arms are fully extended."
    ]
  },
  {
    id: 24,
    name: "Dumbbell Hammer Curl",
    bodyPart: "Arms",
    equipment: ["dumbbell"],
    instructions: [
      "Stand with a dumbbell in each hand, palms facing your torso (neutral grip).",
      "Keeping your elbows close to your sides, curl the weights up toward your shoulders.",
      "Lower the dumbbells back down to the starting position under control."
    ]
  },
  {
    id: 25,
    name: "Kettlebell Curl",
    bodyPart: "Arms",
    equipment: ["kettlebell"],
    instructions: [
      "Stand with your feet hip‑width apart holding kettlebells by the handles with palms facing forward.",
      "Curl the weights toward your shoulders while keeping your elbows stationary.",
      "Lower the kettlebells back to the starting position with control."
    ]
  },
  {
    id: 26,
    name: "Tricep Dips",
    bodyPart: "Arms",
    equipment: ["body weight"],
    instructions: [
      "Place your hands on parallel bars or the edge of a sturdy chair behind you and extend your legs forward.",
      "Lower your body by bending your elbows until your upper arms are about parallel to the floor.",
      "Press through your hands to straighten your arms and return to the starting position."
    ]
  },
  {
    id: 27,
    name: "Skull Crusher",
    bodyPart: "Arms",
    equipment: ["barbell"],
    instructions: [
      "Lie on a bench holding a barbell with arms extended above your chest.",
      "Keeping your elbows pointed forward, lower the bar toward your forehead by bending your elbows.",
      "Extend your arms to return the bar to the starting position."
    ]
  },
  {
    id: 28,
    name: "Dumbbell Tricep Extension",
    bodyPart: "Arms",
    equipment: ["dumbbell"],
    instructions: [
      "Hold a single dumbbell with both hands and extend it overhead.",
      "Keeping your elbows close to your head, lower the weight behind your head by bending at the elbows.",
      "Extend your arms to raise the weight back overhead."
    ]
  },
  // Core
  {
    id: 29,
    name: "Plank",
    bodyPart: "Core",
    equipment: ["body weight"],
    instructions: [
      "Place your forearms on the floor with elbows under your shoulders and legs extended behind you.",
      "Engage your core and keep your body in a straight line from head to heels.",
      "Hold this position while breathing steadily for the prescribed time."
    ]
  },
  {
    id: 30,
    name: "Russian Twist",
    bodyPart: "Core",
    equipment: ["dumbbell", "kettlebell"],
    instructions: [
      "Sit on the floor with knees bent and feet hovering slightly off the ground, holding a weight with both hands.",
      "Lean back slightly and rotate your torso to one side, bringing the weight beside your hip.",
      "Rotate to the opposite side, keeping your core engaged."
    ]
  },
  {
    id: 31,
    name: "Barbell Rollout",
    bodyPart: "Core",
    equipment: ["barbell"],
    instructions: [
      "Kneel on the floor with a barbell in front of you and grasp the bar with both hands.",
      "Roll the bar forward, extending your hips and arms while keeping your core braced.",
      "Roll back to the starting position by pulling with your core and lats."
    ]
  },
  {
    id: 32,
    name: "Hanging Leg Raise",
    bodyPart: "Core",
    equipment: ["body weight"],
    instructions: [
      "Hang from a pull‑up bar with your legs straight and toes pointed.",
      "Engage your core to raise your legs until they are parallel to the floor or higher.",
      "Lower your legs back down under control and repeat."
    ]
  },
  {
    id: 33,
    name: "Sit‑Up",
    bodyPart: "Core",
    equipment: ["body weight"],
    instructions: [
      "Lie on your back with knees bent and feet flat on the floor.",
      "Place your hands across your chest or behind your head and curl your torso up toward your thighs.",
      "Lower back down with control."
    ]
  },
  {
    id: 34,
    name: "Kettlebell Windmill",
    bodyPart: "Core",
    equipment: ["kettlebell"],
    instructions: [
      "Press a kettlebell overhead with one hand and stand with feet wider than shoulder‑width, toes slightly turned out.",
      "Keeping the kettlebell arm locked, hinge at your hips and reach your free hand down toward the opposite ankle.",
      "Maintain eye contact with the kettlebell as you return to the standing position and repeat on both sides."
    ]
  }
];

// Keep track of the current workout so exercises can be swapped out on demand.
let currentWorkout = [];

// Utility: randomly choose an element from an array
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Derive the selected equipment from the form. If the 'gym' option is
// selected all equipment types will be considered available.
function getSelectedEquipment() {
  const checkboxes = document.querySelectorAll('input[name="equipment"]');
  const selected = [];
  let gymSelected = false;
  checkboxes.forEach(cb => {
    if (cb.checked) {
      if (cb.value === 'gym') {
        gymSelected = true;
      } else {
        selected.push(cb.value);
      }
    }
  });
  if (gymSelected) {
    // When gym is selected we make all equipment available
    return ['barbell','dumbbell','kettlebell','body weight'];
  }
  return selected.length ? selected : ['body weight'];
}

// Determine how many supersets to include based on the workout duration and
// number of exercises per superset. Durations are expressed in minutes.
function calcSupersetCount(duration, size) {
  const dur = parseInt(duration, 10);
  const ss = parseInt(size, 10);
  // Basic heuristic: 45 min -> 6 supersets of 2 exercises or 5 supersets of 3
  // 60 min -> 8 supersets of 2 exercises or 6 supersets of 3
  if (dur <= 45) {
    return ss === 2 ? 6 : 5;
  }
  return ss === 2 ? 8 : 6;
}

// Filter the exercise catalogue by the user’s equipment choices. Only
// exercises whose equipment list intersects with the selected equipment are
// returned.
function filterExercisesByEquipment(selectedEquipment) {
  return EXERCISES.filter(ex => {
    return ex.equipment.some(eq => selectedEquipment.includes(eq));
  });
}

// Assemble a single superset by randomly selecting exercises from the
// filtered pool. Each exercise in a superset must target a different
// body part to maintain variety. If not enough unique body parts remain
// the function will relax the uniqueness requirement.
function createSuperset(pool, size, usedExercises) {
  const superset = [];
  const usedBodyParts = new Set();
  let attempts = 0;
  while (superset.length < size && attempts < 100) {
    const candidate = randomChoice(pool);
    if (!usedExercises.has(candidate.id)) {
      if (!usedBodyParts.has(candidate.bodyPart) || attempts > 50) {
        superset.push(candidate);
        usedBodyParts.add(candidate.bodyPart);
        usedExercises.add(candidate.id);
      }
    }
    attempts++;
  }
  // If for some reason we couldn't fill the superset with unique body parts,
  // fill the remaining slots with any available exercises.
  attempts = 0;
  while (superset.length < size && attempts < 100) {
    const candidate = randomChoice(pool);
    if (!usedExercises.has(candidate.id)) {
      superset.push(candidate);
      usedExercises.add(candidate.id);
    }
    attempts++;
  }
  return superset;
}

// Generate the full workout: a list of supersets. The function clears the
// existing workout and rebuilds it based on the selected settings. Once
// generated, the workout is rendered to the DOM.
function generateWorkout() {
  const selectedEquipment = getSelectedEquipment();
  const duration = document.getElementById('duration').value;
  const size = document.getElementById('supersetSize').value;
  const supersetCount = calcSupersetCount(duration, size);
  // Filter exercises by equipment
  const pool = filterExercisesByEquipment(selectedEquipment);
  // Use a set to avoid repeating the exact same exercise too often
  const usedExercises = new Set();
  currentWorkout = [];
  for (let i = 0; i < supersetCount; i++) {
    const superset = createSuperset(pool, parseInt(size, 10), usedExercises);
    currentWorkout.push(superset);
  }
  renderWorkout();
}

// Replace a specific exercise within a given superset. It attempts to find
// another exercise that matches the original exercise’s body part and the
// available equipment. If none are found, it falls back to any exercise in
// the pool.
function redoExercise(supersetIndex, exerciseIndex) {
  const selectedEquipment = getSelectedEquipment();
  const pool = filterExercisesByEquipment(selectedEquipment);
  const original = currentWorkout[supersetIndex][exerciseIndex];
  // Filter pool to match the same body part and equipment
  let candidates = pool.filter(ex => ex.bodyPart === original.bodyPart);
  // Further filter by overlapping equipment
  candidates = candidates.filter(ex => ex.equipment.some(eq => original.equipment.includes(eq)));
  if (candidates.length === 0) {
    // Fallback to any exercise with same body part
    candidates = pool.filter(ex => ex.bodyPart === original.bodyPart);
  }
  if (candidates.length === 0) {
    // Fallback to entire pool
    candidates = pool;
  }
  // Remove currently used exercises to minimise repeats
  const usedIds = new Set(currentWorkout.flat().map(ex => ex.id));
  const available = candidates.filter(c => !usedIds.has(c.id));
  const replacementPool = available.length ? available : candidates;
  const replacement = randomChoice(replacementPool);
  // Replace and re-render
  currentWorkout[supersetIndex][exerciseIndex] = replacement;
  renderWorkout();
}

// Render the current workout to the DOM. Creates superset containers and
// attaches redo listeners to each exercise.
function renderWorkout() {
  const workoutEl = document.getElementById('workout');
  // Clear previous content
  workoutEl.innerHTML = '';
  currentWorkout.forEach((superset, supersetIdx) => {
    const supersetDiv = document.createElement('div');
    supersetDiv.className = 'superset';
    const heading = document.createElement('h2');
    heading.textContent = `Superset ${supersetIdx + 1}`;
    supersetDiv.appendChild(heading);
    superset.forEach((exercise, exerciseIdx) => {
      const exerciseRow = document.createElement('div');
      exerciseRow.className = 'exercise';
      const infoDiv = document.createElement('div');
      const nameEl = document.createElement('div');
      nameEl.className = 'exercise-name';
      nameEl.textContent = exercise.name;
      const detailsEl = document.createElement('div');
      detailsEl.className = 'exercise-details';
      detailsEl.textContent = `${exercise.bodyPart} • ${exercise.equipment.join(', ')}`;
      infoDiv.appendChild(nameEl);
      infoDiv.appendChild(detailsEl);
      // Add instructions for each exercise, if available
      if (exercise.instructions && exercise.instructions.length > 0) {
        const instrEl = document.createElement('div');
        instrEl.className = 'exercise-instr';
        // Join instructions into a multi-line string with numbered steps
        instrEl.innerHTML = exercise.instructions
          .map((step, idx) => `<strong>Step ${idx + 1}:</strong> ${step}`)
          .join('<br>');
        infoDiv.appendChild(instrEl);
      }
      exerciseRow.appendChild(infoDiv);
      // Redo button
      const redoBtn = document.createElement('button');
      redoBtn.className = 'redo-btn';
      redoBtn.textContent = 'Redo';
      redoBtn.addEventListener('click', () => {
        redoExercise(supersetIdx, exerciseIdx);
      });
      exerciseRow.appendChild(redoBtn);
      supersetDiv.appendChild(exerciseRow);
    });
    workoutEl.appendChild(supersetDiv);
  });
}

// Wire up the generate button
document.getElementById('generateBtn').addEventListener('click', generateWorkout);

// Generate an initial workout on page load for convenience
window.addEventListener('DOMContentLoaded', generateWorkout);