/**
 * Simple signaling service to communicate between screens
 * without using complex state management or EventEmitter.
 */
class TaskSignal {
    private _shouldRefresh = false;

    get shouldRefresh() {
        return this._shouldRefresh;
    }

    set shouldRefresh(value: boolean) {
        this._shouldRefresh = value;
    }
}

export const taskSignal = new TaskSignal();
