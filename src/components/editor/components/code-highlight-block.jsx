import PropTypes from 'prop-types';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';

import './code-highlight-block.css';
import { editorClasses } from '../classes';

// ----------------------------------------------------------------------

export function CodeHighlightBlock({
  node: {
    attrs: { language: defaultLanguage },
  },

  extension,
  updateAttributes,
}) {
  return (
    <NodeViewWrapper className={editorClasses.content.codeBlock}>
      <select
        name="language"
        contentEditable={false}
        defaultValue={defaultLanguage}
        onChange={(event) => updateAttributes({ language: event.target.value })}
        className={editorClasses.content.langSelect}
      >
        <option value="null">auto</option>
        <option disabled>—</option>
        {extension.options.lowlight.listLanguages().map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>

      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
}

CodeHighlightBlock.propTypes = {
  node: PropTypes.object.isRequired,
  extension: PropTypes.object.isRequired,
  updateAttributes: PropTypes.func.isRequired,
};
