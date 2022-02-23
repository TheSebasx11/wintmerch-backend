const { Router } = require("express");
const router = Router();
const { getConnection } = require("../db");

//routes
const con = getConnection();

router.get("/api/users", async (req, res) => {
  const data = await con.query("SELECT * from usuario");
  res.json(data);
});

router.post("/api/comprar/:id", async (req, res) => {
  const id = req.params.id;
  const query = `call comprar("${id}")`;
  await con.query(query);
  res.sendStatus(200);
});

router.get("/api/items", async (req, res) => {
  const data = await con.query(
    "SELECT  pro.id_producto as id, pro.nombre as name , cat.nombre as brand, pro.URL as img_url, pro.precio as price from producto pro, categoria_producto cat WHERE  pro.id_categoria = cat.id_categoria;"
  );
  res.json(data);
});

router.get("/api/prodById/:id", async (req, res) => {
  let id = req.params.id;
  const query = `SELECT pro.nombre, pro.SKU, pro.descripcion , pro.precio , pro.URL , pro.peso , ip.cantidad as stock from producto pro, inventario_producto ip where pro.id_producto = ${id} and ip.id_inventario = pro.id_inventario`;
  const data = await con.query(query);
  res.json(data);
});

router.get("/api/sesion", async (req, res) => {
  const data = await con.query("select * from sesion");
  let result = [];
  for (let index = 0; index < data.length; index++) {
    const user = await con.query(
      `select * from usuario where id_usuario = ${data[index].id_usuario}`
    );
    result.push({
      id_sesion: data[index].id_sesion,
      fecha_inicio: data[index].fecha_inicio,
      fecha_final: data[index].fecha_final,
      usuario: user[0],
    });
  }
  res.json(result);
});

router.get("/api/carrito/:id", async (req, res) => {
  const id = req.params.id;
  await con.query(`call carrito("${id}")`);
  const query = `SELECT tem.id_item as id, tem.subtotal, tem.cantidad, pro.descripcion as 'desc', pro.precio, pro.URL as image, pro.nombre 
   FROM temporal tem, producto pro WHERE tem.id_producto = pro.id_producto and tem.id_usuario="${id}";`;
  const data = await con.query(query);
  res.json(data);
});

//get calzado
router.get("/api/products", async (req, res) => {
  const query = `SELECT pro.*, cat.nombre as categoria FROM producto pro, categoria_producto cat WHERE cat.id_categoria = pro.id_categoria `;
  const data = await con.query(query);
  res.json(data);
});

router.get("/api/logout/:id", async (req, res) => {
  let id = req.params.id;
  const query = `call salir_sesion("${id}")`;
  await con.query(query);
  res.sendStatus(200);
});

router.get("/api/deleteItem/:id", async (req, res) => {
  const id = req.params.id;
  const query = `UPDATE cart_item SET modificado=CURRENT_TIMESTAMP WHERE id_cart_item="${id}"`;
  await con.query(query);
  res.sendStatus(200);
});

router.post("/api/addItem", async (req, res) => {
  const data = req.body;
  const query = `call addItems(${data.idProduct}, ${data.idSesion}, ${data.cantidad})`;
  await con.query(query);
  //res.json(data);
  res.sendStatus(200);
});

router.post("/api/register", async (req, res) => {
  const data = req.body;
  const query = `INSERT INTO usuario (id_usuario, usuario, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, telefono, contrasena) VALUES(CONCAT(round(rand()*10000), ""), "${data.User}", "${data.name}", "", "${data.lastname}", '', ${data.phone}, "${data.password}");`;
  await con.query(query);
  const query2 = `SELECT usuario.id_usuario as id from usuario where usuario="${data.User}" and contrasena="${data.password}"`;
  const user2 = await con.query(query2);
  res.json(user2);
});

router.post("/api/login", async (req, res) => {
  const data = req.body;
  const query = `SELECT usuario.id_usuario as id from usuario where usuario="${data.usuario}" and contrasena="${data.contrasena}"`;
  const user = await con.query(query);
  if (user != "") {
    await con.query(`call inicio_sesion("${user[0].id}")`);
    const query2 = `SELECT usuario.id_usuario as id, usuario.primer_nombre as nombre, usuario.primer_apellido as apellido, usuario.telefono, usuario.usuario, sesion.id_sesion FROM sesion, usuario WHERE usuario.id_usuario = sesion.id_usuario and sesion.fecha_final is null;`;
    const user2 = await con.query(query2);
    res.send(user2);
  } else {
    //res.send("Incorrecto");
    res.sendStatus(404);
  }
});

module.exports = router;
