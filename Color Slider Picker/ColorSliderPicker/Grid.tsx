import * as React from 'react';
import { useId } from '@fluentui/react-hooks';
import { IColorCellProps, SwatchColorPicker } from '@fluentui/react/lib/SwatchColorPicker';
import { TextField } from '@fluentui/react/lib/TextField';

export interface IPropColor{
    id: string;
    label: string;
    color: string;
}
export interface GridProps {
    cellSize: number;
    numberOfColumns: number;
    colors: IPropColor[];
}

export const SwatchColorPickerComponent = React.memo((props: GridProps) => {
    const {
        cellSize,
        numberOfColumns,
        colors,
    } = props;


    const [previewColor, setPreviewColor] = React.useState<string>();
    const [textValue, setTextValue] = React.useState<string>('');
    const baseId = useId('colorpicker');

    console.log("textValue ", textValue);

    const swatchColorPickerOnCellHovered = (id?: string, color?: string) => {
        if (color) {
            setPreviewColor(color);
        }
    };

    const onChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setTextValue(newValue || '');  
    };

    const handleOnclick = (e: React.MouseEvent) => {
        setPreviewColor(previewColor);
    }

    return (
        <div 
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '24px',
            }}
        >
            <div
                style={{
                    flex: '1',
                    textAlign: 'left',
                    width: '100px',
                }}
            >
                <TextField 
                    underlined 
                    placeholder="Enter text here"
                    value={textValue}
                    onChange={onChange}
                    styles={{
                        field: {
                            color: previewColor,
                            fontSize: '24px',
                            fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
                            lineHeight: '1.5',
                        }
                    }}
                /> 
            </div>
            
            <div
                style={{
                    flex: '1',
                    textAlign: 'right',
                    marginLeft: '200px',
                }}
                onClick={handleOnclick}
            >
                <SwatchColorPicker
                    onCellFocused={swatchColorPickerOnCellHovered}
                    columnCount={numberOfColumns}
                    cellShape={'circle'}
                    cellHeight={cellSize}
                    cellWidth={cellSize}
                    cellBorderWidth={3}
                    colorCells={colors}
                    aria-labelledby={`${baseId}-grid`}
                />
            </div>
            
        </div>
    );
});