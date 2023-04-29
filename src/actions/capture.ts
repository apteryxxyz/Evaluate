import { Action } from 'maclary';
import { buildRenderAttachmentPayload } from '&factories/renderer';

export class CaptureAction extends Action {
    public constructor() {
        super({ id: 'capture' });
    }

    public override async onModalSubmit(modal: Action.ModalSubmit) {
        const code = modal.fields.getTextInputValue('code');

        const rawLang = modal.fields.getTextInputValue('language') ?? '';
        const language = rawLang
            ? await this.container.executor.findLanguage(rawLang)
            : undefined;

        const [, action, ...args] = modal.customId.split(',');

        if (action === 'create') {
            const theme = this.container.renderer.resolveTheme(args[0]);
            const mode = this.container.renderer.resolveMode(args[1]);

            await modal.deferReply();
            const image = await this.container.renderer.createRender(
                { language, code, theme, mode },
                modal.user.id
            );

            const payload = buildRenderAttachmentPayload(image);
            return modal.editReply(payload);
        }

        return void 0;
    }
}
