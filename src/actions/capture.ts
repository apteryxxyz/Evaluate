import { Action } from 'maclary';
import { CaptureBuilder } from '&builders/CaptureBuilder';

export class CaptureAction extends Action {
    public constructor() {
        super({ id: 'capture' });
    }

    public override async onModalSubmit(modal: Action.ModalSubmit) {
        const code = modal.fields.getTextInputValue('code');

        const rawLang = modal.fields.getTextInputValue('language') ?? '';
        const language = rawLang
            ? await this.container.executor.resolveLanguage(rawLang)
            : undefined;

        const [, action, ...args] = modal.customId.split(',');

        if (action === 'create') {
            const theme = this.container.capture.resolveTheme(args[0]);
            const mode = this.container.capture.resolveMode(args[1]);

            await modal.deferReply();
            const payload = await CaptureBuilder.buildCapturePayload(
                modal.user.id,
                { language, code, theme, mode }
            );
            return modal.editReply(payload);
        }

        return void 0;
    }
}
