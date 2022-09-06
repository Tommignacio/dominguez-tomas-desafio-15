import { Router } from "express";
import { fork } from "child_process";
import os from "os"; // obtener informacion del sistema

const nroCPUs = os.cpus().length; //numero de procesadores
const router = Router();

const info = {
	"Node version": process.version,
	platformName: process.platform,
	"Directorio de ejecución": process.cwd(),
	"ID del proceso": process.pid,
	"Uso de la memoria": process.memoryUsage(),
	"Memoria total reservada (rss)": process.memoryUsage().rss,
	"path de ejecución": process.execPath, //donde está el ejecutable de node
	"Argumentos de entrada": process.argv,
	CPUs: nroCPUs,
	// PORT: args.PORT,
};

//routes
router.get("/info", (req, res) => {
	res.send(info);
});

router.get("/api/randoms", (req, res) => {
	//recibe por query  //http://localhost:8080/api/randoms?cant=1000
	const cant = req.query.cant || 1000000;
	//ejecuta la funcion asincronica(pesada)
	const child = fork("./src/getRandom.js");
	//envia la cantidad a getrandom
	child.send(cant);
	//escucha el resultado de la funcion getrandom
	child.on("message", (msg) => {
		//envia al html
		res.send(msg);
	});
	//escucha el codigo cuando finaliza el proceso
	child.on("exit", (code) => {
		console.log("Se ha cerrado el proceso", code);
	});
});

export default router;
