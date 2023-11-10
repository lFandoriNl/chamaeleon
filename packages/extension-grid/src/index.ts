import { Row } from './row';
import { Column } from './column';
import { ColumnsTemplate } from './columns-template';

export const GridPack = [Row(), Column(), ColumnsTemplate()] as const;
export { Row, Column, ColumnsTemplate };
