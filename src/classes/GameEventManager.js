/**
 * Allows to register callbacks for specific events.
 */
export default class GameEventManager {
    listeners = {};

    /**
   * Add an event listener for a specific event type.
   * @param {String} eventName - The event to listen for.
   * @param {Function} callback - The callback function to
   * be invoked when the event occurs.
   */
    on(eventName, callback) {
    // Check if the event type already has listeners
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }

        // Add the listener
        this.listeners[eventName].push(callback);
    }

    /**
   * Remove an event listener for a specific event type.
   * @param {String} eventName - The event to listen for.
   * @param {Function} callback - The callback function to be
   * invoked when the event occurs.
   */
    off(eventName, callback) {
    /**
     * @type {Function[]}
     * */
        const listeners = this.listeners[eventName];
        if (listeners) {
            this.listeners[eventName] = listeners.filter((cb) => cb !== callback);
            if (this.listeners[eventName].length === 0) {
                delete this.listeners[eventName];
            }
        }
    }

    /**
   * Executes all the callbacks listening to the event.
   * @param {GameEvent} event
   */
    trigger(event) {
    /**
     * @type {Function[]}
     */
        const listeners = this.listeners[event.name];

        if (listeners) {
            listeners.forEach((callback) => callback(event));
        }
    }
}
