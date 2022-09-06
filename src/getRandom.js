console.log("Child Process created", process.pid); //id del proceso

//escucha el fork de sever.js
process.on("message", (msg) => {
	//recibe el numero escrito en la query
	console.log("Child Process received message", msg);
	//ejecuta la funcion
	const result = getRandom(msg);
	//envia el resultado al server.js
	process.send(result);

	//finaloza el proceso en 5 seg
	setTimeout(() => {
		process.exit();
	}, 5000);
});

//funcion para devolver cuantos numeros se repiten
function getRandom(cant) {
	const numeros = [];
	//genera numeros aleatorios
	for (let i = 0; i < cant; i++) {
		numeros.push(Math.floor(Math.random() * 1000) + 1);
	}
	//contar cuantas veces se repite cada numero
	const contador = numeros.reduce((acc, num) => {
		acc[num] = (acc[num] || 0) + 1;
		return acc;
	}, {});

	return contador;
}

export default getRandom;
