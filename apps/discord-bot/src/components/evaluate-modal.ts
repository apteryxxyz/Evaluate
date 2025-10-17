import {
  Label,
  Modal,
  type ModalInteraction,
  TextInput,
  TextInputStyle,
} from '@buape/carbon';
import { sayable } from '@sayable/carbon';
import type { Sayable } from 'sayable';
import { handleEvaluating } from '~/handlers/evaluate';
import { getInteractionContext } from '~/helpers/session-context';
import { captureEvent } from '~/services/posthog';

export class EvaluateModal extends sayable(Modal) {
  customId = 'evaluate,new';
  constructor(say: Sayable, values?: Record<string, string | undefined>) {
    super({
      title: say`Evaluate`,
      components: [
        new RuntimeLabel(say, values?.runtime),
        new CodeLabel(say, values?.code),
        new ArgumentsLabel(say, values?.args),
        new InputLabel(say, values?.input),
      ],
    });
  }

  async run(submit: ModalInteraction) {
    captureEvent(getInteractionContext(submit.rawData), 'submitted_modal', {
      modal_id: this.customId,
    });

    const runtime = submit.fields.getText('runtime', true);
    const code = submit.fields.getText('code', true);
    const args = submit.fields.getText('args');
    const input = submit.fields.getText('input');

    return handleEvaluating(submit, runtime, { code, args, input });
  }
}

export class EvaluateModalEdit extends EvaluateModal {
  customId = 'evaluate,edit';
  constructor(say: Sayable, values?: Record<string, string | undefined>) {
    super(say, values);
    Reflect.set(this, 'title', say`Edit Evaluation`);
  }
}

class RuntimeTextInput extends sayable(TextInput) {
  customId = 'runtime';
  constructor(say: Sayable, value?: string) {
    super({ placeholder: say`The runtime in which the code is written.` });
    if (value) this.value = value;
  }
  style = TextInputStyle.Short;
  minLength = 1;
  maxLength = 100;
  required = true;
}

class RuntimeLabel extends sayable(Label) {
  constructor(say: Sayable, value?: string) {
    super({ label: say`Runtime` }, new RuntimeTextInput(say, value));
  }
}

class CodeTextInput extends sayable(TextInput) {
  customId = 'code';
  constructor(say: Sayable, value?: string) {
    super({ placeholder: say`The source code to evaluate.` });
    if (value) this.value = value;
  }
  style = TextInputStyle.Paragraph;
  minLength = 1;
  maxLength = 4000;
  required = true;
}

class CodeLabel extends sayable(Label) {
  constructor(say: Sayable, value?: string) {
    super({ label: say`Code` }, new CodeTextInput(say, value));
  }
}

class ArgumentsTextInput extends sayable(TextInput) {
  customId = 'args';
  constructor(say: Sayable, value?: string) {
    super({
      placeholder: say`Additional command line arguments to pass to the program.`,
    });
    if (value) this.value = value;
  }
  style = TextInputStyle.Short;
  minLength = 0;
  maxLength = 500;
  required = false;
}

class ArgumentsLabel extends sayable(Label) {
  constructor(say: Sayable, value?: string) {
    super({ label: say`CLI Arguments` }, new ArgumentsTextInput(say, value));
  }
}

class InputTextInput extends sayable(TextInput) {
  customId = 'input';
  constructor(say: Sayable, value?: string) {
    super({ placeholder: say`The STDIN input to provide to the program.` });
    if (value) this.value = value;
  }
  style = TextInputStyle.Short;
  minLength = 0;
  maxLength = 500;
  required = false;
}

class InputLabel extends sayable(Label) {
  constructor(say: Sayable, value?: string) {
    super({ label: say`STDIN` }, new InputTextInput(say, value));
  }
}
