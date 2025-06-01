export default async function getCoreConnection() {
    await loadBulk([
        "utils/eventEmitter",
        "providers/tools/dispatcher", Loader.Type.requirejs,
        "core/configs/gui",
        "core/configs/connector", Loader.Type.requirejs,
        "providers/system/connector", Loader.Type.requirejs,
        "providers/system/protocol/gui/auth", Loader.Type.requirejs,
        "providers/v2/lib", Loader.Type.requirejs,
        "providers/tools/algorithm", Loader.Type.requirejs,
        "utils/basicExtend/basicextend",
    ]);

    const EventEmitter = loader.getModule("utils/eventEmitter");
    const tools = loader.getModule("providers/tools/dispatcher");
    const guiConfig = loader.getModule("core/configs/gui");
    const connectorConfig = loader.getModule("core/configs/connector");
    const Connector = loader.getModule("providers/system/connector");
    const request_auth = loader.getModule("providers/system/protocol/gui/auth");

    global.tools = tools;
    global.DEBUG_CONNECTION = false;
    global.DEBUG_CONNECTION_RAW = false;

    if (!ps.pl) {
        ps.pl = {
            core_config: {},
        };
    }

    class CoreConnection extends EventEmitter {
        constructor(options={
            dispatcher: undefined,
        }) {
            super();

            this._dispatcher = options.dispatcher;

            if (this._dispatcher === undefined)
                this._dispatcher = global.dispatcher = new tools.dispatcher();

            const conf = global.conf = {
                gui: guiConfig,
                connector: connectorConfig
            }

            ps.pl.gui = () => this._connector;

            if (!ps.pl.core_config.m_sys_addr) {
                ps.pl.core_config.m_sys_addr = () => v2.address.from_array(["master"]);
            }

            // const connection = global.connection = new Connection(this._dispatcher, conf.connector.connection);
            this._connector = global.connector = new Connector({
                dispatcher: this._dispatcher,
                config: conf.connector,
                version: conf.gui.version,
                // connection: connection,
            });

            this._connector.init();
        }

        destructor() {
            this._connector.deinit();
            this._connector = undefined;
        }

        get connector() { return this._connector; }
        get dispatcher() { return this._dispatcher; }

        connect(login='root', password='root') {
            // const __connector_resumed = this.add_slot(this.__connector.s_resumed, this.__on_connector_resumed.bind(this));
            return new Promise((resolve, reject) => {
                this._connector.connect();

                this._dispatcher.add_slot(this._connector.s_suspended, () => this.trigger("suspended"));
                this._dispatcher.add_slot(this._connector.s_handshake_failed, () => this.trigger("handshakeFailed"));
                this._dispatcher.add_slot(this._connector.s_resumed, () => {
                    const ra = new request_auth({
                        dispatcher: this._dispatcher,
                        writer: this._connector,
                        login: new v2.string(login),
                        password: new v2.string( tools.base64convert(password) ),
                        remember: new v2.boolean(false)
                    });
                    ra.init();
                    ra.send().then( () => {
                        this.trigger("authSuccess");
                        resolve(this);
                    }, (errCode) => {
                        this.trigger("authFailed");
                        reject(errCode);
                    }).then(() => ra.deinit());
                })
            });
        }

        disconnect() {
            if (this._connector) this._connector.disconnect();
        }
    }

    return CoreConnection;
}
