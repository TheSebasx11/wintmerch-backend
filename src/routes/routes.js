const { Router } = require("express");
const router = Router();
const { getConnection } = require("../db");

//routes
const con = getConnection();

router.get("/api/users", async (req, res) => {
  const data = await con.query("SELECT * from usuario");
  res.json(data);
});

router.get("/api/products", async (req, res) => {
  const data = await con.query("SELECT * from producto");
  res.json(data);
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
}),
  router.get("/api/carrito/:id", async (req, res) => {
    let id = req.params.id;
    await con.query(`call carrito("${id}")`);
    const data = await con.query("select * from temporal");
    res.json(data);
  });

router.get("/api/sesion", async (req, res) => {
  
  const data = await con.query("select * from sesion");
  let result = []
  for (let index = 0; index < data.length; index++) {
    const user = await con.query(`select * from usuario where id_usuario = ${data[index].id_usuario}`);
    result.push(
      {
        "id_sesion":data[index].id_sesion,
        "fecha_inicio":  data[index].fecha_inicio,
        "fecha_final" : data[index].fecha_final,
        "usuario": user[0]
      }
    );
  }
  res.json(result);
});

router.post("/api/login", async (req, res) => {
  const data = req.body;
  const query = `SELECT usuario.id_usuario, usuario.primer_nombre, usuario.primer_apellido, usuario.telefono, 
  usuario.usuario from usuario where usuario="${data.usuario}" and contrasena="${data.contrasena}"`;
  const user = await con.query(query);
  //res.send(user);
  if (user != "") {
    res.send(user);
  } else {
    //res.send("Incorrecto");
    res.sendStatus(404);
  }
});

module.exports = router;
