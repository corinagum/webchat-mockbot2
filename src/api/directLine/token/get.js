import setImmediateAndInterval from '../../../utils/setImmediateAndInterval';

const PREGENERATE_TOKEN_INTERVAL = 60000;

export default async function getDirectLineToken(server, { env: { DIRECT_LINE_SECRET: directLineSecret } }) {
  let pregeneratedTokens = [];

  setImmediateAndInterval(async () => {
    const now = Date.now();
    const { conversationId: conversationID, expires_in: expiresIn, token } = await generateDirectLineToken(directLineSecret);
    const expiresAt = now + expiresIn * 1000;

    pregeneratedTokens.push({
      conversationID,
      expiresIn,
      expiresAt,
      token
    });

    pregeneratedTokens = pregeneratedTokens.filter(token => token.expiresAt > Date.now() - PREGENERATE_TOKEN_INTERVAL);
  }, PREGENERATE_TOKEN_INTERVAL);

  server.get('/directline/tokens', async (_, res) => {
    res.set('Content-Type', 'text/plain');
    res.set('Cache-Control', 'no-cache');

    res.send(
      JSON.stringify(
        {
          tokens: pregeneratedTokens.map(token => {
            const message1 = `This token will expires at ${new Date(token.expiresAt).toISOString()}`;
            const message2 =
              Date.now() > token.expiresAt
                ? 'And is expired.'
                : `Or in about ${~~((token.expiresAt - Date.now()) / 1000)} seconds`;
            const separator = new Array(Math.max(message1.length, message2.length)).fill('-').join('');

            return {
              human: [separator, message1, message2, separator],
              ...token
            };
          })
        },
        null,
        2
      )
    );
  });
}
