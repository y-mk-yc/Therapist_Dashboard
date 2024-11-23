import {ExerciseSession} from "../store/rehybApi";

export const EXERCISE_STATE_COLORS: Record<ExerciseSession['status'], string> = {
    Finished: 'bg-positive',
    Unfinished: 'bg-middle',
    Skipped: 'bg-negative',
    Planned: 'bg-secondary'
}

// EXERCISE_STATE_COLORS[data.sessionStatus]