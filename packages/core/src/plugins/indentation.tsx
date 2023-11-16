import { Input } from '@chamaeleon/uikit';

import { Plugin, PluginStyleView } from '../state';

const withPxIfNecessary = (value: string) => {
  if (!value) return value;

  if (String(parseFloat(value)) === value) {
    return value + 'px';
  }

  return value;
};

const emptyIfZero = (value: string) => {
  if (!value) return value;

  return parseFloat(value) === 0 ? '' : value;
};

function createIndentationView(
  indentationMain: keyof React.CSSProperties,
  indentations: Array<keyof React.CSSProperties>,
): PluginStyleView {
  return {
    name: indentationMain,
    filter: (styleSpec) => {
      return [indentationMain, ...indentations].some((property) => {
        return property in styleSpec;
      });
    },
    component: ({ layer, style, styleSpec, block, editor }) => {
      const getInputs = (isShowAll: boolean) => {
        return indentations
          .filter((indentation) => {
            return isShowAll ? true : indentation in styleSpec;
          })
          .map((indentation, index) => {
            if (isShowAll) {
              const indentationsParsed =
                typeof style[indentationMain] === 'string'
                  ? String(style[indentationMain]).split(' ')
                  : Array(4).fill(style[indentationMain] || '0px');

              return (
                <Input
                  key={indentation}
                  className="max-w-[90px]"
                  placeholder={indentation.replace(indentationMain, '')}
                  value={String(
                    emptyIfZero(indentationsParsed[index]).replace('px', '') ||
                      '',
                  )}
                  onChange={(event) => {
                    indentationsParsed[index] =
                      withPxIfNecessary(event.currentTarget.value.trim()) ||
                      '0px';

                    editor.commands.changeStyle(block.id, layer, {
                      [indentationMain]: indentationsParsed
                        .slice(0, 4)
                        .join(' '),
                    });
                  }}
                />
              );
            }

            return (
              <Input
                key={indentation}
                className="max-w-[90px]"
                placeholder={indentation.replace(indentationMain, '')}
                value={emptyIfZero(
                  String(style[indentation] || '').replace('px', ''),
                )}
                onChange={(event) => {
                  editor.commands.changeStyle(block.id, layer, {
                    [indentation]:
                      withPxIfNecessary(event.currentTarget.value.trim()) ||
                      '0px',
                  });
                }}
              />
            );
          });
      };

      return (
        <div>
          <p className="mb-2 capitalize">{indentationMain}</p>

          <div className="space-x-2">
            {getInputs(indentationMain in styleSpec)}
          </div>
        </div>
      );
    },
  };
}

export function Indentation(): Plugin {
  return {
    name: 'indentation-style',

    apply(editor, { addStyleView }) {
      addStyleView(
        createIndentationView('margin', [
          'marginTop',
          'marginRight',
          'marginBottom',
          'marginLeft',
        ]),
      );

      addStyleView(
        createIndentationView('padding', [
          'paddingTop',
          'paddingRight',
          'paddingBottom',
          'paddingLeft',
        ]),
      );
    },
  };
}
