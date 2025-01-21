import {
  Modal,
  type ModalInteraction,
  Row,
  TextInput,
  TextInputStyle,
} from '@buape/carbon';
import { handleEvaluating } from '~/handlers/evaluate';

export class EvaluateModal extends Modal {
  title = 'Evaluate';
  customId = 'evaluate:new';

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

  async run(interaction: ModalInteraction) {
    const runtime = interaction.fields.getText('runtime', true);
    const code = interaction.fields.getText('code', true);
    const args = interaction.fields.getText('args');
    const input = interaction.fields.getText('input');

    return handleEvaluating(interaction, { runtime, code, args, input });
  }
}

export class EvaluateModalEdit extends EvaluateModal {
  customId = 'evaluate:edit';
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
  style = TextInputStyle.Paragraph;
  minLength = 1;
  maxLength = 500;
  required = false;
}

class InputInput extends TextInput {
  customId = 'input';
  label = 'Input';
  placeholder = 'The STDIN input to provide to the program.';
  style = TextInputStyle.Paragraph;
  minLength = 1;
  maxLength = 500;
  required = false;
}
