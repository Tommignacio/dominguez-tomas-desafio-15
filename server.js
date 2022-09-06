import express from "express";
import cluster from "cluster";
import os from "os";
import indexRoutes from "./src/routes/indexRoutes.js";
import minimist from "minimist";

export const args = minimist(process.argv.slice(2), {
	default: {
		PORT: 8080,
		mode: "fork",
	},
	alias: {
		p: "PORT",
		m: "mode",
	},
});

//si en el parametro se pasa el modo cluster
if (args.mode == "cluster" && cluster.isPrimary) {
	//    --------proceso primario  -------------
	console.log(`I am the primary process with pid ${process.pid}!!`);
	//verificar cantidad de nucleos de la pc
	const WORK_NUM = os.cpus().length;
	for (let i = 0; i < WORK_NUM; i++) {
		//crea procesos secundarios(trbajan en paralelo)
		cluster.fork(); //ejecuta las funciones secundarias por cada nucleo que haya
	}
	//manejar cuando proceso finaliza
	cluster.on("exit", (worker, code) => {
		//en consola se puede finalizar un poceso: kill -9 NºPID
		console.log(`Worker ${worker.process.pid} died :(`);
		//crea nuevo proceso si uno finaliza
		cluster.fork();
	});
} else {
	//-------proceso secundario----------------
	console.log(
		`I am a worker process with pid ${process.pid}, mode: ${
			args.mode == "cluster" ? "cluster" : "fork"
		} `
	);

	//puerto segundo argumento
	const PORT = args.PORT || 8080;
	const app = express();
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	/**routes */
	app.use("/", indexRoutes);

	const server = app.listen(PORT, () =>
		console.log(
			`Server started on port ${PORT} at ${new Date().toLocaleString()}`
		)
	);
	server.on("error", (err) => console.log(err));
}
