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

  override components = [
    new Row([new RuntimeInput()]),
    new Row([new CodeInput()]),
    new Row([new ArgumentsInput()]),
    new Row([new InputInput()]),
  ];
  public constructor(defaultValues: Record<string, string | undefined> = {}) {
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
  override customId = 'evaluate:edit';
  override title = 'Edit Evaluation';
}

class RuntimeInput extends TextInput {
  customId = 'runtime';
  label = 'Runtime';
  override placeholder = 'The runtime in which the code is written.';
  override style = TextInputStyle.Short;
  override minLength = 1;
  override maxLength = 100;
  override required = true;
}

class CodeInput extends TextInput {
  customId = 'code';
  label = 'Code';
  override placeholder = 'The source code to evaluate.';
  override style = TextInputStyle.Paragraph;
  override minLength = 1;
  override maxLength = 4000;
  override required = true;
}

class ArgumentsInput extends TextInput {
  customId = 'args';
  label = 'Arguments';
  override placeholder =
    'Additional command line arguments to pass to the program.';
  override style = TextInputStyle.Paragraph;
  override minLength = 1;
  override maxLength = 500;
  override required = false;
}

class InputInput extends TextInput {
  customId = 'input';
  label = 'Input';
  override placeholder = 'The STDIN input to provide to the program.';
  override style = TextInputStyle.Paragraph;
  override minLength = 1;
  override maxLength = 500;
  override required = false;
}
