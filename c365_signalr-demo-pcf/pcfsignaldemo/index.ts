import { error } from "console";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

export class pcfsignaldemo implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _lastSentChatMessage: string | null = null;
    private _notifyOutputChanged: () => void;
    private _context: ComponentFramework.Context<IInputs>;
    private _connection?: HubConnection;
    private _signalRApi: string;
    private _isUpdatingYoutubeUrl: boolean;

    /**
     * Empty constructor.
     */
    constructor()
    {
        this._isUpdatingYoutubeUrl = false;
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(
        context: ComponentFramework.Context<IInputs>, 
        notifyOutputChanged: () => void, 
        state: ComponentFramework.Dictionary, 
        container:HTMLDivElement)
        : void
    {
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;
        this._signalRApi = this._context.parameters.signalRHubConnectionURL.raw || "";

        // Open a connection if the signalRApi is available
        if (this._signalRApi) {
            this.OpenConnection();
        }
    }

    /**
     * Function to open connection with SignalR
    */
    private OpenConnection() {
        // Build and configure the signalR connection
        this._connection = new HubConnectionBuilder()
        .withUrl(this._signalRApi)
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();

        // Define event listenners for certain SignalR messages
        this._connection.on("newChatMessage", this.processNewChatMessage.bind(this));

        // Start the connection and log any errors
        this._connection.start()
        .then(() => console.log("Connexion SignalR etablie avec sucess"))
        .catch(error => console.error("Connexion SignalR non etablie : ", error));
    }


    /*
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        this._context = context;

        const chatSenderIn = context.parameters.ChatSenderIn.raw;

        const chatMessageIn = context.parameters.ChatMessageIn.raw;
        if (chatMessageIn && chatMessageIn !== this._lastSentChatMessage) {
            this._lastSentChatMessage = chatMessageIn;
            this.sendChatMessage(chatSenderIn, chatMessageIn);
        }
    }

    private sendChatMessage(sender: string | null, message: string | null) {
        const functionUrl = `${this._signalRApi}/chatmessages`;
        console.log("sendChatMessage URL : ", functionUrl);
        const xhr = new XMLHttpRequest();
        xhr.open("POST", functionUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = () => {
            if (xhr.status < 200 && xhr.status >= 300) {
                console.error('Erro occured when sending chat message ',xhr.responseText);
            }
        };

        xhr.onerror = () => console.error("Request failed ", xhr.responseText);
        xhr.send(JSON.stringify({ sender, message}));
    }

    private processNewChatMessage(data: unknown): void {
        console.log("New Chat Message");
        let parsedData: { sender: string; message: string } | null = null;
        try {
            parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        } catch (error) {
            console.error('Error parsing chat message ', error);
            return;
        }

        if (!parsedData || !parsedData.sender || !parsedData.message) {
            console.error('Invalid message format received ', parsedData);
            return;
        }

        const outputMessage = `${parsedData.sender}: ${parsedData.message}`;
        if (this._context.parameters.ChatMessageOut.raw !== outputMessage) {
            this._context.parameters.ChatMessageOut.raw = outputMessage;
            this._notifyOutputChanged();
        }
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs
    {
        return {
            ChatMessageOut: this._context.parameters.ChatMessageOut.raw!
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
        if (this._connection)
            this._connection.stop();
    }
}
