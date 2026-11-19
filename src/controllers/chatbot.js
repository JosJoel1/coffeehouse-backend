const productos = require("../models/productos");
const servicios = require("../models/servicios");
const especialidades = require("../models/especialidades");
const nosotros = require("../models/nosotros");

const CONTEXTO_BASE = `
Eres el asistente virtual de CoffeeHouse, una cafetería de Cochabamba, Bolivia.
Ayudas a los clientes con preguntas sobre el menú, los precios, las
especialidades de la casa, los servicios, el horario, la dirección y el contacto.
Responde en español, de forma breve, amable y cercana.
Usa únicamente la información de la cafetería que se te entrega a continuación.
Si no tienes un dato, no lo inventes: indica que no cuentas con esa información
y sugiere contactar a la cafetería. Responde solo preguntas relacionadas con
CoffeeHouse; para otros temas, explica amablemente que tu función se limita a
la cafetería.
`;

const OLLAMA_URL = (
  process.env.OLLAMA_URL || "http://127.0.0.1:11434"
).replace(/\/+$/, "");
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "gemma3";
const OLLAMA_TIMEOUT_MS = 60000;
const MAX_PROMPT_LENGTH = 4000;

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function construirContexto() {
  const [menu, listaServicios, listaEspecialidades, info] = await Promise.all([
    productos.findAll(),
    servicios.findAll(),
    especialidades.findAll(),
    nosotros.get(),
  ]);

  const lineasMenu = menu
    .map(
      (p) =>
        `- ${p.titulo} (${p.categoria || "General"}): ${p.descripcion || ""} - Bs ${p.precio}`,
    )
    .join("\n");
  const lineasServicios = listaServicios
    .map((s) => `- ${s.nombre}: ${s.descripcion || ""}`)
    .join("\n");
  const lineasEspecialidades = listaEspecialidades
    .map((e) => `- ${e.nombre}: ${e.descripcion || ""}`)
    .join("\n");
  const datosLocal = info
    ? `Dirección: ${info.direccion}\nTeléfono: ${info.telefono}\nEmail: ${info.email}\nHorario: ${info.horario}\nHistoria: ${info.historia}`
    : "Sin datos del local.";

  return `${CONTEXTO_BASE}
MENÚ Y PRECIOS:
${lineasMenu}

ESPECIALIDADES:
${lineasEspecialidades}

SERVICIOS:
${lineasServicios}

DATOS DEL LOCAL:
${datosLocal}
`;
}

async function prompt(req, res) {
  const { prompt: question } = req.body;
  if (
    typeof question !== "string" ||
    !question.trim() ||
    question.length > MAX_PROMPT_LENGTH
  ) {
    throw httpError(
      400,
      `prompt debe ser un texto no vacío de hasta ${MAX_PROMPT_LENGTH} caracteres`,
    );
  }

  const contexto = await construirContexto();

  const controller = new AbortController();
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, OLLAMA_TIMEOUT_MS);

  let data;
  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        system: contexto,
        prompt: question.trim(),
        stream: false,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw httpError(502, "El servicio de IA no pudo procesar la solicitud");
    }
    data = await response.json();
  } catch (error) {
    if (error.status) {
      throw error;
    }
    if (timedOut) {
      throw httpError(504, "El servicio de IA excedió el tiempo de espera");
    }
    throw httpError(502, "No se pudo conectar con el servicio de IA");
  } finally {
    clearTimeout(timeout);
  }

  if (!data || typeof data.response !== "string") {
    throw httpError(502, "El servicio de IA devolvió una respuesta no válida");
  }

  res.json({ response: data.response.trim() });
}

module.exports = { prompt };