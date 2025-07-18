import {
  Modal,
  type ModalInteraction,
  Row,
  TextInput,
  TextInputStyle,
} from '@buape/carbon';
import { handleEvaluating } from '~/handlers/evaluate';
import { captureEvent } from '~/services/posthog';
import { getInteractionContext } from '~/utilities/session-context';

export class EvaluateModal extends Modal {
  title = 'Evaluate';
  customId = 'evaluate,new';

  components = [
    new Row([new RuntimeInput()]),
    new Row([new CodeInput()]),
    new Row([new ArgumentsInput()]),
    new Row([new InputInput()]),
  ];
  constructor(defaultValues: Record<string, string | undefined> = {}) {
    super();

    const components = this.components.flatMap((row) => row.components);
    for (const component of components) {
      const value = defaultValues[component.customId];
      if (value) component.value = value;
    }
  }

  async run(submit: ModalInteraction) {
    captureEvent(getInteractionContext(submit.rawData), 'submitted_modal', {
      modal_id: this.customId,
    });

    const runtime = submit.fields.getText('runtime', true);
    const code = submit.fields.getText('code', true);
    const args = submit.fields.getText('args');
    const input = submit.fields.getText('input');

    return handleEvaluating(submit, { runtime, code, args, input });
  }
}

export class EvaluateModalEdit extends EvaluateModal {
  customId = 'evaluate,edit';
  title = 'Edit Evaluation';
}

class RuntimeInput extends TextInput {
  customId = 'runtime';
  label = 'Runtime';
  placeholder = 'The runtime in which the code is written.';
  style = TextInputStyle.Short;
  minLength = 1;
  maxLength = 100;
  required = true;
}

class CodeInput extends TextInput {
  customId = 'code';
  label = 'Code';
  placeholder = 'The source code to evaluate.';
  style = TextInputStyle.Paragraph;
  minLength = 1;
  maxLength = 4000;
  required = true;
}

class ArgumentsInput extends TextInput {
  customId = 'args';
  label = 'Arguments';
  placeholder = 'Additional command line arguments to pass to the program.';
  style = TextInputStyle.Short;
  minLength = 0;
  maxLength = 500;
  required = false;
}

class InputInput extends TextInput {
  customId = 'input';
  label = 'Input';
  placeholder = 'The STDIN input to provide to the program.';
  style = TextInputStyle.Short;
  minLength = 0;
  maxLength = 500;
  required = false;
}
