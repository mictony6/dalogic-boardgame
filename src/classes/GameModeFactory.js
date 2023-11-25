/**
 * Enum for game modes
 */
export default class GameModeFactory {
    PlayerVsPlayer = 0;

    PlayerVsAI = 1;

    AIVsAI = 2;

    constructor() {
        Object.freeze(this);
    }
}
