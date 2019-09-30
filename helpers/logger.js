import jsLogger from 'js-logger';
import _isEmpty from 'lodash/isEmpty';
import _lowerCase from 'lodash/lowerCase';
import logDnaLogger from 'logdna';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const {
    ENABLE_CONSOLE_LOGGING,
    LOGDNA_PUBLIC_INGESTION_KEY,
    LOGDNA_APP_NAME,
    LOG_LEVEL,
    NODE_ENV,
} = publicRuntimeConfig;

const level = Object.prototype.hasOwnProperty.call(jsLogger, LOG_LEVEL)
    ? LOG_LEVEL
    : 'error';

const logDnaOptions = {
    app: `Web client [browser]`,
    env: NODE_ENV,
    hostname: LOGDNA_APP_NAME,
};

const logDnaLoggerDefaultLogger = !_isEmpty(LOGDNA_PUBLIC_INGESTION_KEY)
    ? logDnaLogger.setupDefaultLogger(
        LOGDNA_PUBLIC_INGESTION_KEY,
        logDnaOptions,
    ) : {};

// logDNAHandler is used to log the message in logdna
const logDNAHandler = (!_isEmpty(LOGDNA_PUBLIC_INGESTION_KEY) && ENABLE_CONSOLE_LOGGING)
    ? (messages, context) => {
        if (context.level.value >= context.filterLevel.value) {
            logDnaOptions.level = _lowerCase(context.level.name);
            logDnaLoggerDefaultLogger.log(messages, logDnaOptions);
        }
    } : () => {};


// createDefaultHandler is a default handler function which writes to your browser's console object
const handlers = {
    console: ENABLE_CONSOLE_LOGGING
        ? jsLogger.createDefaultHandler()
        : () => {},
    logDNAHandler,
};
    // handlersSetter have two handle one is used for printing log in browser and other in logdna
const handlersSetter = (messages, context) => {
    const messagePieces = [
        '[WebClient]',
    ];

    messagePieces.push(messages[0]);
    Object.values(handlers).forEach((handle) => handle(
        [
            messagePieces.join(' '),
        ],
        context,
    ));
};

// Sets the filterLevel value in context
jsLogger.setLevel(jsLogger[level.toUpperCase()]);
jsLogger.setHandler(handlersSetter);
jsLogger.info(
    '[Logger] Logging all messages at %s and above with handlers: %s',
    jsLogger.getLevel().name,
    Object.keys(handlers).join(', '),
);

export {
    jsLogger as default,
    handlers,
    handlersSetter,
};
