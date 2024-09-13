import * as React  from 'react';
import styled from 'styled-components';
import { TextField } from '@fluentui/react/lib/TextField';

interface propsDiv {
    barHeight: number;
    value: number;
    barWidth: number;
    showValue: boolean;
}

interface props {
    StartColor: string;
    EndColor: string;
    RightColor: string;
    BarHeight: number;
    value: number;
    Orientation: string;
}

interface IPropCoponent {
    StartColor: string;
    EndColor: string;
    RightColor: string;
    BarHeight: number;
    BarWidth: number;
    MinValue: number;
    MaxValue: number;
    ShowValue: boolean;
    Orientation: string;
}


const Slider = styled.input.attrs({ type: 'range', id: 'range'})<props>`
  background: transparent;
  -webkit-appearance: none;
  width: 100%;
  transition: opacity 0.2s;

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    background-image:${(props) => `linear-gradient(${props.Orientation === 'Vertical' ? 'to bottom' : 'to right'}, ${props.StartColor}, ${props.RightColor}, ${props.EndColor})`};
    width: 100%;
    height: 100%;
    border: 0.1rem ridge gray;
    border-sizing: border-box;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 25px;
    height: 25px;
    background: #4CAF50;
    cursor: pointer;
    border-radius: 50%;
  }
`;

const ValueDisplay = styled.div<propsDiv>`
  position: absolute;
  display: ${(props) => props.showValue ? 'flex' : 'none'};
  justify-content: center;
  margin-left: ${(props) => props.value === 0 ? `8px` : `4px`};
  align-items: center;
  left: ${(props) => props.value < 10 ? props.value + 1 : (props.value >= 10 && props.value <= 50 ? props.value - 0.5 : props.value - 1)}%;
  transform: translateX(-50%);
  bottom: 100%;
  background-color: white;
  width: 23px;
  height: 20px;
  font-size: 1rem;
  border-radius: 3px;
  box-shadow: 0 0 5px rgba(0,0,0,0.3);
  margin-bottom: 10px;
`;


const GradientSlider = React.memo((props: IPropCoponent) => {
    const {
        StartColor, 
        EndColor, 
        RightColor, 
        BarHeight,
        BarWidth, 
        MinValue, 
        MaxValue, 
        ShowValue, 
        Orientation 
    } = props

  const [value, setValue] =React.useState(MinValue);
  const [showVal, setShowVal] = React.useState<boolean>(ShowValue);
  const [color, setColor] = React.useState<string>('');

  // const onChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
  //   setTextValue(newValue || '');  
  // };

  
  const interpolateColor = (startColor: string, endColor: string, factor: number) => {
      const result = startColor.slice(1).match(/.{2}/g)!.map((hex, index) => {
          return Math.round(parseInt(hex, 16) + factor * (parseInt(endColor.slice(1).match(/.{2}/g)![index], 16) - parseInt(hex, 16)));
      });
      return `#${result.map(value => value.toString(16).padStart(2, '0')).join('')}`;
  }
  

  const getCurrentColor = (value: number, startColor: string, rightColor: string, endColor:string) => {
    if (value <= 50) {

        return interpolateColor(startColor, rightColor, value / 50);

    } else {
        
        return interpolateColor(rightColor, endColor, (value - 50) / 50);
    }
}

  React.useEffect(() => {
    const color = getCurrentColor(value, StartColor, RightColor, EndColor);
    setColor(color);
    setValue(value);
  }, [value, StartColor, EndColor])

  console.log("BarHeight : ", BarHeight);
  console.log("ShowValue : ", ShowValue);

  return (
    <>
      <Slider
          min={MinValue}
          max={MaxValue}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(Number(e.target.value))}
          StartColor={StartColor}
          EndColor={EndColor}
          RightColor={RightColor}
          BarHeight={BarHeight}
          BarWidth={BarWidth}
          Orientation={Orientation}
          style = {{
            height: "100%",
            width: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
            padding: "10px"
          }}
      >
      </Slider>
      {<ValueDisplay value={(value - MinValue) / (MaxValue - MinValue) * 100} showValue={ShowValue}>{value}</ValueDisplay>}
    </>
  );
});

GradientSlider.displayName = "GradientSlider"

export default GradientSlider;
