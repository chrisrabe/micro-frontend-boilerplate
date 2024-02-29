import { PlainJSComponent } from '../../micro-ui/PlainJSMicroUI';

const TextBox: PlainJSComponent<any> = (_): HTMLElement => {
  const textArea = document.createElement('textarea');
  textArea.placeholder = "Enter some text"
  return textArea;
};

export default TextBox;
