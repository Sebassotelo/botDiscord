const moment = require("moment");
const axios = require("axios");
require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const TOKEN = process.env.DISCORD_TOKEN;

const TWITCH_USERNAME = "sebassdev";
const TWITCH_USERNAME2 = "saabtian_";
const DISCORD_CHANNEL_ID = "600535334962331669";

let aviso = false;
let avisoYT = false;
let avisoYT2 = false;

async function checkTwitchStreamStatus() {
  try {
    const response = await axios.get(
      `https://decapi.me/twitch/uptime/${TWITCH_USERNAME}`
    );
    const response2 = await axios.get(
      `https://decapi.me/twitch/uptime/${TWITCH_USERNAME2}`
    );

    const streamData = response.data;
    const streamData2 = response2.data;

    let shouldSendMessage = false;

    if (streamData.includes("offline") && streamData2.includes("offline")) {
      shouldSendMessage = false;
      aviso = false;
    } else {
      shouldSendMessage = true;
    }

    const client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    });

    client.login(TOKEN);

    client.on("ready", () => {
      console.log(`Bot está en línea como ${client.user.tag}`);

      if (shouldSendMessage && !aviso) {
        const channel = client.channels.cache.get(DISCORD_CHANNEL_ID);
        if (channel) {
          if (streamData2.includes("offline")) {
            channel.send(
              "Sebas prendio! https://twitch.tv/saabtian_ ! Veni a ver que onda! ♥ "
            );
          } else {
            channel.send(
              "Sebas prendio! https://twitch.tv/sebassdev ! Veni a ver que onda! ♥ "
            );
          }

          aviso = true;
        } else {
          console.error(
            "No se pudo encontrar el canal con el ID proporcionado."
          );
        }
      }
    });
  } catch (error) {
    console.error("Error al verificar el estado del stream de Twitch:", error);
  }
}

const fetchVideos = async () => {
  const fetchYoutube = await fetch(
    "https://www.googleapis.com/youtube/v3/search?key=AIzaSyB4BrehJtk5UpVZpFK8aXl4ve2A8sIo6rA&channelId=UCjnn1S2FKvvkicwEuoBlmAQ&part=snippet,id&order=date&maxResults=1&type=video"
  );
  const fetchYoutube2 = await fetch(
    "https://www.googleapis.com/youtube/v3/search?key=AIzaSyB4BrehJtk5UpVZpFK8aXl4ve2A8sIo6rA&channelId=UCkC0ygRvnJtJuf5uqFsxG3A&part=snippet,id&order=date&maxResults=1&type=video"
  );
  const datos = await fetchYoutube.json();
  const datos2 = await fetchYoutube2.json();

  // Obtén la fecha y hora actual
  const fechaActual = moment();

  // Define la fecha que deseas comparar
  const fechaComparar = moment(datos.items[0].snippet.publishedAt);
  const fechaComparar2 = moment(datos2.items[0].snippet.publishedAt);

  // Calcula la diferencia de tiempo entre la fecha actual y la fecha de comparación
  const diferencia = fechaActual.diff(fechaComparar);
  const diferencia2 = fechaActual.diff(fechaComparar2);

  // Define un período de tiempo que consideres "hace poco" (por ejemplo, 24 horas en milisegundos)
  const periodoHacePoco = 24 * 60 * 60 * 1000;

  // Compara la diferencia de tiempo con el período "hace poco" y establece un valor booleano en función de la comparación
  const valorBooleano = diferencia <= periodoHacePoco;
  const valorBooleano2 = diferencia2 <= periodoHacePoco;

  if (diferencia >= periodoHacePoco) {
    avisoYT = false;
  }
  if (diferencia2 >= periodoHacePoco) {
    avisoYT2 = false;
  }

  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  });

  client.login(TOKEN);

  client.on("ready", () => {
    console.log(`Bot está en línea como ${client.user.tag}`);

    if (valorBooleano && !avisoYT) {
      const channel = client.channels.cache.get(DISCORD_CHANNEL_ID);
      if (channel) {
        channel.send(
          `Sebas subio Video Nuevo! https://www.youtube.com/watch?v=${datos.items[0].id.videoId} Veni a ver que onda! ♥ `
        );
        avisoYT = true;
      } else {
        console.error("No se pudo encontrar el canal con el ID proporcionado.");
      }
    }
    if (valorBooleano2 && !avisoYT2) {
      const channel = client.channels.cache.get(DISCORD_CHANNEL_ID);
      if (channel) {
        channel.send(
          `Sebas subio Video Nuevo! https://www.youtube.com/watch?v=${datos2.items[0].id.videoId} Veni a ver que onda! ♥ `
        );
        avisoYT2 = true;
      } else {
        console.error("No se pudo encontrar el canal con el ID proporcionado.");
      }
    }
  });
};

setInterval(() => {
  checkTwitchStreamStatus();
  fetchVideos();
}, 60000); // Verificar cada 1 minuto
