import * as React from "react";
import { TextField } from '@fluentui/react/lib/TextField';
import styled from 'styled-components';

export interface IPropRGBColor {
    R: number;
    G: number;
    B: number;
}

export interface IColor {
    name: string;
    value: IPropRGBColor;
}

export interface IPropColor{
    colors: IColor[];
    sliderHeight: number;
}

interface props {
    height: number;
    colorPercent: number;
    color: string;
}

interface IPropCoponent {
    StartColor: string;
    EndColor: string;
    RightColor: string;
    BarHeight: number;
    MinValue: number;
    MaxValue: number;
    ShowValue: boolean;
    Orientation: string;
}

const StyledRangeInput = styled.input.attrs({ type: 'range' })<props>`
  background: transparent;
  -webkit-appearance: none;
  width: 100%;
  height: ${props => props.height}px;
  -webkit-tap-highlight-color: transparent;

  &.linearslider:focus {
    outline: none;
  }

  &.linearslider::-webkit-slider-runnable-track {
    background: ${props => `linear-gradient(to right, ${props.color} ${props.colorPercent}%, transparent ${props.colorPercent}%)`};
    width: 100%;
    height: ${props => props.height}px;
    cursor: pointer;
  }

  &.linearslider::-webkit-slider-thumb {
    background: #666;
    border: 0 solid #f00;
    height: ${props => props.height * 12}px;
    width: 10px;
    border-radius: 48px;
    cursor: pointer;
    opacity: 1;
    -webkit-appearance: none;
    margin-top: -12px;
  }

  &.linearslider::-moz-range-track {
    background: #666;
    height: 2px;
    cursor: pointer;
  }

  &.linearslider::-moz-range-thumb {
    background: #666;
    border: 0 solid #f00;
    height: 24px;
    width: 10px;
    border-radius: 48px;
    cursor: pointer;
    opacity: 1;
    -webkit-appearance: none;
    margin-top: -12px;
  }

  &.linearslider::-ms-track {
    background: #666;
    height: 2px;
    cursor: pointer;
  }

  &.linearslider::-ms-thumb {
    background: #666;
    border: 0 solid #f00;
    height: 24px;
    width: 10px;
    border-radius: 48px;
    cursor: pointer;
    opacity: 1;
    -webkit-appearance: none;
  }
`;


function componentToHex(c: number) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
function rgbToHex(r: number , g: number, b: number) {
return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


const ColorSlider = React.memo((props: IPropColor) => {

  const {
    colors,
    sliderHeight
  } = props;

  console.log("rendering component");
  const [sliderValue, setSliderValue] = React.useState(0);
  const [color, setColor] = React.useState(colors[0].value);
  const [textValue, setTextValue] = React.useState<string>('');


  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(Number(event.target.value));
  };

  const onChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    setTextValue(newValue || '');  
  };

  React.useEffect(() => {
    console.log("sliderVlaue : ", sliderValue);
    const range = 100 / (colors.length - 1);
    const index = Math.floor(sliderValue / range);
    const colorStart = colors[index].value;
    const colorEnd = colors[index + 1] ? colors[index + 1].value : colors[index].value;

    const ratio = (sliderValue % range) / range;

    const newColor = {
      R: Math.round(colorStart.R + ratio * (colorEnd.R - colorStart.R)),
      G: Math.round(colorStart.G + ratio * (colorEnd.G - colorStart.G)),
      B: Math.round(colorStart.B + ratio * (colorEnd.B - colorStart.B)),
    };

    setColor(newColor);
  }, [sliderValue, colors]);

  return (
    <div style={{
        display: "flex",
        justifyContent: "center", 
        alignItems: "center",
        width: "100%",
        padding: "20px", 
        margin: "0 auto",
    }}>
        <div style ={{
             width: "40%",
             padding: "20px",
             textAlign: "center",
             margin: "auto 20px auto 10px",
        }}>
            
            <TextField 
                underlined 
                placeholder="Enter text here"
                value={textValue}
                onChange={onChange}
                styles={{
                    field: {
                        color: `rgb(${color.R}, ${color.G}, ${color.B})`,
                        fontSize: '24px',
                        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
                        lineHeight: '1.5',
                    }
                }}
            />
        </div>
        <div style={{
            width: "40%",
            padding: "20px",
            textAlign: "center",
            margin: "auto 5px auto 20px", 
        }}>
            <StyledRangeInput
                className="linearslider"
                min="0"
                max="100"
                value={sliderValue}
                onChange={handleSliderChange}
                style ={{
                    width: "100%",
                    padding: "0",
                    margin: "20px 0 0",
                }}
                height={sliderHeight}
                color={rgbToHex(color.R, color.G, color.B)}
                colorPercent={sliderValue}
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {colors.map((color, index) => (
                        <span 
                            key={index} 
                            style={{background: `${color.name}`, borderRadius: '10px', width: '10px', height: '10px'}}>
                        </span>
                    ))
                }
            </div>
        </div>
    </div>
  );
});

ColorSlider.displayName = "ColorSlider";

export default ColorSlider;

// import * as React from "react";
// import { TextField } from '@fluentui/react/lib/TextField';
// import styled from 'styled-components';

// export interface IPropRGBColor {
//     R: number;
//     G: number;
//     B: number;
// }

// export interface IColor {
//     name: string;
//     value: IPropRGBColor;
// }

// export interface IPropColor{
//     colors: IColor[];
// }

// const StyledRangeInput = styled.input.attrs({ type: 'range' })<IPropRGBColor>`
//   margin: 1px 0;
//   background: transparent;
//   -webkit-appearance: none;
//   width: 100%;
//   padding: 0;
//   height: 24px;
//   -webkit-tap-highlight-color: transparent;

//   &.linearslider:focus {
//     outline: none;
//   }

//   &.linearslider::-webkit-slider-runnable-track {
//     background: #666;
//     height: 2px;
//     cursor: pointer;
//   }

//   &.linearslider::-webkit-slider-thumb {
//     background: ${color => `rgb(${color.R || 102}, ${color.G || 102}, ${color.B || 102})`};
//     border: 0 solid #f00;
//     height: 24px;
//     width: 10px;
//     border-radius: 48px;
//     cursor: pointer;
//     opacity: 1;
//     -webkit-appearance: none;
//     margin-top: -12px;
//   }

//   &.linearslider::-moz-range-track {
//     background: #666;
//     height: 2px;
//     cursor: pointer;
//   }

//   &.linearslider::-moz-range-thumb {
//     background: ${color => `rgb(${color.R || 102}, ${color.G || 102}, ${color.B || 102})`};
//     border: 0 solid #f00;
//     height: 24px;
//     width: 10px;
//     border-radius: 48px;
//     cursor: pointer;
//     opacity: 1;
//     -webkit-appearance: none;
//     margin-top: -12px;
//   }

//   &.linearslider::-ms-track {
//     background: #666;
//     height: 2px;
//     cursor: pointer;
//   }

//   &.linearslider::-ms-thumb {
//     background: ${color => `rgb(${color.R || 102}, ${color.G || 102}, ${color.B || 102})`};
//     border: 0 solid #f00;
//     height: 24px;
//     width: 10px;
//     border-radius: 48px;
//     cursor: pointer;
//     opacity: 1;
//     -webkit-appearance: none;
//   }
// `;

// const Container = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   min-height: 100vh;
//   font-size: calc(10px + 2vmin);
//   padding: 20px;
// `;

// const ColorDots = styled.div`
//   display: flex;
//   justify-content: space-between;
//   width: 100%;
//   padding: 10px 0;
// `;

// const ColorSlider = React.memo((props: IPropColor) => {
//   const {
//     colors,
//   } = props;

//   const [sliderValue, setSliderValue] = React.useState(0);
//   const [color, setColor] = React.useState(colors[0].value);
//   const [textValue, setTextValue] = React.useState<string>('');

//   const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSliderValue(Number(event.target.value));
//   };

//   const onChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
//     setTextValue(newValue || '');  
//   };

//   React.useEffect(() => {
//     const range = 100 / (colors.length - 1);
//     const index = Math.floor(sliderValue / range);
//     const colorStart = colors[index].value;
//     const colorEnd = colors[index + 1] ? colors[index + 1].value : colors[index].value;

//     const ratio = (sliderValue % range) / range;

//     const newColor = {
//       R: Math.round(colorStart.R + ratio * (colorEnd.R - colorStart.R)),
//       G: Math.round(colorStart.G + ratio * (colorEnd.G - colorStart.G)),
//       B: Math.round(colorStart.B + ratio * (colorEnd.B - colorStart.B)),
//     };

//     setColor(newColor);
//   }, [sliderValue, colors]);

//   return (
//     <Container>
//       <TextField 
//         underlined 
//         placeholder="Enter text here"
//         value={textValue}
//         onChange={onChange}
//         styles={{
//           field: {
//             color: `rgb(${color.R}, ${color.G}, ${color.B})`,
//             fontSize: '24px',
//             fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
//             lineHeight: '1.5',
//             marginLeft: '20px',
//             flex: '1'
//           }
//         }}
//       />
//       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1', marginRight: '20px' }}>
//         <StyledRangeInput
//           className="linearslider"
//           min="0"
//           max="100"
//           value={sliderValue}
//           onChange={handleSliderChange}
//           color={color}
//         />
//         <ColorDots>
//           {colors.map((color, index) => (
//             <span 
//               key={index} 
//               style={{
//                 background: `${color.name}`, 
//                 marginRight: index === colors.length - 1 ? '0' : '10px', 
//                 borderRadius: '50%', 
//                 width: '10px', 
//                 height: '10px'
//               }}
//             />
//           ))}
//         </ColorDots>
//       </div>
//     </Container>
//   );
// });

// ColorSlider.displayName = "ColorSlider";

// export default ColorSlider;
