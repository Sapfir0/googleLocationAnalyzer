export default class WorkerBuilder extends Worker {
    constructor(worker: () => void) {
        super(worker as any);
        const code = worker.toString();
        const blob = new Blob([`(${code})()`]);
        return new Worker(URL.createObjectURL(blob));
    }
}
