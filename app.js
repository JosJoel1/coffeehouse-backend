const express = require("express");
const usuariosRoutes = require("./routes/usuarios");
const productosRoutes = require("./routes/productos");
const serviciosRoutes = require("./routes/servicios");   // <-- NUEVA
const hitosRoutes = require("./routes/hitos");
const hitosChacoRoutes = require("./routes/hitos-chaco");
const chatbotRoutes = require("./routes/chatbot");
// ...

app.use("/api/usuarios", usuariosRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/servicios", serviciosRoutes);              // <-- NUEVA
app.use("/api/hitos", hitosRoutes);
app.use("/api/hitos-chaco", hitosChacoRoutes);