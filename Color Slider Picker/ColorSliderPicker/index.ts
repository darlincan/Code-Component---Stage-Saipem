import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
//import ColorSlider from './ColorSlider';
import { IPropRGBColor, IPropColor, IColor } from './ColorSlider';
import GradientSlider  from './GradientSlider';

export class ColorSliderPicker implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    
    notifyOutputChanged: () => void;
    container: HTMLDivElement;
    context: ComponentFramework.Context<IInputs>
    isTestHarness: boolean;
    colors: IPropColor;
    compteur: number = 0;
    barHeightBase: number;
    barWidthBase: number;
    baseAllColors = new Map([
        ["aliceblue" , {R:240,G:248,B:255}],
        ["antiquewhite" , {R:250,G:235,B:215}],
        ["aqua" , {R:0,G:255,B:255}],
        ["aquamarine" , {R:127,G:255,B:212}],
        ["azure" , {R:240,G:255,B:255}],
        ["beige" , {R:245,G:245,B:245}],
        ["bisque" , {R:255,G:228,B:196}],
        ["black" , {R:0,G:0,B:0}],
        ["blanchedalmond" , {R:255,G:235,B:205}],
        ["blue" , {R:0,G:0,B:255}],
        ["blueviolet" , {R:138,G:43,B:226}],
        ["brown" , {R:165,G:42,B:42}],
        ["burlywood" , {R:222,G:184,B:135}],
        ["cadetblue" , {R:95,G:158,B:160}],
        ["chartreuse" , {R:0,G:255,B:0}],
        ["chocolate" , {R:210,G:105,B:30}],
        ["coral" , {R:255,G:127,B:80}],
        ["cornflowerblue" , {R:100,G:149,B:237}],
        ["cornsilk" , {R:255,G:248,B:220}],
        ["crimson" , {R:220,G:20,B:60}],
        ["cyan" , {R:0,G:255,B:255}],
        ["darkblue" , {R:0,G:0,B:139}],
        ["darkcyan" , {R:0,G:139,B:139}],
        ["darkgoldenrod" , {R:184,G:134,B:11}],
        ["darkgray" , {R:169,G:169,B:169}],
        ["darkgreen" , {R:0,G:100,B:0}],
        ["darkkhaki" , {R:189,G:183,B:107}],
        ["darkmagenta" , {R:139,G:0,B:139}],
        ["darkolivegreen" , {R:85,G:107,B:47}],
        ["darkorange" , {R:255,G:140,B:0}],
        ["darkorchid" , {R:153,G:50,B:204}],
        ["darkred" , {R:139,G:0,B:0}],
        ["darkgrey" , {R:169,G:169,B:169}],
        ["darkslateblue" , {R:72,G:61,B:139}],
        ["darkslategray" , {R:47,G:79,B:79}],
        ["darksalmon",	{R:233,G:150,B:122}],
        ["darkseagreen", {R:143,G:188,B:143}],
        ["darkslategrey",  {R:47,G:79,B:79}],
        ["darkturquoise",	{R:0,G:206,B:209}],
        ["darkviolet",		{R:148,G:0,B:211}],
        ["deeppink",		{R:255,G:20,B:147}],
        ["deepskyblue",	{R:	0,G:191,B:255}],
        ["dimgray",		{R:105,G:105,B:105}],
        ["dimgrey",		{R:105,G:105,B:105}],
        ["dodgerblue",		{R:30,G:144,B:255}],
        ["firebrick",		{R:178,G:34,B:34}],
        ["floralwhite",		{R:255,G:250,B:240}],
        ["forestgreen",		{R:34,G:139,B:34}],
        ["fuchsia",		{R:255,G:0,B:255}],
        ["gainsboro",		{R:220,G:220,B:220}],
        ["ghostwhite",		{R:248,G:248,B:255}],
        ["gold",		{R:255,G:215,B:0}],
        ["goldenrod",		{R:218,G:165,B:32}],
        ["gray",		{R:128,G:128,B:128}],
        ["green",		{R:0,G:128,B:0}],
        ["greenyellow",		{R:173,G:255,B:47}],
        ["grey",		{R:128,G:128,B:128}],
        ["honeydew"	,	{R:240,G:255,B:240}],
        ["hotpink",		{R:255,G:105,B:180}],
        ["indianred",		{R:205,G:92,B:92}],
        ["indigo",		{R:75,G:0,B:130}],
        ["ivory",		{R:255,G:255,B:240}],
        ["khaki",		{R:240,G:230,B:140}],
        ["lavender",		{R:230,G:230,B:250}],
        ["lavenderblush",		{R:255,G:240,B:245}],
        ["lightseagreen", {R:32, G:178, B:170}],
        ["lightskyblue", {R:135, G:206, B:250}],
        ["lightslategray", {R:119, G:136, B:153}],
        ["lightslategrey", {R:119, G:136, B:153}],
        ["lightsteelblue", {R:176, G:196, B:222}],
        ["lightyellow", {R:255, G:255, B:224}],
        ["lime", {R:0, G:255, B:0}],
        ["limegreen", {R:50, G:205, B:50}],
        ["linen", {R:250, G:240, B:230}],
        ["magenta", {R:255, G:0, B:255}],
        ["maroon", {R:128, G:0, B:0}],
        ["mediumaquamarine", {R:102, G:205, B:170}],
        ["mediumblue", {R:0, G:0, B:205}],
        ["mediumorchid", {R:186, G:85, B:211}],
        ["mediumpurple", {R:147, G:112, B:219}],
        ["mediumseagreen", {R:60, G:179, B:113}],
        ["mediumslateblue", {R:123, G:104, B:238}],
        ["mediumspringgreen", {R:0, G:250, B:154}],
        ["mediumturquoise", {R:72, G:209, B:204}],
        ["mediumvioletred", {R:199, G:21, B:133}],
        ["midnightblue", {R:25, G:25, B:112}],
        ["mintcream", {R:245, G:255, B:250}],
        ["mistyrose", {R:255, G:228, B:225}],
        ["moccasin", {R:255, G:228, B:181}],
        ["navajowhite", {R:255, G:222, B:173}],
        ["navy", {R:0, G:0, B:128}],
        ["oldlace", {R:253, G:245, B:230}],
        ["olive", {R:128, G:128, B:0}],
        ["olivedrab", {R:107, G:142, B:35}],
        ["orange", {R:255, G:165, B:0}],
        ["orangered", {R:255, G:69, B:0}],
        ["orchid", {R:218, G:112, B:214}],
        ["palegoldenrod", {R:238, G:232, B:170}],
        ["palegreen", {R:152, G:251, B:152}],
        ["paleturquoise", {R:175, G:238, B:238}],
        ["palevioletred", {R:219, G:112, B:147}],
        ["papayawhip", {R:255, G:239, B:213}],
        ["peachpuff", {R:255, G:218, B:185}],
        ["peru", {R:205, G:133, B:63}],
        ["pink", {R:255, G:192, B:203}],
        ["plum", {R:221, G:160, B:221}],
        ["powderblue", {R:176, G:224, B:230}],
        ["purple", {R:128, G:0, B:128}],
        ["red", {R:255, G:0, B:0}],
        ["rosybrown", {R:188, G:143, B:143}],
        ["royalblue", {R:65, G:105, B:225}],
        ["saddlebrown", {R:139, G:69, B:19}],
        ["salmon", {R:250, G:128, B:114}],
        ["sandybrown", {R:244, G:164, B:96}],
        ["seagreen", {R:46, G:139, B:87}],
        ["seashell", {R:255, G:245, B:238}],
        ["sienna", {R:160, G:82, B:45}],
        ["silver", {R:192, G:192, B:192}],
        ["skyblue", {R:135, G:206, B:235}],
        ["slateblue", {R:106, G:90, B:205}],
        ["slategray", {R:112, G:128, B:144}],
        ["slategrey", {R:112, G:128, B:144}],
        ["snow", {R:255, G:250, B:250}],
        ["springgreen", {R:0, G:255, B:127}],
        ["steelblue", {R:70, G:130, B:180}],
        ["tan", {R:210, G:180, B:140}],
        ["teal", {R:0, G:128, B:128}],
        ["thistle", {R:216, G:191, B:216}],
        ["tomato", {R:255, G:99, B:71}],
        ["turquoise", {R:64, G:224, B:208}],
        ["violet", {R:238, G:130, B:238}],
        ["wheat", {R:245, G:222, B:179}],
        ["white", {R:255, G:255, B:255}],
        ["whitesmoke", {R:245, G:245, B:245}],
        ["yellow", {R:255, G:255, B:0}],
        ["yellowgreen", {R:154, G:205, B:50}] 
    ]);
    
    constructor()
    {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
        // Add control initialization code
        this.notifyOutputChanged = notifyOutputChanged;
        this.container = container;
        this.context = context;
        this.isTestHarness = document.getElementById("control-dimensions") != null;
        this.context.mode.trackContainerResize(true);
        this.barHeightBase = 0;
        this.barWidthBase = 0;
    }

    private isValidHex = (color: string): boolean => {
        let res = false;
        if (color[0] === '#')
        {
            for (let i = 1; i < color.length; i++)
            {
                if ((color[i] >= '0' && color[i] <= '9') || (color[i] >= 'A' && color[i] <= 'F'))
                    res = true;
            }
        }
        return res;
    };
    
    private isValidColorName = (color: string): boolean => {
        const s = new Option().style;
        s.color = color;
        return s.color !== '';
    };

    private hexToRgb = (hex: string): IPropRGBColor | null => {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          R: parseInt(result[1], 16),
          G: parseInt(result[2], 16),
          B: parseInt(result[3], 16)
        } : null;
    };

    private componentToHex = (c: number): string => {
        const hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
      
    private rgbToHex = (r: number, g:number, b:number) => {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }
    

    private convertToIPropColorArray = (options : ComponentFramework.PropertyHelper.OptionMetadata[]) : IColor[] => {
        
        const res:IColor[] = [];
        for (let i = 0; i < options.length; i++)
        {
            let colorProp: IColor;
            if (this.isValidHex(options[i].Label))       
            {  
                colorProp = { name: options[i].Label, value: this.hexToRgb(options[i].Label)!}
            }
            else
            {
                colorProp = {name: options[i].Label, value: this.baseAllColors.get(options[i].Label)!}
            }
            res.push(colorProp);
        }


        return res;
    }
    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {  
        const barHeightParameter = this.context.parameters.BarHeight.raw!;
        const barWidthParameter = this.context.parameters.BarWidth.raw!;

        let allocatedWidth = parseInt(this.context.mode.allocatedWidth as unknown as string);
        let allocatedHeight = parseInt(this.context.mode.allocatedHeight as unknown as string);

        if (this.barHeightBase != barHeightParameter) {
            allocatedHeight = barHeightParameter;
            this.barHeightBase = barHeightParameter;
        }

        if (this.barWidthBase != barWidthParameter) {
            allocatedWidth = barWidthParameter;
            this.barWidthBase = barWidthParameter;
        }

        this.notifyOutputChanged();
        
        this.container.style.width = `${allocatedWidth}px`;
        this.container.style.height = `${allocatedHeight}px`;

        let val = this.baseAllColors.get(context.parameters.StartColor.raw!)!;
        const startColor: string = this.rgbToHex(val.R, val.G, val.B);

        val = this.baseAllColors.get(context.parameters.EndColor.raw!)!;
        const endColor: string = this.rgbToHex(val.R, val.G, val.B);

        val = this.baseAllColors.get(context.parameters.RightColor.raw!)!;
        const rightColor: string = this.rgbToHex(val.R, val.G, val.B);


        console.log("ShowValue : ", this.context.parameters.ShowValue)

        ReactDOM.render(
            React.createElement(GradientSlider, {
                StartColor: startColor,
                EndColor: endColor,
                RightColor: rightColor, 
                BarHeight: allocatedHeight,
                BarWidth: allocatedWidth,
                MinValue: this.context.parameters.MinValue.raw! || 0, 
                MaxValue: this.context.parameters.MaxValue.raw! || 100, 
                ShowValue: this.context.parameters.ShowValue.raw!,
                Orientation: this.context.parameters.Orientation.raw! || "Horizontal" 
            }),
            this.container
        );

        const rangeElement = document.getElementById("range") as HTMLInputElement | null;

        if (rangeElement) {
            this.applyWebkitSliderThumbStyle(rangeElement, `background-color: #000; width: 10px; height: ${allocatedHeight - 5}px; border-radius: 10px; cursor: pointer; -webkit-appearance: none; top: 100%; border: 0 solid black; margin-bottom: 3px;`);
        }

        console.log("Component is successfully rendering")
        console.log("Elements enfants du conatiner : ", this.container);
    }

    public applyWebkitSliderThumbStyle(element: HTMLInputElement, style: string): void {
        const selector = `#${element.id}::-webkit-slider-thumb`;

        const stylesheet = document.styleSheets[0] as CSSStyleSheet;
        let ruleFound = false;
        
        for (let i = 0; i < stylesheet.cssRules.length; i++) {
            const rule = stylesheet.cssRules[i] as CSSStyleRule;
            if (rule.selectorText === selector) {
                rule.style.cssText = style;
                ruleFound = true;
                break;
            }
        }

        if (!ruleFound) {
            stylesheet.insertRule(`${selector} { ${style} }`, stylesheet.cssRules.length);
        }
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs
    {
        console.log("GetOutputs Called");
        return {
            BarHeight: parseInt(this.context.mode.allocatedHeight as unknown as string),
            BarWidth: parseInt(this.context.mode.allocatedWidth as unknown as string),
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
        ReactDOM.unmountComponentAtNode(this.container);
    }
}
