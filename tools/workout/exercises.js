// This file contains a catalogue of exercises used by the workout generator.
// Each entry defines the primary muscle group targeted, a short description
// based on reputable sources, the equipment required, push/pull classification,
// the region of the body it focuses on, the environments it can be performed in
// (home or gym) and a link to a video demonstration.

const exercises = [
  {
    id: 'bench_press',
    name: 'Bench Press',
    muscleGroup: 'Chest',
    description: 'A compound pressing movement that works the chest (pectorals), front shoulders (anterior deltoids) and triceps【887133560323093†L49-L64】.',
    equipment: ['barbell', 'bench'],
    pushPull: 'push',
    bodyRegion: 'upper',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=gRVjAtPip0Y'
  },
  {
    id: 'dumbbell_chest_press',
    name: 'Dumbbell Chest Press',
    muscleGroup: 'Chest',
    description: 'A dumbbell variation of the bench press that targets the pectorals, anterior deltoids and triceps【887133560323093†L49-L64】.',
    equipment: ['dumbbell', 'bench'],
    pushPull: 'push',
    bodyRegion: 'upper',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=VmB1G1K7v94'
  },
  {
    id: 'push_up',
    name: 'Push‑Up',
    muscleGroup: 'Chest',
    description: 'Body‑weight exercise that targets the pectoralis major and minor, triceps and anterior deltoids while engaging the core for stability【3169215331396†L206-L303】.',
    equipment: ['bodyweight'],
    pushPull: 'push',
    bodyRegion: 'upper',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=_l3ySVKYVJ8'
  },
  {
    id: 'incline_push_up',
    name: 'Incline Push‑Up',
    muscleGroup: 'Chest',
    description: 'Push‑up performed with hands elevated on a bench or box; targets the chest and triceps with reduced intensity and engages the core.',
    equipment: ['bodyweight', 'bench'],
    pushPull: 'push',
    bodyRegion: 'upper',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=KcZ5FGX7jd4'
  },
  {
    id: 'dumbbell_fly',
    name: 'Dumbbell Fly',
    muscleGroup: 'Chest',
    description: 'Isolation exercise that stretches and contracts the pectorals through a wide arc, helping to develop chest shape and flexibility.',
    equipment: ['dumbbell', 'bench'],
    pushPull: 'push',
    bodyRegion: 'upper',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=eozdVDA78K0'
  },
  {
    id: 'dip',
    name: 'Dip',
    muscleGroup: 'Chest',
    description: 'Body‑weight exercise performed on parallel bars or a bench; targets the chest, triceps and anterior shoulders depending on torso angle.',
    equipment: ['bodyweight', 'parallel bars'],
    pushPull: 'push',
    bodyRegion: 'upper',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=0326dy_-CzM'
  },
  {
    id: 'bent_over_row',
    name: 'Bent‑Over Row',
    muscleGroup: 'Back',
    description: 'A pulling exercise that primarily works the latissimus dorsi, trapezius, rhomboids and posterior deltoids【903469741117129†L237-L243】.',
    equipment: ['barbell'],
    pushPull: 'pull',
    bodyRegion: 'upper',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=vT2GjY_Umpw'
  },
  {
    id: 'single_arm_row',
    name: 'Single‑Arm Dumbbell Row',
    muscleGroup: 'Back',
    description: 'Variation of the bent‑over row performed one arm at a time; targets the lats, rhomboids and rear shoulders while allowing greater range of motion【903469741117129†L237-L243】.',
    equipment: ['dumbbell', 'bench'],
    pushPull: 'pull',
    bodyRegion: 'upper',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=pYcpY20QaE8'
  },
  {
    id: 'lat_pulldown',
    name: 'Lat Pulldown',
    muscleGroup: 'Back',
    description: 'Machine exercise that targets the back muscles, especially the large latissimus dorsi; grip width can emphasise different parts of the lats, rhomboids and trapezius【191857787843093†L311-L324】.',
    equipment: ['machine'],
    pushPull: 'pull',
    bodyRegion: 'upper',
    environment: ['gym'],
    video: 'https://www.youtube.com/watch?v=CAwf7n6Luuc'
  },
  {
    id: 'pull_up',
    name: 'Pull‑Up',
    muscleGroup: 'Back',
    description: 'Body‑weight pulling movement where you lift your body toward a bar; primarily works the latissimus dorsi, rhomboids, biceps and core for stability.',
    equipment: ['bodyweight', 'pull‑up bar'],
    pushPull: 'pull',
    bodyRegion: 'upper',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
  },
  {
    id: 'seated_cable_row',
    name: 'Seated Cable Row',
    muscleGroup: 'Back',
    description: 'Cable exercise where you pull a handle toward your torso, engaging the middle back, lats, rhomboids and biceps.',
    equipment: ['machine'],
    pushPull: 'pull',
    bodyRegion: 'upper',
    environment: ['gym'],
    video: 'https://www.youtube.com/watch?v=IzoCFhPpO-I'
  },
  {
    id: 'face_pull',
    name: 'Face Pull',
    muscleGroup: 'Back',
    description: 'Cable exercise performed with a rope attachment; strengthens the rear deltoids, upper traps and rotator cuff muscles, promoting shoulder health.',
    equipment: ['machine'],
    pushPull: 'pull',
    bodyRegion: 'upper',
    environment: ['gym'],
    video: 'https://www.youtube.com/watch?v=rep-qVOkqgk'
  },
  {
    id: 'shoulder_press',
    name: 'Shoulder Press',
    muscleGroup: 'Shoulders',
    description: 'Overhead pressing exercise that targets the deltoids, trapezius, serratus anterior and triceps【249590864428750†L130-L176】.',
    equipment: ['barbell', 'dumbbell'],
    pushPull: 'push',
    bodyRegion: 'upper',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=qEwKCR5JCog'
  },
  {
    id: 'lateral_raise',
    name: 'Lateral Raise',
    muscleGroup: 'Shoulders',
    description: 'Isolation movement that lifts dumbbells out to the sides, emphasising the lateral (middle) deltoids.',
    equipment: ['dumbbell'],
    pushPull: 'push',
    bodyRegion: 'upper',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=3VcKaXpzqRo'
  },
  {
    id: 'front_raise',
    name: 'Front Raise',
    muscleGroup: 'Shoulders',
    description: 'Raises a weight in front of the body to target the anterior deltoids and improve shoulder strength.',
    equipment: ['dumbbell'],
    pushPull: 'push',
    bodyRegion: 'upper',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=-t7fuZ0KhDA'
  },
  {
    id: 'reverse_fly',
    name: 'Reverse Fly',
    muscleGroup: 'Shoulders',
    description: 'Bent‑over movement that targets the posterior deltoids and upper back, helping to improve posture and shoulder balance.',
    equipment: ['dumbbell'],
    pushPull: 'pull',
    bodyRegion: 'upper',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=6fF7qGaPzYg'
  },
  {
    id: 'upright_row',
    name: 'Upright Row',
    muscleGroup: 'Shoulders',
    description: 'Pulling the weight vertically up the body to shoulder height activates the traps and side deltoids.',
    equipment: ['barbell', 'dumbbell'],
    pushPull: 'pull',
    bodyRegion: 'upper',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=9efgcAjQe7E'
  },
  {
    id: 'squat',
    name: 'Back Squat',
    muscleGroup: 'Legs',
    description: 'Compound lower‑body exercise that strengthens the quadriceps, hamstrings, glutes and core【657076300076063†L478-L484】.',
    equipment: ['barbell', 'squat rack'],
    pushPull: 'push',
    bodyRegion: 'lower',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=Dy28eq2PjcM'
  },
  {
    id: 'front_squat',
    name: 'Front Squat',
    muscleGroup: 'Legs',
    description: 'Squat variation where the bar rests on the front of the shoulders, shifting emphasis toward the quadriceps and core.',
    equipment: ['barbell'],
    pushPull: 'push',
    bodyRegion: 'lower',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=YOnwtbSIu5A'
  },
  {
    id: 'goblet_squat',
    name: 'Goblet Squat',
    muscleGroup: 'Legs',
    description: 'Holding a kettlebell or dumbbell at the chest, this squat targets the quads and glutes while encouraging good posture.',
    equipment: ['kettlebell', 'dumbbell'],
    pushPull: 'push',
    bodyRegion: 'lower',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=6xwV0Xqf8zk'
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    muscleGroup: 'Legs',
    description: 'Hip‑dominant movement that works the trapezius, glutes, hamstrings, core, hip muscles and lats【909263793633001†L186-L203】.',
    equipment: ['barbell'],
    pushPull: 'pull',
    bodyRegion: 'lower',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=op9kVnSso6Q'
  },
  {
    id: 'romanian_deadlift',
    name: 'Romanian Deadlift',
    muscleGroup: 'Legs',
    description: 'Deadlift variation performed with relatively straight legs to focus on the hamstrings and posterior muscles【909263793633001†L257-L259】.',
    equipment: ['barbell', 'dumbbell'],
    pushPull: 'pull',
    bodyRegion: 'lower',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=2SHsk9AzdjA'
  },
  {
    id: 'lunge',
    name: 'Lunge',
    muscleGroup: 'Legs',
    description: 'Stepping movement that works the quadriceps, glutes and hamstrings while challenging balance.',
    equipment: ['bodyweight', 'dumbbell'],
    pushPull: 'push',
    bodyRegion: 'lower',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=wrwwXE_x-pQ'
  },
  {
    id: 'bulgarian_split_squat',
    name: 'Bulgarian Split Squat',
    muscleGroup: 'Legs',
    description: 'Single‑leg squat with rear foot elevated; targets the quads, glutes and hamstrings, improving unilateral strength and balance.',
    equipment: ['dumbbell', 'bench'],
    pushPull: 'push',
    bodyRegion: 'lower',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=2C-uNgKwPLE'
  },
  {
    id: 'glute_bridge',
    name: 'Glute Bridge',
    muscleGroup: 'Glutes',
    description: 'Body‑weight or weighted exercise that strengthens the gluteus maximus and hamstrings by driving the hips upward.',
    equipment: ['bodyweight', 'barbell'],
    pushPull: 'push',
    bodyRegion: 'lower',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=m2Zx-4PE7Qo'
  },
  {
    id: 'step_up',
    name: 'Step‑Up',
    muscleGroup: 'Legs',
    description: 'Stepping onto a bench or box works the quadriceps and glutes while improving balance and unilateral strength.',
    equipment: ['bodyweight', 'dumbbell', 'bench'],
    pushPull: 'push',
    bodyRegion: 'lower',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=dQqApCGd5Ss'
  },
  {
    id: 'leg_press',
    name: 'Leg Press',
    muscleGroup: 'Legs',
    description: 'Machine‑based movement that targets the quadriceps, glutes and hamstrings by pressing a weighted platform away from the body.',
    equipment: ['machine'],
    pushPull: 'push',
    bodyRegion: 'lower',
    environment: ['gym'],
    video: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ'
  },
  {
    id: 'leg_curl',
    name: 'Leg Curl',
    muscleGroup: 'Legs',
    description: 'Isolation machine exercise that flexes the knee to strengthen the hamstrings.',
    equipment: ['machine'],
    pushPull: 'pull',
    bodyRegion: 'lower',
    environment: ['gym'],
    video: 'https://www.youtube.com/watch?v=1Tq3QdYUuHs'
  },
  {
    id: 'leg_extension',
    name: 'Leg Extension',
    muscleGroup: 'Legs',
    description: 'Machine‑based exercise that isolates the quadriceps by extending the knee against resistance.',
    equipment: ['machine'],
    pushPull: 'push',
    bodyRegion: 'lower',
    environment: ['gym'],
    video: 'https://www.youtube.com/watch?v=YyvSfVjQeL0'
  },
  {
    id: 'bicep_curl',
    name: 'Bicep Curl',
    muscleGroup: 'Arms',
    description: 'Curling a weight toward the shoulders works the biceps brachii primarily and also engages the brachialis and brachioradialis muscles【818450744871574†L121-L145】.',
    equipment: ['dumbbell', 'barbell'],
    pushPull: 'pull',
    bodyRegion: 'upper',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo'
  },
  {
    id: 'hammer_curl',
    name: 'Hammer Curl',
    muscleGroup: 'Arms',
    description: 'Variation of the curl performed with a neutral grip to emphasise the brachioradialis along with the biceps.',
    equipment: ['dumbbell'],
    pushPull: 'pull',
    bodyRegion: 'upper',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=zC3nLlEvin4'
  },
  {
    id: 'tricep_extension',
    name: 'Overhead Tricep Extension',
    muscleGroup: 'Arms',
    description: 'Lifting a weight overhead and lowering it behind the head to isolate and strengthen the triceps.',
    equipment: ['dumbbell'],
    pushPull: 'push',
    bodyRegion: 'upper',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=nRiJVZDpdL0'
  },
  {
    id: 'tricep_dip',
    name: 'Tricep Dip',
    muscleGroup: 'Arms',
    description: 'Body‑weight exercise on parallel bars or a bench that targets the triceps, with assistance from the chest and shoulders.',
    equipment: ['bodyweight', 'parallel bars'],
    pushPull: 'push',
    bodyRegion: 'upper',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=0326dy_-CzM'
  },
  {
    id: 'skull_crusher',
    name: 'Skull Crusher',
    muscleGroup: 'Arms',
    description: 'Lying tricep extension performed with a barbell or dumbbells to focus on the triceps.',
    equipment: ['barbell', 'dumbbell', 'bench'],
    pushPull: 'push',
    bodyRegion: 'upper',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=d_KZxkY_0cM'
  },
  {
    id: 'close_grip_bench_press',
    name: 'Close‑Grip Bench Press',
    muscleGroup: 'Arms',
    description: 'Bench press performed with hands closer together to place greater emphasis on the triceps while still working the chest and shoulders.',
    equipment: ['barbell', 'bench'],
    pushPull: 'push',
    bodyRegion: 'upper',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=EN3JeXKw3zw'
  },
  {
    id: 'plank',
    name: 'Plank',
    muscleGroup: 'Core',
    description: 'Isometric hold that engages the rectus abdominis, obliques and lower back muscles to improve core stability and posture.',
    equipment: ['bodyweight'],
    pushPull: 'push',
    bodyRegion: 'core',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=ASdvN_XEl_c'
  },
  {
    id: 'russian_twist',
    name: 'Russian Twist',
    muscleGroup: 'Core',
    description: 'Rotational core exercise that targets the obliques and abdominal muscles by twisting the torso while holding a weight or bodyweight.',
    equipment: ['bodyweight', 'kettlebell'],
    pushPull: 'pull',
    bodyRegion: 'core',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=wkD8rjkodUI'
  },
  {
    id: 'bicycle_crunch',
    name: 'Bicycle Crunch',
    muscleGroup: 'Core',
    description: 'Alternating elbow‑to‑knee movement that engages the rectus abdominis and oblique muscles while promoting coordination.',
    equipment: ['bodyweight'],
    pushPull: 'pull',
    bodyRegion: 'core',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=Qp9mcLCZgN8'
  },
  {
    id: 'kettlebell_swing',
    name: 'Kettlebell Swing',
    muscleGroup: 'Full Body',
    description: 'Explosive hip‑hinge movement that works the glutes, hamstrings, core and shoulders while building power and cardiovascular fitness.',
    equipment: ['kettlebell'],
    pushPull: 'pull',
    bodyRegion: 'full',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=YSx4W2VeWKg'
  },
  {
    id: 'hanging_leg_raise',
    name: 'Hanging Leg Raise',
    muscleGroup: 'Core',
    description: 'Hanging from a bar and lifting the legs engages the lower abdominals and hip flexors while challenging grip strength.',
    equipment: ['pull‑up bar'],
    pushPull: 'pull',
    bodyRegion: 'core',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=JB2oyawG9KI'
  },
  {
    id: 'cable_woodchop',
    name: 'Cable Woodchop',
    muscleGroup: 'Core',
    description: 'Rotational cable movement that trains the obliques and transverse abdominis by simulating a chopping motion.',
    equipment: ['machine'],
    pushPull: 'pull',
    bodyRegion: 'core',
    environment: ['gym'],
    video: 'https://www.youtube.com/watch?v=Q0FrbJ4ce94'
  },
  {
    id: 'dead_bug',
    name: 'Dead Bug',
    muscleGroup: 'Core',
    description: 'Contralateral limb movement performed lying on the back that improves core stability and coordination.',
    equipment: ['bodyweight'],
    pushPull: 'pull',
    bodyRegion: 'core',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=4ZV25r-0m-A'
  },
  {
    id: 'mountain_climber',
    name: 'Mountain Climber',
    muscleGroup: 'Full Body',
    description: 'Dynamic plank variation where you alternate driving knees toward the chest, working the core, shoulders and legs while elevating heart rate.',
    equipment: ['bodyweight'],
    pushPull: 'pull',
    bodyRegion: 'full',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=nmwgirgXLYM'
  }
,
  {
    id: 'jumping_jacks',
    name: 'Jumping Jacks',
    muscleGroup: 'Cardio',
    description: 'A full-body cardio exercise that involves jumping while spreading the legs and arms out wide and then returning to a position with feet together and arms at the sides.',
    equipment: ['bodyweight'],
    pushPull: 'push',
    bodyRegion: 'full',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8'
  },
  {
    id: 'high_knees',
    name: 'High Knees',
    muscleGroup: 'Cardio',
    description: 'A cardio exercise performed by running in place while lifting the knees as high as possible with each step, engaging the core and increasing heart rate.',
    equipment: ['bodyweight'],
    pushPull: 'push',
    bodyRegion: 'full',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=tx5rgpd5p_I'
  },
  {
    id: 'mountain_climbers',
    name: 'Mountain Climbers',
    muscleGroup: 'Cardio',
    description: 'A dynamic cardio exercise that mimics climbing a mountain by alternating knee drives toward the chest from a plank position, engaging the core and elevating heart rate.',
    equipment: ['bodyweight'],
    pushPull: 'push',
    bodyRegion: 'full',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=nmwgirgXLYM'
  },
  {
    id: 'burpees',
    name: 'Burpees',
    muscleGroup: 'Cardio',
    description: 'A full-body exercise that combines a squat, plank, push-up, and jump, providing both strength and cardiovascular benefits.',
    equipment: ['bodyweight'],
    pushPull: 'push',
    bodyRegion: 'full',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=TU8QYVW0gDU'
  },
  {
    id: 'jump_rope',
    name: 'Jump Rope',
    muscleGroup: 'Cardio',
    description: 'A cardio exercise that involves jumping over a rope swung over the head and under the feet, improving coordination, agility, and cardiovascular fitness.',
    equipment: ['jump rope'],
    pushPull: 'push',
    bodyRegion: 'full',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=FJmRQ5iTXKE'
  },
  {
    id: 'squat_jumps',
    name: 'Squat Jumps',
    muscleGroup: 'Cardio',
    description: 'An explosive cardio exercise that combines a squat with a vertical jump, targeting the lower body muscles while elevating heart rate.',
    equipment: ['bodyweight'],
    pushPull: 'push',
    bodyRegion: 'lower',
    environment: ['home', 'gym'],
    video: 'https://www.youtube.com/watch?v=U4s4mEQ5VqU'
  }
];

// Expose the exercises array to the global scope when running in a browser.
if (typeof window !== 'undefined') {
  window.exercises = exercises;
}

// Export for Node.js environments (e.g. testing).
if (typeof module !== 'undefined') {
  module.exports = exercises;
}