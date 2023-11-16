import { Input } from '@chamaeleon/uikit';

import { Plugin } from '../state';

const margins = [
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
] as const;

export function Margin(): Plugin {
  return {
    name: 'margin-style',

    apply(editor, { addStyleView }) {
      addStyleView({
        name: 'margin',
        filter: (styleSpec) => {
          return ['margin', ...margins].some((property) => {
            return property in styleSpec;
          });
        },
        component: ({ layer, style, styleSpec, block }) => {
          const getInputs = (isShowAll: boolean) => {
            return margins
              .filter((marginName) => {
                return isShowAll ? true : marginName in styleSpec;
              })
              .map((marginName, index) => {
                if (isShowAll) {
                  const marginArray =
                    typeof style.margin === 'string'
                      ? style.margin.split(' ')
                      : Array(4)
                          .fill(style.margin)
                          .map((margin) => margin + 'px');

                  const withPxIfNecessary = (value: string) => {
                    if (!value) return value;

                    if (String(parseFloat(value)) === value) {
                      return value + 'px';
                    }

                    return value;
                  };

                  return (
                    <Input
                      key={marginName}
                      className="max-w-[90px]"
                      placeholder={marginName}
                      value={String(marginArray[index].replace('px', '') || '')}
                      onChange={(event) => {
                        const { value } = event.currentTarget;

                        marginArray[index] = (
                          withPxIfNecessary(value) || '0px'
                        ).trim();

                        editor.commands.changeStyle(block.id, layer, {
                          margin: marginArray.slice(0, 4).join(' '),
                        });
                      }}
                    />
                  );
                }

                return (
                  <Input
                    key={marginName}
                    className="max-w-[90px]"
                    placeholder={marginName}
                    value={String(style[marginName] || '')}
                    onChange={(event) => {
                      editor.commands.changeStyle(block.id, layer, {
                        [marginName]: event.currentTarget.value || '0px',
                      });
                    }}
                  />
                );
              });
          };

          return (
            <div>
              <p className="mb-2">Margin</p>

              <div className="space-x-2">
                {getInputs('margin' in styleSpec)}
              </div>
            </div>
          );
        },
      });
    },
  };
}

// set
// {
//   margin: undefined | 0;
// }

// use
// {
//   margin?: 0;
// }

// use in plugin
// {
//   margin: 0 | null;
// }
