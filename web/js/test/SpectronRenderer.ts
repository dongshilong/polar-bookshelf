import {TestResultService} from './results/TestResultService';
import {MainTestResultWriter} from './results/writer/MainTestResultWriter';
import {BrowserWindow} from "electron";
import {RendererTestResultWriter} from './results/writer/RendererTestResultWriter';

export class SpectronRenderer {

    static setup() {
        new TestResultService().start();
    }

    static start(callback: RunCallback): Promise<void> {
        SpectronRenderer.setup();
        let testResultWriter = new RendererTestResultWriter();
        let state = new SpectronRendererState(testResultWriter);
        return callback(state);
    }

    static run(callback: RunCallback) {
        this.start(callback)
            .catch(err => console.error(err));
    }

}

export interface RunCallback {
    (state: SpectronRendererState): Promise<void>
}


export class SpectronRendererState {

    public readonly testResultWriter: RendererTestResultWriter;

    constructor(testResultWriter: RendererTestResultWriter) {
        this.testResultWriter = testResultWriter;
    }

}