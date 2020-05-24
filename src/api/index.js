import getBotFrameworkWebChatVersions from './versions/botFrameworkWebChat/get';
import getHealth from './health/get';
import getRoot from './get';
import postDirectLineToken from './directLine/token/post';
import postMessages from './messages/post';
import postSpeechServicesToken from './speechServices/token/post';
import upgrade from './upgrade';

export default async function index(server, options) {
  await Promise.all(
    [
      getBotFrameworkWebChatVersions,
      getHealth,
      getRoot,
      postDirectLineToken,
      postMessages,
      postSpeechServicesToken,
      upgrade
    ].map(handler => handler(server, options))
  );
}
