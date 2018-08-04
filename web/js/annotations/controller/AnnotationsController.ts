import {DialogWindowOptions, Resource, ResourceType} from '../../ui/dialog_window/DialogWindow';
import {DialogWindowClient} from '../../ui/dialog_window/DialogWindowClient';
import {Logger} from '../../logger/Logger';
import {TriggerEvent} from '../../contextmenu/TriggerEvent';
import {Nullable} from '../../util/ts/Nullable';

const log = Logger.create();

/**
 * Controller used to listen for the context menu (and key bindings) for
 * creating specific annotation types.
 *
 * @ElectronMainContext
 */
export class AnnotationsController {

    flashcardDialogWindow = new Nullable<DialogWindowClient>();

    async start(): Promise<void> {

        window.addEventListener("message", event => this.onMessageReceived(event), false);

        let dialogWindowClient = await this.createFlashcardDialogWindow();
        this.flashcardDialogWindow.set(dialogWindowClient);

    }

    private onMessageReceived(event: any) {

        let data = event.data;

        // TODO: refactor this to use IPC and make the api have
        // /api/context-menu in it so that it's obvious that we're responding
        // to context menu events

        if(data) {

            if(data.type === 'create-flashcard') {

                let triggerEvent = TriggerEvent.create(event.data);

                log.info("Creating flashcard from trigger event: ", triggerEvent);

                //FIXME: add this back in,... let createFlashcardRequest = new CreateFlashcardRequest(triggerEvent.docDescriptor);

                // TODO: narrow this down to the right annotation were creating
                // this with and also attach the

                this.createFlashcard()
                    .catch(err => log.error("Could not create flashcard: ", err));

            }

        }

    }

    /**
     * Create a new flashcard.
     */
    private async createFlashcard() {

        // FIXME: now send a message to the card creator that we're going to
        // create a new flashcard.

        //log.info("Creating flashcard with triggerEvent: ", createFlashcardRequest);

        // we need to tell the annotation controller about the new highlight.

        await this.flashcardDialogWindow.get().show();

    }

    private async createFlashcardDialogWindow(): Promise<DialogWindowClient> {

        let appPath = "./apps/card-creator/index.html";

        let resource = new Resource(ResourceType.FILE, appPath);
        let options = new DialogWindowOptions(resource);
        options.show = false;

        return await DialogWindowClient.create(options);

    }

}
